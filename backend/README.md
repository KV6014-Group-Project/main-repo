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

## GeoIP / Region-based RSVP (Security)

This project includes an optional region-based RSVP check to restrict or flag
RSVPs that originate outside configured country codes for an event. The
implementation uses the MaxMind GeoLite2 Country database and a small updater
script to download the DB.

How it works (high level)
- Each `Event` can store `allowed_country_codes` (list of ISO country codes)
    and a boolean `enforce_country_restriction`.
- When a participant hits the RSVP link, the backend looks up their IP address,
    resolves it to an approximate country using the GeoLite2 DB, and then:
    - If enforcement is off: the RSVP proceeds as normal.
    - If enforcement is on and the country is allowed: RSVP proceeds.
    - If enforcement is on and the country is not allowed (or cannot be resolved):
        the RSVP is marked as `suspicious` (or can be blocked depending on policy).

Setup: download GeoLite2 DB
1. Create a (free) MaxMind account and obtain a GeoLite2 license key.
2. Set the `MAXMIND_LICENSE_KEY` environment variable in your shell.
     - PowerShell example:
         ```powershell
         $env:MAXMIND_LICENSE_KEY = 'YOUR_LICENSE_KEY'
         $env:GEOIP2_DB_PATH = "$PWD\backend\geoip\GeoLite2-Country.mmdb"
         ```
3. Run the updater script from the repository root:
     ```powershell
     python .\backend\scripts\update_geolite2.py
     ```
     This writes the file to `backend/geoip/GeoLite2-Country.mmdb` by default or
     to the path set in `GEOIP2_DB_PATH` env var.

Configuration (Django)
- Set `GEOIP2_DB_PATH` in your environment or Django settings so the app can
    find the downloaded DB.

Enabling region checks for an event
- In the admin (or via code), set `allowed_country_codes` to a list like
    `["GB", "IE"]` and set `enforce_country_restriction = True` on the Event.

Policy choices (how to handle out-of-region requests)
- Block: return HTTP 403 and reject the RSVP immediately. Stronger security,
    but may block legitimate attendees travelling or using mobile networks.
- Flag: accept the RSVP but set `suspicious=True` and record IP/country for
    human review. Safer UX and recommended for rollout.

Notes and maintenance
- GeoIP DB accuracy is not perfect; VPNs or mobile networks can appear in a
    different country.
- Update the GeoLite2 DB monthly. You can run the updater manually or schedule
    it in CI/cron.
- Storing IP addresses may be considered personal data under privacy laws
    (e.g., GDPR). Keep data retention and privacy policy in mind.

Running tests
- The repository includes tests for the RSVP behavior. Run them with:
    ```powershell
    cd backend
    python manage.py test sharing
    ```

If you want, I can add a small management command to run the updater on a
schedule or a short admin dashboard to review flagged RSVPs.