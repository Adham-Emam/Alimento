from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404
from django.db.models import Count

from .models import Post, PostVote, PostComment
from .serializers import PostReadSerializer, PostWriteSerializer, PostCommentSerializer
from .permissions import IsOwnerOrReadOnly


class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class CommentPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class PostListView(generics.ListAPIView):
    queryset = (
        Post.objects.all()
        .select_related("user", "recipe")
        .prefetch_related("tags")
        .annotate(comments_count=Count("comments"))
        .order_by("-created_at")
    )
    serializer_class = PostReadSerializer
    pagination_class = PostPagination
    permission_classes = [AllowAny]


class PostDetailView(generics.RetrieveAPIView):
    queryset = (
        Post.objects.all()
        .select_related("user", "recipe")
        .prefetch_related("tags")
        .annotate(comments_count=Count("comments"))
        .order_by("-created_at")
    )
    serializer_class = PostReadSerializer
    permission_classes = [AllowAny]


class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostWriteSerializer
    permission_classes = [IsAuthenticated]


class PostUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = (
        Post.objects.all()
        .select_related("user", "recipe")
        .prefetch_related("tags")
        .order_by("-created_at")
    )
    serializer_class = PostWriteSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


def _apply_vote(user, post, value: int):
    vote = PostVote.objects.filter(user=user, post=post).first()
    if vote is None:
        PostVote.objects.create(user=user, post=post, value=value)
        return "created"
    elif vote.value == value:
        vote.delete()
        return "deleted"
    else:
        vote.value = value
        vote.save(update_fields=["value", "updated_at"])
        return "updated"


class PostUpVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        action = _apply_vote(request.user, post, 1)
        return Response({"status": f"Upvote {action}."}, status=status.HTTP_200_OK)


class PostDownVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        action = _apply_vote(request.user, post, -1)
        return Response({"status": f"Downvote {action}."}, status=status.HTTP_200_OK)


class PostCommentListView(generics.ListAPIView):
    serializer_class = PostCommentSerializer
    pagination_class = CommentPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_id = self.kwargs.get("pk")
        return (
            PostComment.objects.filter(post__id=post_id)
            .select_related("user")
            .order_by("-created_at")
        )


class PostCommentCreateView(generics.CreateAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs.get("pk")
        post = get_object_or_404(Post, pk=post_id)
        serializer.save(user=self.request.user, post=post)


class PostCommentUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PostComment.objects.all().select_related("user", "post")
    serializer_class = PostCommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
