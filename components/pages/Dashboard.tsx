
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../layout/Header';
import Button from '../ui/Button';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900">Welcome back, {user?.fullName}!</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            You have <span className="font-bold text-blue-600">{user?.credits}</span> credits remaining.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">Create a New Invoice</h3>
                            <p className="mt-2 text-gray-500">
                                Start from scratch and generate a professional invoice in minutes.
                            </p>
                            <Link to="/invoice" className="mt-6">
                                <Button>Create Invoice</Button>
                            </Link>
                        </div>

                         <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">Purchase More Credits</h3>
                            <p className="mt-2 text-gray-500">
                                Top up your account to continue creating unlimited invoices.
                            </p>
                            <Link to="/purchase-credits" className="mt-6">
                                <Button variant="secondary">Buy Credits</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
