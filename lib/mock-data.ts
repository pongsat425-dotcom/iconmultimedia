import { Product } from './types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'MacBook Pro 16-inch (M3 Max, 2026)',
    slug: 'macbook-pro-16-m3-max',
    description: 'The most powerful MacBook Pro ever. With the M3 Max chip, up to 128GB unified memory, and a stunning 16-inch Liquid Retina XDR display, this is the laptop for professionals who push the limits.',
    price: 129900,
    image: '/mock-laptop.jpg',
    category: 'laptops',
    inStock: true,
    stock: 12,
    rating: 4.9,
    reviews: 24,
    specs: { 'Processor': 'Apple M3 Max', 'RAM': '64GB Unified', 'Storage': '1TB SSD', 'Display': '16.2" Liquid Retina XDR', 'Battery': 'Up to 22 hours', 'Weight': '2.14 kg' }
  },
  {
    id: 'p2',
    name: 'ROG Strix GeForce RTX 5090 32GB GDDR7',
    slug: 'rog-strix-rtx-5090',
    description: 'Dominate the competition with the ROG Strix RTX 5090. Built for 4K gaming and content creation with 32GB of blazing-fast GDDR7 memory and advanced ray tracing.',
    price: 79900,
    originalPrice: 85900,
    image: '/mock-gpu.jpg',
    category: 'gpu',
    inStock: true,
    stock: 5,
    rating: 5.0,
    reviews: 8,
    specs: { 'GPU': 'NVIDIA RTX 5090', 'Memory': '32GB GDDR7', 'Boost Clock': '2.9 GHz', 'Cooling': 'Triple Fan', 'Power': '600W TDP', 'Ports': '3x DP 2.1, 1x HDMI 2.1' }
  },
  {
    id: 'p3',
    name: 'Samsung Odyssey OLED G9 49" Curved Gaming Monitor',
    slug: 'samsung-odyssey-oled-g9',
    description: 'Experience immersive ultra-wide gaming on this stunning 49-inch OLED curved display with 240Hz refresh rate and 0.03ms response time.',
    price: 49900,
    image: '/mock-monitor.jpg',
    category: 'monitor',
    inStock: false,
    stock: 0,
    rating: 4.8,
    reviews: 156,
    specs: { 'Panel': '49" OLED', 'Resolution': '5120x1440', 'Refresh Rate': '240Hz', 'Response Time': '0.03ms (GtG)', 'HDR': 'HDR10+ / True Black 400', 'Curvature': '1800R' }
  },
  {
    id: 'p4',
    name: 'Intel Core i9-15900K Desktop Processor',
    slug: 'intel-core-i9-15900k',
    description: 'Unleash peak performance with Intel\'s flagship desktop processor. 24 cores and 32 threads for ultimate multitasking and gaming prowess.',
    price: 24500,
    image: '/mock-cpu.jpg',
    category: 'components',
    inStock: true,
    stock: 30,
    rating: 4.7,
    reviews: 42,
    specs: { 'Cores/Threads': '24C / 32T', 'Base Clock': '3.2 GHz', 'Boost Clock': '6.2 GHz', 'Socket': 'LGA 1851', 'TDP': '125W', 'Cache': '36MB L3' }
  },
  {
    id: 'p5',
    name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    slug: 'keychron-q1-pro',
    description: 'A premium wireless custom mechanical keyboard with gasket mount, hot-swappable switches, and a solid aluminum CNC frame. Perfect for typing enthusiasts.',
    price: 6990,
    originalPrice: 7500,
    image: '/mock-kb.jpg',
    category: 'keyboard',
    inStock: true,
    stock: 45,
    rating: 4.6,
    reviews: 89,
    specs: { 'Layout': '75%', 'Switches': 'Gateron Jupiter Brown', 'Connection': 'Bluetooth 5.1 / USB-C', 'Battery': '4000mAh', 'Frame': 'CNC Aluminum', 'Hot-swap': 'Yes' }
  },
  {
    id: 'p6',
    name: 'ASUS ROG Rapture GT6 Wi-Fi 6 Router',
    slug: 'asus-rog-rapture-gt6',
    description: 'High-performance gaming mesh Wi-Fi system covering up to 5,800 sq. ft., with triple-level game acceleration and 2.5G WAN port.',
    price: 18900,
    image: '/mock-router.jpg',
    category: 'router',
    inStock: true,
    stock: 60,
    rating: 4.9,
    reviews: 1250,
    specs: { 'Standard': 'Wi-Fi 6 (802.11ax)', 'Speed': 'Up to 10000 Mbps', 'Bands': 'Tri-Band', 'Coverage': 'Up to 5,800 sq ft', 'Ports': '1x 2.5G WAN, 3x Gig LAN' }
  },
  {
    id: 'p7',
    name: 'WD Black SN850X 2TB NVMe SSD',
    slug: 'wd-black-sn850x-2tb',
    description: 'Blazing-fast PCIe Gen4 NVMe SSD with up to 7,300 MB/s sequential reads. Ideal for gaming, content creation, and heavy workloads.',
    price: 5490,
    originalPrice: 6290,
    image: '/mock-ssd.jpg',
    category: 'storage',
    inStock: true,
    stock: 80,
    rating: 4.8,
    reviews: 340,
    specs: { 'Capacity': '2TB', 'Interface': 'PCIe Gen4 x4 NVMe', 'Read Speed': '7,300 MB/s', 'Write Speed': '6,600 MB/s', 'Form Factor': 'M.2 2280', 'Endurance': '1200 TBW' }
  },
  {
    id: 'p8',
    name: 'ASUS TUF Gaming A15 (Ryzen 7, RTX 4060)',
    slug: 'asus-tuf-gaming-a15',
    description: 'A durable and powerful gaming laptop featuring AMD Ryzen 7 processor and NVIDIA RTX 4060 graphics for smooth 1080p gaming.',
    price: 35990,
    image: '/mock-laptop2.jpg',
    category: 'laptops',
    inStock: true,
    stock: 15,
    rating: 4.5,
    reviews: 112,
    specs: { 'Processor': 'AMD Ryzen 7 7735HS', 'GPU': 'NVIDIA RTX 4060 8GB', 'RAM': '16GB DDR5', 'Storage': '512GB NVMe SSD', 'Display': '15.6" FHD 144Hz', 'Battery': '90Wh' }
  },
  {
    id: 'p9',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz',
    slug: 'corsair-vengeance-rgb-ddr5',
    description: 'High-performance DDR5 memory with dynamic RGB lighting. Optimized for Intel and AMD platforms with tight timings and XMP 3.0 support.',
    price: 4290,
    image: '/mock-ram.jpg',
    category: 'ram',
    inStock: true,
    stock: 100,
    rating: 4.7,
    reviews: 215,
    specs: { 'Capacity': '32GB (2x16GB)', 'Speed': 'DDR5-6000', 'Timing': 'CL36-36-36-76', 'Voltage': '1.35V', 'RGB': 'Yes (iCUE)', 'XMP': '3.0' }
  },
  {
    id: 'p10',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation with exceptional sound quality. 30 hours battery life, ultra-comfortable design, and multipoint connection.',
    price: 12990,
    originalPrice: 14990,
    image: '/mock-hp.jpg',
    category: 'headset',
    inStock: true,
    stock: 25,
    rating: 4.8,
    reviews: 456,
    specs: { 'Driver': '30mm', 'ANC': 'Yes (Auto NC Optimizer)', 'Battery': '30 hours', 'Bluetooth': '5.3 / LDAC', 'Weight': '250g', 'Multipoint': 'Yes' }
  },
  {
    id: 'p11',
    name: 'iPad Pro 13-inch M4 (2026)',
    slug: 'ipad-pro-13-m4',
    description: 'The thinnest, most powerful iPad ever. With the M4 chip, stunning tandem OLED display, and Apple Pencil Pro support.',
    price: 49900,
    image: '/mock-tablet.jpg',
    category: 'external-devices',
    inStock: true,
    stock: 8,
    rating: 4.9,
    reviews: 67,
    specs: { 'Chip': 'Apple M4', 'Display': '13" Tandem OLED', 'Storage': '256GB', 'Connectivity': 'Wi-Fi 6E + 5G', 'Camera': '12MP Wide + LiDAR', 'Weight': '579g' }
  },
  {
    id: 'p12',
    name: 'HP LaserJet Pro MFP 4101fdw',
    slug: 'hp-laserjet-pro-4101fdw',
    description: 'Fast and efficient multifunction laser printer with auto-duplex printing, 50-sheet ADF, and wireless connectivity for small offices.',
    price: 16990,
    image: '/mock-printer.jpg',
    category: 'printers',
    inStock: true,
    stock: 10,
    rating: 4.4,
    reviews: 33,
    specs: { 'Type': 'Mono Laser MFP', 'Speed': '42 ppm', 'Duplex': 'Auto', 'Connectivity': 'Wi-Fi / Ethernet / USB', 'ADF': '50-sheet', 'Paper Tray': '250-sheet' }
  },
  {
    id: 'p13',
    name: 'Lian Li UNI Fan SL-INF 120 Triple Pack',
    slug: 'lian-li-uni-fan-sl-inf-120',
    description: 'High-performance RGB case fans with infinity mirror design and slide-in interlocking mechanism for clutter-free cable management.',
    price: 3690,
    image: '/mock-fans.jpg',
    category: 'cooling',
    inStock: true,
    stock: 18,
    rating: 4.6,
    reviews: 72,
    specs: { 'Fan Size': '120mm', 'Speed': '200 - 2,100 RPM', 'Airflow': '61.3 CFM', 'Noise Level': '29 dB(A)', 'RGB': 'Infinity Mirror' }
  },
  {
    id: 'p14',
    name: 'Samsung Galaxy S26 Ultra 512GB',
    slug: 'samsung-galaxy-s26-ultra',
    description: 'The ultimate Galaxy experience with S Pen, 200MP camera, and Snapdragon 8 Elite processor. Built for power users.',
    price: 49900,
    originalPrice: 52900,
    image: '/mock-phone.jpg',
    category: 'external-devices',
    inStock: true,
    stock: 20,
    rating: 4.7,
    reviews: 189,
    specs: { 'Processor': 'Snapdragon 8 Elite', 'Display': '6.9" AMOLED 120Hz', 'RAM': '16GB', 'Storage': '512GB', 'Camera': '200MP + 50MP + 12MP + 10MP', 'Battery': '5000mAh' }
  },
  {
    id: 'p15',
    name: 'Corsair RM1000x 1000W 80+ Gold PSU',
    slug: 'corsair-rm1000x',
    description: 'Reliable, quiet, and fully modular power supply with 80 PLUS Gold efficiency. Zero RPM fan mode for silent operation.',
    price: 7490,
    image: '/mock-psu.jpg',
    category: 'power-supply',
    inStock: true,
    stock: 35,
    rating: 4.8,
    reviews: 128,
    specs: { 'Wattage': '1000W', 'Efficiency': '80+ Gold', 'Modular': 'Fully Modular', 'Fan': '135mm Fluid Dynamic Bearing', 'Warranty': '10 Years', 'Protection': 'OVP/UVP/OCP/OPP/SCP' }
  },
]

