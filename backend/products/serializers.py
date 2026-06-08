from rest_framework import serializers
from .models import Category, Product, ProductImage
from reviews.serializers import ReviewSerializer

class CategorySerializer(serializers.ModelSerializer):
    nameUr = serializers.CharField(source='name_ur')

    class Meta:
        model = Category
        fields = ['id', 'name', 'nameUr']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    nameUr = serializers.CharField(source='name_ur')
    category = serializers.CharField(source='category.name')
    categoryUr = serializers.CharField(source='category.name_ur')
    materialUr = serializers.CharField(source='material_ur')
    artisanUr = serializers.CharField(source='artisan_ur')
    artisanImage = serializers.SerializerMethodField()
    descriptionUr = serializers.CharField(source='description_ur')
    dimensionsUr = serializers.CharField(source='dimensions_ur')
    inStock = serializers.BooleanField(source='in_stock')
    
    rating = serializers.FloatField(source='average_rating', read_only=True)
    reviewsCount = serializers.IntegerField(source='reviews_count', read_only=True)
    
    images = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'nameUr', 'price', 'image', 'images', 
            'category', 'categoryUr', 'material', 'materialUr', 
            'artisan', 'artisanUr', 'artisanImage', 'description', 
            'descriptionUr', 'rating', 'reviewsCount', 'dimensions', 
            'dimensionsUr', 'inStock', 'featured', 'reviews'
        ]

    def get_images(self, obj):
        request = self.context.get('request')
        urls = []
        if obj.image:
            urls.append(request.build_absolute_uri(obj.image.url) if request else obj.image.url)
        for extra in obj.additional_images.all():
            urls.append(request.build_absolute_uri(extra.image.url) if request else extra.image.url)
        return urls

    def get_artisanImage(self, obj):
        request = self.context.get('request')
        if obj.artisan_image:
            return request.build_absolute_uri(obj.artisan_image.url) if request else obj.artisan_image.url
        return None
