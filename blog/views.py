from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from .models import Post
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect

from blog.forms import UserRegisterForm, UserLoginForm 

def post_list(request):
    posts = Post.objects.all()
    return render(request, 'post_list.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'post_detail.html', {'post': post})


def register_view(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registration was successful! You can now log in.')
            return redirect('login')
        else:
            messages.error(request, 'Please check error form')
    else:
        form = UserRegisterForm()
    return render(request, 'register.html', {'form': form})

    

def login_view(request):
    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            print("user = ", user)
            print("request.user = ", request.user)
            login(request, user)
            return redirect('post_list')
        else:
            messages.error(request, 'The username or password is incorrect.')
    else:
        form = UserLoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')    