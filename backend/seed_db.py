import os
import shutil
import django
from django.core.files import File

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'handmade_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Category, Product, ProductImage
from reviews.models import Review
from dashboard.models import SiteSettings

def seed():
    print("Starting database seeding...")
    
    # 1. Clear Existing Data
    print("Clearing existing data...")
    Review.objects.all().delete()
    ProductImage.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    SiteSettings.objects.all().delete()
    print("Database cleared.")
    
    # 2. Create Superuser
    User = get_user_model()
    admin_email = 'admin@auracrafts.com'
    if not User.objects.filter(email=admin_email).exists():
        User.objects.create_superuser(
            email=admin_email,
            name='Aura Admin',
            password='password123'
        )
        print(f"Created superuser: {admin_email} / password123")
    else:
        print(f"Superuser {admin_email} already exists.")

    # 3. Setup Media Folders
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    media_dir = os.path.join(backend_dir, 'media')
    products_media_dir = os.path.join(media_dir, 'products')
    artisans_media_dir = os.path.join(media_dir, 'artisans')
    site_media_dir = os.path.join(media_dir, 'site')

    os.makedirs(products_media_dir, exist_ok=True)
    os.makedirs(artisans_media_dir, exist_ok=True)
    os.makedirs(site_media_dir, exist_ok=True)

    # Source images path in frontend and fallback default_media
    frontend_images_dir = os.path.abspath(os.path.join(backend_dir, '..', 'frontend', 'public', 'images'))
    default_media_dir = os.path.join(backend_dir, 'default_media')

    # Copy files helper
    def copy_file(filename, dest_folder):
        src = os.path.join(frontend_images_dir, filename)
        if not os.path.exists(src):
            src = os.path.join(default_media_dir, filename)
        dest = os.path.join(dest_folder, filename)
        if os.path.exists(src):
            shutil.copy(src, dest)
            print(f"Copied {filename} to {dest_folder}")
        else:
            print(f"Source file not found: {src}")

    # Run copy files
    copy_file('ceramic_vase.png', products_media_dir)
    copy_file('ceramic_vase_2.png', products_media_dir)
    copy_file('wall_hanging.png', products_media_dir)
    copy_file('wall_hanging_2.png', products_media_dir)
    copy_file('wood_bowl.png', products_media_dir)
    copy_file('wood_bowl_2.png', products_media_dir)
    copy_file('brass_lantern.png', products_media_dir)
    copy_file('brass_lantern_2.png', products_media_dir)
    copy_file('artisan_portrait.png', artisans_media_dir)
    
    # Copy website logo
    copy_file('ceramic_vase.png', site_media_dir)
    src_logo = os.path.join(site_media_dir, 'ceramic_vase.png')
    dest_logo = os.path.join(site_media_dir, 'logo.png')
    if os.path.exists(src_logo):
        if os.path.exists(dest_logo):
            os.remove(dest_logo)
        os.rename(src_logo, dest_logo)
        print("Set logo.png in media/site/")

    # 4. Create Site Settings & Upload Logo
    site_settings = SiteSettings.load()
    logo_path = os.path.join(site_media_dir, 'logo.png')
    if os.path.exists(logo_path):
        with open(logo_path, 'rb') as f:
            site_settings.logo.save('logo.png', File(f), save=True)
            print("Uploaded logo.png to Site Settings")
    else:
        site_settings.logo = 'site/logo.png'
        site_settings.save()
    print("Site Branding Settings initialized.")

    # 5. Create Categories
    categories_data = [
        {"name": "Ceramics", "name_ur": "مٹی کے برتن"},
        {"name": "Textiles", "name_ur": "منسوجات"},
        {"name": "Woodwork", "name_ur": "لکڑی کا کام"},
        {"name": "Lighting", "name_ur": "لائٹس اور فانوس"}
    ]

    categories = {}
    for cat_data in categories_data:
        cat, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'name_ur': cat_data['name_ur']}
        )
        categories[cat.name] = cat
        print(f"Category: {cat.name} ({'created' if created else 'exists'})")

    # 6. Create Products and Upload Images
    products_data = [
        {
            "name": "Terracotta Ceramic Vase",
            "name_ur": "مٹی کا خوبصورت گلدان",
            "price": 85.00,
            "image_path": "ceramic_vase.png",
            "category": categories["Ceramics"],
            "material": "Clay & Mineral Glaze",
            "material_ur": "خالص مٹی اور معدنی چمک",
            "artisan": "Yusuf Ahmed",
            "artisan_ur": "یوسف احمد",
            "artisan_image_path": "artisan_portrait.png",
            "description": "Each terracotta vase is hand-thrown on the potter's wheel using locally-sourced clay. It is fired at high temperatures and finished with a unique organic mineral glaze, creating subtle variations in texture and color that ensure no two pieces are identical.",
            "description_ur": "ہر مٹی کا گلدان مقامی طور پر حاصل کردہ مٹی سے روایتی چاک پر ہاتھ سے تیار کیا جاتا ہے۔ اسے بلند درجہ حرارت پر پکا کر ایک منفرد معدنی چمک کے ساتھ مکمل کیا جاتا ہے، جس سے اس کی بناوٹ اور رنگ میں ایسی باریک تبدیلیاں آتی ہیں جو ہر ٹکڑے کو ایک منفرد فن پارہ بناتی ہے۔",
            "dimensions": "12\" H x 7\" W",
            "dimensions_ur": "12 انچ اونچائی × 7 انچ چوڑائی",
            "in_stock": True,
            "featured": True
        },
        {
            "name": "Woven Tapestry Wall Hanging",
            "name_ur": "ہاتھ سے بنا ہوا جدارتی قالین",
            "price": 120.00,
            "image_path": "wall_hanging.png",
            "category": categories["Textiles"],
            "material": "Organic Wool & Pine Wood",
            "material_ur": "نامیاتی اون اور صنوبر کی لکڑی",
            "artisan": "Sarah Weaver",
            "artisan_ur": "سارہ ویور",
            "artisan_image_path": "artisan_portrait.png",
            "description": "Handwoven in a traditional loom using high-quality organic wool and cotton fibers. This boho-inspired tapestry features intricate geometric patterns and long tassels, suspended on a polished pine wood dowel.",
            "description_ur": "اعلیٰ معیار کی نامیاتی اون اور سوتی دھاگوں کا استعمال کرتے ہوئے روایتی کھڈی پر ہاتھ سے بنا ہوا یہ خوبصورت وال ہینگنگ قالین بوهو طرز کے ڈیزائن، ہندسی نمونوں اور خوبصورت جھالروں پر مشتمل ہے۔",
            "dimensions": "36\" L x 24\" W",
            "dimensions_ur": "36 انچ لمبائی × 24 انچ چوڑائی",
            "in_stock": True,
            "featured": True
        },
        {
            "name": "Olive Wood Decorative Bowl",
            "name_ur": "زیتون کی لکڑی کا آرائشی پیالہ",
            "price": 65.00,
            "image_path": "wood_bowl.png",
            "category": categories["Woodwork"],
            "material": "Reclaimed Olive Wood",
            "material_ur": "زیتون کی پائیدار لکڑی",
            "artisan": "Mario C.",
            "artisan_ur": "ماریو سی",
            "artisan_image_path": "artisan_portrait.png",
            "description": "Carved from premium, reclaimed olive wood logs, this decorative bowl highlights the breathtaking natural grain and contrasting swirls characteristic of olive wood.",
            "description_ur": "زیتون کی قیمتی لکڑی سے تراشا گیا یہ خوبصورت پیالہ لکڑی کے قدرتی اور دلکش ریشوں کو نمایاں کرتا ہے۔ اس کی بیرونی چھال کو قدرتی حالت میں چھوڑا گیا ہے، جبکہ اندرونی حصے کو رگڑ کر ہموار کیا گیا ہے اور اسے لکڑی کے محافظ قدرتی تیل سے چمکایا گیا ہے۔",
            "dimensions": "10\" Diameter x 4\" H",
            "dimensions_ur": "10 انچ قطر × 4 انچ اونچائی",
            "in_stock": True,
            "featured": True
        },
        {
            "name": "Moroccan Brass Lantern",
            "name_ur": "مراکشی پیتل کا فانوس",
            "price": 150.00,
            "image_path": "brass_lantern.png",
            "category": categories["Lighting"],
            "material": "Solid Hammered Brass",
            "material_ur": "خالص پیتل",
            "artisan": "Karim Al-Mansoor",
            "artisan_ur": "کریم المنصور",
            "artisan_image_path": "artisan_portrait.png",
            "description": "Hand-hammered and pierced by skilled artisans in Fez, this Moroccan brass lantern creates an enchanting play of light. When illuminated, the intricate star and floral geometric cutouts cast beautiful patterned shadows.",
            "description_ur": "فاس کے ماہر کاریگروں کے ہاتھوں سے تیار کردہ یہ مراکشی پیتل کا فانوس روشنی کے خوبصورت سائے بکھیرتا ہے۔ جب اسے روشن کیا جائے تو اس کے نفیس ہندسی اور پھولوں والے نمونے چھت اور دیواروں پر دلکش سائے بناتے ہیں، جو کمرے کو سحر انگیز بنا دیتے ہیں۔",
            "dimensions": "18\" H x 9\" W",
            "dimensions_ur": "18 انچ اونچائی × 9 انچ چوڑائی",
            "in_stock": True,
            "featured": True
        }
    ]

    products = {}
    for p_data in products_data:
        p_data_copy = p_data.copy()
        image_name = p_data_copy.pop('image_path')
        artisan_image_name = p_data_copy.pop('artisan_image_path')
        
        prod = Product.objects.create(**p_data_copy)
        
        # Upload main product image
        local_prod_path = os.path.join(products_media_dir, image_name)
        if os.path.exists(local_prod_path):
            with open(local_prod_path, 'rb') as f:
                prod.image.save(image_name, File(f), save=False)
                print(f"Uploaded product image {image_name} for {prod.name}")

        # Upload artisan image
        local_art_path = os.path.join(artisans_media_dir, artisan_image_name)
        if os.path.exists(local_art_path):
            with open(local_art_path, 'rb') as f:
                prod.artisan_image.save(artisan_image_name, File(f), save=False)
                print(f"Uploaded artisan image {artisan_image_name} for {prod.name}")
                
        prod.save()
        products[prod.name] = prod
        print(f"Product: {prod.name} created and saved.")

    # 7. Create Additional Product Images (Gallery) & Upload
    gallery_data = [
        {
            "product": products["Terracotta Ceramic Vase"],
            "image_path": "ceramic_vase_2.png"
        },
        {
            "product": products["Woven Tapestry Wall Hanging"],
            "image_path": "wall_hanging_2.png"
        },
        {
            "product": products["Olive Wood Decorative Bowl"],
            "image_path": "wood_bowl_2.png"
        },
        {
            "product": products["Moroccan Brass Lantern"],
            "image_path": "brass_lantern_2.png"
        }
    ]

    for g_item in gallery_data:
        prod_img = ProductImage(product=g_item["product"])
        image_name = g_item["image_path"]
        local_gal_path = os.path.join(products_media_dir, image_name)
        if os.path.exists(local_gal_path):
            with open(local_gal_path, 'rb') as f:
                prod_img.image.save(image_name, File(f), save=True)
                print(f"Uploaded additional image {image_name} for {g_item['product'].name}")

    # 8. Create Reviews
    reviews_data = [
        {
            "product": products["Terracotta Ceramic Vase"],
            "author": "Elena Rostova",
            "author_ur": "ایلینا روستووا",
            "rating": 5,
            "comment": "The terracotta vase is absolutely stunning! The natural glaze variants make it look like an ancient artifact. I've received so many compliments on it.",
            "comment_ur": "مٹی کا یہ گلدان بے حد خوبصورت ہے! اس کی قدرتی چمک اور بناوٹ اسے ایک قدیم تاریخی شاہکار بناتی ہے۔ مجھے اس پر بہت تعریفیں ملی ہیں۔"
        },
        {
            "product": products["Moroccan Brass Lantern"],
            "author": "Tariq Mansoor",
            "author_ur": "طارق منصور",
            "rating": 5,
            "comment": "The Moroccan lantern is worth every penny. The patterns it casts when lit at night are breathtaking. Outstanding handiwork!",
            "comment_ur": "مراکشی فانوس اپنی قیمت کے لحاظ سے بہترین ہے۔ رات کو اس سے بننے والے سائے اور روشنی کے پیٹرنز انتہائی دلکش ہیں۔ عمدہ دستکاری!"
        },
        {
            "product": products["Olive Wood Decorative Bowl"],
            "author": "Amara Okeke",
            "author_ur": "امارا اوکیکی",
            "rating": 4,
            "comment": "Stunning olive wood bowl. The grain is beautiful and it has a lovely earthy scent. It is slightly smaller than expected.",
            "comment_ur": "زیتون کی لکڑی کا یہ پیالہ بہت شاندار ہے۔ اس کی خوشبو اور بناوٹ قدرتی احساس دیتی ہے۔ یہ سائز میں ثھوٹا ہے لیکن میرے کھانے کی میز پر بہت جچتا ہے۔"
        }
    ]

    for rev_data in reviews_data:
        Review.objects.create(**rev_data)
        print(f"Review by {rev_data['author']} for {rev_data['product'].name}")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
