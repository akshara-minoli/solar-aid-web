import React, { useState, useEffect } from 'react';
import api from '../api';
import AdminProfileMenu from '../components/AdminProfileMenu';
import Sidebar from '../components/Sidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function HouseholdProfilesAdmin() {
  const [households, setHouseholds] = useState([]);
  const [filteredHouseholds, setFilteredHouseholds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingHousehold, setEditingHousehold] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [remarks, setRemarks] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'update' or 'delete'
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  // Filter households based on search and filters
  useEffect(() => {
    let filtered = households.filter(household => {
      const ownerName = household.userId?.fullName?.toLowerCase() || '';
      const ownerEmail = household.userId?.email?.toLowerCase() || '';
      return !ownerName.includes('administrator') && !ownerEmail.includes('admin@');
    });
    
    if (searchTerm) {
      filtered = filtered.filter(household => 
        household.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        household.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        household.district?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (districtFilter) {
      filtered = filtered.filter(household => household.district === districtFilter);
    }
    
    if (typeFilter) {
      filtered = filtered.filter(household => household.houseType === typeFilter);
    }
    
    setFilteredHouseholds(filtered);
  }, [households, searchTerm, districtFilter, typeFilter]);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      console.log('Fetching households from API...');
      const res = await api.get('/api/admin/households');
      console.log('API response:', res.data);
      if (res.data && res.data.success) {
        const householdList = res.data.households || [];
        setHouseholds(householdList);
        console.log('Households loaded:', householdList.length);
      }
    } catch (err) {
      console.error('Fetch households error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch households');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    try {
      console.log('Starting PDF export for households...');
      console.log('Data to export:', filteredHouseholds);
      
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Household Profiles Report', 20, 20);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Total Records: ${filteredHouseholds.length}`, 20, 35);
      
      // Table data
      const tableData = filteredHouseholds.map(household => [
        household.userId?.fullName || 'Unknown Owner',
        household.userId?.email || 'No email',
        (household.houseType || 'N/A').toUpperCase(),
        household.district || 'N/A',
        household.members?.toString() || '0',
        `${household.roofArea || 0} sq ft`
      ]);
      
      console.log('Table data prepared:', tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable === 'function') {
        // Table
        doc.autoTable({
          startY: 45,
          head: [['Owner', 'Email', 'Type', 'District', 'Members', 'Roof Area']],
          body: tableData,
          theme: 'striped',
          styles: {
            fontSize: 8,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            1: { cellWidth: 50 }, // Email column
            0: { cellWidth: 35 }, // Owner column
          }
        });
      } else {
        // Fallback: just add text if autoTable fails
        let y = 50;
        doc.setFontSize(12);
        doc.text('Owner\t\tEmail\t\tType\t\tDistrict\t\tMembers\t\tRoof Area', 20, y);
        y += 10;
        
        tableData.forEach(row => {
          if (y > 280) { // New page if needed
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(8);
          doc.text(row.join('\t'), 20, y);
          y += 8;
        });
      }
      
      console.log('PDF generated successfully, saving...');
      
      // Save the PDF
      doc.save('household-profiles-report.pdf');
      
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    }
  };
  const handleDelete = async (household) => {
    setSelectedHousehold(household);
    setActionType('delete');
    setRemarks('');
    setShowRemarksModal(true);
  };

  const handleEdit = (household) => {
    setEditingHousehold(household._id);
    setEditFormData({
      houseType: household.houseType || '',
      roofArea: household.roofArea || '',
      district: household.district || '',
      members: household.members || '',
      houseAddress: household.houseAddress || '',
      appliances: household.appliances || ''
    });
  };

  const handleUpdate = async (household) => {
    if (!remarks.trim()) {
      setError('Please provide remarks for the update');
      return;
    }
    setSelectedHousehold(household);
    setActionType('update');
    setShowRemarksModal(false);
    
    try {
      const payload = { ...editFormData, remarks: remarks.trim() };
      const res = await api.put(`/api/admin/households/${household._id}`, payload);
      
      if (res.data && res.data.success) {
        setSuccess('Household updated successfully');
        setEditingHousehold(null);
        setEditFormData({});
        setRemarks('');
        fetchHouseholds();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update household');
      setTimeout(() => setError(''), 5000);
    }
  };

  const confirmAction = async () => {
    if (!remarks.trim()) {
      setError('Please provide remarks for this action');
      return;
    }

    try {
      if (actionType === 'delete') {
        const res = await api.delete(`/api/admin/households/${selectedHousehold._id}`, {
          data: { remarks: remarks.trim() }
        });
        if (res.data && res.data.success) {
          setSuccess('Household deleted successfully');
          fetchHouseholds();
        }
      } else if (actionType === 'update') {
        handleUpdate(selectedHousehold);
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${actionType} household`);
      setTimeout(() => setError(''), 5000);
    }

    setShowRemarksModal(false);
    setRemarks('');
    setSelectedHousehold(null);
    setActionType('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const cancelEdit = () => {
    setEditingHousehold(null);
    setEditFormData({});
  };

  const inputClass = "w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col pl-64 bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        
        <main className="p-6 pt-24 max-w-7xl w-full mx-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-orange-400">🏠</span>
                    Manage Household Profiles
                  </h1>
                  <p className="text-slate-400 mt-1">View and manage all registered household accounts</p>
                </div>
                <button
                  onClick={exportToPDF}
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <span>📄</span>
                  Export PDF
                </button>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Search Households</label>
                    <input
                      type="text"
                      placeholder="Search by owner name, email, or district..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="w-full lg:w-48">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Filter by District</label>
                    <select
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="" className="bg-slate-800 text-white">All Districts</option>
                      <option value="Colombo" className="bg-slate-800 text-white">Colombo</option>
                      <option value="Gampaha" className="bg-slate-800 text-white">Gampaha</option>
                      <option value="Kegalle" className="bg-slate-800 text-white">Kegalle</option>
                      <option value="Kandy" className="bg-slate-800 text-white">Kandy</option>
                      <option value="Galle" className="bg-slate-800 text-white">Galle</option>
                      <option value="Matara" className="bg-slate-800 text-white">Matara</option>
                      <option value="Kurunegala" className="bg-slate-800 text-white">Kurunegala</option>
                    </select>
                  </div>
                  <div className="w-full lg:w-48">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Filter by Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="" className="bg-slate-800 text-white">All Types</option>
                      <option value="house" className="bg-slate-800 text-white">House</option>
                      <option value="apartment" className="bg-slate-800 text-white">Apartment</option>
                    </select>
                  </div>
                  {(searchTerm || districtFilter || typeFilter) && (
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setDistrictFilter('');
                          setTypeFilter('');
                        }}
                        className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30 px-4 py-2.5 rounded-lg font-medium transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                {(searchTerm || districtFilter || typeFilter) && (
                  <div className="mt-3 text-sm text-slate-400">
                    Showing {filteredHouseholds.length} of {households.filter(household => {
                      const ownerName = household.userId?.fullName?.toLowerCase() || '';
                      const ownerEmail = household.userId?.email?.toLowerCase() || '';
                      return !ownerName.includes('administrator') && !ownerEmail.includes('admin@');
                    }).length} households
                  </div>
                )}
              </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm">
                {success}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-10">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wide">Owner</th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wide">Type</th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wide">District</th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wide">Members</th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wide">Roof Area</th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHouseholds.length > 0 ? filteredHouseholds.map((household) => (
                      <tr key={household._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="text-white">
                            {household.userId?.fullName || 'Unknown Owner'}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {household.userId?.email || 'No email'}
                          </div>
                        </td>
                        <td className="p-4">
                          {editingHousehold === household._id ? (
                            <select
                              value={editFormData.houseType || ''}
                              onChange={(e) => setEditFormData({...editFormData, houseType: e.target.value})}
                              className={inputClass}
                            >
                              <option value="" className="bg-slate-800 text-white">Select type</option>
                              <option value="house" className="bg-slate-800 text-white">House</option>
                              <option value="apartment" className="bg-slate-800 text-white">Apartment</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-wider ${
                              household.houseType === 'house' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                              {household.houseType}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {editingHousehold === household._id ? (
                            <input
                              type="text"
                              value={editFormData.district || ''}
                              onChange={(e) => setEditFormData({...editFormData, district: e.target.value})}
                              className={inputClass}
                              placeholder="District"
                            />
                          ) : (
                            <div className="text-slate-300">{household.district}</div>
                          )}
                        </td>
                        <td className="p-4">
                          {editingHousehold === household._id ? (
                            <input
                              type="number"
                              value={editFormData.members || ''}
                              onChange={(e) => setEditFormData({...editFormData, members: e.target.value})}
                              className={inputClass}
                              placeholder="Members"
                              min="1"
                            />
                          ) : (
                            <div className="text-slate-300">{household.members}</div>
                          )}
                        </td>
                        <td className="p-4">
                          {editingHousehold === household._id ? (
                            <input
                              type="number"
                              value={editFormData.roofArea || ''}
                              onChange={(e) => setEditFormData({...editFormData, roofArea: e.target.value})}
                              className={inputClass}
                              placeholder="Roof area (sq ft)"
                              min="0"
                            />
                          ) : (
                            <div className="text-slate-300">{household.roofArea} sq ft</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {editingHousehold === household._id ? (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedHousehold(household);
                                    setActionType('update');
                                    setShowRemarksModal(true);
                                  }}
                                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  SAVE
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  CANCEL
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(household)}
                                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  EDIT
                                </button>
                                <button
                                  onClick={() => handleDelete(household)}
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  DELETE
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center p-8 text-slate-400">
                          {searchTerm || districtFilter || typeFilter ? 'No households match your search criteria.' : 'No household profiles found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Remarks Modal */}
        {showRemarksModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0B1120] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">📝</span> 
                {actionType === 'delete' ? 'Delete Household' : 'Update Household'}
              </h3>
              
              <p className="text-slate-300 mb-4 text-sm">
                {actionType === 'delete' 
                  ? 'Please provide a reason for deleting this household profile:' 
                  : 'Please provide remarks for updating this household profile:'
                }
              </p>
              
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks here..."
                className="w-full h-24 p-3 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                required
              />
              
              {error && (
                <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded text-xs">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={confirmAction}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                    actionType === 'delete'
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                  }`}
                >
                  {actionType === 'delete' ? 'Confirm Delete' : 'Confirm Update'}
                </button>
                <button
                  onClick={() => {
                    setShowRemarksModal(false);
                    setRemarks('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}