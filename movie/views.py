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
from movie.models import *
import json


# Create your views here.
def index(request):
    data = {}
    return render(request,'movie/movie.html', data)


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

class SalepersonList(View):
    def get(self, request):
        salepersons = list(Saleperson.objects.all().values())
        data = dict()
        data['salepersons'] = salepersons
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class SalepersonDetail(View):
    def get(self, request, pk):
        saleperson = get_object_or_404(Saleperson, pk=pk)
        data = dict()
        data['salepersons'] = model_to_dict(saleperson)
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

class MovieDetail(View):
    def get(self, request, pk):
        movieid = pk
        movie = list(Movie.objects.select_related("producer").filter(movieid=movieid).values('movieid', 'title','genre','copyrightdate','producerid', 'producerid__pfname', 'producerid__plname','price'))
        movieactor = list(MovieActor.objects.select_related('actorid').filter(movieid=movieid).order_by('lineitem').values("lineitem", "movieid", "actorid", "actorid__afname",'actorid__alname'))

        data = dict()
        data['movie'] = movie[0]
        data['movieactor'] = movieactor

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


class MovieForm(forms.ModelForm):
    class Meta:
        model = Movie
        fields = '__all__'


class MovieActorForm(forms.ModelForm):
    class Meta:
        model = MovieActor
        fields = '__all__'


@method_decorator(csrf_exempt, name='dispatch')
class MovieCreate(View):
    def post(self, request):
        data = dict()
        request.POST = request.POST.copy()
        if Movie.objects.count() != 0:
            movieid_max = Movie.objects.aggregate(Max('movieid'))['movieid__max']
            next_movieid = movieid_max[0:3] + str(int(movieid_max[3:6]) + 1)
        else:
            next_movieid = "MOV101"
        request.POST['movieid'] = next_movieid
        request.POST['copyrightdate'] = reFormatDateMMDDYYYY(request.POST['copyrightdate'])
        request.POST['price'] = reFormatNumber(request.POST['price'])

        form = MovieForm(request.POST)
        if form.is_valid():
            movie = form.save()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['movieid'] = next_movieid

                formlineitem = MovieActorForm(lineitem)
                formlineitem.save()

            data['movie'] = model_to_dict(movie)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


@method_decorator(csrf_exempt, name='dispatch')
class MovieUpdate(View):
    def post(self, request, pk):
        movieid = pk
        data = dict()
        movie = Movie.objects.get(pk=movieid)
        request.POST = request.POST.copy()
        request.POST['movieid'] = movieid
        request.POST['copyrightdate'] = reFormatDateMMDDYYYY(request.POST['copyrightdate'])
        request.POST['price'] = reFormatNumber(request.POST['price'])

        form = MovieForm(instance=movie, data=request.POST)
        if form.is_valid():
            movie = form.save()

            MovieActor.objects.filter(movieid=movieid).delete()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['movieid'] = movieid
                lineitem['lineitem'] = lineitem['lineitem']
                lineitem['actorid'] = lineitem['actorid']
                formlineitem = MovieActorForm(lineitem)
                formlineitem.save()

            data['movie'] = model_to_dict(movie)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


@method_decorator(csrf_exempt, name='dispatch')
class MovieDelete(View):
    def post(self, request, pk):
        movieid = pk
        data = dict()
        movie = Movie.objects.get(pk=movieid)
        if movie:
            movie.delete()
            data['message'] = "Movie Deleted!"
        else:
            data['message'] = "Error!"

        return JsonResponse(data)


class MoviePDF(View):
    def get(self, request, pk):
        movieid = pk
        movie = list(Movie.objects.select_related("producer").filter(movieid=movieid).values('movieid', 'title','genre','copyrightdate','producerid', 'producerid__pfname', 'producerid__plname','price'))
        movieactor = list(MovieActor.objects.select_related('actorid').filter(movieid=movieid).order_by('lineitem').values("lineitem", "movieid", "actorid", "actorid__afname",'actorid__alname'))
        data = dict()
        data['movie'] = movie[0]
        data['movieactor'] = movieactor
        # return JsonResponse(data)
        return render(request, 'movie/pdf.html', data)


class MovieReport(View):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute('SELECT m.movieid as "Movie ID", m.title as "Title", m.genre as "Genre", m.copyrightdate as "CopyRight Date"'
                           ' , m.producerid as "Producer Id", p.pfname as "Producer First Name", p.plname as "Producer Last Name"'
                           ' , m.price as "Price" '
                           ' FROM movie as m JOIN producer as p '
                           ' ON m.producerid = p.producerid '
                           ' ORDER BY m.movieid ')

            row = dictfetchall(cursor)
            column_name = [col[0] for col in cursor.description]

        data = dict()
        data['data'] = row
        data['column_name'] = column_name

        # return JsonResponse(data)
        return render(request, 'movie/report.html', data)


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