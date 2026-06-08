from rest_framework import serializers
from .models import SiteSettings

class SiteSettingsSerializer(serializers.ModelSerializer):
    siteName = serializers.CharField(source='site_name')
    siteNameUr = serializers.CharField(source='site_name_ur')
    siteTitle = serializers.CharField(source='site_title')
    siteTitleUr = serializers.CharField(source='site_title_ur')
    heroTitle = serializers.CharField(source='hero_title')
    heroTitleUr = serializers.CharField(source='hero_title_ur')
    heroSub = serializers.CharField(source='hero_sub')
    heroSubUr = serializers.CharField(source='hero_sub_ur')

    class Meta:
        model = SiteSettings
        fields = [
            'siteName', 'siteNameUr', 'siteTitle', 'siteTitleUr', 
            'logo', 'heroTitle', 'heroTitleUr', 'heroSub', 'heroSubUr'
        ]
