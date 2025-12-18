from django.urls import path
from .views import (
    PostListView,
    PostDetailView,
    PostCreateView,
    PostUpdateDeleteView,
    PostUpVoteView,
    PostDownVoteView,
    PostCommentListView,
    PostCommentCreateView,
    PostCommentUpdateDeleteView,
)

urlpatterns = [
    # Posts
    path("posts/", PostListView.as_view(), name="post-list"),
    path("posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("posts/create/", PostCreateView.as_view(), name="post-create"),
    path(
        "posts/<int:pk>/edit/",
        PostUpdateDeleteView.as_view(),
        name="post-update-delete",
    ),
    path("posts/<int:pk>/upvote/", PostUpVoteView.as_view(), name="post-upvote"),
    path("posts/<int:pk>/downvote/", PostDownVoteView.as_view(), name="post-downvote"),
    # Comments
    path(
        "posts/<int:pk>/comments/",
        PostCommentListView.as_view(),
        name="post-comment-list",
    ),
    path(
        "posts/<int:pk>/comments/create/",
        PostCommentCreateView.as_view(),
        name="post-comment-create",
    ),
    path(
        "comments/<int:pk>/edit/",
        PostCommentUpdateDeleteView.as_view(),
        name="post-comment-update-delete",
    ),
]
