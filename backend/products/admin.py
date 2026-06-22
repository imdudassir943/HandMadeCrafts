from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ('image_preview',)
    fields = ('image', 'image_preview')

    def image_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<a href="{0}" target="_blank">'
                '<img src="{0}" style="max-height: 80px; max-width: 80px; border-radius: 4px; border: 1px solid #ccc; object-fit: cover;" />'
                '</a>',
                obj.image.url
            )
        return "No image uploaded"
    image_preview.short_description = 'Preview'

class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'image_preview_list')
    list_filter = ('product',)
    readonly_fields = ('image_preview_detail',)
    
    def image_preview_list(self, obj):
        if obj.image:
            return format_html(
                '<a href="{0}" target="_blank">'
                '<img src="{0}" style="max-height: 50px; max-width: 50px; border-radius: 4px; border: 1px solid #ccc; object-fit: cover;" />'
                '</a>',
                obj.image.url
            )
        return "No Image"
    image_preview_list.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html(
                '<a href="{0}" target="_blank">'
                '<img src="{0}" style="max-height: 200px; max-width: 200px; border-radius: 8px; border: 1px solid #ddd; object-fit: cover;" />'
                '</a>',
                obj.image.url
            )
        return "No Image"
    image_preview_detail.short_description = 'Preview'

class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_preview_list', 'name', 'price', 'category', 'in_stock', 'featured', 'created_at')
    list_filter = ('category', 'in_stock', 'featured')
    search_fields = ('name', 'name_ur', 'description', 'description_ur')
    inlines = [ProductImageInline]
    readonly_fields = ('main_image_preview', 'artisan_image_preview')
    
    fields = (
        'name', 'name_ur',
        'price', 'category',
        'image', 'main_image_preview',
        'material', 'material_ur',
        'artisan', 'artisan_ur',
        'artisan_image', 'artisan_image_preview',
        'description', 'description_ur',
        'dimensions', 'dimensions_ur',
        'in_stock', 'featured'
    )
    
    def image_preview_list(self, obj):
        if obj.image:
            return format_html(
                '<img src="{0}" style="max-height: 40px; max-width: 40px; border-radius: 4px; object-fit: cover;" />',
                obj.image.url
            )
        return "No Image"
    image_preview_list.short_description = 'Image'

    def main_image_preview(self, obj):
        if obj.image:
            return format_html(
                '<a href="{0}" target="_blank">'
                '<img src="{0}" style="max-height: 150px; max-width: 150px; border-radius: 6px; border: 1px solid #ccc; object-fit: cover;" />'
                '</a>',
                obj.image.url
            )
        return "No main image uploaded"
    main_image_preview.short_description = 'Current Main Image'

    def artisan_image_preview(self, obj):
        if obj.artisan_image:
            return format_html(
                '<a href="{0}" target="_blank">'
                '<img src="{0}" style="max-height: 150px; max-width: 150px; border-radius: 6px; border: 1px solid #ccc; object-fit: cover;" />'
                '</a>',
                obj.artisan_image.url
            )
        return "No artisan image uploaded"
    artisan_image_preview.short_description = 'Current Artisan Image'

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)

