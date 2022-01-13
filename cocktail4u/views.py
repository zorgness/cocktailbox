from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.template import RequestContext
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from .form import PostComment
from .models import User, Drink, Comment

# Create your views here.


def index(request):

    return render(request, "cocktail4u/index.html")



@login_required(login_url='login')
@csrf_exempt
def like(request):
    if request.method == 'GET':
        return JsonResponse("wrong way", safe=False)

    if request.method == 'PUT':
        user = User.objects.get(pk=request.user.id)
        data = json.loads(request.body)
        drink_id = data.get("drink_id")
        drink_name = data.get("drink_name")
        drink_image = data.get("drink_image")
        if drink_id != None:
            try:
                drink = Drink.objects.get(drink_id=drink_id)
                list_user = drink.likes.all()
                if user not in list_user:
                    drink.likes.add(user)
                    drink.save()
                    return JsonResponse("save", safe=False)
                else:
                    drink.likes.remove(user)
                    drink.save()
                    return JsonResponse("remove", safe=False)
            except Drink.DoesNotExist:
                f = Drink(drink_id=drink_id, drink_name=drink_name, drink_image=drink_image)
                f.save()
                drink = Drink.objects.get(drink_id=drink_id)
                drink.likes.add(user)
                drink.save()
                return JsonResponse("save", safe=False)
            
    return HttpResponseRedirect(reverse("cocktail4u/index.html"))


def update(request):

    user = User.objects.get(pk=request.user.id)
    recipient = []
    all_drinks = Drink.objects.all()
    for drink in all_drinks:
        if user in drink.likes.all():
            recipient.append(drink.drink_id)

    return JsonResponse(recipient, safe=False)


def counter(request):
    recipient = {"info": []}

    all_drinks = Drink.objects.all()
    for drink in all_drinks:
        recipient["info"].append(dicto(drink))

    return JsonResponse(recipient, safe=False)


def dicto(data):
    if data == None:
        return None
    dicto = {}
    dicto["drink_id"] = data.drink_id
    dicto["count"] = data.likes.all().count()
    return dicto


@csrf_exempt
def comment(request):
    if request.method == 'GET':
        return HttpResponseRedirect(reverse("index"))
    if request.method == 'PUT':
        data = json.loads(request.body)
        response = data.get("condition")
        if response == True:
            return JsonResponse("on single page", safe=False)

    return JsonResponse("main page", safe=False)


@csrf_exempt
def get_id_drink(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        drink_id = data.get("drink_id")
        try:
            drink = Drink.objects.get(drink_id=drink_id)
            comments = drink.comment.all().order_by("-created_at")
            if comments:
                recipient = {"comments": []}
                for comment in comments:
                    recipient["comments"].append(dicto_comment(comment))

                return JsonResponse(recipient, safe=False)
            else:
                return JsonResponse(drink_id, safe=False)

        except Drink.DoesNotExist:
            return JsonResponse(drink_id, safe=False)

    return HttpResponseRedirect(reverse("cocktail4u/index.html"))


def dicto_comment(data):
    if data == None:
        return None
    dicto = {}
    dicto["user_id"] = data.user_id
    dicto["name"] = data.name
    dicto["drink_id"] = data.drink_id
    dicto["text"] = data.text
    dicto["created_at"] = data.created_at
    return dicto


@login_required(login_url='login')
@csrf_exempt
def new_comment(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        text = data.get("text")
        drink_id = data.get("id")
        user_id = request.user.id
        user = User.objects.get(pk=user_id)
        f = Comment(drink_id=drink_id, user_id=user_id, name=user, text=text)
        f.save()
        try:
            drink = Drink.objects.get(drink_id=drink_id)
            drink.comment.add(f)
            drink.save()
        except Drink.DoesNotExist:
            drink = Drink(drink_id=drink_id)
            drink.save()
            drink.comment.add(f)
            drink.save()

        comments = drink.comment.all().order_by("-created_at")

        recipient = {"comments": []}
        for comment in comments:
            recipient["comments"].append(dicto_comment(comment))

        return JsonResponse(recipient, safe=False)
    return render(request, "cocktail4u/index.html")

def favorites(request):
    
    drinks = Drink.objects.all()
    user = request.user
    recipient = []
    for drink in drinks:
        if user in drink.likes.all():
            recipient.append(dicto_favorite(drink))
        
    return JsonResponse(recipient, safe=False)


def dicto_favorite(data):
    if data == None:
        return None
    dicto = {}
    dicto["idDrink"] = data.drink_id
    dicto["strDrink"] = data.drink_name
    dicto["strDrinkThumb"] = data.drink_image
    return dicto


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "cocktail4u/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "cocktail4u/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "cocktail4u/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "cocktail4u/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "cocktail4u/register.html")


