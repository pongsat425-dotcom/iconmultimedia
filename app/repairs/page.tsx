import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Wrench, Shield, Clock, Phone, AlertCircle, ArrowRight, Laptop, Monitor, Globe, MessageCircle } from 'lucide-react'
import RepairsClient from './RepairsClient'

export const metadata = {
  title: 'บริการซ่อมคอมพิวเตอร์และอุปกรณ์ไอที | Icon Multimedia',
  description: 'บริการซ่อมโน๊ตบุ๊ค คอมพิวเตอร์ประกอบ เครื่องพิมพ์ ปริ้นเตอร์ และอัพเกรดอุปกรณ์ไอที โดยช่างผู้เชี่ยวชาญ ประเมินราคาฟรี พร้อมรับประกันงานซ่อม',
}

const DEFAULT_REPAIR_SERVICES = [
  {
    id: 'rep_1',
    name: 'ตรวจเช็คและซ่อมบอร์ดโน๊ตบุ๊ค / MacBook',
    slug: 'notebook-motherboard-repair',
    description: 'ซ่อมแซมระบบไฟ ลายวงจร เปลี่ยนไอซี (IC) ชิปเซ็ต และอาการเปิดไม่ติด ไฟไม่เข้า สำหรับโน๊ตบุ๊คและ MacBook ทุกแบรนด์ โดยเครื่องมือทันสมัยและช่างชำนาญการ',
    price: 1500,
    original_price: 2500,
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=600&auto=format&fit=crop',
    specs: {
      'Device Type': 'Laptop',
      'Warranty': '90 วัน',
      'Repair Time': '1-3 วัน'
    }
  },
  {
    id: 'rep_2',
    name: 'เปลี่ยนแบตเตอรี่ MacBook Air / Pro',
    slug: 'macbook-battery-replacement',
    description: 'บริการเปลี่ยนแบตเตอรี่ MacBook ทุกรุ่น แก้ปัญหาแบตเตอรี่เสื่อม แบตเตอรี่บวม ชาร์จไฟไม่เข้า หรือเครื่องดับเองขณะใช้งาน พร้อมการทำความสะอาดพัดลมระบายความร้อนภายในฟรี',
    price: 2900,
    original_price: 3500,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    specs: {
      'Device Type': 'Laptop',
      'Warranty': '6 เดือน',
      'Repair Time': '1-2 ชั่วโมง'
    }
  },
  {
    id: 'rep_3',
    name: 'กู้ข้อมูล Hard Drive / SSD / Flash Drive',
    slug: 'data-recovery-service',
    description: 'บริการกู้คืนข้อมูลสำคัญ เอกสาร รูปภาพ จากอุปกรณ์จัดเก็บข้อมูลที่ชำรุด เสียหาย ตกกระแทก หรือเผลอลบข้อมูลไป ด้วยซอฟต์แวร์และฮาร์ดแวร์เฉพาะด้านความปลอดภัยสูง',
    price: 2000,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
    specs: {
      'Device Type': 'Desktop PC',
      'Warranty': 'รับประกันผลลัพธ์',
      'Repair Time': '2-5 วัน'
    }
  },
  {
    id: 'rep_4',
    name: 'ทำความสะอาดและเปลี่ยนซิลิโคนลดความร้อน PC / Notebook',
    slug: 'thermal-paste-cleaning',
    description: 'บริการแกะทำความสะอาดฝุ่นภายใน ปัดสิ่งสกปรก และเปลี่ยนซิลิโคนระบายความร้อนระดับพรีเมียม (Thermal Grizzly) ช่วยลดความร้อนสะสม ป้องกัน CPU/GPU ชำรุด และช่วยให้เครื่องทำงานเร็วขึ้น',
    price: 490,
    original_price: 800,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600&auto=format&fit=crop',
    specs: {
      'Device Type': 'Desktop PC',
      'Warranty': 'ทดสอบอุณหภูมิก่อนส่งมอบ',
      'Repair Time': '1 ชั่วโมง'
    }
  },
  {
    id: 'rep_5',
    name: 'ตรวจเช็คและซ่อมเครื่องพิมพ์ (Printer) ทุกอาการ',
    slug: 'printer-repair-service',
    description: 'บริการซ่อมเครื่องพิมพ์อิงค์เจ็ท เลเซอร์ มัลติฟังก์ชัน แก้อาการกระดาษติด ดึงกระดาษซ้อน ไฟกระพริบเตือน ซับหมึกเต็ม หัวพิมพ์อุดตัน หรือเปิดไม่ติด พร้อมทำความสะอาดหัวพิมพ์ฟรี',
    price: 690,
    original_price: 1200,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600&auto=format&fit=crop',
    specs: {
      'Device Type': 'Printer',
      'Warranty': '90 วัน',
      'Repair Time': '1-2 วัน'
    }
  }
]

