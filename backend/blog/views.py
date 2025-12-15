from rest_framework import generics, permissions, status
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import BlogPost, PostLike, PostComment, Subscriber
from .serializers import (
    BlogPostSerializer,
    PostLikeSerializer,
    PostCommentSerializer,
    SubscriberSerializer,
)


class PostPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 50


class PostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PostPagination
    filter_backends = [SearchFilter]
    search_fields = ["title", "category", "excerpt"]


class PostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class PostCreateView(generics.CreateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAdminUser]


class PostUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "slug"


class CommentPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 50


class CommentCreateView(generics.CreateAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post = get_object_or_404(BlogPost, pk=self.kwargs["pk"])
        serializer.save(post=post)


class CommentDeleteView(generics.DestroyAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PostComment.objects.filter(user=self.request.user)


class CommentListView(generics.ListAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = CommentPagination

    def get_queryset(self):
        post = get_object_or_404(BlogPost, pk=self.kwargs["pk"])
        return PostComment.objects.filter(post=post)


class ToggleLikeView(generics.GenericAPIView):
    serializer_class = PostLikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        user = request.user

        post_like, created = PostLike.objects.get_or_create(user=user, post=post)

        if not created:
            post_like.delete()
            return Response(
                {"liked": False},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"liked": True},
            status=status.HTTP_201_CREATED,
        )


class SubscriberCreateView(generics.CreateAPIView):
    serializer_class = SubscriberSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        if Subscriber.objects.filter(email=request.data.get("email")).exists():
            return Response(
                {"detail": "Email already subscribed"},
                status=status.HTTP_200_OK,
            )
        return super().create(request, *args, **kwargs)
