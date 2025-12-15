from django.urls import path
from .views import (
    PostListView,
    PostDetailView,
    PostCreateView,
    PostUpdateDeleteView,
    CommentCreateView,
    CommentDeleteView,
    CommentListView,
    ToggleLikeView,
    SubscriberCreateView,
)

urlpatterns = [
    # Posts
    path("posts/", PostListView.as_view(), name="post-list"),
    path("posts/create/", PostCreateView.as_view(), name="post-create"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
    path(
        "posts/<slug:slug>/manage/",
        PostUpdateDeleteView.as_view(),
        name="post-update-delete",
    ),
    # Comments
    path(
        "posts/<int:pk>/comments/",
        CommentListView.as_view(),
        name="comment-list",
    ),
    path(
        "posts/<int:pk>/comments/create/",
        CommentCreateView.as_view(),
        name="comment-create",
    ),
    path(
        "comments/<int:pk>/delete/",
        CommentDeleteView.as_view(),
        name="comment-delete",
    ),
    # Likes
    path(
        "posts/<int:pk>/like/",
        ToggleLikeView.as_view(),
        name="post-like-toggle",
    ),
    # Subscribers
    path(
        "subscribe/",
        SubscriberCreateView.as_view(),
        name="subscriber-create",
    ),
]
