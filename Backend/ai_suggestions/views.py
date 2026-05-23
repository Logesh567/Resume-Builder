import json
import traceback
from groq import Groq
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL  = 'llama-3.3-70b-versatile'


def ask_groq(prompt):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{'role': 'user', 'content': prompt}],
        max_tokens=1000,
    )
    return response.choices[0].message.content.strip()


class ImproveBulletView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            bullet    = request.data.get('bullet', '').strip()
            job_title = request.data.get('job_title', 'professional')
            if not bullet:
                return Response({'error': 'bullet is required'}, status=400)
            improved = ask_groq(
                f"Improve this resume bullet for a {job_title} role. "
                f"Make it impactful, quantifiable, ATS-friendly. Return ONLY the improved bullet, nothing else.\n\nBullet: {bullet}"
            )
            return Response({'original': bullet, 'improved': improved})
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)


class RewriteSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            summary   = request.data.get('summary', '').strip()
            job_title = request.data.get('job_title', 'professional')
            years     = request.data.get('years_experience', '3')
            if not summary:
                return Response({'error': 'summary is required'}, status=400)
            improved = ask_groq(
                f"Rewrite this resume summary for a {job_title} with {years} years experience. "
                f"Make it compelling, 3-4 sentences, ATS-optimized. Return ONLY the improved summary, nothing else.\n\nSummary: {summary}"
            )
            return Response({'original': summary, 'improved': improved})
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)


class SuggestSkillsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            job_title      = request.data.get('job_title', '').strip()
            current_skills = request.data.get('current_skills', [])
            if not job_title:
                return Response({'error': 'job_title is required'}, status=400)
            raw = ask_groq(
                f"Suggest 10 skills for a {job_title} role. "
                f"Exclude these already listed: {', '.join(current_skills)}. "
                f'Return ONLY a JSON array of strings, no explanation. Example: ["Skill1", "Skill2"]'
            )
            raw = raw.replace('```json', '').replace('```', '').strip()
            try:
                skills = json.loads(raw)
            except json.JSONDecodeError:
                skills = [s.strip().strip('"') for s in raw.strip('[]').split(',')]
            return Response({'suggestions': skills})
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)


class MatchJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            job_description = request.data.get('job_description', '').strip()
            resume_text     = request.data.get('resume_text', '').strip()
            if not job_description or not resume_text:
                return Response({'error': 'job_description and resume_text are required'}, status=400)
            raw = ask_groq(
                f"Analyze this resume vs the job description. Return ONLY valid JSON with keys: "
                f"match_score (0-100), missing_skills (array), strong_matches (array), suggestions (array). No explanation.\n\n"
                f"JOB DESCRIPTION:\n{job_description}\n\nRESUME:\n{resume_text}"
            )
            raw = raw.replace('```json', '').replace('```', '').strip()
            try:
                result = json.loads(raw)
            except json.JSONDecodeError:
                result = {'error': 'Could not parse response', 'raw': raw}
            return Response(result)
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)