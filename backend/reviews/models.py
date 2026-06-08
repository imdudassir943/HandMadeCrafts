from django.db import models
from django.conf import settings
from products.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    author = models.CharField(max_length=255)
    author_ur = models.CharField(max_length=255, blank=True)
    rating = models.IntegerField()
    comment = models.TextField()
    comment_ur = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} - {self.product.name} ({self.rating}★)"
