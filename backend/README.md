## Key Concepts

### Models

Models are how you define what data your website stores. They're like blueprints for your database tables. You write them in Python, and Django handles the rest.

Example: A simple blog post model

```python
from django.db import models

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
```

### Views

Views are Python functions or classes that handle what happens when someone visits a page on your website. They get data, process it, and decide what to show the user.

```python
from django.shortcuts import render
from .models import BlogPost

def post_list(request):
    posts = BlogPost.objects.all()
    return render(request, 'post_list.html', {'posts': posts})
```

### Templates

Templates are HTML files that control what users actually see in their browser. You can insert data from your views into them.

Example `post_list.html`:

```html
<h1>All Blog Posts</h1>
<ul>
    {% for post in posts %}
        <li>{{ post.title }} - {{ post.created_date }}</li>
    {% endfor %}
</ul>
```

### URLs

URLs connect web addresses to views. When someone visits a specific web address, Django knows which view to run.

```python
from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.post_list, name='post_list'),
]
```

## The Development Workflow

1. **Define your models** — Write code for what data you want to store
2. **Create migrations** — Tell Django about your database changes
3. **Write views** — Write Python code to handle user requests
4. **Create templates** — Write HTML to display information
5. **Set up URLs** — Connect web addresses to your views

To apply your database changes, run:

```bash
uv run python manage.py migrate
```

## Running Your Website Locally

Start the development server to test your website on your computer:

```bash
uv run python manage.py runserver
```

Then visit `http://127.0.0.1:8000/` in your browser to see your site.

## Admin Panel

Django comes with a built-in admin panel where you can manage your data. Create a user to access it:

```bash
uv run python manage.py createsuperuser
```

Then visit `http://127.0.0.1:8000/admin/` to log in and manage your website.

## Common Tasks

**Adding a new page:** Create a view, an HTML template, and add a URL pattern.

**Storing user information:** Create a model with the fields you need, then run migrations.

**Showing data on a page:** Query your models in a view, pass the data to a template, and display it with template tags.