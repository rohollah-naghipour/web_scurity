
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from blog.models import *

class UserRegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'enter password'}))
    password2 = forms.CharField(label='Confirm password',
     widget=forms.PasswordInput(attrs={'placeholder': 'enter password again'}))

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'username'}),
            'first_name': forms.TextInput(attrs={'placeholder': 'name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'lastname'}),
            'email': forms.EmailInput(attrs={'placeholder': 'email'}),
        }

    def clean_password2(self):
        p1 = self.cleaned_data.get('password')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise ValidationError("The password and receipt do not match.")
        return p2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user

class UserLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'password'}))

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']
     
        