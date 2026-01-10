from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from .models import BlogPost, Subscriber


User = get_user_model()


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 30},
)
def send_new_post_email(self, post_id):
    try:
        post = BlogPost.objects.get(id=post_id)
    except ObjectDoesNotExist:
        return

    subscriber_emails = list(Subscriber.objects.values_list("email", flat=True))

    user_emails = list(
        User.objects.filter(is_active=True)
        .exclude(email="")
        .values_list("email", flat=True)
    )

    recipient_list = list(set(subscriber_emails + user_emails))

    if not recipient_list:
        return

    send_mail(
        subject=f"New Blog Post: {post.title}",
        message=(
            f"Hi there!\n\n"
            f"A new blog post has been published:\n\n"
            f"Title: {post.title}\n"
            f"Category: {post.category}\n\n"
            f"Read it here: {settings.FRONTEND_URL}/blog/{post.slug}/"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
    )
