from django.urls import path
from .views import ExportPDFView

urlpatterns = [
    path('pdf/<int:resume_id>/', ExportPDFView.as_view(), name='export-pdf'),
]