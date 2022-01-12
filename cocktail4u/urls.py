from django.urls import path

from cocktail4u.views import new_comment

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("like", views.like, name="like"),
    path("update", views.update, name="update"),
    path("counter", views.counter, name="counter"),
    path("comment", views.comment, name="comment"),
    path("get_id_drink", views.get_id_drink, name="get_id_drink"),
    path("new_comment", views.new_comment, name="new_comment"),
    path("favorites", views.favorites, name="favorites")
]
