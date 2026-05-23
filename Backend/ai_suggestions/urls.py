from django.urls import path
from .views import ImproveBulletView, RewriteSummaryView, SuggestSkillsView, MatchJobView

urlpatterns = [
    path('improve-bullet/',  ImproveBulletView.as_view(),  name='improve-bullet'),
    path('rewrite-summary/', RewriteSummaryView.as_view(), name='rewrite-summary'),
    path('suggest-skills/',  SuggestSkillsView.as_view(),  name='suggest-skills'),
    path('match-job/',       MatchJobView.as_view(),        name='match-job'),
]