export const CATEGORY_LIST = [
  { id: 'laptops', slug: 'laptops', name: 'Laptops', description: 'Notebooks and ultrabooks for work and play' },
  { id: 'desktops', slug: 'desktops', name: 'Desktops', description: 'Desktop PCs and monitors' },
  { id: 'components', slug: 'components', name: 'CPU', description: 'Central Processing Units (CPUs)' },
  { id: 'external-devices', slug: 'external-devices', name: 'External Devices', description: 'External drives, hubs, and portable storage' },
  { id: 'printers', slug: 'printers', name: 'Printers', description: 'Laser and inkjet printers' },
  { id: 'mainboard', slug: 'mainboard', name: 'Mainboard', description: 'Motherboards for Intel and AMD processors' },
  { id: 'ram', slug: 'ram', name: 'RAM', description: 'DDR4 and DDR5 memory modules' },
  { id: 'storage', slug: 'storage', name: 'Storage', description: 'SSDs, HDDs, and portable storage' },
  { id: 'gpu', slug: 'gpu', name: 'GPU', description: 'Graphics cards for gaming and rendering' },
  { id: 'power-supply', slug: 'power-supply', name: 'Power Supply', description: 'PSUs with certified efficiency' },
  { id: 'cooling', slug: 'cooling', name: 'Cooling', description: 'CPU coolers, fans, and liquid cooling systems' },
  { id: 'monitor', slug: 'monitor', name: 'Monitor', description: 'Gaming and professional displays' },
  { id: 'keyboard', slug: 'keyboard', name: 'Keyboard', description: 'Mechanical and office keyboards' },
  { id: 'headset', slug: 'headset', name: 'Headset', description: 'Gaming and wireless headsets' },
  { id: 'router', slug: 'router', name: 'Router', description: 'Wi-Fi routers and networking equipment' },
]

export const PROMOTIONS = [
  { title: 'Mega Sale 2026', description: 'Up to 15% off on selected GPUs, keyboards, and tech gear!', badge: 'HOT' },
  { title: 'Back to School', description: 'Special deals on laptops and tech gear for students.', badge: 'STUDENT' },
  { title: 'Free Shipping', description: 'Free shipping on all orders over ฿2,000 nationwide.', badge: 'FREE' },
]

// Helper functions
export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.id === id)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return MOCK_PRODUCTS.filter(p => p.category === categorySlug)
}

export function getDiscountedProducts(): Product[] {
  return MOCK_PRODUCTS.filter(p => p.originalPrice && p.originalPrice > p.price)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
}

export function getCategoryBySlug(slug: string) {
  return CATEGORY_LIST.find(c => c.slug === slug)
}
