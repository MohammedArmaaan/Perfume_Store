import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Order } from '../types';

// Create an Axios instance with base URL for the Laravel API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// MOCK ADAPTER FOR SANDBOX PREVIEW
const mock = new MockAdapter(apiClient, { delayResponse: 500 });

// Mock Data - Categories
const mockCategories = [
  { id: 1, name: 'Men', slug: 'men', description: 'Masculine scents crafted for presence.', image: 'https://images.unsplash.com/photo-1611242956059-53e4c29e6b22?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Women', slug: 'women', description: 'Feminine scents of elegance and grace.', image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Unisex', slug: 'unisex', description: 'Universal blends for every aura.', image: 'https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?auto=format&fit=crop&q=80&w=800' }
];

const menImages = [
  'https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1611242956059-53e4c29e6b22?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
];
const womenImages = [
  'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
];
const unisexImages = [
  'https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
];

const generateProducts = () => {
  const products = [];
  let id = 1;

  const menNames = ['Oud Wood Intense', 'Leather Reserve', 'Midnight Musk', 'Cedar Noir', 'Vetiver Blanc', 'Ocean Breeze', 'Spiced Amber', 'Tuscan Leather', 'Smoked Vanilla', 'Urban Gentleman', 'Sandalwood Supreme', 'Black Pepper Blend'];
  const womenNames = ['Rose De Mai', 'Vanilla Bloom', 'Floral Whisper', 'Jasmine Noir', 'Peony Dream', 'Velvet Orchid', 'Silk Blossom', 'Golden Neroli', 'Midnight Rose', 'Cherry Blossom', 'White Iris', 'Amethyst Floral'];
  const unisexNames = ['Amber Glow', 'Citrus Splash', 'Santal Spice', 'Bergamot Woods', 'White Tea', 'Desert Rose', 'Himalayan Pine', 'Aqua Universalis', 'Matcha Reserve', 'Green Tea Extract', 'Velvet Woods', 'Oud Blanc'];

  menNames.forEach((name, index) => {
    const price = 120 + (index * 15);
    products.push({
      id: id++, category_id: 1, name, slug: name.toLowerCase().replace(/ /g, '-'),
      description: `A sophisticated blend highlighting the rich notes of ${name}.`,
      price, discount_price: index % 4 === 0 ? price * 0.8 : null, stock: 50, sku: `MEN-${id}`,
      images: [menImages[index % menImages.length]],
      fragrance_notes: { top: ['Bergamot', 'Pepper'], middle: ['Leather', 'Oud'], base: ['Amber', 'Musk'] },
      longevity: '8-10 Hours', projection: 'Strong', is_featured: index < 3, category: mockCategories[0]
    });
  });

  womenNames.forEach((name, index) => {
    const price = 110 + (index * 12);
    products.push({
      id: id++, category_id: 2, name, slug: name.toLowerCase().replace(/ /g, '-'),
      description: `An elegant and radiant fragrance, ${name} captures the essence of modern femininity.`,
      price, discount_price: index % 5 === 0 ? price * 0.85 : null, stock: 75, sku: `WMN-${id}`,
      images: [womenImages[index % womenImages.length]],
      fragrance_notes: { top: ['Citrus', 'Peach'], middle: ['Rose', 'Jasmine'], base: ['Vanilla', 'Sandalwood'] },
      longevity: '6-8 Hours', projection: 'Moderate', is_featured: index < 3, category: mockCategories[1]
    });
  });

  unisexNames.forEach((name, index) => {
    const price = 130 + (index * 10);
    products.push({
      id: id++, category_id: 3, name, slug: name.toLowerCase().replace(/ /g, '-'),
      description: `A harmonious balance of elements, ${name} is designed to be worn by anyone.`,
      price, discount_price: index % 6 === 0 ? price * 0.9 : null, stock: 60, sku: `UNI-${id}`,
      images: [unisexImages[index % unisexImages.length]],
      fragrance_notes: { top: ['Lemon', 'Mint'], middle: ['Green Tea', 'Cardamom'], base: ['Cedar', 'White Musk'] },
      longevity: '7-9 Hours', projection: 'Moderate to Strong', is_featured: index < 3, category: mockCategories[2]
    });
  });

  return products;
};

const mockProducts = generateProducts();

let mockOrders: Order[] = [
  {
    id: 'ORD_0982374',
    user_id: 1,
    total_amount: 345.00,
    status: 'shipped',
    payment_status: 'paid',
    shipping_details: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', address: '123 Luxury Ave', city: 'New York', zipCode: '10001', country: 'US' },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    items: [
      { id: 1, product_id: 1, quantity: 1, price: 120, product: mockProducts[0] },
      { id: 2, product_id: 2, quantity: 2, price: 112.5, product: mockProducts[1] }
    ]
  },
  {
    id: 'ORD_0982375',
    user_id: 1,
    total_amount: 150.00,
    status: 'processing',
    payment_status: 'paid',
    shipping_details: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', address: '123 Luxury Ave', city: 'New York', zipCode: '10001', country: 'US' },
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    items: [
      { id: 3, product_id: 15, quantity: 1, price: 150, product: mockProducts[14] }
    ]
  }
];

