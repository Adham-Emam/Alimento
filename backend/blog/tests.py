from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from blog.models import BlogPost, PostComment

User = get_user_model()


class BlogViewTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            email="admin@test.com",
            password="adminpass",
        )
        self.user = User.objects.create_user(
            email="user@test.com",
            password="userpass",
        )

        self.post = BlogPost.objects.create(
            title="Test Post",
            slug="test-post",
            category="Tech",
            excerpt="Short excerpt",
            content="Full content",
        )

    # -------------------------
    # Post list & detail
    # -------------------------
    def test_post_list_view(self):
        url = reverse("post-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["results"]), 1)

    def test_post_detail_view(self):
        url = reverse("post-detail", kwargs={"slug": self.post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.post.title)

    # -------------------------
    # Post create/update/delete (admin only)
    # -------------------------
    def test_post_create_admin_only(self):
        url = reverse("post-create")

        data = {
            "title": "New Post",
            "slug": "new-post",
            "category": "Tech",
            "excerpt": "Excerpt",
            "content": "Content",
        }

        # unauthenticated
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # authenticated non-admin
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # admin
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_update_delete_admin_only(self):
        url = reverse("post-update-delete", kwargs={"slug": self.post.slug})

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(url, {"title": "Updated"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # -------------------------
    # Comments
    # -------------------------
    def test_create_comment_authenticated_only(self):
        url = reverse("comment-create", kwargs={"pk": self.post.pk})

        data = {"content": "Nice post!"}

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_comment_list(self):
        PostComment.objects.create(
            post=self.post,
            user=self.user,
            content="Test comment",
        )

        url = reverse("comment-list", kwargs={"pk": self.post.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_delete_own_comment_only(self):
        comment = PostComment.objects.create(
            post=self.post,
            user=self.user,
            content="My comment",
        )

        url = reverse("comment-delete", kwargs={"pk": comment.pk})

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # -------------------------
    # Likes
    # -------------------------
    def test_toggle_like(self):
        url = reverse("post-like-toggle", kwargs={"pk": self.post.pk})

        self.client.force_authenticate(user=self.user)

        # like
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])

        # unlike
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])

    # -------------------------
    # Subscribers
    # -------------------------
    def test_subscribe_email(self):
        url = reverse("subscriber-create")

        data = {"email": "test@email.com"}

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # duplicate
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Email already subscribed")
