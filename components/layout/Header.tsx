
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/signin');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                           AI Invoicer
                        </Link>
                         <nav className="hidden md:flex space-x-4">
                            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                            <Link to="/invoice" className="text-gray-600 hover:text-blue-600">New Invoice</Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="text-right">
                             <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
                             <Link to="/purchase-credits" className="text-sm text-blue-600 hover:underline">
                                 {user?.credits} Credits Available
                             </Link>
                         </div>
                        <Button onClick={handleSignOut} variant="secondary">
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
