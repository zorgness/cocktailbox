from django.contrib import admin
from .models import User, Drink, Comment

admin.site.register(User)
admin.site.register(Drink)
admin.site.register(Comment)