// Mock Routes
mock.onGet('/categories').reply(200, { data: mockCategories });

mock.onGet(/\/products\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!);
  const product = mockProducts.find(p => p.id === id);
  return product ? [200, { data: product }] : [404, { message: 'Not Found' }];
});

mock.onGet('/products').reply((config) => {
  let results = [...mockProducts];
  const params = config.params || {};
  
  if (params.category) {
    const cat = mockCategories.find(c => c.slug === params.category);
    if (cat) results = results.filter(p => p.category_id === cat.id);
  }
  if (params.search) {
    results = results.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
  }
  if (params.min_price) results = results.filter(p => p.price >= parseFloat(params.min_price));
  if (params.max_price) results = results.filter(p => p.price <= parseFloat(params.max_price));
  
  if (params.sort === 'price_asc') results.sort((a, b) => a.price - b.price);
  if (params.sort === 'price_desc') results.sort((a, b) => b.price - a.price);

  return [200, {
    data: results,
    meta: { current_page: 1, last_page: 1, total: results.length }
  }];
});

// User Orders
mock.onGet('/orders').reply(200, { data: mockOrders });
mock.onGet(/\/orders\/ORD_\d+/).reply((config) => {
  const id = config.url!.split('/').pop();
  const order = mockOrders.find(o => o.id === id);
  return order ? [200, { data: order }] : [404, { message: 'Not Found' }];
});

// Admin Orders
mock.onGet('/admin/orders').reply(200, { data: mockOrders });
mock.onPut(/\/admin\/orders\/ORD_\d+\/status/).reply((config) => {
  const id = config.url!.split('/')[3];
  const { status } = JSON.parse(config.data);
  const orderIndex = mockOrders.findIndex(o => o.id === id);
  if (orderIndex > -1) {
    mockOrders[orderIndex].status = status;
    return [200, { data: mockOrders[orderIndex], message: 'Status updated' }];
  }
  return [404, { message: 'Not Found' }];
});

// Admin Dashboard Stats
mock.onGet('/admin/stats').reply(200, {
  data: {
    total_revenue: mockOrders.reduce((sum, o) => sum + o.total_amount, 0),
    total_orders: mockOrders.length,
    total_products: mockProducts.length,
    total_customers: 124
  }
});

mock.onPost('/checkout').reply((config) => {
  const data = JSON.parse(config.data);
  const newOrder: Order = {
    id: 'ORD_' + Math.floor(1000000 + Math.random() * 9000000),
    user_id: 1,
    total_amount: data.amount,
    status: 'pending',
    payment_status: 'paid',
    shipping_details: data.shipping_details,
    created_at: new Date().toISOString(),
    items: data.cart_items.map((item: any, i: number) => ({
      id: Date.now() + i,
      product_id: item.product_id,
      quantity: item.quantity,
      price: mockProducts.find(p => p.id === item.product_id)?.price || 0,
      product: mockProducts.find(p => p.id === item.product_id)
    }))
  };
  mockOrders.unshift(newOrder);
  return [200, { success: true, order_id: newOrder.id, razorpay_order_id: 'order_' + Math.random().toString(36).substring(7) }];
});

mock.onPost('/cart').reply(200, { success: true });
mock.onPut(/\/cart\/\d+/).reply(200, { success: true });
mock.onDelete(/\/cart\/\d+/).reply(200, { success: true });

export default apiClient;
