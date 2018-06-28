from medic.models import Profile
import django_filters

class MedicFilter(django_filters.FilterSet):
    cost = django_filters.NumericRangeFilter(name='cost')
    #cost__gt = django_filters.NumberFilter(name='cost', lookup_expr='amount__gt')
    #cost__lt = django_filters.NumberFilter(name='cost', lookup_expr='amount__lt')
    class Meta:
        model = Profile
        fields = ['genre', 'city', 'cost',]
