from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, ExperienceViewSet, EducationViewSet, SkillViewSet, ProjectViewSet

router = DefaultRouter()
router.register(r'', ResumeViewSet, basename='resume')

def nested(ViewSet):
    return (
        ViewSet.as_view({'get': 'list', 'post': 'create'}),
        ViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
    )

exp_list,  exp_detail  = nested(ExperienceViewSet)
edu_list,  edu_detail  = nested(EducationViewSet)
skill_list, skill_detail = nested(SkillViewSet)
proj_list, proj_detail  = nested(ProjectViewSet)

urlpatterns = router.urls + [
    path('<int:resume_pk>/experiences/',          exp_list),
    path('<int:resume_pk>/experiences/<int:pk>/', exp_detail),
    path('<int:resume_pk>/educations/',           edu_list),
    path('<int:resume_pk>/educations/<int:pk>/',  edu_detail),
    path('<int:resume_pk>/skills/',               skill_list),
    path('<int:resume_pk>/skills/<int:pk>/',      skill_detail),
    path('<int:resume_pk>/projects/',             proj_list),
    path('<int:resume_pk>/projects/<int:pk>/',    proj_detail),
]