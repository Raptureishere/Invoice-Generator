
import { CreditPackage } from './types';

export const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with your actual test key

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 1,
    credits: 50,
    priceGHS: 10,
    priceCents: 10 * 100,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    id: 2,
    credits: 150,
    priceGHS: 20,
    priceCents: 20 * 100,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    id: 3,
    credits: 300,
    priceGHS: 35,
    priceCents: 35 * 100,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  }
];
