from django.contrib import admin

# Register your models here.
from .models import Actor
from .models import Producer
from .models import Saleperson
from .models import Payment
from .models import Customer
# from .models import Movie
# from .models import MovieActor
from .models import Rent
from .models import RentLineItem

admin.site.register(Actor)
admin.site.register(Producer)
admin.site.register(Payment)
admin.site.register(Customer)
# admin.site.register(Payment)
# admin.site.register(Movie)
# admin.site.register(MovieActor)
admin.site.register(Rent)
admin.site.register(RentLineItem)