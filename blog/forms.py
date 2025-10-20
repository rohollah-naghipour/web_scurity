
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from blog.models import *

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']
     
        