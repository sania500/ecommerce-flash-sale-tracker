from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Order(BaseModel):
    customer_name: str
    product_name: str
    quantity: int

orders_db = [
    {"id": 1, "customer_name": "Rahim Ahmed", "product_name": "Wireless Earbuds", "quantity": 1, "status": "Dispatched"},
    {"id": 2, "customer_name": "Sadia Islam", "product_name": "Smart Watch", "quantity": 2, "status": "Packed"},
]

@app.get("/api/orders")
def get_orders():
    return orders_db

@app.post("/api/orders")
def place_order(order: Order):
    new_order = {
        "id": len(orders_db) + 1,
        "customer_name": order.customer_name,
        "product_name": order.product_name,
        "quantity": order.quantity,
        "status": "Placed"
    }
    orders_db.insert(0, new_order)
    return {"message": "Order placed successfully!", "order": new_order}

@app.delete("/api/orders/{order_id}")
def cancel_order(order_id: int):
    global orders_db
    orders_db = [o for o in orders_db if o["id"] != order_id]
    return {"message": "Order cancelled successfully"}