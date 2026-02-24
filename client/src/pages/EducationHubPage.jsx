import React from 'react';
import EducationHub from '../components/EducationHub';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardLayout from '../components/DashboardLayout';

const EducationHubPage = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (isLoggedIn) {
        return (
            <DashboardLayout title="Learning Hub">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <EducationHub theme="dashboard" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col pt-24">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
                <EducationHub theme="landing" />
            </main>
            <Footer />
        </div>
    );
};

export default EducationHubPage;
