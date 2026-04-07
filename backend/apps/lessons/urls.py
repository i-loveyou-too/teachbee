from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, CancelMakeupViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'cancel-makeups', CancelMakeupViewSet)

urlpatterns = router.urls
