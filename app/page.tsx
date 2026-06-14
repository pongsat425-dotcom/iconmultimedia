import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";
import TikTokShowcase from "@/components/home/TikTokShowcase";
import { getNewArrivals, getBestSellers, getHeroSlides, getProductsByCategory, getHomepageSettings } from "@/lib/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { CATEGORY_LIST } from "@/lib/mock-data";

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch base layout data (New Arrivals, Best Sellers, Slides, Tiktok videos, Section Banners, and Homepage Settings)
  const [
    newArrivals,
    bestSellers,
    slides,
    tiktokResult,
    bannersResult,
    settings,
  ] = await Promise.all([
    getNewArrivals(5),
    getBestSellers(5),
    getHeroSlides(),
    supabase
      .from('products')
      .select('id, name, description, image, specs')
      .eq('category', 'homepage_tiktok')
      .order('created_at', { ascending: true }),
    supabase
      .from('products')
      .select('id, name, description, image, specs')
      .eq('category', 'section_banner'),
    getHomepageSettings(),
  ]);

  // 2. Fetch products for all categories in parallel dynamically
  const categoryProducts = await Promise.all(
    CATEGORY_LIST.map(async (cat) => {
      const products = await getProductsByCategory(cat.slug, 5);
      return {
        category: cat,
        products,
      };
    })
  );

  const tiktokVideos = tiktokResult.data || [];
  const banners = bannersResult.data || [];
  
  // Map banners by section name (e.g. 'new-arrivals', 'gpu', etc.)
  const bannersMap = banners.reduce((acc: any, cur: any) => {
    acc[cur.name] = cur
    return acc
  }, {});

  // Helper to check if a banner is active
  const isBannerActive = (banner: any) => {
    if (!banner) return false;
    return banner.specs?.['Is Active'] !== false;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroBanner slides={slides} />
      <CategoryGrid />
      
      {settings.show_new_arrivals && (newArrivals.length > 0 || isBannerActive(bannersMap['new-arrivals'])) && (
        <ProductGrid 
          title="สินค้าใหม่ล่าสุด" 
          products={newArrivals} 
          viewAllLink="/shop?sort=newest" 
          banner={bannersMap['new-arrivals']}
        />
      )}
      
      {settings.show_best_sellers && (bestSellers.length > 0 || isBannerActive(bannersMap['best-sellers'])) && (
        <ProductGrid 
          title="สินค้าขายดี" 
          products={bestSellers} 
          viewAllLink="/shop?sort=bestselling" 
          banner={bannersMap['best-sellers']}
        />
      )}

      {/* Category Showcases */}
      {categoryProducts
        .filter(({ category, products }) => (products.length > 0 || isBannerActive(bannersMap[category.slug])) && settings.visible_categories.includes(category.slug))
        .map(({ category, products }) => (
          <ProductGrid 
            key={category.slug}
            title={category.name} 
            products={products} 
            viewAllLink={`/category/${category.slug}`} 
            banner={bannersMap[category.slug]}
          />
        ))}

      {/* Homepage TikTok Video Showcase */}
      <TikTokShowcase videos={tiktokVideos} />

      {(!settings.show_new_arrivals || (newArrivals.length === 0 && !isBannerActive(bannersMap['new-arrivals']))) && 
       (!settings.show_best_sellers || (bestSellers.length === 0 && !isBannerActive(bannersMap['best-sellers']))) && 
       categoryProducts.filter(({ category, products }) => (products.length > 0 || isBannerActive(bannersMap[category.slug])) && settings.visible_categories.includes(category.slug)).length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            ยังไม่มีส่วนข้อมูลที่จะแสดงผล เพิ่มสินค้าหรือเปิดใช้งานหมวดหมู่ที่ต้องการแสดงผลจากระบบผู้ดูแลระบบ (Admin Panel)
          </p>
        </div>
      )}
    </div>
  );
}

