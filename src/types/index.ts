export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  sku: string;
  images: string[];
  fragrance_notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  longevity: string;
  projection: string;
  is_featured: boolean;
  category?: Category;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: number | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  payment_status: 'unpaid' | 'paid';
  shipping_details: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  created_at: string;
  items: OrderItem[];
}
