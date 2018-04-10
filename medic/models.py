from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from djmoney.models.fields import MoneyField
from geoposition.fields import GeopositionField
from address.models import AddressField

def profileFilePath(instance, filename):
    return 'medic/files/{0}/{1}'.format(instance.user.id, filename)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=profileFilePath, default='/static/images/no_user.png')
    MALE = 'M'
    FEMALE = 'F'
    UNDEF = 'U'
    GENRES = (
        (MALE, 'Masculino'),
        (FEMALE, 'Femenino'),
        (UNDEF, 'No definido'),
    )
    genre = models.CharField(
        max_length=1,
        choices=GENRES,
        default=UNDEF,
    )
    CEDULA_CIUDADANIA = 'CC'
    CEDULA_EXTRANJERIA = 'CE'
    PASAPORTE = 'PS'
    DOCUMENT_TYPES = (
        (CEDULA_CIUDADANIA, 'Cedula de ciudadania'),
        (CEDULA_EXTRANJERIA, 'Cedula de extranjeria'),
        (PASAPORTE, 'Pasaporte'),
    )
    personalDocumentType = models.CharField(
        'Tipo de documento',
        max_length=2,
        choices=DOCUMENT_TYPES,
        default=CEDULA_CIUDADANIA,
    )
    personalDocumentNumber = models.BigIntegerField('Numero de documento', null=True)
    personalDocumentFile = models.ImageField(upload_to=profileFilePath, null=True)
    professionalCardNumber = models.CharField(max_length=25, null=True)
    professionalCardFile = models.ImageField(upload_to=profileFilePath, null=True)

    city = models.CharField(max_length=25, null=True)
    address = AddressField(blank=True, null=True)
    location = GeopositionField()

    cost = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='COP',
        max_digits=11,
    )

    def __unicode__(self):
        return self.user.get_username()

@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

def studiesFilePath(instance, filename):
    return 'medic/files/{0}/{1}'.format(instance.profile.user.id, filename)

class Studies(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    BACHELOR = 'BH'
    CERTIFICAION = 'CR'
    SPECIALIZATION = 'SP'
    MASTER = 'MS'
    DOCTOR = 'PH'
    DEGREE = (
        (BACHELOR, 'Pregrado'),
        (CERTIFICAION, 'Certificacion'),
        (SPECIALIZATION, 'Especializacion'),
        (MASTER, 'Maestria'),
        (DOCTOR, 'Doctorado'),
    )
    level = models.CharField(
        max_length=2,
        choices=DEGREE,
        default=BACHELOR,
    )
    title = models.CharField(max_length=100)
    date = models.DateField()
    experienceYears = models.IntegerField()
    file = models.FileField(upload_to=studiesFilePath)
    certificated = models.BooleanField(default=False)
    def getLevel(self):
        return dict(self.DEGREE)[self.level]
    def getUserName(self):
        return self.profile.user.get_username()
    def __unicode__(self):
        return '%s - %s: %s'%(self.getUserName(), self.getLevel(), self.title)
