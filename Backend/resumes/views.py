from rest_framework import viewsets, permissions
from .models import Resume, Experience, Education, Skill, Project
from .serializers import (
    ResumeSerializer, ResumeListSerializer,
    ExperienceSerializer, EducationSerializer,
    SkillSerializer, ProjectSerializer,
)


class ResumeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        return ResumeListSerializer if self.action == 'list' else ResumeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BaseNestedViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    resume_model = Resume

    def get_resume(self):
        return self.resume_model.objects.get(id=self.kwargs['resume_pk'], user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(resume__user=self.request.user, resume_id=self.kwargs['resume_pk'])

    def perform_create(self, serializer):
        serializer.save(resume=self.get_resume())


class ExperienceViewSet(BaseNestedViewSet):
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.all()


class EducationViewSet(BaseNestedViewSet):
    serializer_class = EducationSerializer
    queryset = Education.objects.all()


class SkillViewSet(BaseNestedViewSet):
    serializer_class = SkillSerializer
    queryset = Skill.objects.all()


class ProjectViewSet(BaseNestedViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()