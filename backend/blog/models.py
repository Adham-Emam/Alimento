from django.db import models
from django.contrib.auth import get_user_model
from slugify import slugify


User = get_user_model()


class BlogPost(models.Model):
    title = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(max_length=1000, db_index=True)

    thumbnail = models.ImageField(upload_to="post_thumbnail/", null=True, blank=True)

    content = models.TextField()

    category = models.CharField(max_length=100, db_index=True)
    reading_time = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="likes")

    class Meta:
        unique_together = ["user", "post"]

    def __str__(self):
        return f"{self.user} liked {self.post}"


class PostComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(
        BlogPost, on_delete=models.CASCADE, related_name="comments"
    )
    content = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Comment by {self.user}"


class Subscriber(models.Model):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email
