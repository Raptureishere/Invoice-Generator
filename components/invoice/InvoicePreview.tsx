
import React, { forwardRef } from 'react';
import { Invoice } from '../../types';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface InvoicePreviewProps {
    invoice: Invoice;
    onDownloadPDF: () => void;
    isGenerating: boolean;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(({ invoice, onDownloadPDF, isGenerating }, ref) => {
    const { user } = useAuth();
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxAmount = (subtotal * (invoice.tax || 0)) / 100;
    const discountAmount = (subtotal * (invoice.discount || 0)) / 100;
    const total = subtotal + taxAmount - discountAmount;

    return (
        <div className="sticky top-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
                <Button onClick={onDownloadPDF} disabled={isGenerating || (user?.credits ?? 0) <= 0}>
                    {isGenerating ? 'Generating PDF...' : `Download PDF (${user?.credits ?? 0} credits left)`}
                </Button>
            </div>
             <div ref={ref} className="bg-white p-8 rounded-lg shadow-lg" id="invoice-preview">
                <header className="flex justify-between items-start pb-6 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                        <p className="text-gray-500"># {invoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-gray-800">{invoice.fromName}</h2>
                        <p className="text-gray-500">{invoice.fromAddress.split(',').map((line, i) => <span key={i}>{line.trim()}<br/></span>)}</p>
                    </div>
                </header>

                <section className="flex justify-between mt-6">
                    <div className="w-1/2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Bill To</h3>
                        <p className="font-bold text-gray-800">{invoice.toName}</p>
                        <p className="text-gray-600">{invoice.toAddress.split(',').map((line, i) => <span key={i}>{line.trim()}<br/></span>)}</p>
                    </div>
                    <div className="text-right w-1/2">
                        <p><span className="font-semibold">Date:</span> {invoice.date}</p>
                        <p><span className="font-semibold">Due Date:</span> {invoice.dueDate}</p>
                    </div>
                </section>

                <section className="mt-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 font-semibold text-sm">Description</th>
                                <th className="p-3 font-semibold text-sm text-center">Qty</th>
                                <th className="p-3 font-semibold text-sm text-right">Price</th>
                                <th className="p-3 font-semibold text-sm text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                                    <td className="p-3 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="flex justify-end mt-6">
                    <div className="w-full max-w-xs text-gray-700">
                        <div className="flex justify-between py-1"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        {invoice.tax > 0 && <div className="flex justify-between py-1"><span>Tax ({invoice.tax}%)</span><span>${taxAmount.toFixed(2)}</span></div>}
                        {invoice.discount > 0 && <div className="flex justify-between py-1"><span>Discount ({invoice.discount}%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
                        <div className="flex justify-between py-2 border-t mt-2 font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                </section>
                
                <footer className="mt-8 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Notes</h3>
                    <p className="text-gray-600 text-sm mt-1">{invoice.notes}</p>
                </footer>
            </div>
        </div>
    );
});

export default InvoicePreview;
