from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Drink(models.Model):
    drink_id = models.IntegerField()
    drink_name = models.CharField(max_length=50)
    drink_image = models.CharField(max_length=50)
    likes = models.ManyToManyField(User, related_name="user_like")
    comment = models.ManyToManyField('Comment', related_name="user_comment")


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    drink_id = models.IntegerField()
    user_id = models.IntegerField()
    name = models.CharField(max_length=30)
    text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
