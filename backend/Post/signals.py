from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Count, Q

from .models import PostVote


def recompute_counts(post):
    agg = post.votes.aggregate(
        up=Count("id", filter=Q(value=1)),
        down=Count("id", filter=Q(value=-1)),
    )
    post.upvotes_count = agg["up"] or 0
    post.downvotes_count = agg["down"] or 0
    post.save(update_fields=["upvotes_count", "downvotes_count"])


@receiver(post_save, sender=PostVote)
def vote_saved(sender, instance, **kwargs):
    recompute_counts(instance.post)


@receiver(post_delete, sender=PostVote)
def vote_deleted(sender, instance, **kwargs):
    recompute_counts(instance.post)
