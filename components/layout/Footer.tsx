'use client'

import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, MessageCircle, Video, ChevronUp, Clock, Shield, Truck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-350 pt-0 pb-8 mt-auto relative">
      {/* Premium gradient accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-60" />
      
      {/* Trust badges strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">สินค้าแท้ 100%</p>
                <p className="text-xs text-slate-400">รับประกันสินค้าทุกชิ้น</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">จัดส่งทั่วนครศรี</p>
                <p className="text-xs text-slate-400">ฟรีค่าส่งเมื่อซื้อครบ ฿2,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">บริการรวดเร็ว</p>
                <p className="text-xs text-slate-400">ตอบกลับภายใน 24 ชม.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-primary-500">Icon</span> Multimedia
            </h3>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              ศูนย์จำหน่ายคอมพิวเตอร์ โน้ตบุ๊ค อุปกรณ์ไอที พร้อมบริการซ่อมครบวงจร นครศรีธรรมราช สินค้าแท้ ราคาดี มีประกัน
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/iconnakhon/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110" title="Facebook Page">
                <Globe className="h-4 w-4" />
              </a>
              <a href="https://line.me/ti/p/~icon0815971155" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110" title="LINE">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@iconmultimedia?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-rose-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110" title="TikTok">
                <Video className="h-4 w-4" />
              </a>
            </div>
          </div>
 
          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">หมวดหมู่สินค้า</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/category/laptops" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">โน้ตบุ๊ค (Laptops)</Link></li>
              <li><Link href="/category/desktops" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">คอมพิวเตอร์ตั้งโต๊ะ (Desktops)</Link></li>
              <li><Link href="/category/components" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">ซีพียู (CPU)</Link></li>
              <li><Link href="/category/printers" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">เครื่องพิมพ์ (Printers)</Link></li>
              <li><Link href="/category/router" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">เราเตอร์ (Routers)</Link></li>
              <li><Link href="/shop" className="text-primary-400 hover:text-primary-300 transition-colors font-medium hover:translate-x-1 inline-block">ดูสินค้าทั้งหมด →</Link></li>
            </ul>
          </div>
 
          {/* Customer Service */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">บริการลูกค้า</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/contact" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">ติดต่อเรา</Link></li>
              <li><Link href="/repairs" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">บริการซ่อม</Link></li>
              <li><Link href="/orders" className="text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">ตรวจสอบคำสั่งซื้อ</Link></li>
              <li><span className="text-slate-500 cursor-default">นโยบายการคืนสินค้า</span></li>
              <li><span className="text-slate-500 cursor-default">ข้อมูลการรับประกัน</span></li>
            </ul>
          </div>
 
          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">ข้อมูลติดต่อ</h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                <a 
                  href="https://maps.app.goo.gl/HwGJ1R3Y4WVEHqcZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  82/50 ถ.บ่ออ่าง ต.คลัง<br/>อ.เมือง จ.นครศรีธรรมราช 80000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                <a href="tel:0815971155" className="hover:text-primary-400 transition-colors font-medium">081 597 1155</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                <a href="mailto:iconmu@gmail.com" className="hover:text-primary-400 transition-colors">iconmu@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-primary-500 shrink-0" />
                <a href="https://line.me/ti/p/~icon0815971155" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  LINE: icon0815971155
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary-500 shrink-0" />
                <span>เปิดบริการทุกวัน 10:00 - 20:00 น.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-center md:flex md:justify-between md:items-center md:text-left text-slate-500">
          <p>&copy; {new Date().getFullYear()} Icon Multimedia. สงวนลิขสิทธิ์ทุกประการ</p>
          
          <div className="mt-4 md:mt-0 flex items-center justify-center gap-4">
            <span className="text-slate-500 text-xs">นโยบายความเป็นส่วนตัว</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500 text-xs">ข้อกำหนดการใช้บริการ</span>
            
            {/* Back to Top */}
            <button 
              onClick={scrollToTop}
              className="ml-4 w-9 h-9 bg-slate-800 hover:bg-primary rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              aria-label="กลับขึ้นด้านบน"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
