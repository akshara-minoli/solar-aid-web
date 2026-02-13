import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

export default function ProductsPage(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ productName: '', productBrand: '', productPrice: '', productCategory: 'Solar Panels' })
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ productName: '', productBrand: '', productPrice: '', productCategory: 'Solar Panels' })
  const [editImage, setEditImage] = useState(null)

  const token = localStorage.getItem('token')

  const fetchProducts = () => {
    setLoading(true)
    api.get('/api/admin/products')
      .then(res => setProducts(res.data.products || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleImage = (e) => setImage(e.target.files[0])

  const handleEditImage = (e) => setEditImage(e.target.files[0])

  const handleEditClick = (p) => {
    setEditingId(p._id)
    setEditForm({ productName: p.productName || '', productBrand: p.productBrand || '', productPrice: p.productPrice || '', productCategory: p.productCategory || 'Solar Panels' })
    setEditImage(null)
  }

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ productName: '', productBrand: '', productPrice: '', productCategory: 'Solar Panels' })
    setEditImage(null)
  }

  const handleSaveEdit = async (id) => {
    try {
      const fd = new FormData()
      fd.append('productName', editForm.productName)
      fd.append('productBrand', editForm.productBrand)
      fd.append('productPrice', editForm.productPrice)
      fd.append('productCategory', editForm.productCategory)
      if (editImage) fd.append('productPicture', editImage)

      await api.put(`/api/admin/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      handleCancelEdit()
      fetchProducts()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      console.log('Deleting product', id)
      const res = await api.delete(`/api/admin/products/${id}`)
      console.log('Delete response:', res)
      if (res && (res.data && res.data.success)) {
        fetchProducts()
      } else {
        alert('Delete failed: ' + (res.data?.message || 'Unknown'))
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error deleting product: ' + (err?.response?.data?.message || err.message || err))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('productName', formData.productName)
      fd.append('productBrand', formData.productBrand)
      fd.append('productPrice', formData.productPrice)
      fd.append('productCategory', formData.productCategory)
      if (image) fd.append('productPicture', image)

      await api.post('/api/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFormData({ productName: '', productBrand: '', productPrice: '', productCategory: 'Solar Panels' })
      setImage(null)
      fetchProducts()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 pl-64">
        <Navbar title="Manage Products" />
        <main className="p-6 pt-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 bg-white p-4 rounded shadow">
              <h4 className="font-bold mb-4">Add Product</h4>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
                <input name="productBrand" value={formData.productBrand} onChange={handleChange} placeholder="Brand" className="w-full p-2 border rounded" />
                <input name="productPrice" value={formData.productPrice} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
                <select name="productCategory" value={formData.productCategory} onChange={handleChange} className="w-full p-2 border rounded">
                  <option>Solar Panels</option>
                  <option>Solar Inverter</option>
                  <option>Others</option>
                </select>
                <input type="file" onChange={handleImage} accept="image/*" />
                <button className="px-4 py-2 bg-emerald-500 text-white rounded">Add</button>
              </form>
            </div>

            <div className="col-span-2 bg-white p-4 rounded shadow">
              <h4 className="font-bold mb-4">Products</h4>
              {loading ? <div>Loading...</div> : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map(p => (
                    <div key={p._id} className="border p-3 rounded">
                      {editingId === p._id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          <div className="flex flex-col items-center">
                            {p.productPicture ? <img src={`/${p.productPicture}`} alt="pic" className="w-28 h-28 object-cover rounded mb-2" /> : <div className="w-28 h-28 bg-gray-100 rounded mb-2" />}
                            <input type="file" onChange={handleEditImage} accept="image/*" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <input name="productName" value={editForm.productName} onChange={handleEditChange} className="w-full p-2 border rounded" />
                            <input name="productBrand" value={editForm.productBrand} onChange={handleEditChange} className="w-full p-2 border rounded" />
                            <input name="productPrice" value={editForm.productPrice} onChange={handleEditChange} className="w-full p-2 border rounded" />
                            <select name="productCategory" value={editForm.productCategory} onChange={handleEditChange} className="w-full p-2 border rounded">
                              <option>Solar Panels</option>
                              <option>Solar Inverter</option>
                              <option>Others</option>
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => handleSaveEdit(p._id)} className="px-3 py-2 bg-emerald-500 text-white rounded">Save</button>
                              <button onClick={handleCancelEdit} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-28 h-28 flex-shrink-0">
                            {p.productPicture ? <img src={`/${p.productPicture}`} alt="pic" className="w-28 h-28 object-cover rounded" /> : <div className="w-28 h-28 bg-gray-100 rounded" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg">{p.productName}</div>
                            <div className="text-sm text-gray-500">Brand: {p.productBrand || '—'}</div>
                            <div className="text-sm text-gray-500">Price: ${p.productPrice}</div>
                            <div className="text-sm text-gray-500">Category: {p.productCategory}</div>
                            <div className="text-xs text-gray-400">ID: {p._id}</div>
                            <div className="text-xs text-gray-400">Added: {p.createdAt ? new Date(p.createdAt).toLocaleString() : '—'}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => handleEditClick(p)} className="px-3 py-2 bg-blue-500 text-white rounded">Edit</button>
                            <button onClick={() => handleDelete(p._id)} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
