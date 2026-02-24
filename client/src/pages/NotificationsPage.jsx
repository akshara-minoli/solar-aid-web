import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import UserNotifications from '../components/UserNotifications';

const NotificationsPage = () => {
    return (
        <DashboardLayout title="Your Notifications">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                    <UserNotifications />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NotificationsPage;
