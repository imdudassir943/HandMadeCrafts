from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Category, Product

class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Ceramics",
            name_ur="مٹی کے برتن"
        )
        self.product = Product.objects.create(
            name="Test Vase",
            name_ur="ٹیسٹ گلدان",
            price=10.00,
            image="products/test.png",
            category=self.category,
            material="Clay",
            material_ur="مٹی",
            artisan="Maker",
            artisan_ur="کارساز",
            description="Nice vase",
            description_ur="خوبصورت",
            dimensions="12x12",
            dimensions_ur="12x12",
            in_stock=True,
            featured=True
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Test Vase")
        self.assertEqual(str(self.product), "Test Vase")
        self.assertEqual(self.product.average_rating, 0.0)
        self.assertEqual(self.product.reviews_count, 0)

class ProductAPITest(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Ceramics", name_ur="مٹی کے برتن")
        self.product1 = Product.objects.create(
            name="Aura Vase", name_ur="اورا گلدان", price=50.00, image="products/vase.png",
            category=self.category, material="Clay", material_ur="مٹی",
            artisan="Maker", artisan_ur="کارساز", description="Crafted vase",
            description_ur="گلدان", dimensions="12x12", dimensions_ur="12",
            in_stock=True, featured=True
        )
        self.product2 = Product.objects.create(
            name="Tapestry", name_ur="قالین", price=100.00, image="products/tapestry.png",
            category=self.category, material="Wool", material_ur="اون",
            artisan="Maker 2", artisan_ur="کارساز 2", description="Woven tapestry",
            description_ur="قالین", dimensions="24x24", dimensions_ur="24",
            in_stock=True, featured=False
        )

    def test_list_products(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return both products
        self.assertEqual(len(response.data), 2)

    def test_search_products(self):
        url = reverse('product-list')
        # Search by term in name
        response = self.client.get(url, {'search': 'Aura'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Aura Vase')

    def test_featured_filter(self):
        url = reverse('product-list')
        response = self.client.get(url, {'featured': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Aura Vase')
