from django.urls import path
from . import views

urlpatterns = [
    path('post_list/',  views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail_view, name='post_detail'),
 
]
