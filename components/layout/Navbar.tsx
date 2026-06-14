'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronDown, X, LogOut, Settings, Heart } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';
import { useCart } from '@/lib/cart/cart-context';
import { useFavorites } from '@/lib/favorites/favorites-context';
import { CATEGORY_LIST } from '@/lib/mock-data';
import { getLogoSettings } from '@/app/actions/settings';

export default function Navbar() {
  const { user, role, loading, signOut } = useAuth();
  const { state: cartState } = useCart();
  const { items: favoriteItems } = useFavorites();
  const favoriteCount = favoriteItems.length;
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoSrc, setLogoSrc] = useState('/logo.png');
  const [logoWidth, setLogoWidth] = useState(160);
  const [logoHeight, setLogoHeight] = useState(40);

  useEffect(() => {
    // Avoid hydration mismatch by initializing client-side
    const supabaseUrl = `https://lpurpvlrcmzwkdmojahy.supabase.co/storage/v1/object/public/product-images/logo.png?t=${Date.now()}`;
    setLogoSrc(supabaseUrl);

    const loadLogoSize = async () => {
      const size = await getLogoSettings();
      setLogoWidth(size.width);
      setLogoHeight(size.height);
    };
    loadLogoSize();

    const handleLogoUpdate = () => {
      setLogoSrc(`https://lpurpvlrcmzwkdmojahy.supabase.co/storage/v1/object/public/product-images/logo.png?t=${Date.now()}`);
      loadLogoSize();
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('logo-updated', handleLogoUpdate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartCount = cartState.totalItems;

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:text-primary dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center py-1">
              <Image 
                src={logoSrc} 
                alt="Icon Multimedia Logo" 
                width={logoWidth} 
                height={logoHeight} 
                className="object-contain dark:brightness-110 transition-all duration-300"
                style={{ height: `${logoHeight}px`, width: `${logoWidth}px` }}
                priority
                unoptimized
                onError={() => {
                  if (logoSrc !== '/logo.png') {
                    setLogoSrc('/logo.png');
                  }
                }}
              />
            </Link>
          </div>

          {/* Desktop Search & Categories */}
          <div className="hidden flex-1 md:flex items-center gap-6 max-w-2xl px-4">
            <form onSubmit={handleSearch} className="relative flex-1 flex items-center">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-500" />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-350 dark:border-slate-700 rounded-l-xl leading-5 bg-slate-50 dark:bg-slate-950 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 sm:text-sm transition-all text-slate-900 dark:text-white" 
                placeholder="ค้นหาสินค้า แบรนด์ หรือหมวดหมู่..." 
              />
              <button type="submit" className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-2.5 rounded-r-xl text-xs font-bold transition-all shadow-md shadow-primary/10 select-none cursor-pointer">
                ค้นหา
              </button>
            </form>
            
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-bold text-slate-850 dark:text-slate-100 hover:text-primary transition-colors cursor-pointer select-none">
                หมวดหมู่สินค้า <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2.5 w-52 max-h-[400px] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                <div className="py-2 px-1">
                  {CATEGORY_LIST.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-3.5 py-2 text-xs font-bold rounded-lg text-slate-800 dark:text-slate-100 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/repairs" className="text-sm font-bold text-slate-850 dark:text-slate-100 hover:text-primary transition-colors">
              บริการซ่อม
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Desktop-only Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/contact" className="bg-primary text-white text-sm font-medium px-3.5 py-1.5 rounded-md hover:bg-primary-700 transition-colors shadow-sm" title="Contact Seller">
                ติดต่อ
              </Link>

              <Link href="/favorites" className="relative p-2 text-slate-600 hover:text-rose-500 dark:text-slate-300 transition-colors" title="รายการโปรด">
                <Heart className="h-6 w-6" />
                {favoriteCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-slate-600 hover:text-primary dark:text-slate-300 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full badge-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* Auth Section */}
              {loading ? (
                <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
              ) : user ? (
                /* Logged-in user menu */
                <div className="relative">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold text-slate-850 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-700"
                  >
                    <div className="w-7 h-7 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in z-50">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Settings className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <ShoppingCart className="h-4 w-4" />
                          My Orders
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                        <button 
                          onClick={signOut}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in */
                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="text-sm font-medium bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-700 transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile-only Actions */}
            <div className="flex sm:hidden items-center gap-3">
              <Link href="/contact" className="bg-primary text-white text-sm font-medium px-3.5 py-1.5 rounded-md hover:bg-primary-700 transition-colors shadow-sm" title="Contact Seller">
                ติดต่อ
              </Link>

              <Link href="/favorites" className="relative p-2 text-slate-600 hover:text-rose-500 dark:text-slate-300 transition-colors" title="รายการโปรด">
                <Heart className="h-6 w-6" />
                {favoriteCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-slate-600 hover:text-primary dark:text-slate-300 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full badge-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link href={user ? "/profile" : "/login"} className="p-2 text-slate-600 hover:text-primary dark:text-slate-300">
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
              placeholder="Search products..." 
            />
          </div>
        </form>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 pb-4 animate-fade-in">
            <nav className="py-2 space-y-1 max-h-[40vh] overflow-y-auto">
              {CATEGORY_LIST.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/repairs" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>บริการซ่อม</Link>
              <Link href="/contact" className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>ติดต่อผู้ขาย</Link>
            </nav>
            {!user && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2 px-4">
                <Link href="/login" className="flex-1 text-center text-sm font-medium text-slate-700 dark:text-slate-200 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/register" className="flex-1 text-center text-sm font-medium bg-primary text-white py-2 rounded-md hover:bg-primary-700" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
            {user && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 px-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                {role === 'admin' && (
                  <Link href="/admin" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <button 
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
        
      </div>
    </header>
  );
}
