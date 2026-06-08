from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'price', 'quantity', 'subtotal')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'name', 'email', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'name', 'email')
    readonly_fields = ('order_number', 'total_price')
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
