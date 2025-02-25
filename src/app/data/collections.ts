import { Category, Product } from '../types';

export const categories: Category[] = [
  {
    id: 'traditional',
    name: 'Traditional Wear',
    description: 'Elegant traditional African attire with a modern twist'
  },
  {
    id: 'casual',
    name: 'Casual Wear',
    description: 'Comfortable, stylish everyday African-inspired clothing'
  },
  {
    id: 'formal',
    name: 'Formal Wear',
    description: 'Sophisticated formal wear blending African and modern designs'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with our African-inspired accessories'
  }
];

export const products: Product[] = [
  {
    id: 'c7ad2a1f-2044-451a-b509-b54b6ed684ed',
    name: 'Ankara Print Blazer',
    description: 'Modern cut blazer with traditional Ankara print',
    price: 25999,
    images: ['/images/products/placeholder.jpg'],
    category: 'formal',
    gender: 'male',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: 50,
    is_featured: false,
    is_new: true
  },
  {
    id: '6ba6d2a5-cf40-49c9-a211-b8b550507be1',
    name: 'Adire Maxi Dress',
    description: 'Flowing maxi dress with traditional Adire pattern',
    price: 18999,
    images: ['/images/products/placeholder.jpg'],
    category: 'traditional',
    gender: 'female',
    sizes: ['S', 'M', 'L'],
    stock_quantity: 30,
    is_featured: true,
    is_new: false
  },
  {
    id: 'c6d481ea-bfe1-4eb0-9e41-10a3a01b5dec',
    name: 'Modern Agbada Set',
    description: 'Contemporary take on the classic Agbada',
    price: 35999,
    images: ['/images/products/placeholder.jpg'],
    category: 'traditional',
    gender: 'male',
    sizes: ['M', 'L', 'XL'],
    stock_quantity: 20,
    is_featured: true,
    is_new: false
  },
  {
    id: 'c626fcae-3da2-4809-a9af-b27d8c0e594f',
    name: 'Ankara Pencil Skirt',
    description: 'Professional pencil skirt with Ankara details',
    price: 12999,
    images: ['/images/products/placeholder.jpg'],
    category: 'formal',
    gender: 'female',
    sizes: ['S', 'M', 'L'],
    stock_quantity: 40,
    is_featured: false,
    is_new: false
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'African Print T-Shirt',
    description: 'Casual t-shirt with modern African prints',
    price: 8999,
    images: ['/images/products/placeholder.jpg'],
    category: 'casual',
    gender: 'male',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: 100,
    is_featured: false,
    is_new: false
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    name: 'Beaded Necklace Set',
    description: 'Handcrafted beaded necklace with earrings',
    price: 15999,
    images: ['/images/products/placeholder.jpg'],
    category: 'accessories',
    gender: 'female',
    sizes: ['ONE_SIZE'],
    stock_quantity: 25,
    is_featured: false,
    is_new: false
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    name: 'Ankara Shorts',
    description: 'Comfortable shorts with Ankara pattern',
    price: 9999,
    images: ['/images/products/placeholder.jpg'],
    category: 'casual',
    gender: 'male',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: 75,
    is_featured: false,
    is_new: true
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    name: 'Traditional Head Wrap',
    description: 'Elegant head wrap in various patterns',
    price: 5999,
    images: ['/images/products/placeholder.jpg'],
    category: 'accessories',
    gender: 'female',
    sizes: ['ONE_SIZE'],
    stock_quantity: 60,
    is_featured: false,
    is_new: true
  }
]; 