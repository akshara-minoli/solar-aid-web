import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

export default function UsersPage(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/api/admin/users')
      .then(res => setUsers(res.data.users || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 pl-64">
        <Navbar title="Manage Users" />
        <main className="p-6 pt-28">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-4">Users</h3>
            {loading ? <div>Loading...</div> : (
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2">{u.fullName}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.phone}</td>
                      <td className="p-2">{u.role || 'user'}</td>
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
