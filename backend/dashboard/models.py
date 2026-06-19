from django.db import models

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="Aura Crafts")
    site_name_ur = models.CharField(max_length=100, default="اورا کرافٹس")
    
    site_title = models.CharField(max_length=255, default="Aura Crafts - Premium Handmade Home Décor")
    site_title_ur = models.CharField(max_length=255, default="اورا کرافٹس - پریمیم ہینڈ میڈ ہوم ڈیکور")
    
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    
    hero_title = models.CharField(max_length=255, default="Handcrafted Treasures for Your Sanctuary")
    hero_title_ur = models.CharField(max_length=255, default="ہاتھ سے بنے شاہکار آپ کے خوبصورت گھر کے لیے")
    
    hero_sub = models.TextField(default="Immerse your space in the stories of global master craftsmen. Curated, sustainable, and heirloom-quality home decor.")
    hero_sub_ur = models.TextField(default="اپنے گھر کو دنیا بھر کے ماہر دستکاروں کی کہانیوں سے سجائیں۔ منتخب، پائیدار اور شاندار ہوم ڈیکور۔")

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        # Compress logo if newly uploaded
        if self.logo:
            from django.core.files.uploadedfile import UploadedFile
            if hasattr(self.logo, 'file') and isinstance(self.logo.file, UploadedFile):
                from products.models import compress_image
                self.logo = compress_image(self.logo)
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Website Branding Settings"
