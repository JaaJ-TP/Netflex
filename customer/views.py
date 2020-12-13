from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.http import JsonResponse
from django import forms
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.db.models import Max
from django.db import connection
from customer.models import *
import json


# Create your views here.
def index(request):
    data = {}
    return render(request,'customer/customer.html', data)

class CustomerList(View):
    def get(self, request):
        customers = list(Customer.objects.all().values())
        data = dict()
        data['customers'] = customers
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class CustomerDetail(View):
    def get(self, request, pk):
        customerid = pk
        customer = list(Customer.objects.select_related("custome").filter(customerid=customerid).values('customerid','cfname','clname','cphone','cemail'))

        data = dict()
        data['customer'] = customer[0]

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'

@method_decorator(csrf_exempt, name='dispatch')
class CustomerCreate(View):
    def post(self, request):
        data = dict()
        request.POST = request.POST.copy()
        if Customer.objects.count() != 0:
            customerid_max = Customer.objects.aggregate(Max('customerid'))['customerid__max']
            next_customerid = customerid_max[0:3] + str(int(customerid_max[3:6]) + 1)
        else:
            next_customerid = "CUS001"
        request.POST['customerid'] = next_customerid

        form = CustomerForm(request.POST)
        if form.is_valid():
            customer = form.save()

            data['customer'] = model_to_dict(customer)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


@method_decorator(csrf_exempt, name='dispatch')
class CustomerUpdate(View):
    def post(self, request, pk):
        customerid = pk
        data = dict()
        customer = Customer.objects.get(pk=customerid)
        request.POST = request.POST.copy()
        request.POST['customerid'] = customerid

        form = CustomerForm(instance=customer, data=request.POST)
        if form.is_valid():
            customer = form.save()
            data['customer'] = model_to_dict(customer)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


@method_decorator(csrf_exempt, name='dispatch')
class CustomerDelete(View):
    def post(self, request, pk):
        customerid = pk
        data = dict()
        customer = Customer.objects.get(pk=customerid)
        if customer:
            customer.delete()
            data['message'] = "Customer Deleted!"
        else:
            data['message'] = "Error!"

        return JsonResponse(data)


class CustomerReport(View):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT c.customerid as "Customer ID", c.cfname as "Customer First Name", clname as "Customer Last Name",'
                ' c.cphone as "Phone",c.cemail as "Email"'
                ' FROM customer as c')

            row = dictfetchall(cursor)
            column_name = [col[0] for col in cursor.description]

        data = dict()
        data['data'] = row
        data['column_name'] = column_name

        # return JsonResponse(data)
        return render(request, 'customer/report.html', data)


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [name[0].replace(" ", "_").lower() for name in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def reFormatDateMMDDYYYY(ddmmyyyy):
    if (ddmmyyyy == ''):
        return ''
    return ddmmyyyy[3:5] + "/" + ddmmyyyy[:2] + "/" + ddmmyyyy[6:]


def reFormatNumber(str):
    if (str == ''):
        return ''
    return str.replace(",", "")