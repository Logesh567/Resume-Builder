from io import BytesIO
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT
from resumes.models import Resume
from resumes.serializers import ResumeSerializer


def build_pdf(resume):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)

    styles = getSampleStyleSheet()
    name_style    = ParagraphStyle('Name',    fontSize=20, fontName='Helvetica-Bold', spaceAfter=4)
    contact_style = ParagraphStyle('Contact', fontSize=9,  textColor=colors.grey, spaceAfter=12)
    section_style = ParagraphStyle('Section', fontSize=11, fontName='Helvetica-Bold', spaceAfter=4, spaceBefore=12)
    title_style   = ParagraphStyle('Title',   fontSize=10, fontName='Helvetica-Bold')
    sub_style     = ParagraphStyle('Sub',     fontSize=9,  textColor=colors.grey)
    body_style    = ParagraphStyle('Body',    fontSize=9,  spaceAfter=6, leading=13)

    story = []

    # Header
    story.append(Paragraph(resume.get('full_name', ''), name_style))
    contact_parts = [p for p in [
        resume.get('email'), resume.get('phone'),
        resume.get('location'), resume.get('linkedin')
    ] if p]
    story.append(Paragraph('  |  '.join(contact_parts), contact_style))

    # Summary
    if resume.get('summary'):
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
        story.append(Paragraph('SUMMARY', section_style))
        story.append(Paragraph(resume['summary'], body_style))

    # Experience
    if resume.get('experiences'):
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
        story.append(Paragraph('EXPERIENCE', section_style))
        for e in resume['experiences']:
            end = 'Present' if e.get('is_current') else e.get('end_date', '')
            story.append(Paragraph(f"{e['job_title']} — {e['company']}", title_style))
            story.append(Paragraph(f"{e.get('location', '')}  {e.get('start_date', '')} – {end}", sub_style))
            if e.get('description'):
                story.append(Paragraph(e['description'], body_style))
            story.append(Spacer(1, 6))

    # Education
    if resume.get('educations'):
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
        story.append(Paragraph('EDUCATION', section_style))
        for e in resume['educations']:
            story.append(Paragraph(f"{e['degree']} — {e['institution']}", title_style))
            story.append(Paragraph(f"{e.get('start_date', '')} – {e.get('end_date', '')}", sub_style))
            story.append(Spacer(1, 6))

    # Projects
    if resume.get('projects'):
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
        story.append(Paragraph('PROJECTS', section_style))
        for p in resume['projects']:
            story.append(Paragraph(p['name'], title_style))
            if p.get('technologies'):
                story.append(Paragraph(p['technologies'], sub_style))
            if p.get('description'):
                story.append(Paragraph(p['description'], body_style))
            story.append(Spacer(1, 6))

    # Skills
    if resume.get('skills'):
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
        story.append(Paragraph('SKILLS', section_style))
        skill_names = ',  '.join([s['name'] for s in resume['skills']])
        story.append(Paragraph(skill_names, body_style))

    doc.build(story)
    buffer.seek(0)
    return buffer


class ExportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=404)

        data = ResumeSerializer(resume).data
        buffer = build_pdf(data)

        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{resume.title}.pdf"'
        return response