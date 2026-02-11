import React, { useEffect, useState } from 'react';
import './Login.css';

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tab === 'users') {
          const res = await fetch('/api/auth/users');
          const data = await res.json();
          if (data.success) setUsers(data.users || []);
        } else if (tab === 'products') {
          const res = await fetch('/api/admin/products');
          const data = await res.json();
          if (data.success) {
            setProducts(data.products || []);
          } else {
            console.error('Failed to fetch products:', data.message);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', newName);
    form.append('price', newPrice);
    if (newImage) form.append('image', newImage);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers,
        body: form
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [data.product, ...prev]);
        setNewName(''); setNewPrice(''); setNewImage(null);
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    const ok = window.confirm(`Delete product "${name}"? This action cannot be undone.`);
    if (!ok) return;
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Existing Users</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Existing Products</button>
      </div>

      {loading && <div>Loading...</div>}

      {tab === 'users' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}><td>{u.fullName}</td><td>{u.email}</td><td>{u.phone}</td><td>{new Date(u.createdAt).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div>
          <form onSubmit={handleAddProduct} style={{marginBottom:20}}>
            <h3>Add Product</h3>
            <div>
              <input placeholder="Name" value={newName} onChange={e=>setNewName(e.target.value)} required />
            </div>
            <div>
              <input placeholder="Price" type="number" step="0.01" value={newPrice} onChange={e=>setNewPrice(e.target.value)} required />
            </div>
            <div>
              <input type="file" accept="image/*" onChange={e=>setNewImage(e.target.files[0])} />
            </div>
            <button type="submit">Add Product</button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {products.map(p => (
              <div key={p._id} style={{ textAlign: 'center', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                {p.imagePath ? (
                  <img src={p.imagePath} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
                ) : (
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '6px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                )}
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>{p.name}</h4>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>${p.price}</p>
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleDeleteProduct(p._id, p.name)} style={{ background:'#d9534f', color:'#fff', border:'none', padding:'6px 10px', borderRadius:4, cursor:'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
