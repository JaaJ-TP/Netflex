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
from rent.models import *
import json

from datetime import date,datetime
from django.db.models.functions import Extract


# Create your views here.
def index(request):
    data = {}
    return render(request,'rent/rent.html', data)

class PaymentList(View):
    def get(self, request):
        payments = list(Payment.objects.all().values())
        data = dict()
        data['payments'] = payments
        print(data)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class PaymentDetail(View):
    def get(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        data = dict()
        data['payments'] = model_to_dict(payment)
        print(data)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


class ActorList(View):
    def get(self, request):
        actors = list(Actor.objects.all().values())
        data = dict()
        data['actors'] = actors
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class ActorDetail(View):
    def get(self, request, pk):
        actor = pk
        data = dict()
        data['actors'] = model_to_dict(actor)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class ProducerList(View):
    def get(self, request):
        producers = list(Producer.objects.all().values())
        data = dict()
        data['producers'] = producers
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class ProducerDetail(View):
    def get(self, request, pk):
        producer = get_object_or_404(Producer, pk=pk)
        data = dict()
        data['producers'] = model_to_dict(producer)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


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
        customer = get_object_or_404(Customer, pk=pk)
        data = dict()
        data['customers'] = model_to_dict(customer)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class MovieList(View):
    def get(self, request):
        movies = list(Movie.objects.order_by('movieid').all().values())
        data = dict()
        data['movies'] = movies
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class RentList(View):
    def get(self, request):
        rents = list(Rent.objects.order_by('receiptno').all().values())
        data = dict()
        data['rents'] = rents
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class RentDetail(View):
    def get(self, request, pk, pk2):
        receiptno = pk + '/' + pk2
        rent = list(Rent.objects.select_related("customer").filter(receiptno=receiptno).values('receiptno', 'date','duedate','customerid','customerid__cfname', 'customerid__clname', 'customerid__cphone','customerid__cemail','paymentmethod','paymentref','total'))
        rentlineitem = list(RentLineItem.objects.select_related('movieid').filter(receiptno=receiptno).order_by('lineitem').values("lineitem", "movieid", "movieid__title", "unitday",'unitprice','extendedprice'))

        data = dict()
        data['rent'] = rent[0]
        data['rentlineitem'] = rentlineitem

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


class RentForm(forms.ModelForm):
    class Meta:
        model = Rent
        fields = '__all__'


class RentLineItemForm(forms.ModelForm):
    class Meta:
        model = RentLineItem
        fields = '__all__'


@method_decorator(csrf_exempt, name='dispatch')
class RentCreate(View):
    def post(self, request):
        data = dict()
        print(data)
        request.POST = request.POST.copy()
        if Rent.objects.count() != 0:
            receiptno_max = Rent.objects.aggregate(Max('receiptno'))['receiptno__max']
            next_receiptno = receiptno_max[0:3] + str(int(receiptno_max[3:7]) + 1)  + "/" + receiptno_max[8:10]
        else:
            next_receiptno = "RCT1000/20"
        request.POST['receiptno'] = next_receiptno
        request.POST['date'] = reFormatDateMMDDYYYY(request.POST['date'])
        request.POST['duedate'] = reFormatDateMMDDYYYY(request.POST['duedate'])
        request.POST['total'] = reFormatNumber(request.POST['total'])

        form = RentForm(request.POST)
        if form.is_valid():
            rent = form.save()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['receiptno'] = next_receiptno
                lineitem['unitday'] = reFormatNumber(lineitem['unitday'])
                lineitem['unitprice'] = reFormatNumber(lineitem['unitprice'])
                lineitem['extendedprice'] = reFormatNumber(lineitem['extendedprice'])

                formlineitem = RentLineItemForm(lineitem)
                formlineitem.save()

            data['rent'] = model_to_dict(rent)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


@method_decorator(csrf_exempt, name='dispatch')
class RentUpdate(View):
    def post(self, request, pk, pk2):
        receiptno = pk + "/" + pk2
        data = dict()
        rent = Rent.objects.get(pk=receiptno)
        request.POST = request.POST.copy()
        request.POST['receiptno'] = receiptno
        request.POST['date'] = reFormatDateMMDDYYYY(request.POST['date'])
        request.POST['duedate'] = reFormatDateMMDDYYYY(request.POST['duedate'])
        request.POST['total'] = reFormatNumber(request.POST['total'])

        form = RentForm(instance=rent, data=request.POST)
        if form.is_valid():
            rent = form.save()

            RentLineItem.objects.filter(receiptno=receiptno).delete()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['receiptno'] = receiptno
                lineitem['lineitem'] = lineitem['lineitem']
                lineitem['movieid'] = lineitem['movieid']
                lineitem['unitday'] = reFormatNumber(lineitem['unitday'])
                lineitem['unitprice'] = reFormatNumber(lineitem['unitprice'])
                lineitem['extendedprice'] = reFormatNumber(lineitem['extendedprice'])
                formlineitem = RentLineItemForm(lineitem)
                formlineitem.save()

            data['rent'] = model_to_dict(rent)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


@method_decorator(csrf_exempt, name='dispatch')
class RentDelete(View):
    def post(self, request, pk, pk2):
        receiptno = pk + "/" + pk2
        data = dict()
        rent = Rent.objects.get(pk=receiptno)
        if rent:
            rent.delete()
            data['message'] = "Rent Deleted!"
        else:
            data['message'] = "Error!"

        return JsonResponse(data)


class RentPDF(View):
    def get(self, request, pk, pk2):
        receiptno = pk + "/" + pk2
        rent = list(Rent.objects.select_related("customer").filter(receiptno=receiptno).values('receiptno', 'date','duedate','customerid','customerid__cfname', 'customerid__clname', 'customerid__cphone','customerid__cemail','paymentmethod','paymentref','total'))
        rentlineitem = list(RentLineItem.objects.select_related('movieid').filter(receiptno=receiptno).order_by('lineitem').values("lineitem", "movieid", "movieid__title", "unitday",'unitprice','extendedprice'))
        data = dict()
        data['rent'] = rent[0]
        data['rentlineitem'] = rentlineitem
        # return JsonResponse(data)
        return render(request, 'rent/pdf.html', data)


class RentReport(View):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT r.receiptno as "Receipt No",r.date as "Rent Date",r.duedate as "Return Date",r.customerid as "Customer ID"'
                ',c.cfname as "Customer First Name",c.clname as "Customer Last Name",c.cphone as "Phone",c.cemail as "Email",'
                'r.paymentmethod as "Payment Method",r.paymentref as "Payment Reference",r.total as "Total"'
                'FROM rent as r JOIN customer as c'
                ' ON r.customerid = c.customerid'
                ' ORDER BY r.receiptno')

            row = dictfetchall(cursor)
            column_name = [col[0] for col in cursor.description]

        data = dict()
        data['data'] = row
        data['column_name'] = column_name

        # return JsonResponse(data)
        return render(request, 'rent/report.html', data)

# # def diffdate(str):
# def diffdate(str):
#     start = datetime(Rent.date)
#     end = datetime(Rent.duedate)
#     self.objects.create(start_datetime = start,start_date = start.date(),end_datetime = end, end_date=end.date())
#     Rent.objects.filter(start_datetime__year=Extract('end_datetime', 'date')).count()

# def diffdate(str):
#     if request.method=='Post':
#         date = request.POST['date']
#         date = request.POST['duedate']
#         try
#             t=Attendence.objects.filter()

# def diffdate():
#     firstDate = Rent.date()
#     SecondDate = Rent.duedate()
#     unitday = firstDate - SecondDate


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