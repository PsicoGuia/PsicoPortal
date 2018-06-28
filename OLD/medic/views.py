from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from models import Profile, Studies
from django.http import Http404
from address.models import Address

from forms import SignUpForm, ProfileForm

# Create your views here.
def index(request):
    return render(request, 'medic/index.html', {})

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('index')
    else:
        form = SignUpForm()
    return render(request, 'medic/signup.html', {'form': form})

def profile(request, username):
    try:
        if request.method == 'POST':
            form = ProfileForm(request.POST)
            if form.is_valid():
                print(':.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.')
                print(request.POST)
                print(form)
        profile = Profile.objects.get(user__username=username)
        print('profile id')
        print(profile.id)
        studies = Studies.objects.filter(profile__id=profile.id)
        print(profile.location)
        form = ProfileForm()
        return render(request, 'medic/profile.html', {'profile': profile, 'studies': studies, 'form': form})
    except Profile.DoesNotExist:
        raise Http404
