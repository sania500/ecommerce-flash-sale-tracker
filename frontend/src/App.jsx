import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ব্যাকএন্ড থেকে অর্ডার ফেচ করা
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // নতুন অর্ডার প্লে করা
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !productName) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          product_name: productName,
          quantity: Number(quantity)
        })
      });
      const data = await response.json();
      setOrders([data.order, ...orders]);
      setCustomerName('');
      setProductName('');
      setQuantity(1);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // অর্ডার ক্যানসেল বা ডিলিট করা
  const handleCancelOrder = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: 'DELETE'
      });
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>⚡ Flash Sale & Order Tracker</h1>

      {/* অর্ডার ফর্ম */}
      <form onSubmit={handlePlaceOrder} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Place New Order</h3>
        <input 
          type="text" 
          placeholder="Customer Name" 
          value={customerName} 
          onChange={(e) => setCustomerName(e.target.value)} 
          required
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input 
          type="text" 
          placeholder="Product Name" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          required
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input 
          type="number" 
          min="1" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          style={{ marginRight: '10px', padding: '8px', width: '60px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Buy Now
        </button>
      </form>

      {/* অর্ডার লিস্ট */}
      <h3>Live Orders List ({orders.length})</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td><span style={{ background: '#e2f0cb', padding: '3px 8px', borderRadius: '4px' }}>{order.status}</span></td>
              <td>
                <button 
                  onClick={() => handleCancelOrder(order.id)} 
                  style={{ background: '#ff4d4d', color: '#white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;