from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        if cart_item.quantity <= 0:
            cart_item.delete()
        else:
            cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not in cart'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def delete(self, request):
        cart = self.get_cart(request.user)
        product_id = request.query_params.get('product_id')
        
        if product_id:
            CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        else:
            CartItem.objects.filter(cart=cart).delete()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
