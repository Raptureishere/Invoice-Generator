
import React, { useState } from 'react';
import { Invoice, InvoiceItem } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { generateInvoiceDescription } from '../../services/geminiService';

interface InvoiceFormProps {
    invoice: Invoice;
    setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice }) => {
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<string | null>(null);

    const handleChange = <K extends keyof Invoice,>(field: K, value: Invoice[K]) => {
        setInvoice(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
        const newItems = invoice.items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        );
        handleChange('items', newItems);
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: new Date().toISOString(),
            description: '',
            quantity: 1,
            price: 0,
        };
        handleChange('items', [...invoice.items, newItem]);
    };

    const removeItem = (id: string) => {
        handleChange('items', invoice.items.filter(item => item.id !== id));
    };

    const handleGenerateDescription = async () => {
        if (!aiPrompt || !currentItemId) return;
        setAiLoading(true);
        const description = await generateInvoiceDescription(aiPrompt);
        handleItemChange(currentItemId, 'description', description);
        setAiLoading(false);
        setCurrentItemId(null);
        setAiPrompt('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice Details</h2>
            <div className="space-y-4">
                {/* From & To Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                        <h3 className="font-semibold mb-2">From</h3>
                        <Input id="fromName" label="Name" value={invoice.fromName} onChange={e => handleChange('fromName', e.target.value)} />
                        <Input id="fromAddress" label="Address" value={invoice.fromAddress} onChange={e => handleChange('fromAddress', e.target.value)} />
                    </div>
                    <div className="p-4 border rounded">
                        <h3 className="font-semibold mb-2">To</h3>
                        <Input id="toName" label="Name" value={invoice.toName} onChange={e => handleChange('toName', e.target.value)} />
                        <Input id="toAddress" label="Address" value={invoice.toAddress} onChange={e => handleChange('toAddress', e.target.value)} />
                    </div>
                </div>

                {/* Invoice Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input id="invoiceNumber" label="Invoice #" value={invoice.invoiceNumber} onChange={e => handleChange('invoiceNumber', e.target.value)} />
                    <Input id="date" label="Date" type="date" value={invoice.date} onChange={e => handleChange('date', e.target.value)} />
                    <Input id="dueDate" label="Due Date" type="date" value={invoice.dueDate} onChange={e => handleChange('dueDate', e.target.value)} />
                </div>

                {/* Items */}
                <div>
                    <h3 className="font-semibold mb-2 mt-4">Items</h3>
                    <div className="space-y-3">
                        {invoice.items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 p-2 border rounded items-center">
                                <div className="col-span-12 md:col-span-6">
                                    <label className="text-sm">Description</label>
                                    <textarea value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="w-full border rounded p-1 text-sm" rows={2}/>
                                    <button onClick={() => setCurrentItemId(item.id)} className="text-xs text-blue-600 hover:underline">✨ Generate with AI</button>
                                </div>
                                <div className="col-span-4 md:col-span-2"><Input id={`q-${item.id}`} label="Qty" type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))} /></div>
                                <div className="col-span-4 md:col-span-2"><Input id={`p-${item.id}`} label="Price" type="number" value={item.price} onChange={e => handleItemChange(item.id, 'price', parseFloat(e.target.value))} /></div>
                                <div className="col-span-4 md:col-span-2 flex items-end">
                                    <Button onClick={() => removeItem(item.id)} variant="danger" className="h-10 w-10 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={addItem} variant="secondary" className="mt-2">Add Item</Button>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input id="tax" label="Tax (%)" type="number" value={invoice.tax} onChange={e => handleChange('tax', parseFloat(e.target.value))} />
                     <Input id="discount" label="Discount (%)" type="number" value={invoice.discount} onChange={e => handleChange('discount', parseFloat(e.target.value))} />
                </div>

                {/* Notes */}
                <div>
                     <label className="text-sm">Notes</label>
                     <textarea value={invoice.notes} onChange={e => handleChange('notes', e.target.value)} className="w-full border rounded p-2 text-sm" rows={3}/>
                </div>
            </div>
            
            {currentItemId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Generate Description</h3>
                        <p className="text-sm text-gray-600 mb-2">Enter a simple prompt (e.g., "logo design and branding package").</p>
                        <Input id="aiPrompt" label="Prompt" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="secondary" onClick={() => setCurrentItemId(null)}>Cancel</Button>
                            <Button onClick={handleGenerateDescription} disabled={aiLoading}>
                                {aiLoading ? 'Generating...' : 'Generate'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceForm;
