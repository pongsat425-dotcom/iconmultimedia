export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  inStock: boolean
  stock: number
  rating: number
  reviews: number
  specs?: Record<string, string>
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  shipping_address: ShippingAddress
  created_at: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'user'
  created_at: string
}

export interface HeroSlide {
  id: string
  title?: string
  subtitle?: string
  description?: string
  buttonText1?: string
  buttonLink1?: string
  buttonText2?: string
  buttonLink2?: string
  imageUrl: string
  orderIndex: number
  createdAt?: string
}

export interface ProductReview {
  id: string
  productId: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}


