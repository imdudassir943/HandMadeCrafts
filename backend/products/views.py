from django.db import models
from rest_framework import viewsets, permissions, generics
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('reviews', 'additional_images').all().order_by('-created_at')
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = Product.objects.select_related('category').prefetch_related('reviews', 'additional_images').all().order_by('-created_at')
        category_name = self.request.query_params.get('category', None)
        search_query = self.request.query_params.get('search', None)
        featured = self.request.query_params.get('featured', None)

        if category_name:
            # Match against category name
            queryset = queryset.filter(category__name__iexact=category_name)
        if search_query:
            # Match search text against both English and Urdu name/description
            queryset = queryset.filter(
                models.Q(name__icontains=search_query) |
                models.Q(name_ur__icontains=search_query) |
                models.Q(description__icontains=search_query) |
                models.Q(description_ur__icontains=search_query)
            )
        if featured is not None:
            is_featured = featured.lower() in ['true', '1']
            queryset = queryset.filter(featured=is_featured)

        return queryset

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
