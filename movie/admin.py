from django.contrib import admin

from .models import Actor
from .models import Producer
from .models import Saleperson
from .models import Customer
from .models import Movie
from .models import MovieActor

admin.site.register(Actor)
admin.site.register(Producer)
admin.site.register(Saleperson)
admin.site.register(Customer)
admin.site.register(Movie)
admin.site.register(MovieActor)