import random
from rest_framework import views, permissions, status
from rest_framework.response import Response
from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer

class PaymentProcessView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_number = request.data.get('order_number')
        payment_method = request.data.get('payment_method', 'Card')
        
        if not order_number:
            return Response({'error': 'order_number is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(order, 'payment'):
            return Response({'error': 'Order has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)

        transaction_id = f"TXN-{random.randint(10000000, 99999999)}"

        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            transaction_id=transaction_id,
            amount=order.total_price,
            status='Paid'
        )

        order.status = 'Processing'
        order.save()

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
