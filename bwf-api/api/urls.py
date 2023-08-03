from api import views
from rest_framework import routers
from django.urls import path
from django.conf.urls import include
from rest_framework.authtoken.views import obtain_auth_token

routers = routers.DefaultRouter()
routers.register(r'groups', views.GroupViewset)
routers.register(r'events', views.EventViewset)
routers.register(r'bets', views.BetViewset)
routers.register(r'members', views.MemberViewset)
routers.register(r'comments', views.CommentViewset)
routers.register(r'users', views.UserViewSet)
routers.register(r'profile', views.UserProfileViewset)


urlpatterns = [
    path('', include(routers.urls)),
    path('authenticate/', views.CustomObtainAuthToken.as_view())
]

