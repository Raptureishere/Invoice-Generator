
import React, { useState } from 'react';
import Header from '../layout/Header';
import { useAuth } from '../../context/AuthContext';
import { CREDIT_PACKAGES } from '../../constants';
import { CreditPackage } from '../../types';
import Button from '../ui/Button';
import { PAYSTACK_PUBLIC_KEY } from '../../constants';

const PurchaseCreditsPage: React.FC = () => {
    const { user, addCredits } = useAuth();
    const [statusMessage, setStatusMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    
    const handlePurchase = (pkg: CreditPackage) => {
        setStatusMessage('');
        const paystackOptions = {
            key: PAYSTACK_PUBLIC_KEY,
            email: `${user?.username}@example.com`, // Using username as a placeholder for email
            amount: pkg.priceCents,
            currency: 'GHS' as const,
            ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generate a unique reference
            callback: (response: { reference: string }) => {
                // Payment was successful
                console.log('Payment successful. Reference:', response.reference);
                addCredits(pkg.credits);
                setMessageType('success');
                setStatusMessage(`Successfully purchased ${pkg.credits} credits! Your new balance is ${user!.credits + pkg.credits}.`);
            },
            onClose: () => {
                // User closed the payment popup
                setMessageType('error');
                setStatusMessage('Payment cancelled. Please try again.');
            },
        };
        
        const handler = window.PaystackPop.setup(paystackOptions);
        handler.openIframe();
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900">Purchase Credits</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Choose a package below to top up your account and continue creating invoices.
                        </p>
                    </div>

                    {statusMessage && (
                        <div className={`mt-6 p-4 rounded-md text-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {statusMessage}
                        </div>
                    )}

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {CREDIT_PACKAGES.map(pkg => (
                            <div key={pkg.id} className={`p-8 rounded-lg shadow-lg text-center flex flex-col ${pkg.bgColor} ${pkg.textColor}`}>
                                <h3 className="text-2xl font-bold">{pkg.credits} Credits</h3>
                                <p className="mt-4 text-4xl font-extrabold">
                                    GHS {pkg.priceGHS}
                                </p>
                                <div className="flex-grow"></div>
                                <Button 
                                    onClick={() => handlePurchase(pkg)} 
                                    className="mt-8 w-full bg-white !text-gray-800 hover:bg-gray-200"
                                >
                                    Buy Now
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PurchaseCreditsPage;
