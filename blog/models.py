from django.db import models
from django.contrib.auth.models import User

from .validators import post_validator


class Post(models.Model):
    title = models.CharField(max_length=200,
    validators=[post_validator.validate_title],)

    content = models.FileField(upload_to='uploads/',
         null=False, blank=False, validators=[post_validator.validate_image])

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)


  