from django.contrib import admin
from django.urls import path, include
from collectapp import views

urlpatterns = [
    path('', views.HomePage.as_view(), name="home"),
    path('logout', views.logout_view, name="logout"),
    path('dashboard', views.Dashboard.as_view(), name="dashboard"),
    path('create-form', views.CreateForm.as_view(), name="create-form"),
    path('created-form', views.CreatedForm.as_view(), name="created-form"),
    path('form/<str:form_id>', views.GetForm.as_view(), name="form"),
    path('response/<str:form_id>', views.GetResponse.as_view(), name="response"),

]