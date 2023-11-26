# The Cocktail Box

## Final project for CS50's Web Programming with Python and JavaScript 


## Distinctiveness and Complexity

This application is a simple single page app. The purpose is to get cocktail recipes. The user can make research with the name of a cocktail or with ingredients,
it will return all the items corresponding.
Then he will be able to get informations, ingredients and how to prepare it on any recipe. 
The user can register and then log into and then he will be able to put comments but also to get as favorites each items
and keep tracks of it with a link in the navbar.

The project is distinct from other because it need to get information from differents API call, in order to get information.
The most complex part was to fetch the datas between all components of the application, because some datas come from API and others like User informations
or Comments come from the Database.

The project Frontend is mostly build with Javascript. I use also Bootstrap CSS for styling.

For a better user experience i create a pagination system and the application is fully responsive.

So this project even if it’s a really simple application, was pretty hard at first because I make a lot of mistake in the conception. As the models for my database that I have changed multiple times.
I learn a lot on Javascript and Python but mostly in the way to organise my code. I have at first make to much hardcoding so as it grow it start to become a terrible mess and I was having a lot of problem to find solution for easy problem and get a lot of errors difficult to analyzed.

It was truly a good way to learn  how to create an application and I will remember all the mistakes that I have done in order to work more accurately and faster. It was a real and concrete example on why you should use dynamic programming.


## Files Description


### ./thebox:

#### * models.py 	
contains the models I used in the project User, Drink, and Comment
#### * form.py
contains form for user to post new Comment
#### * static  	
contains all static content.
#### * urls.py 		
all application URLs.
#### * admin.py  	
admin classes to manage database application
#### * templates 	
contains all application templates
#### * views.py  	
contains all the application views


### ./thebox/static/thebox:

#### * alert.css   
contains css for alert message
#### * comment.css  
contains css for comment section
#### * script.js	   
contains all the javascript function for frontend
#### * styles.css   
contains most of the css of the application


### ./thebox/templates/thebox:

#### * index.html	  
main templates of the application
#### * login.html	  
contain the page for user to login
#### * register.html	
contain the page for user to register



## How to run the application:

- python -m pip install Django
- pip install requirements.txt
- python manage.py makemigrations
- python manage.py migrate
- python manage.py runserver







