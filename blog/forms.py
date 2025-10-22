
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from blog.models import *

from django.contrib.auth.password_validation import validate_password

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



class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content']


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']


class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter your first name'
        })
    )
    
    last_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter your last name'
        })
    )
    
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter your email address'
        })
    )
    
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter username'
        })
    )
    
    # Password change fields
    current_password = forms.CharField(
        required=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter current password to change password'
        }),
        label="Current Password (required for password change)"
    )
    
    new_password1 = forms.CharField(
        required=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter new password'
        }),
        label="New Password"
    )
    
    new_password2 = forms.CharField(
        required=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Confirm new password'
        }),
        label="Confirm New Password"
    )
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username']
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exclude(pk=self.instance.pk).exists():
            raise ValidationError('This username is already taken.')
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise ValidationError('This email is already registered.')
        return email
    
    def clean(self):
        cleaned_data = super().clean()
        
        current_password = cleaned_data.get('current_password')
        new_password1 = cleaned_data.get('new_password1')
        new_password2 = cleaned_data.get('new_password2')
        
        # Check if user wants to change password
        if new_password1 or new_password2 or current_password:
            # Validate that all password fields are filled
            if not all([current_password, new_password1, new_password2]):
                raise ValidationError(
                    'To change password, please fill all password fields.'
                )
            
            # Verify current password
            if not self.instance.check_password(current_password):
                raise ValidationError({
                    'current_password': 'Current password is incorrect.'
                })
            
            # Validate new password
            if new_password1 != new_password2:
                raise ValidationError({
                    'new_password2': 'New passwords do not match.'
                })
            
            # Validate password strength
            try:
                validate_password(new_password1, self.instance)
            except ValidationError as e:
                raise ValidationError({'new_password1': e.messages})
        
        return cleaned_data
        
    def save(self, commit=True):
        user = super().save(commit=False)
        
        # Change password if provided
        new_password = self.cleaned_data.get('new_password1')
        if new_password:
            user.set_password(new_password)
        
        if commit:
            user.save()
        
        return user    