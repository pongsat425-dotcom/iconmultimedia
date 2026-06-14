import Link from 'next/link';
import { CATEGORY_LIST } from '@/lib/mock-data';
import { Laptop, Monitor, Cpu, HardDrive, Printer, Layers, Tv, Zap, Wind, Keyboard, Headphones, Wifi, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  laptops: Laptop,
  desktops: Monitor,
  components: Cpu,
  'external-devices': HardDrive,
  printers: Printer,
  mainboard: Layers,
  ram: Cpu,
  storage: HardDrive,
  gpu: Tv,
  'power-supply': Zap,
  cooling: Wind,
  monitor: Monitor,
  keyboard: Keyboard,
  headset: Headphones,
  router: Wifi,
};

const CATEGORY_COLORS: Record<string, string> = {
  laptops: 'bg-gradient-to-tr from-blue-600 to-sky-400',
  desktops: 'bg-gradient-to-tr from-emerald-600 to-teal-400',
  components: 'bg-gradient-to-tr from-purple-600 to-pink-400',
  'external-devices': 'bg-gradient-to-tr from-rose-600 to-orange-400',
  printers: 'bg-gradient-to-tr from-cyan-600 to-indigo-400',
  mainboard: 'bg-gradient-to-tr from-indigo-600 to-purple-400',
  ram: 'bg-gradient-to-tr from-teal-600 to-emerald-400',
  storage: 'bg-gradient-to-tr from-slate-600 to-slate-400',
  gpu: 'bg-gradient-to-tr from-orange-600 to-amber-400',
  'power-supply': 'bg-gradient-to-tr from-yellow-500 to-orange-450',
  cooling: 'bg-gradient-to-tr from-sky-600 to-cyan-400',
  monitor: 'bg-gradient-to-tr from-emerald-700 to-teal-500',
  keyboard: 'bg-gradient-to-tr from-pink-600 to-rose-400',
  headset: 'bg-gradient-to-tr from-violet-600 to-purple-400',
  router: 'bg-gradient-to-tr from-red-600 to-rose-450',
};

export default function CategoryGrid() {
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          Shop by Category
        </h2>
        <Link 
          href="/shop" 
          className="text-primary hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm md:text-base flex items-center gap-1.5 transition-colors group"
        >
          <span>ดูสินค้าทั้งหมด</span>
          <ArrowRight className="h-4 w-4 md:h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {CATEGORY_LIST.filter(c => ['laptops', 'desktops', 'components', 'external-devices', 'printers'].includes(c.slug)).map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] || Cpu;
          const colorClass = CATEGORY_COLORS[category.slug] || 'bg-slate-500';
          
          return (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg hover:border-primary/35 hover:-translate-y-1 transition-all duration-300 glow-card"
            >
              <div className={`w-16 h-16 rounded-full ${colorClass} text-white flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-md`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-center group-hover:text-primary transition-colors text-sm md:text-base">
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
