from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer
from products.models import Product

class ReviewCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        author = self.request.data.get('author')
        if user and not author:
            author = user.name
        serializer.save(user=user, author=author or "Anonymous")
