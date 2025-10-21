from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from .models import Post
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from blog.forms import CommentForm,UserLoginForm,UserRegisterForm,PostForm

@login_required
def post_list(request):
    posts = Post.objects.all()
    print("request.user =", request.user)
    return render(request, 'post_list.html', {'posts': posts})
 
@login_required
def post_detail_view(request, pk):
    post = get_object_or_404(Post, pk=pk)
    comments = post.comments.all().order_by('-user')

    #print("post =", post)
    #print("comments =", comments)
    print("request.user =", request.user)

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.user = request.user
            comment.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = CommentForm()

    return render(request, 'post_detail.html', {
        'post': post,
        'comments': comments,
        'form': form,
    })


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


@login_required
def create_post_view(request):
    if request.method == 'POST':
        print("request.POST = ", request.POST)
        print("request.FILES = ", request.FILES)
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            messages.success(request, 'Your post was successfully created.')
            return redirect('post_list')
    else:
        form = PostForm()
    return render(request, 'create_post.html', {'form': form})



def logout_view(request):
    logout(request)
    return redirect('login')    
