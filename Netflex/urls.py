"""Netflex URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from movie import views as movie_views
from rent import views as rent_views
from report import views as report_views
from customer import views as customer_views


from accounts.views import login_view, register_view, logout_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/login/', login_view),
    path('accounts/register/', register_view),
    path('accounts/logout/', logout_view),




    path('report', report_views.index, name='index'),
    path('report/ReportListAllMovies', report_views.ReportListAllMovies),
    path('report/ReportListAllRents', report_views.ReportListAllRents),
    path('report/ReportListAllCustomer', report_views.ReportListAllCustomer),

    path('movie', movie_views.index, name='index'),
    path('actor/list', movie_views.ActorList.as_view(), name='actor_list'),
    path('actor/detail/<str:pk>', movie_views.ActorDetail.as_view(), name='actor_detail'),
    path('producer/list', movie_views.ProducerList.as_view(), name='producer_list'),
    path('producer/detail/<str:pk>', movie_views.ProducerDetail.as_view(), name='producer_detail'),
    path('saleperson/list', movie_views.SalepersonList.as_view(), name='saleperson_list'),
    path('saleperson/detail/<str:pk>', movie_views.SalepersonDetail.as_view(), name='saleperson_detail'),
    path('customer/list', movie_views.CustomerList.as_view(), name='customer_list'),
    path('customer/detail/<str:pk>', movie_views.CustomerDetail.as_view(), name='customer_detail'),
    path('movie/list', movie_views.MovieList.as_view(), name='movie_list'),
    path('movie/detail/<str:pk>', movie_views.MovieDetail.as_view(), name='movie_detail'),
    path('movie/create', movie_views.MovieCreate.as_view(), name='movie_create'),
    path('movie/update/<str:pk>', movie_views.MovieUpdate.as_view(), name='movie_update'),
    path('movie/delete/<str:pk>', movie_views.MovieDelete.as_view(), name='movie_delete'),
    path('movie/pdf/<str:pk>', movie_views.MoviePDF.as_view(), name='movie_pdf'),
    path('movie/report', movie_views.MovieReport.as_view(), name='movie_report'),

    path('rent', rent_views.index, name='index'),
    path('payment/list', rent_views.PaymentList.as_view(), name='payment_list'),
    path('payment/detail/<pk>', rent_views.PaymentDetail.as_view(), name='payment_detail'),
    path('movie/list', rent_views.MovieList.as_view(), name='movie_list'),
    path('rent/list', rent_views.RentList, name='rent_list'),
    path('rent/detail/<str:pk>/<str:pk2>', rent_views.RentDetail.as_view(), name='rent_detail'),
    path('rent/create', rent_views.RentCreate, name='rent_create'),
    path('rent/update/<str:pk>/<str:pk2>', rent_views.RentUpdate.as_view(), name='rent_update'),
    path('rent/delete/<str:pk>/<str:pk2>', rent_views.RentDelete.as_view(), name='rent_delete'),
    path('rent/pdf/<str:pk>/<str:pk2>', rent_views.RentPDF.as_view(), name='rent_pdf'),
    path('rent/report', rent_views.RentReport.as_view(), name='rent_report'),

    path('customer', customer_views.index, name='index'),
    path('customer/list', customer_views.CustomerList.as_view(), name='customer_list'),
    path('customer/detail/<str:pk>', customer_views.CustomerDetail.as_view(), name='customer_detail'),
    path('customer/create', customer_views.CustomerCreate.as_view(), name='customer_create'),
    path('customer/update/<str:pk>', customer_views.CustomerUpdate.as_view(), name='customer_update'),
    path('customer/delete/<str:pk>', customer_views.CustomerDelete.as_view(), name='customer_delete'),
    path('customer/report', customer_views.CustomerReport.as_view(), name='customer_report'),

    
]