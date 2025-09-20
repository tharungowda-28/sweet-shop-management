from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Sweet
from .serializers import SweetSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"username": user.username}, status=status.HTTP_201_CREATED)

class SweetViewSet(viewsets.ModelViewSet):
    queryset = Sweet.objects.all().order_by("-created_at")
    serializer_class = SweetSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # restock & delete should require admin
        if self.action in ["restock", "destroy"]:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        qs = self.get_queryset()
        name = request.query_params.get("name")
        category = request.query_params.get("category")
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")

        if name:
            qs = qs.filter(name__icontains=name)
        if category:
            qs = qs.filter(category__icontains=category)
        if min_price:
            try:
                qs = qs.filter(price__gte=min_price)
            except ValueError:
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=max_price)
            except ValueError:
                pass

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def purchase(self, request, pk=None):
        sweet = get_object_or_404(Sweet, pk=pk)
        if sweet.quantity <= 0:
            return Response({"detail": "Out of stock"}, status=status.HTTP_400_BAD_REQUEST)
        sweet.quantity -= 1
        sweet.save()
        return Response(self.get_serializer(sweet).data)

    @action(detail=True, methods=["post"])
    def restock(self, request, pk=None):
        # permission handled by get_permissions -> admin only
        sweet = get_object_or_404(Sweet, pk=pk)
        amount = request.data.get("amount")
        quantity = request.data.get('quantity')
        try:
            amount = int(amount)
            if amount <= 0:
                raise ValueError
        except Exception:
            return Response({"detail": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        sweet.quantity += amount
        sweet.save()
        return Response(self.get_serializer(sweet).data)
