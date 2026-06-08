from django.contrib import admin
from .models import Review

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('author', 'comment', 'comment_ur')

admin.site.register(Review, ReviewAdmin)
