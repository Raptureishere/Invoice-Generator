
import React, { useState, useRef } from 'react';
import { Invoice as InvoiceType } from '../../types';
import Header from '../layout/Header';
import InvoiceForm from '../invoice/InvoiceForm';
import InvoicePreview from '../invoice/InvoicePreview';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoicePage: React.FC = () => {
    const { user, useCredit } = useAuth();
    const [invoice, setInvoice] = useState<InvoiceType>({
        fromName: user?.fullName || 'Your Name',
        fromAddress: 'Your Address, City, Country',
        toName: 'Client Name',
        toAddress: 'Client Address, City, Country',
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        items: [{ id: new Date().toISOString(), description: 'Service or Product Description', quantity: 1, price: 0 }],
        notes: 'Thank you for your business.',
        tax: 0,
        discount: 0,
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const invoicePreviewRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!user || user.credits <= 0) {
            alert('You have no credits left. Please purchase more to download invoices.');
            return;
        }
        if (!invoicePreviewRef.current) return;
        
        setIsGenerating(true);

        const canvas = await html2canvas(invoicePreviewRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);

        useCredit();
        setIsGenerating(false);
        alert('Invoice downloaded successfully! 1 credit has been used.');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
                    <InvoicePreview 
                        ref={invoicePreviewRef} 
                        invoice={invoice} 
                        onDownloadPDF={handleDownloadPDF} 
                        isGenerating={isGenerating} 
                    />
                </div>
            </main>
        </div>
    );
};

export default InvoicePage;
