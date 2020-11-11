from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.mixins import LoginRequiredMixin
import django.forms
from .models import UserForms, FormResponse
import json, hashlib

# Create your views here.
class HomePage(TemplateView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboard')
        return render(request, 'home.html')
    def post(self, request, *args, **kwargs):
        data = request.POST
        if 'login-btn' in data:
            #Login Form
            user = authenticate(request, username=data['loginusername'], password=data['loginpassword'])
            if user is not None:
                login(request, user)
                messages.success(request, 'Credentials Matches')
                return redirect('dashboard')
            else:
                messages.error(request, 'Credentials Not Matches')
            return redirect('home')
        elif 'register-btn' in data:
            #Registeration Form
            try:
                if not User.objects.filter(username=data['username']).exists():
                    user_obj = User.objects.create_user(data['username'], data['email'], data['password'])
                    # password = hashlib.sha256((data['password']).encode()).hexdigest()
                    user_obj.firstname = data['firstname']
                    user_obj.lastname = data['lastname']
                    user_obj.save()
                    messages.success(request, 'Account Successfully Created, Please Login to Continue..')
                else:
                    messages.error(request, 'Username is Taken, Please try with differnt one..')
                    return redirect('home')
            except Exception as err:
                print(err)
                messages.error(request, 'Error Occured, Please try again..')
            return redirect('home')
        return redirect('home')
def logout_view(request):
    logout(request)
    messages.success(request, 'Successfully, Logged out')
    return redirect('home')

class Dashboard(LoginRequiredMixin, TemplateView):
    login_url = 'home'
    def get(self, request, *args, **kwargs):
        return render(request, 'dashboard.html')

class CreateForm(LoginRequiredMixin, TemplateView):
    login_url = 'home'
    def get(self, request, *args, **kwargs):
        return render(request, 'createform.html')
    def post(self, request, *args, **kwargs):
        data = request.POST
        userform_obj = UserForms()
        userform_obj.title = data['title']
        userform_obj.user = request.user
        userform_obj.data = data['json_data']
        userform_obj.save()
        messages.success(request, "Successfully Created..")
        return redirect('dashboard')

class GetForm(TemplateView):
    def get(self, request, *args, **kwargs):
        form_id = self.kwargs['form_id']
        try:
            context = {}
            form_obj = UserForms.objects.get(form_id = form_id)
            context['title'] = form_obj.title
            context['data'] = form_obj.data
            return render(request, 'formresponse.html', context)
        except Exception as err:
            print(err)
            messages.error(request, "Articles does not exists")
            return redirect('home')
    def post(self, request, *args, **kwargs):
        form_id = self.kwargs['form_id']
        response = (request.POST).copy()
        response.pop('csrfmiddlewaretoken', 'No Key found')
        # response['form_id'] = form_id
        response_obj = FormResponse()
        response_obj.form = UserForms.objects.get(form_id =form_id)
        response_obj.response = json.dumps(response)
        response_obj.usermail = response['usermail']
        response_obj.save()
        messages.success(request, "Successfully submitted form.")
        return redirect('home')
class CreatedForm(LoginRequiredMixin, TemplateView):
    login_url = 'home'
    def get(self, request, *args, **kwargs):
        all_forms = UserForms.objects.filter(user = request.user)
        return render(request, 'createdform.html', {'forms':all_forms})

class GetResponse(LoginRequiredMixin, TemplateView):
    login_url = 'home'
    def get(self, request, *args, **kwargs):
        context = {}
        form_id = self.kwargs['form_id']
        form = UserForms.objects.get(form_id = form_id)
        all_responses = []
        responses_obj = FormResponse.objects.filter(form = form)
        for response in responses_obj:
            all_responses.append(json.loads(response.response))
        questions = []
        for question in json.loads(form.data):
            questions.append(question['label'])
        context['form'] = json.dumps(questions)
        context['responses'] = json.dumps(all_responses)
        context['title'] = form.title
        return render(request, 'response.html', context)