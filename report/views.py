from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.http import JsonResponse
from django import forms
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import connection
from report.models import *
import json
# Create your views here.
def index(request):
    return render(request, 'report/base_report.html')

def ReportListAllMovies(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT m.movieid as "Movie ID", m.title as "Title", m.genre as "Genre", m.copyrightdate as "CopyRight Date"'
                           ' , m.producerid as "Producer Id", p.pfname as "Producer First Name", p.plname as "Producer Last Name"'
                           ' , m.price as "Price" '
                           ' FROM movie as m JOIN producer as p '
                           ' ON m.producerid = p.producerid '
                           ' ORDER BY m.movieid ')

        row = dictfetchall(cursor)
        column_name = [col[0] for col in cursor.description]

    data_report = dict()
    data_report['data'] = row
    data_report['column_name'] = column_name
    print (data_report)
    return render(request,'report/report_list_all_movies.html',data_report)

def ReportListAllRents(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT r.receiptno as "Receipt No",r.date as "Rent Date",r.duedate as "Return Date",r.customerid as "Customer ID"'
                        ',c.cfname as "Customer First Name",c.clname as "Customer Last Name",c.cphone as "Phone",c.cemail as "Email",'
                        ' r.payment_method as "Payment Method"'
                        ',r.paymentref as "Payment Reference",r.total as "Total"'
                        'FROM rent as r JOIN customer as c'
                        ' ON r.customerid = c.customerid'
                        ' ORDER BY r.receiptno')

        row = dictfetchall(cursor)
        column_name = [col[0] for col in cursor.description]

    data_report = dict()
    data_report['data'] = row
    data_report['column_name'] = column_name
    return render(request,'report/report_list_all_rents.html',data_report)


def ReportListAllCustomer(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT c.customerid as "Customer ID", c.cfname as "Customer First Name", clname as "Customer Last Name",'
                       ' c.cphone as "Phone",c.cemail as "Email"'
                       ' FROM customer as c')

        row = dictfetchall(cursor)
        column_name = [col[0] for col in cursor.description]

    data_report = dict()
    data_report['data'] = row
    data_report['column_name'] = column_name

    return render(request, 'report/report_list_all_customer.html', data_report)


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [name[0].replace(" ", "_").lower() for name in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

def CursorToDict(data,columns):
    result = []
    fieldnames = [name.replace(" ", "_").lower() for name in columns]
    for row in data:
        rowset = []
        for field in zip(fieldnames, row):
            rowset.append(field)
        result.append(dict(rowset))
    return result
