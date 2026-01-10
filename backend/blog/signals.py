from django.db.models.signals import post_save
from django.dispatch import receiver
from .tasks import send_new_post_email
from .models import BlogPost


@receiver(post_save, sender=BlogPost)
def notify_subscribers_new_post(sender, instance, created, **kwargs):
    if created:
        send_new_post_email.delay(instance.id)
