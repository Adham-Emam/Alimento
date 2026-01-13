from django.contrib import admin
from .models import Tag, Post, PostVote, PostComment


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'recipe', 'score', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('title', 'body', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'upvotes_count', 'downvotes_count')
    filter_horizontal = ('tags',)
    
    @admin.display(description='Score')
    def score(self, obj):
        return obj.score


@admin.register(PostVote)
class PostVoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'value', 'created_at')
    list_filter = ('value', 'created_at')
    search_fields = ('user__email', 'post__title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'content_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'post__title', 'content')
    readonly_fields = ('created_at', 'updated_at')
    
    @admin.display(description='Content Preview')
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content

