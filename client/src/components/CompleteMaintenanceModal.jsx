import React, { useState } from 'react';

const CompleteMaintenanceModal = ({ schedule, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        completionNotes: '',
        issues: '',
        partsReplaced: '',
        nextScheduleDate: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Split issues and parts by comma
            const issuesArray = formData.issues.split(',').map(i => i.trim()).filter(i => i !== '');
            const partsArray = formData.partsReplaced.split(',').map(p => p.trim()).filter(p => p !== '');

            onSuccess(schedule._id, {
                completionNotes: formData.completionNotes,
                issues: issuesArray,
                partsReplaced: partsArray,
                nextScheduleDate: formData.nextScheduleDate || null
            });
        } catch (error) {
            console.error('Error in modal submit:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Complete Maintenance</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Completion Notes</label>
                        <textarea
                            required
                            className={inputClass}
                            rows="3"
                            placeholder="What was done? (e.g. System reset and panel wipe)"
                            value={formData.completionNotes}
                            onChange={(e) => setFormData({ ...formData, completionNotes: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Issues Identified (Comma separated)</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Loose wiring, Dust buildup"
                            value={formData.issues}
                            onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Parts Replaced (Comma separated)</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. 5A Fuse, Connector Clip"
                            value={formData.partsReplaced}
                            onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Next Suggested Date (Optional)</label>
                        <input
                            type="date"
                            className={`${inputClass} [color-scheme:dark]`}
                            value={formData.nextScheduleDate}
                            onChange={(e) => setFormData({ ...formData, nextScheduleDate: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-emerald-600/20"
                        >
                            {loading ? 'Processing...' : 'Confirm Completion'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteMaintenanceModal;
