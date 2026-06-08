from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import SiteSettings
from .serializers import SiteSettingsSerializer
from django.contrib.auth import get_user_model
from products.models import Product
from orders.models import Order
from contact.models import ContactMessage
from django.db.models import Sum

User = get_user_model()

class SiteSettingsView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='Pending').count()
        total_products = Product.objects.count()
        out_of_stock = Product.objects.filter(in_stock=False).count()
        total_users = User.objects.filter(is_staff=False).count()
        total_messages = ContactMessage.objects.count()
        
        revenue_data = Order.objects.exclude(status='Cancelled').aggregate(Sum('total_price'))
        total_revenue = revenue_data['total_price__sum'] or 0.00

        # Import OrderSerializer here to avoid potential circular dependencies
        from orders.serializers import OrderSerializer
        recent_orders = Order.objects.all().order_by('-created_at')[:5]
        recent_orders_serialized = OrderSerializer(recent_orders, many=True, context={'request': request}).data

        return Response({
            'stats': {
                'totalSales': total_revenue,
                'totalOrders': total_orders,
                'pendingOrders': pending_orders,
                'totalProducts': total_products,
                'outOfStockProducts': out_of_stock,
                'totalCustomers': total_users,
                'totalMessages': total_messages
            },
            'recentOrders': recent_orders_serialized
        })
