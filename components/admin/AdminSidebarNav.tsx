'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  LogOut, 
  ArrowLeft, 
  Image as ImageIcon, 
  Settings, 
  Images, 
  Menu, 
  X,
  Wrench,
  Play,
  Layout,
  Sliders
} from 'lucide-react';

import { logout } from '@/app/actions/auth';

interface AdminSidebarNavProps {}

interface NavItem {
  name: string;
  nameTh: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavCategory {
  title: string;
  titleTh: string;
  items: NavItem[];
}

const navCategories: NavCategory[] = [
  {
    title: 'Overview',
    titleTh: 'ภาพรวมระบบ',
    items: [
      { name: 'Dashboard Overview', nameTh: 'แดชบอร์ดภาพรวม', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Store Management',
    titleTh: 'จัดการร้านค้า',
    items: [
      { name: 'Products', nameTh: 'จัดการสินค้า', href: '/admin/products', icon: Package },
      { name: 'Repairs', nameTh: 'จัดการงานซ่อม', href: '/admin/repairs', icon: Wrench },
      { name: 'Orders', nameTh: 'รายการคำสั่งซื้อ', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Customers', nameTh: 'รายชื่อลูกค้า', href: '/admin/users', icon: Users },
    ]
  },
  {
    title: 'Content & Settings',
    titleTh: 'การตั้งค่าและเนื้อหา',
    items: [
      { name: 'Hero Banner', nameTh: 'จัดการป้ายแบนเนอร์', href: '/admin/hero', icon: ImageIcon },
      { name: 'Media Gallery', nameTh: 'คลังรูปภาพและสื่อ', href: '/admin/media', icon: Images },
      { name: 'Logo Settings', nameTh: 'ตั้งค่าโลโก้ร้าน', href: '/admin/logo', icon: Settings },
      { name: 'TikTok Showcase', nameTh: 'วิดีโอแนะนำหน้าแรก', href: '/admin/tiktok', icon: Play },
      { name: 'Section Banners', nameTh: 'แบนเนอร์หมวดหมู่หน้าแรก', href: '/admin/section-banners', icon: Layout },
      { name: 'Homepage Sections', nameTh: 'จัดการหมวดหมู่หน้าแรก', href: '/admin/homepage-sections', icon: Sliders },
    ]
  }
];

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await logout();
    });
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/admin" className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2 select-none">
          <span className="text-emerald-600 dark:text-emerald-400">Icon</span> Admin
        </Link>
      </div>

      {/* Nav Categories */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-7">
        {navCategories.map((category) => (
          <div key={category.title} className="space-y-2">
            {/* Category Header */}
            <div className="px-3 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {category.title}
              </span>
              <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600 -mt-0.5">
                {category.titleTh}
              </span>
            </div>

            {/* Category Items */}
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = isLinkActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group relative ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {/* Active dynamic bar indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-emerald-600 dark:bg-emerald-500" />
                    )}
                    <Icon className={`h-5 w-5 transition-colors duration-200 ${
                      isActive 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-350'
                    }`} />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className={`text-[10px] font-normal -mt-0.5 ${
                        isActive ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.nameTh}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white transition-all duration-200 font-medium">
          <ArrowLeft className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Back to Store</span>
            <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 -mt-0.5">กลับไปยังหน้าร้าน</span>
          </div>
        </Link>
        <form onSubmit={handleLogout}>
          <button 
            type="submit" 
            disabled={isPending}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 font-medium disabled:opacity-50 select-none cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span>{isPending ? 'Signing out...' : 'Sign out'}</span>
              <span className="text-[10px] font-normal text-rose-400/80 dark:text-rose-450/80 -mt-0.5">ออกจากระบบ</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col hidden md:flex h-screen sticky top-0 shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Top Header */}
      <header className="h-16 md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 justify-between w-full shrink-0">
        <Link href="/admin" className="font-bold text-lg text-slate-900 dark:text-white select-none">
          <span className="text-emerald-600 dark:text-emerald-450">Icon</span> Admin
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Sheet */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full animate-slide-in-left shadow-2xl">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Nav content */}
            <div className="h-full pt-2">
              <NavContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
