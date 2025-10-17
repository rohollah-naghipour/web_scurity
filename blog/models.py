from django.db import models
from django.db import models
from django.contrib.auth.models import User


def validate_file_extension(value):
    import os
    from django.core.exceptions import ValidationError
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.png']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.FileField(upload_to='uploads/',
         null=False, blank=False, validators=[validate_file_extension])
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)


  