export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Food {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
}

export interface Order {
  items: {
    food: string;
    title: string;
    price: number;
    qty: number;
  }[];
  address: string;
  phone: string;
  voucher?: {
    code: string;
    discountPercent: number;
  } | null;
  paymentMethod: string;
}