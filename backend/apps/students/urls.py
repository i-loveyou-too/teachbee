from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, StudentBillingPolicyViewSet, StudentRegularScheduleViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'billing-policies', StudentBillingPolicyViewSet, basename='billing-policy')
router.register(r'regular-schedules', StudentRegularScheduleViewSet, basename='regular-schedule')

urlpatterns = router.urls
