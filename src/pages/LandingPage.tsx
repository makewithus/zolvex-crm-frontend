import { Link } from 'react-router-dom';
import {
  Star, Shield, CheckCircle2, Building2,
  Users, Briefcase, FileText, BarChart3, Settings, Calendar,
  CreditCard, CheckSquare, Zap, Quote, Home, HeartHandshake, PhoneCall, PenTool
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100" style={{ overflow: 'auto', height: '100%' }}>
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-[#1E293B] rounded-lg flex items-center justify-center font-bold text-white text-sm">Z</div>
            <span className="font-extrabold text-slate-900 tracking-tight text-xl">ZOLVEX</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#modules" className="hover:text-slate-900 transition-colors">Modules</a>
            <a href="#solutions" className="hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-slate-900 transition-colors">Resources</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/login" className="text-[14px] font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center text-[14px] font-semibold text-white px-5 py-2.5 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] transition-all shadow-sm"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-24 pb-20 px-6 overflow-hidden bg-white relative">
        {/* Subtle background glow as seen in the new screenshot */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold mb-8 shadow-sm">
                <Star className="h-3.5 w-3.5 text-yellow-500" /> All-In-One CRM for Service Businesses
              </div>
              
              <h1 className="text-[48px] lg:text-[64px] font-extrabold text-[#1E293B] tracking-tight leading-[1.05] mb-6">
                Run Your Business. <br/>
                <span className="text-[#2563EB]">Delight Your Customers.</span>
              </h1>
              
              <p className="text-[18px] text-slate-500 mb-10 leading-relaxed pr-8">
                Zolvex CRM helps service businesses manage leads, bookings, jobs, customers, payments, and team operations — all in one powerful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-[16px] font-semibold text-white px-8 py-3.5 rounded-lg shadow-sm transition-colors bg-[#2563EB] hover:bg-blue-700"
                >
                  Request Demo &rarr;
                </Link>
                <a
                  href="#demo"
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-[16px] font-semibold text-slate-700 bg-white hover:bg-slate-50 px-8 py-3.5 rounded-lg border border-slate-200 transition-colors shadow-sm"
                >
                  Contact Sales
                </a>
              </div>

              <div className="flex flex-wrap md:flex-nowrap items-start gap-8">
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1E293B]">Secure & Reliable</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">Enterprise-grade security</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1E293B]">Easy to Use</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">Get started in minutes</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1E293B]">Built for Growth</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">Scale your operations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: UI Mockup */}
            <div className="relative w-full max-w-2xl mx-auto lg:ml-auto lg:mr-[-100px] z-10 mt-12 lg:mt-0">
               <div className="relative rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/60 bg-white p-2">
                 <img 
                   src="/crm_hero_dashboard.png" 
                   alt="Zolvex CRM Dashboard Mockup" 
                   className="w-full h-auto rounded-xl block"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY LOGOS */}
      <section className="py-10 bg-white border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <p className="text-[13px] font-medium text-slate-500 mb-8">Trusted by service businesses across India</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-70">
             <div className="flex items-center gap-2.5 text-[22px] font-bold text-slate-800 tracking-tight"><Home className="h-5 w-5 text-slate-400" /> HomeCare</div>
             <div className="flex items-center gap-2.5 text-[22px] font-bold text-slate-800 tracking-tight"><PenTool className="h-5 w-5 text-slate-400" /> QuickFix</div>
             <div className="flex items-center gap-2.5 text-[22px] font-bold text-slate-800 tracking-tight"><Shield className="h-5 w-5 text-slate-400" /> CleanPro</div>
             <div className="flex items-center gap-2.5 text-[22px] font-bold text-slate-800 tracking-tight"><Zap className="h-5 w-5 text-slate-400" /> TechServe</div>
             <div className="flex items-center gap-2.5 text-[22px] font-bold text-slate-800 tracking-tight"><Building2 className="h-5 w-5 text-slate-400" /> BrightHome</div>
             <div className="flex items-center gap-2.5 text-[22px] font-bold text-slate-800 tracking-tight"><Settings className="h-5 w-5 text-slate-400" /> FixItFast</div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="py-20 bg-[#F8FAFC]">
         <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-14">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold mb-6 shadow-sm">
                  <Star className="h-3 w-3 text-slate-400" /> Core Features
               </div>
               <h2 className="text-[36px] font-bold text-[#1E293B] tracking-tight leading-tight">
                 Everything You Need to Grow <br/> Your Service Business
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { icon: Users, title: 'Lead Management', desc: 'Capture, track & convert leads into loyal customers.' },
                 { icon: Briefcase, title: 'Job Management', desc: 'Assign jobs, track progress & manage your team.' },
                 { icon: HeartHandshake, title: 'Customer Management', desc: 'Keep all customer details organized in one place.' },
                 { icon: FileText, title: 'Invoicing & Payments', desc: 'Create invoices, send & get paid faster.' },
                 { icon: BarChart3, title: 'Reports & Analytics', desc: 'Make data-driven decisions with powerful insights.' },
                 { icon: Zap, title: 'Automations', desc: 'Automate reminders, follow-ups & business workflows.' }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-shadow">
                    <div className="h-10 w-10 rounded-md bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-sm">
                       <item.icon className="h-4 w-4 text-[#1E293B]" />
                    </div>
                    <h4 className="text-[18px] font-bold text-[#1E293B] mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-[16px] leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. STATS GRID */}
      <section className="px-6 py-12 bg-[#F8FAFC]">
         <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Building2, stat: '500+', label: 'Businesses' },
              { icon: CheckSquare, stat: '50K+', label: 'Jobs Done' },
              { icon: Users, stat: '100K+', label: 'Customers' },
              { icon: Shield, stat: '99.9%', label: 'Uptime' },
              { icon: PhoneCall, stat: '24/7', label: 'Support' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <s.icon className="h-5 w-5 text-slate-400 mb-3" />
                 <div className="text-[24px] font-bold text-[#1E293B]">{s.stat}</div>
                 <div className="text-[13px] text-slate-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* 6. CRM MODULES GRID (ICON ROW) */}
      <section className="py-20 bg-white border-y border-slate-200">
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold mb-6 shadow-sm">
               <Star className="h-3 w-3 text-slate-400" /> CRM Modules
            </div>
            <h2 className="text-[36px] font-bold text-[#1E293B] tracking-tight mb-14">All Your Operations, One Platform</h2>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
               {[
                 { i: Users, l: 'Leads' }, { i: HeartHandshake, l: 'Customers' }, { i: Calendar, l: 'Bookings' },
                 { i: Briefcase, l: 'Jobs' }, { i: Calendar, l: 'Calendar' }, { i: FileText, l: 'Invoices' },
                 { i: CreditCard, l: 'Payments' }, { i: BarChart3, l: 'Reports' }, { i: Users, l: 'Team' }, { i: Settings, l: 'Settings' }
               ].map((x, i) => (
                 <div key={i} className="flex flex-col items-center gap-2.5 min-w-[90px]">
                    <div className="h-14 w-14 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center hover:border-slate-300 transition-colors cursor-pointer">
                       <x.i className="h-5 w-5 text-[#1E293B]" />
                    </div>
                    <span className="text-[13px] font-medium text-slate-600">{x.l}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. SPLIT FEATURE & WORKER IMAGE */}
      <section className="py-20 bg-[#F8FAFC]">
         <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold mb-6 shadow-sm">
                  <Star className="h-3 w-3 text-slate-400" /> Why Choose Zolvex
               </div>
               <h3 className="text-[36px] font-bold text-[#1E293B] tracking-tight leading-[1.15] mb-10">
                  Built for Service Businesses. <br/> Designed for Growth.
               </h3>
               <div className="space-y-4 text-[16px] text-slate-600">
                  <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400" /> Easy to use and quick to implement</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400" /> Access your business from anywhere</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400" /> Secure data with role-based access</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400" /> Scalable as your business grows</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-slate-400" /> Dedicated support whenever you need</div>
               </div>
            </div>
            
            <div className="flex-1 w-full relative pl-0 lg:pl-10">
               {/* Worker Image with floating UI elements */}
               <div className="relative rounded-xl overflow-visible aspect-[4/3] lg:aspect-[5/4] shadow-none">
                  <div className="absolute inset-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                     <img src="/service_worker_tablet.png" alt="Service worker using tablet" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Floating Widget 1 */}
                  <div className="absolute top-12 -left-6 lg:-left-12 bg-white p-3.5 rounded-lg shadow-sm border border-slate-200 w-48 z-10">
                     <p className="text-[13px] text-slate-500 mb-1">Job Status</p>
                     <div className="flex items-center gap-2 text-[15px] font-bold text-[#1E293B]">
                        <div className="h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center"><CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" /></div>
                        Completed
                     </div>
                  </div>

                  {/* Floating Widget 2 */}
                  <div className="absolute bottom-16 -left-4 lg:-left-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200 w-44 z-10">
                     <p className="text-[13px] text-slate-500 mb-1">Customer Rating</p>
                     <div className="text-[24px] font-bold text-[#1E293B] mb-1">4.8/5</div>
                     <div className="flex gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current opacity-20 text-slate-300" />
                     </div>
                  </div>

                  {/* Floating Widget 3 */}
                  <div className="absolute bottom-8 -right-4 lg:-right-10 bg-white p-4 rounded-lg shadow-sm border border-slate-200 w-52 z-10">
                     <p className="text-[13px] text-slate-500 mb-1">Revenue Growth</p>
                     <div className="text-[20px] font-bold text-[#16A34A] mb-0.5">+15.8%</div>
                     <p className="text-[13px] text-slate-400 mb-3">This Month</p>
                     <div className="h-10 w-full relative">
                        <svg viewBox="0 0 100 30" className="w-full h-full stroke-slate-300 stroke-[2] fill-none stroke-linecap-round stroke-linejoin-round relative z-10">
                           <path d="M0,25 L15,22 L30,26 L45,15 L60,18 L75,8 L90,12 L100,4" />
                        </svg>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-white border-y border-slate-200">
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold mb-6 shadow-sm">
               <Star className="h-3 w-3 text-slate-400" /> Testimonials
            </div>
            <h2 className="text-[36px] font-bold text-[#1E293B] tracking-tight mb-14">Loved by Businesses Like Yours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               {[
                 { q: "Zolvex CRM has transformed the way we manage our field operations. Highly recommended!", name: "Ravi Sharma", role: "CEO, HomeCare Services", letter: "R" },
                 { q: "The automation and reports save us hours every day. Our team and customers are happier than ever.", name: "Priya Mehta", role: "Operations Head, CleanPro", letter: "P" },
                 { q: "Best CRM for service companies. Simple, powerful and affordable.", name: "Amit Verma", role: "Founder, QuickFix Solutions", letter: "A" }
               ].map((t, i) => (
                 <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative flex flex-col h-full">
                    <Quote className="absolute top-6 right-6 h-6 w-6 text-slate-200 fill-slate-50" />
                    <p className="text-[16px] text-slate-600 leading-relaxed mb-8 pr-4 flex-1">"{t.q}"</p>
                    <div className="flex items-center gap-3 mt-auto">
                       <div className="h-10 w-10 rounded-md bg-[#1E293B] flex items-center justify-center font-bold text-white shadow-sm">{t.letter}</div>
                       <div>
                          <div className="text-[16px] font-bold text-[#1E293B]">{t.name}</div>
                          <div className="text-[14px] text-slate-500">{t.role}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="py-16 bg-[#F8FAFC] px-6">
         <div className="max-w-[1200px] mx-auto bg-[#1E293B] rounded-xl p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-white shadow-sm">
            <div>
               <h2 className="text-[30px] font-bold tracking-tight mb-2">Ready to Grow Your Business?</h2>
               <p className="text-[15px] text-slate-400">Join hundreds of service businesses already using Zolvex CRM.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <Link to="/login" className="inline-flex justify-center items-center text-[15px] font-semibold text-[#1E293B] bg-white px-8 py-3.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                  Get Started Free
               </Link>
               <Link to="/login" className="inline-flex justify-center items-center text-[15px] font-semibold text-white border border-slate-600 bg-slate-800 px-8 py-3.5 rounded-lg hover:bg-slate-700 transition-colors">
                  Request Demo
               </Link>
            </div>
         </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-white py-16 border-t border-slate-200">
         <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
               <div className="flex items-center gap-2.5 mb-6">
                 <div className="h-8 w-8 bg-slate-900 rounded flex items-center justify-center font-bold text-white text-sm">Z</div>
                 <span className="font-extrabold text-slate-900 tracking-tight text-xl">ZOLVEX</span>
               </div>
               <p className="text-[13px] text-slate-500 font-medium mb-12">All-In-One CRM for Service Businesses</p>
               <p className="text-[12px] text-slate-400">&copy; {new Date().getFullYear()} Zolvex CRM. All rights reserved.</p>
            </div>
            <div>
               <h5 className="font-bold text-slate-900 text-[14px] mb-6">Product</h5>
               <ul className="space-y-4 text-[13px] text-slate-500 font-medium">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Modules</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Updates</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold text-slate-900 text-[14px] mb-6">Resources</h5>
               <ul className="space-y-4 text-[13px] text-slate-500 font-medium">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Guides</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">API Docs</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold text-slate-900 text-[14px] mb-6">Company</h5>
               <ul className="space-y-4 text-[13px] text-slate-500 font-medium">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
};
