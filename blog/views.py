
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from django.db.models import Count

from blog.forms import *
from blog.models import Post

#from django.middleware.csrf import get_token
#from django.views.decorators.csrf import ensure_csrf_cookie
    
def homepage(request):
    context = {
        'total_posts': Post.objects.count(),
        'total_users': User.objects.count(),
        'total_comments': Post.objects.aggregate(total_comments=Count('comments'))['total_comments'] or 0,
        'recent_posts': Post.objects.all().order_by('-created_at')[:6]
    }
    return render(request, 'index.html', context)


@login_required
def post_list(request):
    posts = Post.objects.all()
    #print("request.user = ", request.user)
    #token = get_token(request)
    #print('token = ', token)
    return render(request, 'post_list.html',{'posts': posts})


@login_required
def post_detail_view(request, pk):
    post = get_object_or_404(Post, pk=pk)
    comments = post.comments.all().order_by('-user')

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
            #print("user = ", user)
            #print("request.user = ", request.user)
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

@login_required
def create_post_view(request):
    if request.method == 'POST':
        #print("request.POST = ", request.POST)
        #print("request.FILES = ", request.FILES)
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


@login_required
def update_post_view(request, pk):
    post = get_object_or_404(Post, pk=pk)
    #print("post = ", post)
    if post.author != request.user:
        messages.error(request, 'You do not have permission to edit this post.')
        return redirect('post_list')

    if request.method == 'POST':
        form = PostForm(request.POST,request.FILES,instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your post has been successfully edited.')
            return redirect('post_list')
    else:
        form = PostForm(instance=post)
    return render(request, 'update_post.html', {'form': form})


@login_required
def delete_post_view(request, pk):
    post = get_object_or_404(Post, pk=pk)
    #print("post = ", post)
    if post.author != request.user:
        return redirect('post_list')

    if request.method == 'POST':
        post.delete()
        return redirect('post_list')

    return render(request, 'delete_post.html', {'post': post})    



@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('edit_profile')
    else:
        form = UserProfileForm(instance=request.user)
    
    return render(request, 'edit_profile.html', {'form': form})


@login_required
def user_profile(request):
    user = request.user
    user_posts = user.post_set.all().order_by('-created_at')[:5]  
    
    context = {
        'user': user,
        'recent_posts': user_posts,
        'posts_count': user.post_set.count(),
    }
    return render(request, 'user_profile.html', context)