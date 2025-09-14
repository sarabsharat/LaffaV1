
import product1_image from './components/assets/Product1.jpg';
import product2_image from './components/assets/product2.jpg';
import product3_image from './components/assets/Front.png';

const products = [
  {
    id: 1,
    name: 'Vintage Headphones',
    category: 'electronics',
    categories: ['Audio', 'Accessories', 'Gadgets'],
    price: 100,
    image: product1_image,
    images: {
      'default': product1_image
    },
    colors: [],
    onSale: true,
    oldPrice: 140,
    description: 'High-quality vintage-style headphones for an immersive audio experience.'
  },
  {
    id: 2,
    name: 'Notebook — Ruled',
    category: 'stationery',
    categories: ['Stationery', 'Books', 'Office'],
    price: 20,
    image: product2_image,
    images: {
        'default': product2_image
    },
    colors: [],
    description: 'A classic ruled notebook for all your thoughts and ideas.'
  },
  {
    id: 3,
    name: 'Portable Speaker',
    category: 'electronics',
    categories: ['Audio', 'Gadgets', 'Outdoor'],
    price: 150,
    image: product3_image,
    images: {
        'default': product3_image
    },
    colors: [],
    description: 'Take your music anywhere with this powerful and portable speaker.'
  },
  {
    id: 4,
    name: 'Cozy Sweater',
    category: 'clothing',
    categories: ['Apparel', 'Fashion', 'Winter'],
    price: 50,
    image: 'https://i.imgur.com/p1eXWpX.png', 
    images: {
        'default': 'https://i.imgur.com/p1eXWpX.png'
    },
    colors: [],
    description: 'A warm and comfortable sweater, perfect for chilly days.'
  },
  {
    id: 5,
    name: 'Art Book',
    category: 'books',
    categories: ['Books', 'Art', 'Hobbies'],
    price: 30,
    image: 'https://i.imgur.com/5w2S2lT.png',
    images: {
        'default': 'https://i.imgur.com/5w2S2lT.png'
    },
    colors: [],
    description: 'A beautiful coffee table book showcasing contemporary art.'
  },
  {
    id: 6,
    name: 'Air Jordan 1 Retro High OG',
    subtitle: 'First in Flight',
    category: 'clothing',
    categories: ['Shoes', 'Fashion', 'Sports'],
    price: 120.00,
    description: "This iteration of the AJI reimagines Nike's first signature model with a fresh mix of colours. Premium materials, soft cushioning and a padded ankle collar offer total support and celebrate the shoe that started it all.",
    images: {
        'red': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes.png',
        'blue': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1505054a-8531-4d51-8653-955624388431/air-jordan-1-retro-high-og-shoes-z38f1h.png',
        'yellow': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e3c3b5b7-7b3b-4788-8869-34b9d146904c/air-jordan-1-retro-high-og-shoes.png'
    },
    colors: [
        { name: 'Chicago', hex: '#e63946', imageKey: 'red' },
        { name: 'UNC Toe', hex: '#264653', imageKey: 'blue' },
        { name: 'Taxi', hex: '#f4a261', imageKey: 'yellow' }
    ],
    sizes: [7, 8, 9, 10, 11]
  }
];

export default products;
