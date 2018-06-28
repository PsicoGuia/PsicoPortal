from django.shortcuts import render
from .filters import MedicFilter
from medic.models import Profile

# Create your views here.
def index(request):
    return render(request, 'patient/index.html', {})

def search(request):
    medic_list = Profile.objects.all()
    medic_filter = MedicFilter(request.GET, queryset=medic_list)
    return render(request, 'patient/medic_list.html', {'filter': medic_filter})
