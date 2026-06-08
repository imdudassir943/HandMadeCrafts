from django.urls import path
from .views import SiteSettingsView, DashboardStatsView

urlpatterns = [
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
