from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from sweets.models import Sweet
from decimal import Decimal

User = get_user_model()

def auth_client_for_user(client, user):
    # obtain token via login
    res = client.post("/api/auth/login/", {"username": user.username, "password": "password"}, format="json")
    token = res.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client

class SweetsApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create a normal user and admin user
        self.user = User.objects.create_user("user1", password="password")
        self.admin = User.objects.create_superuser("admin", password="password")
        # create some sweets
        Sweet.objects.create(name="Gulab Jamun", category="Indian", price=Decimal("10.00"), quantity=5)
        Sweet.objects.create(name="Rasgulla", category="Indian", price=Decimal("8.50"), quantity=3)

    def test_list_requires_auth(self):
        res = self.client.get("/api/sweets/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_sweets_authenticated(self):
        auth_client_for_user(self.client, self.user)
        res = self.client.get("/api/sweets/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_create_sweet(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        payload = {"name": "Kaju Katli", "category": "Indian", "price": "12.00", "quantity": 10}
        res = c.post("/api/sweets/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Sweet.objects.filter(name="Kaju Katli").exists())

    def test_delete_requires_admin(self):
        c = APIClient()
        # login as normal user
        auth_client_for_user(c, self.user)
        sweet = Sweet.objects.first()
        res = c.delete(f"/api/sweets/{sweet.id}/")
        self.assertIn(res.status_code, (status.HTTP_403_FORBIDDEN, status.HTTP_405_METHOD_NOT_ALLOWED))

        # admin can delete
        c2 = APIClient()
        auth_client_for_user(c2, self.admin)
        res2 = c2.delete(f"/api/sweets/{sweet.id}/")
        self.assertIn(res2.status_code, (status.HTTP_204_NO_CONTENT, status.HTTP_200_OK))

    def test_purchase_decrements_quantity_and_prevents_negative(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        sweet = Sweet.objects.create(name="TestSweet", category="Test", price=Decimal("2.00"), quantity=1)
        res = c.post(f"/api/sweets/{sweet.id}/purchase/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        sweet.refresh_from_db()
        self.assertEqual(sweet.quantity, 0)

        # cannot purchase when out of stock
        res2 = c.post(f"/api/sweets/{sweet.id}/purchase/")
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_restock_admin_only(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        sweet = Sweet.objects.create(name="RestockTest", category="Test", price=Decimal("1.00"), quantity=0)
        # normal user cannot restock
        res = c.post(f"/api/sweets/{sweet.id}/restock/", {"amount": 5}, format="json")
        self.assertIn(res.status_code, (status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED))

        # admin can restock
        c2 = APIClient()
        auth_client_for_user(c2, self.admin)
        res2 = c2.post(f"/api/sweets/{sweet.id}/restock/", {"amount": 5}, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        sweet.refresh_from_db()
        self.assertEqual(sweet.quantity, 5)

    def test_search_filters(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        res = c.get("/api/sweets/search/?name=Gulab")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(any("Gulab" in s["name"] for s in res.data))
    
    def test_price_validation(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        res = c.post("/api/sweets/", {"name": "Bad Sweet", "category": "Test", "price": -5, "quantity": 2}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("price", res.data["errors"])

    def test_quantity_validation(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        res = c.post("/api/sweets/", {"name": "Bad Sweet", "category": "Test", "price": 5, "quantity": -1}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("quantity", res.data["errors"])

    def test_pagination_on_sweets_list(self):
        c = APIClient()
        auth_client_for_user(c, self.user)
        # create many sweets
        for i in range(15):
            Sweet.objects.create(name=f"Sweet{i}", category="Bulk", price=1, quantity=1)
        res = c.get("/api/sweets/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("results", res.data)
        self.assertLessEqual(len(res.data["results"]), 10)  # default page size

