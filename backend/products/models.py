import os
import sys
from io import BytesIO
from PIL import Image
from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile

def compress_image(image_field):
    if not image_field:
        return image_field
    
    try:
        # Open the image using Pillow
        img = Image.open(image_field)
        
        # Only process if we can read format/mode
        if img.mode in ('RGBA', 'LA') and image_field.name.lower().endswith(('.jpg', '.jpeg')):
            img = img.convert('RGB')
        elif img.mode == 'RGBA' and not image_field.name.lower().endswith('.png'):
            img = img.convert('RGB')
            
        # Resize if dimensions exceed 1600px
        max_size = 1600
        if img.width > max_size or img.height > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
        output = BytesIO()
        filename = image_field.name
        
        if filename.lower().endswith('.png'):
            img_format = 'PNG'
            content_type = 'image/png'
            img.save(output, format=img_format, optimize=True)
        else:
            img_format = 'JPEG'
            content_type = 'image/jpeg'
            if not filename.lower().endswith(('.jpg', '.jpeg')):
                filename = os.path.splitext(filename)[0] + '.jpg'
            img.save(output, format=img_format, quality=85, optimize=True)
            
        output.seek(0)
        
        # Create a new InMemoryUploadedFile to replace the old field value
        return InMemoryUploadedFile(
            output,
            'ImageField',
            filename,
            content_type,
            sys.getsizeof(output),
            None
        )
    except Exception as e:
        # If anything fails, print error and fallback to the original image field
        print(f"Error compressing image {image_field.name}: {e}", file=sys.stderr)
        return image_field

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_ur = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    name_ur = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    material = models.CharField(max_length=255)
    material_ur = models.CharField(max_length=255)
    artisan = models.CharField(max_length=255)
    artisan_ur = models.CharField(max_length=255)
    artisan_image = models.ImageField(upload_to='artisans/', blank=True, null=True)
    description = models.TextField()
    description_ur = models.TextField()
    dimensions = models.CharField(max_length=100)
    dimensions_ur = models.CharField(max_length=100)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        reviews = list(self.reviews.all())
        if not reviews:
            return 0.0
        total = sum(review.rating for review in reviews)
        return round(total / len(reviews), 1)

    @property
    def reviews_count(self):
        return len(self.reviews.all())

    def save(self, *args, **kwargs):
        # Compress product main image if newly uploaded
        if self.image and hasattr(self.image, 'file') and isinstance(self.image.file, UploadedFile):
            self.image = compress_image(self.image)
            
        # Compress artisan image if newly uploaded
        if self.artisan_image and hasattr(self.artisan_image, 'file') and isinstance(self.artisan_image.file, UploadedFile):
            self.artisan_image = compress_image(self.artisan_image)
            
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to='products/gallery/')

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        # Compress additional gallery image if newly uploaded
        if self.image and hasattr(self.image, 'file') and isinstance(self.image.file, UploadedFile):
            self.image = compress_image(self.image)
        super().save(*args, **kwargs)
