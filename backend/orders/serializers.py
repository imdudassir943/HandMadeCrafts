from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price', 'quantity', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'name', 'email', 'address', 'city', 
            'country', 'total_price', 'status', 'created_at', 'items', 'payment'
        ]
        read_only_fields = ['id', 'order_number', 'status', 'created_at']

    def get_payment(self, obj):
        if hasattr(obj, 'payment'):
            return {
                'transaction_id': obj.payment.transaction_id,
                'status': obj.payment.status,
                'payment_method': obj.payment.payment_method,
                'created_at': obj.payment.created_at
            }
        return None
