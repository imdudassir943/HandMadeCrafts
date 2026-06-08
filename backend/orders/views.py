from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product
from cart.models import Cart, CartItem

class OrderCreateListView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        data = request.data
        name = data.get('name')
        email = data.get('email')
        address = data.get('address')
        city = data.get('city')
        country = data.get('country')
        items_data = data.get('items', [])

        if not all([name, email, address, city, country]):
            return Response({'error': 'Shipping details (name, email, address, city, country) are required.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None

        resolved_items = []
        total_price = 0

        # Extract items
        if items_data:
            for item in items_data:
                p_id = item.get('product_id')
                qty = int(item.get('quantity', 1))
                try:
                    product = Product.objects.get(id=p_id)
                except Product.DoesNotExist:
                    return Response({'error': f'Product with id {p_id} not found.'}, status=status.HTTP_404_NOT_FOUND)
                
                price = product.price
                total_price += price * qty
                resolved_items.append((product, price, qty))
        elif user:
            try:
                cart = Cart.objects.get(user=user)
                cart_items = cart.items.all()
                if not cart_items.exists():
                    return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)
                for item in cart_items:
                    product = item.product
                    qty = item.quantity
                    price = product.price
                    total_price += price * qty
                    resolved_items.append((product, price, qty))
            except Cart.DoesNotExist:
                return Response({'error': 'No active cart found.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Order must contain items.'}, status=status.HTTP_400_BAD_REQUEST)

        # Write to db atomically
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                name=name,
                email=email,
                address=address,
                city=city,
                country=country,
                total_price=total_price
            )
            for product, price, qty in resolved_items:
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    price=price,
                    quantity=qty
                )
            
            # Clear DB cart if checkout was loaded from cart
            if not items_data and user:
                CartItem.objects.filter(cart__user=user).delete()

        serializer = self.get_serializer(order, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
