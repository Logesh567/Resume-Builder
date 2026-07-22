from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health(request):
    return JsonResponse({'status': 'ok'})

# Welcome response for root URL
def home(request):
    return JsonResponse({
        'message': 'Resume Builder API is live',
        'endpoints': {
            'health': '/api/health/',
            'auth': '/api/auth/',
            'resumes': '/api/resumes/',
            'ai': '/api/ai/',
            'export': '/api/export/'
        }
    })

urlpatterns = [
    path('', home),  # <-- Handles GET /
    path('admin/', admin.site.urls),
    path('api/health/', health),
    path('api/auth/',     include('users.urls')),
    path('api/resumes/', include('resumes.urls')),
    path('api/ai/',      include('ai_suggestions.urls')),
    path('api/export/',  include('export_pdf.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)