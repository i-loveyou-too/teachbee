from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, PaymentRequestViewSet

router = DefaultRouter()
router.register(r'payments', PaymentViewSet)
router.register(r'payment-requests', PaymentRequestViewSet, basename='payment-request')

urlpatterns = router.urls
