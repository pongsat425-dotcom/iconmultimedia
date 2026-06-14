import { getAllProducts } from '@/lib/supabase/queries'
import { CATEGORY_LIST } from '@/lib/mock-data'
import ShopClient from './ShopClient'

export const metadata = {
  title: 'Shop All Products | Icon Multimedia',
  description: 'Browse our full catalog of laptops, desktops, CPUs, peripherals, and more.',
}

export default async function ShopPage() {
  const products = await getAllProducts()

  return <ShopClient products={products} categories={CATEGORY_LIST} />
}
