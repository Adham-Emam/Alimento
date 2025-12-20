from rest_framework import serializers
from .models import Post, PostComment, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class PostCommentSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PostComment
        fields = [
            "id",
            "post",
            "user",
            "user_email",
            "content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["post", "user", "created_at", "updated_at"]

    def get_user_email(self, obj):
        return getattr(obj.user, "email", str(obj.user))


class PostReadSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "user_email",
            "recipe",
            "title",
            "body",
            "tags",
            "upvotes_count",
            "downvotes_count",
            "score",
            "comments_count",
            "created_at",
            "updated_at",
        ]

    def get_user_email(self, obj):
        return getattr(obj.user, "email", str(obj.user))


class PostWriteSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = ["id", "recipe", "title", "body", "tags"]

    def validate_recipe(self, value):
        if not value.is_public:
            raise serializers.ValidationError(
                "That recipe is set to private please use a public recipe."
            )
        qs = Post.objects.filter(recipe=value)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A post for that recipe already exists.")

        return value

    def create(self, validated_data):
        tags_names = validated_data.pop("tags", [])
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user is None or not user.is_authenticated:
            raise serializers.ValidationError(
                "Authentication required to create a post."
            )
        post = Post.objects.create(user=user, **validated_data)
        tags = []
        for name in tags_names:
            clean = name.strip()
            if not clean:
                continue
            tag, _ = Tag.objects.get_or_create(name=clean)
            tags.append(tag)
        if tags:
            post.tags.set(tags)
        return post

    def update(self, instance, validated_data):
        tags_names = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags_names is not None:
            tags = []
            for name in tags_names:
                clean = name.strip()
                if not clean:
                    continue
                tag, _ = Tag.objects.get_or_create(name=clean)
                tags.append(tag)
            instance.tags.set(tags)
        return instance
