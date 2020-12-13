from django.db import models

# Create your models here.
class Customer(models.Model):
    customerid = models.CharField(max_length=10, primary_key=True)
    cfname = models.CharField(max_length=100, null=True)
    clname = models.CharField(max_length=100, null=True)
    cphone = models.CharField(max_length=100, null=True)
    cemail = models.CharField(max_length=100, null=True)
    class Meta:
        db_table = "customer"
        managed = False
    def __str__(self):
        return self.customerid