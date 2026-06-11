from django.db import models

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

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to='products/gallery/')

    def __str__(self):
        return f"Image for {self.product.name}"
