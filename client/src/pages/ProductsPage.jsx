import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ productName: '', productBrand: '', productPrice: '', productCategory: 'Solar Panels' })
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ productName: '', productBrand: '', productPrice: '', productCategory: 'Solar Panels' })
  const [editImage, setEditImage] = useState(null)

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
      const res = await api.delete(`/api/admin/products/${id}`)
      if (res && (res.data && res.data.success)) {
        fetchProducts()
      } else {
        alert('Delete failed: ' + (res.data?.message || 'Unknown'))
      }
    } catch (err) {
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

  // Component styles for inputs
  const inputClass = "w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Manage Products</h1>
              <p className="text-slate-400 text-sm mt-1">Add, edit, and organize store inventory</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Product Form */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl sticky top-8">
                <h4 className="font-semibold text-lg text-white mb-5 flex items-center gap-2">
                  <span className="text-blue-400">➕</span> Add Product
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" className={inputClass} required />
                  <input name="productBrand" value={formData.productBrand} onChange={handleChange} placeholder="Brand" className={inputClass} />
                  <input name="productPrice" type="number" step="0.01" value={formData.productPrice} onChange={handleChange} placeholder="Price ($)" className={inputClass} required />
                  <select name="productCategory" value={formData.productCategory} onChange={handleChange} className={`${inputClass} [&>option]:bg-slate-800`}>
                    <option value="Solar Panels">Solar Panels</option>
                    <option value="Solar Inverter">Solar Inverter</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="p-3 border border-white/10 rounded-lg border-dashed text-slate-400 text-sm hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden">
                    <input type="file" onChange={handleImage} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="flex items-center gap-2 justify-center">
                      <span>📸</span> {image ? image.name : "Upload Product Image"}
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                    Add to Inventory
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
                </div>
              ) : (
                <>
                  {products.map(p => (
                    <div key={p._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-lg hover:bg-white/10 transition-colors">
                      {editingId === p._id ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                          <div className="col-span-1 flex flex-col items-center">
                            {p.productPicture ? (
                              <img src={`/${p.productPicture}`} alt="pic" className="w-full aspect-square object-cover rounded-xl border border-white/10 mb-3" />
                            ) : (
                              <div className="w-full aspect-square bg-white/5 rounded-xl border border-white/10 mb-3 flex items-center justify-center text-slate-500 p-4 text-center text-xs">No image</div>
                            )}
                            <div className="w-full p-2 border border-white/10 rounded border-dashed text-slate-400 text-xs hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden text-center">
                              <input type="file" onChange={handleEditImage} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                              {editImage ? editImage.name : 'Change'}
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-3 space-y-3">
                            <input name="productName" value={editForm.productName} onChange={handleEditChange} placeholder="Name" className={inputClass} />
                            <div className="grid grid-cols-2 gap-3">
                              <input name="productBrand" value={editForm.productBrand} onChange={handleEditChange} placeholder="Brand" className={inputClass} />
                              <input name="productPrice" type="number" step="0.01" value={editForm.productPrice} onChange={handleEditChange} placeholder="Price" className={inputClass} />
                            </div>
                            <select name="productCategory" value={editForm.productCategory} onChange={handleEditChange} className={`${inputClass} [&>option]:bg-slate-800`}>
                              <option value="Solar Panels">Solar Panels</option>
                              <option value="Solar Inverter">Solar Inverter</option>
                              <option value="Others">Others</option>
                            </select>

                            <div className="flex gap-3 pt-2">
                              <button onClick={() => handleSaveEdit(p._id)} className="flex-1 px-4 py-2.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-medium rounded-lg border border-emerald-500/30 transition-colors">
                                Save Changes
                              </button>
                              <button onClick={handleCancelEdit} className="flex-1 px-4 py-2.5 bg-slate-500/20 text-slate-300 hover:bg-slate-500/40 font-medium rounded-lg border border-slate-500/30 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="w-32 h-32 flex-shrink-0 bg-white/5 rounded-xl p-1 border border-white/10">
                            {p.productPicture ? (
                              <img src={`/${p.productPicture}`} alt="pic" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <div className="w-full h-full rounded-lg bg-white/5 flex items-center justify-center text-slate-500 text-xs">No image</div>
                            )}
                          </div>

                          <div className="flex-1 text-center sm:text-left">
                            <div className="font-bold text-xl text-white mb-1 group-hover:text-blue-300 transition-colors">{p.productName}</div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mb-2">
                              <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">${p.productPrice}</span>
                              <span className="text-sm text-slate-400">Brand: <span className="text-slate-300">{p.productBrand || '—'}</span></span>
                              <span className="text-sm text-slate-400">Category: <span className="text-slate-300">{p.productCategory}</span></span>
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide">ID: <span className="font-mono">{p._id}</span></div>
                          </div>

                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            <button onClick={() => handleEditClick(p)} className="flex-1 sm:flex-none px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 text-sm font-medium transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(p._id)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg border border-rose-500/30 text-sm font-medium transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="text-center p-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                      <div className="text-5xl mb-4 opacity-50">☀️</div>
                      <p className="text-slate-400 font-medium">No products in inventory yet</p>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