export default async function RepairsPage() {
  const supabase = await createClient()

  // Fetch from supabase
  const { data: dbRepairs } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'repair')
    .order('created_at', { ascending: false })

  // Use DB data if available, otherwise fallback to our highly aesthetic default listings
  const services = dbRepairs && dbRepairs.length > 0 ? dbRepairs : DEFAULT_REPAIR_SERVICES

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      
      {/* Premium Hero Banner with Gradient & Blur effects */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900/80 to-slate-950"></div>
        
        {/* Subtle grid patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider animate-fade-in">
            <Wrench className="h-3.5 w-3.5" /> Icon Multimedia Service Center
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
            บริการซ่อมและอัปเกรดครบวงจร
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            ตรวจเช็คประเมินราคาฟรีโดยช่างผู้เชี่ยวชาญ ใช้อะไหล่คุณภาพสูงเกรดพรีเมียม รับประกันงานซ่อมนานสูงสุดถึง 6 เดือนเต็ม ซ่อมเสร็จเร็วและเป็นกันเอง
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2 bg-slate-800/40 px-4 py-2 rounded-xl backdrop-blur-xs border border-slate-700/30">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>มีประกันงานซ่อม</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 px-4 py-2 rounded-xl backdrop-blur-xs border border-slate-700/30">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>ตรวจเช็คฟรีด่วน</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 px-4 py-2 rounded-xl backdrop-blur-xs border border-slate-700/30">
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>ติดต่อสอบถาม 24 ชม.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Catalog (Client Component for search/tabs) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <RepairsClient initialServices={services} />
      </section>

      {/* Trust badges & FAQ callout */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 max-w-5xl">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              ขั้นตอนการส่งซ่อมที่แสนง่ายดาย
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm md:text-base">
              ไม่ต้องกังวลเรื่องราคาหรืออะไหล่ปนเปื้อน ทางร้านมีขั้นตอนการดำเนินงานที่โปร่งใส แจ้งสเปคและราคาก่อนลงมือซ่อมเสมอ
            </p>
            
            <div className="mt-8 space-y-4">
              {[
                { step: '1', title: 'นำเครื่องมาตรวจเช็ค หรือ ส่งทางพัสดุ', desc: 'ช่างจะทำการตรวจประเมินเบื้องต้นในทันที' },
                { step: '2', title: 'แจ้งรายละเอียดและราคาเสนอแนะ', desc: 'ลูกค้าตัดสินใจอนุมัติก่อนทำรายการ ไม่ซ่อมไม่มีค่าใช้จ่าย' },
                { step: '3', title: 'ดำเนินการซ่อมและทดสอบอย่างละเอียด', desc: 'ใช้อะไหล่เกรดแท้และเบิร์นเทสก่อนส่งมอบงาน' },
                { step: '4', title: 'รับเครื่องกลับ พร้อมใบรับประกัน', desc: 'มีรับประกันหลังงานซ่อมตามเงื่อนไขที่ตกลงกัน' }
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200/50 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-sm">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-950 dark:text-slate-250 text-sm">{s.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-900 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">ต้องการสอบถามอาการอื่นเพิ่มเติม?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              หากอุปกรณ์ไอทีของคุณมีอาการชำรุดนอกเหนือจากรายการด้านบน หรือต้องการให้จัดงบประกอบคอมพิวเตอร์ ทำการระบายความร้อนชุดน้ำปิด-เปิด ติดต่อสอบถามรายละเอียดกับทีมช่างของเราได้ตลอดเวลา
            </p>
            
            <div className="pt-2 flex flex-col gap-3">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 text-sm cursor-pointer"
              >
                <span>ติดต่อผ่านเว็บไซต์</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://line.me/ti/p/~icon0815971155" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold py-2.5 px-3 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40 text-xs transition-all text-center"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  <span>LINE: icon0815971155</span>
                </a>
                <a 
                  href="https://www.facebook.com/iconnakhon/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold py-2.5 px-3 rounded-xl border border-blue-200/50 dark:border-blue-900/40 text-xs transition-all text-center"
                >
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span>Facebook Page</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
