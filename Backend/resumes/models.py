from django.db import models
from django.conf import settings


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255, default='My Resume')
    template = models.CharField(max_length=50, default='modern')
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    linkedin = models.URLField(blank=True)
    website = models.URLField(blank=True)
    summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']


class Experience(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='experiences')
    job_title = models.CharField(max_length=255, blank=True, default='')
    company = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    start_date = models.CharField(max_length=20, blank=True, default='')
    end_date = models.CharField(max_length=20, blank=True, default='')
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class Education(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='educations')
    degree = models.CharField(max_length=255, blank=True, default='')
    institution = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    start_date = models.CharField(max_length=20, blank=True, default='')
    end_date = models.CharField(max_length=20, blank=True, default='')
    gpa = models.CharField(max_length=10, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class Skill(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'), ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'), ('expert', 'Expert'),
    ]
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100, blank=True, default='')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='intermediate')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class Project(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    technologies = models.CharField(max_length=255, blank=True, default='')
    url = models.URLField(blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']