from django.contrib import admin
from .models import Category, Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'in_stock', 'featured', 'created_at')
    list_filter = ('category', 'in_stock', 'featured')
    search_fields = ('name', 'name_ur', 'description', 'description_ur')
    inlines = [ProductImageInline]

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
