from django.urls import path
from . import views

urlpatterns = [
    path('post_list/',  views.post_list, name='post_list'),
    path('post-detail/<int:pk>/', views.post_detail, name='post_detail'),
    path('signup/', views.register_view ,name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create/', views.create_post_view, name='create_post'),
   
]
