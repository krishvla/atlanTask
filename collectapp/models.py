from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.

class UserForms(models.Model):
    form_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    data = models.TextField()
    title = models.CharField(max_length=100, null=False)

    def __str__(self):
        params = {
            "title": self.title,
            'user':self.user.username,
        }
        return "{title} - {user}".format(**params)

class FormResponse(models.Model):
    form = models.ForeignKey(UserForms, on_delete=models.SET_NULL, null=True)
    response =  models.TextField()
    usermail = models.CharField(max_length=100, null=False)

    def __str__(self):
        params = {
            "form": self.form.title,
            'user':self.usermail,
        }
        return "{form} - {user}".format(**params)