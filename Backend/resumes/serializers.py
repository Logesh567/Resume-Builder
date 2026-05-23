from rest_framework import serializers
from .models import Resume, Experience, Education, Skill, Project


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        exclude = ['resume']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        exclude = ['resume']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        exclude = ['resume']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ['resume']


class ResumeSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations  = EducationSerializer(many=True, read_only=True)
    skills      = SkillSerializer(many=True, read_only=True)
    projects    = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        exclude = ['user']


class ResumeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'title', 'template', 'full_name', 'updated_at']