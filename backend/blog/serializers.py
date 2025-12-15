from rest_framework import serializers
from .models import BlogPost, PostLike, PostComment, Subscriber


class PostLikeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = PostLike
        fields = ["id", "user", "post"]
        read_only_fields = ["user", "post", "created_at"]


class PostCommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = PostComment
        fields = ["id", "user", "post", "content", "created_at"]
        read_only_fields = ["user", "post", "created_at"]


class BlogPostSerializer(serializers.ModelSerializer):
    likes = PostLikeSerializer(many=True, read_only=True)
    comments = PostCommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = "__all__"

    def get_is_liked(self, obj):
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return obj.likes.filter(user=user).exists()


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = "__all__"
