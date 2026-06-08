from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product', 'author', 'author_ur', 'rating', 'comment', 'comment_ur', 'date']
        read_only_fields = ['id', 'date']

    def get_date(self, obj):
        # Format date as 'Month Day, Year' e.g. 'June 08, 2026'
        return obj.created_at.strftime("%B %d, %Y")
