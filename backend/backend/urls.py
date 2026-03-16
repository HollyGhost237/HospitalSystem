"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import UserViewSet, RoleViewSet
from patients.views import PatientViewSet
from hospitals.views import HospitalViewSet
from services.views import ServiceViewSet, HospitalServiceViewSet
from references.views import ReferenceViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'hospitals', HospitalViewSet, basename='hospital')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'hospital-services', HospitalServiceViewSet, basename='hospital-service')
router.register(r'references', ReferenceViewSet, basename='reference')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # Toutes nos routes API sont sous /api/
    path('api/auth/', include('rest_framework.urls')), # Optionnel : pour la vue login/logout de DRF
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
