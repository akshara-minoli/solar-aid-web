import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

export default function ConsultationsPage(){
  const [consults, setConsults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/api/admin/consultations')
      .then(res => setConsults(res.data.consultations || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 pl-64">
        <Navbar title="Manage Consultations" />
        <main className="p-6 pt-28">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-4">Consultations</h3>
            {loading ? <div>Loading...</div> : (
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">User</th>
                    <th className="p-2">Contact</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {consults.map(c => (
                    <tr key={c.id} className="border-t">
                      <td className="p-2">{c.userName}</td>
                      <td className="p-2">{c.contactInfo}</td>
                      <td className="p-2">{c.message}</td>
                      <td className="p-2">{new Date(c.date).toLocaleString()}</td>
                      <td className="p-2">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
