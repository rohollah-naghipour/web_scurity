from django.urls import path
from . import views

urlpatterns = [
    path('',  views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail_view, name='post_detail'),
    path('signup/', views.register_view ,name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create/', views.create_post_view, name='create_post'),
    path('update/<int:pk>/', views.update_post_view, name='update_post'),
    path('delete/<int:pk>/', views.delete_post_view, name='delete_post'),

]
