
export interface User {
    id: string;
    fullName: string;
    username: string;
    phoneNumber: string;
    passwordHash: string; // In a real app, never store plain text passwords
    credits: number;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Invoice {
    fromName: string;
    fromAddress: string;
    toName: string;
    toAddress: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    notes: string;
    tax: number;
    discount: number;
}

export interface CreditPackage {
    id: number;
    credits: number;
    priceGHS: number;
    priceCents: number; // For Paystack
    bgColor: string;
    textColor: string;
}

export interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: 'GHS';
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup(options: PaystackOptions): {
        openIframe: () => void;
      };
    };
  }
}
