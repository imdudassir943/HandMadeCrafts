from django.db import models

class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('custom', 'Custom Order Request'),
        ('shipping', 'Shipping & Orders'),
        ('collab', 'Artisan Collaborations'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} regarding {self.get_subject_display()}"
