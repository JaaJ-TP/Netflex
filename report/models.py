from django.db import models

# Create your models here.
class Data(models.Model):
    key = models.CharField(max_length=10,primary_key=True)
    value = models.CharField(max_length=100)

class Actor(models.Model):
    actorid = models.CharField(max_length=10, primary_key=True)
    afname = models.CharField(max_length=100, null=True)
    alname = models.CharField(max_length=100, null=True)
    sex = models.CharField(max_length=5, null=True)
    phoneno = models.CharField(max_length=100, null=True)
    class Meta:
        db_table = "actor"
        managed = False

class Producer(models.Model):
    producerid = models.CharField(max_length=10, primary_key=True)
    pfname = models.CharField(max_length=100, null=True)
    plname = models.CharField(max_length=100, null=True)
    class Meta:
        db_table = "producer"
        managed = False

class Saleperson(models.Model):
    userid = models.CharField(max_length=10, primary_key=True)
    sfname = models.CharField(max_length=100, null=True)
    slname = models.CharField(max_length=100, null=True)
    class Meta:
        db_table = "saleperson"
        managed = False

class Customer(models.Model):
    customerid = models.CharField(max_length=10, primary_key=True)
    cfname = models.CharField(max_length=100, null=True)
    clname = models.CharField(max_length=100, null=True)
    cphone = models.CharField(max_length=100, null=True)
    cemail = models.CharField(max_length=100, null=True)
    class Meta:
        db_table = "customer"
        managed = False

class Movie(models.Model):
    movieid = models.CharField(max_length=10, primary_key=True)
    title = models.CharField(max_length=100, null=True)
    genre = models.CharField(max_length=100, null=True)
    copyrightdate = models.DateField(null=True)
    producerid = models.ForeignKey(Producer, on_delete=models.CASCADE, db_column='producerid')
    price = models.FloatField(null=True)
    class Meta:
        db_table = "movie"
        managed = False

class MovieActor(models.Model):
    lineitem = models.IntegerField()
    movieid = models.ForeignKey(Movie, on_delete=models.CASCADE, db_column='movieid')
    actorid = models.ForeignKey(Actor, on_delete=models.CASCADE, db_column='actorid')
    class Meta:
        db_table = "movie_actor"
        unique_together = (("movieid", "actorid"),)
        managed = False

class Rent(models.Model):
    receiptno = models.CharField(max_length=10, primary_key=True)
    date = models.DateField(null=True)
    duedate = models.DateField(null=True)
    customerid = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='customerid')
    salefname = models.CharField(max_length=100, null=True)
    salelname = models.CharField(max_length=100, null=True)
    paymentref = models.CharField(max_length=100, null=True)
    total = models.FloatField(null=True, blank=True)
    class Meta:
        db_table = "rent"
        managed = False

class RentLineItem(models.Model):
    lineitem = models.IntegerField()
    receiptno = models.ForeignKey(Rent, on_delete=models.CASCADE, db_column='receiptno')
    movieid = models.ForeignKey(Movie, on_delete=models.CASCADE, db_column='movieid')
    unitday = models.IntegerField(null=True)
    unitprice = models.FloatField(null=True)
    extendedprice = models.FloatField(null=True)

    class Meta:
        db_table = "rent_line_item"
        unique_together = (("receiptno", "movieid"),)
        managed = False