from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from foods.models import FoodItem, NutritionProfile, ServingSize


import sys, csv

csv.field_size_limit(sys.maxsize)


def fnum(v):
    try:
        s = str(v).strip()
        if not s or s.lower() in {"nan", "none"}:
            return 0.0
        return float(s)
    except Exception:
        return 0.0


class Command(BaseCommand):
    help = "Import OpenFoodFacts TSV (Egypt only) into FoodItem + NutritionProfile"

    def add_arguments(self, parser):
        parser.add_argument("--path", required=True)
        parser.add_argument("--limit", type=int, default=0, help="0 = no limit")
        parser.add_argument("--batch", type=int, default=2000)
        parser.add_argument("--create-serving", action="store_true")
        parser.add_argument(
            "--require-nutrition",
            action="store_true",
            help="Skip products missing all macro fields (kcal/protein/carbs/fat).",
        )

    def handle(self, *args, **opts):
        path = opts["path"]
        limit = opts["limit"]
        batch = opts["batch"]
        create_serving = opts["create_serving"]
        require_nutrition = opts["require_nutrition"]

        processed = 0
        kept = 0

        foods_buf = []

        with open(path, "r", encoding="utf-8", errors="ignore", newline="") as f:
            reader = csv.DictReader(f, delimiter="\t")

            for row in reader:
                processed += 1
                if limit and processed > limit:
                    break

                # --- Egypt filter ---
                countries_tags = (row.get("countries_tags") or "").lower()
                countries_en = (row.get("countries_en") or "").lower()

                MENA_TAGS = {
                    "en:egypt",
                    "en:saudi-arabia",
                    "en:united-arab-emirates",
                    "en:kuwait",
                    "en:qatar",
                    "en:bahrain",
                    "en:oman",
                    "en:jordan",
                    "en:lebanon",
                    "en:morocco",
                    "en:tunisia",
                    "en:algeria",
                }
                if not (
                    any(tag in countries_tags for tag in MENA_TAGS)
                    or "egypt" in countries_en
                ):
                    continue

                code = (row.get("code") or "").strip()
                name = (
                    row.get("product_name")
                    or row.get("generic_name")
                    or row.get("abbreviated_product_name")
                    or ""
                ).strip()

                if not code or not name:
                    continue

                raw_kcal = (row.get("energy-kcal_100g") or "").strip()
                raw_protein = (row.get("proteins_100g") or "").strip()
                raw_carbs = (row.get("carbohydrates_100g") or "").strip()
                raw_fat = (row.get("fat_100g") or "").strip()

                if require_nutrition:
                    if not (raw_kcal or raw_protein or raw_carbs or raw_fat):
                        continue

                kcal = fnum(raw_kcal)
                protein = fnum(raw_protein)
                carbs = fnum(raw_carbs)
                fat = fnum(raw_fat)

                food = FoodItem(
                    off_code=code[:32],
                    name=name[:255],
                    price=Decimal("0.00"),
                    price_quantity=100,
                    price_unit="g",
                )

                # stash nutrient info for flush()
                food._np = {
                    "calories": kcal,
                    "protein": protein,
                    "carbohydrates": carbs,
                    "fats": fat,
                    "fiber": fnum(row.get("fiber_100g")),
                    "sugar": fnum(row.get("sugars_100g")),
                    "sodium": fnum(row.get("sodium_100g")),
                    "iron": fnum(row.get("iron_100g")),
                    "calcium": fnum(row.get("calcium_100g")),
                    "potassium": fnum(row.get("potassium_100g")),
                    "zinc": fnum(row.get("zinc_100g")),
                    "magnesium": fnum(row.get("magnesium_100g")),
                    "vitamin_a": fnum(row.get("vitamin-a_100g")),
                    "vitamin_c": fnum(row.get("vitamin-c_100g")),
                }

                foods_buf.append(food)
                kept += 1

                if len(foods_buf) >= batch:
                    self._flush(foods_buf, create_serving)
                    foods_buf = []
                    self.stdout.write(f"Processed={processed} Kept(Egypt)={kept}")

            if foods_buf:
                self._flush(foods_buf, create_serving)

        self.stdout.write(
            self.style.SUCCESS(f"Done. Processed={processed} Kept={kept}")
        )

    def _flush(self, foods, create_serving: bool):

        if not foods:
            return

        # Deduplicate batch by off_code (OFF can repeat codes)
        foods_by_code = {}
        for f in foods:
            code = getattr(f, "off_code", None)
            if not code:
                continue
            if code not in foods_by_code:
                foods_by_code[code] = f

        uniq_foods = list(foods_by_code.values())
        codes = list(foods_by_code.keys())

        with transaction.atomic():
            # 1) Insert FoodItems (skip if off_code already exists)
            FoodItem.objects.bulk_create(
                uniq_foods,
                ignore_conflicts=True,
                batch_size=2000,
            )

            # 2) Fetch saved FoodItems for these codes
            saved_qs = FoodItem.objects.filter(off_code__in=codes).only(
                "id", "off_code"
            )
            saved_by_code = {fi.off_code: fi for fi in saved_qs}

            # 3) Which already have NutritionProfile
            existing_np_food_ids = set(
                NutritionProfile.objects.filter(food_item__in=saved_qs).values_list(
                    "food_item_id", flat=True
                )
            )

            # 4) Which already have any ServingSize (if enabled)
            existing_serving_food_ids = set()
            if create_serving:
                existing_serving_food_ids = set(
                    ServingSize.objects.filter(food__in=saved_qs).values_list(
                        "food_id", flat=True
                    )
                )

            nps_to_create = []
            servings_to_create = []

            # Avoid duplicates inside THIS flush
            np_added_food_ids = set(existing_np_food_ids)
            serving_added_food_ids = set(existing_serving_food_ids)

            for code, f in foods_by_code.items():
                fi = saved_by_code.get(code)
                if not fi:
                    continue

                if fi.id not in np_added_food_ids:
                    npd = getattr(f, "_np", {}) or {}
                    nps_to_create.append(
                        NutritionProfile(
                            food_item=fi,
                            calories=npd.get("calories", 0),
                            protein=npd.get("protein", 0),
                            carbohydrates=npd.get("carbohydrates", 0),
                            fats=npd.get("fats", 0),
                            fiber=npd.get("fiber", 0),
                            sugar=npd.get("sugar", 0),
                            sodium=npd.get("sodium", 0),
                            iron=npd.get("iron", 0),
                            calcium=npd.get("calcium", 0),
                            potassium=npd.get("potassium", 0),
                            zinc=npd.get("zinc", 0),
                            magnesium=npd.get("magnesium", 0),
                            vitamin_a=npd.get("vitamin_a", 0),
                            vitamin_c=npd.get("vitamin_c", 0),
                        )
                    )
                    np_added_food_ids.add(fi.id)

                if create_serving and fi.id not in serving_added_food_ids:
                    servings_to_create.append(
                        ServingSize(
                            food=fi,
                            description="Per 100 g",
                            quantity=100,
                            unit="g",
                        )
                    )
                    serving_added_food_ids.add(fi.id)

            if nps_to_create:
                NutritionProfile.objects.bulk_create(nps_to_create, batch_size=2000)

            if create_serving and servings_to_create:
                ServingSize.objects.bulk_create(servings_to_create, batch_size=2000)
