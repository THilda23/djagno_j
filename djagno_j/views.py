from urllib import request
from django.shortcuts import render
from rest_framework.views import APIView


class Sub(APIView):
    def get(self, request):
        print('겟으로 호출')
        return render(request, 'djagno_j/main.html')

    def host(self, reques):
        print('호스트로 호출')
        return render(request, 'djagno_j/main.html')

