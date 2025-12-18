from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Post, PostComment, PostVote

User = get_user_model()


def auth_headers(user):
    refresh = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": f"Bearer {str(refresh.access_token)}"}


class PostAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@test.com", password="testpass123"
        )
        self.other_user = User.objects.create_user(
            email="other@test.com", password="testpass123"
        )

        self.post = Post.objects.create(
            user=self.user, title="Test Post", body="Post content"
        )

    def test_post_list_public(self):
        url = reverse("post-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_detail_public(self):
        url = reverse("post-detail", args=[self.post.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_create_requires_auth(self):
        url = reverse("post-create")
        data = {"title": "New", "body": "Content"}
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_create_authenticated(self):
        url = reverse("post-create")
        data = {"title": "New", "body": "Content"}
        res = self.client.post(url, data, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_post_update_owner_only(self):
        url = reverse("post-update-delete", args=[self.post.id])
        data = {"title": "Updated"}

        res = self.client.patch(url, data, **auth_headers(self.other_user))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        res = self.client.patch(url, data, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_delete_owner_only(self):
        url = reverse("post-update-delete", args=[self.post.id])
        res = self.client.delete(url, **auth_headers(self.other_user))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        res = self.client.delete(url, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)


class PostVoteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="vote@test.com", password="testpass123"
        )
        self.post = Post.objects.create(
            user=self.user, title="Vote Post", body="Vote content"
        )

    def test_upvote_create_toggle_delete(self):
        url = reverse("post-upvote", args=[self.post.id])

        res = self.client.post(url, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(PostVote.objects.count(), 1)

        res = self.client.post(url, **auth_headers(self.user))
        self.assertEqual(PostVote.objects.count(), 0)

    def test_downvote_create(self):
        url = reverse("post-downvote", args=[self.post.id])
        res = self.client.post(url, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(PostVote.objects.first().value, -1)


class PostCommentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="comment@test.com", password="testpass123"
        )
        self.other_user = User.objects.create_user(
            email="other2@test.com", password="testpass123"
        )
        self.post = Post.objects.create(
            user=self.user, title="Comment Post", body="Comment content"
        )
        self.comment = PostComment.objects.create(
            user=self.user, post=self.post, body="Test comment"
        )

    def test_comment_list_public(self):
        url = reverse("post-comments", args=[self.post.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_comment_create_requires_auth(self):
        url = reverse("post-comment-create", args=[self.post.id])
        res = self.client.post(url, {"body": "Hi"})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_comment_create_authenticated(self):
        url = reverse("post-comment-create", args=[self.post.id])
        res = self.client.post(url, {"body": "Hi"}, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_comment_update_delete_owner_only(self):
        url = reverse("post-comment-update-delete", args=[self.comment.id])

        res = self.client.patch(url, {"body": "Nope"}, **auth_headers(self.other_user))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        res = self.client.patch(url, {"body": "Updated"}, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.delete(url, **auth_headers(self.user))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
