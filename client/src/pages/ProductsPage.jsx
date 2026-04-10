import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

  // Generate PDF Report
  const handleGeneratePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // ── Header background ──
    doc.setFillColor(11, 17, 32)
    doc.rect(0, 0, 297, 42, 'F')

    // ── Solar Aid branding ──
    // Logo circle
    doc.setFillColor(37, 99, 235)
    doc.circle(18, 18, 10, 'F')
    doc.setFontSize(11)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('SA', 18, 21, { align: 'center' })

    // Title
    doc.setFontSize(20)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('Solar Aid', 32, 16)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(148, 163, 184)
    doc.text('Admin Panel  ·  Inventory Report', 32, 23)

    // Report title (right side)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Product Inventory Report', 297 - 14, 15, { align: 'right' })
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(148, 163, 184)
    doc.text(`Generated: ${dateStr}  ${timeStr}`, 297 - 14, 23, { align: 'right' })
    doc.text(`Total Products: ${products.length}`, 297 - 14, 30, { align: 'right' })

    // Separator line
    doc.setDrawColor(37, 99, 235)
    doc.setLineWidth(0.5)
    doc.line(0, 42, 297, 42)

    // ── Table ──
    const tableRows = products.map((p, idx) => [
      idx + 1,
      p.productName || '—',
      p.productBrand || '—',
      p.productCategory || '—',
      p._id,
      `$${Number(p.productPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ])

    autoTable(doc, {
      startY: 48,
      head: [['#', 'Product Name', 'Brand', 'Category', 'Product ID', 'Price']],
      body: tableRows,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 4,
        textColor: [30, 41, 59],
        lineColor: [203, 213, 225],
        lineWidth: 0.3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 38 },
        4: { cellWidth: 70, fontSize: 7, textColor: [100, 116, 139] },
        5: { halign: 'right', cellWidth: 30, fontStyle: 'bold', textColor: [5, 150, 105] },
      },
      margin: { left: 14, right: 14 },
    })

    // ── Footer ──
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(7)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `Solar Aid Admin Panel  ·  Confidential  ·  Page ${i} of ${pageCount}`,
        297 / 2,
        doc.internal.pageSize.height - 6,
        { align: 'center' }
      )
    }

    doc.save(`solar-aid-inventory-${now.toISOString().slice(0, 10)}.pdf`)
  }

  // Component styles for inputs
  const inputClass = "w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Manage Products</h1>
              <p className="text-slate-400 text-sm mt-1">Add, edit, and organize store inventory</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleGeneratePDF}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)' }}
              >
                {/* PDF download icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                Generate Inventory Report (PDF)
              </button>
              <p className="text-xs text-slate-500 pr-1">Includes names, brands, categories, IDs, and prices. No product images.</p>
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
