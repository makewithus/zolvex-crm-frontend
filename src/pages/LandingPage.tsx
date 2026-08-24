import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star, Shield, CheckCircle2, Building2,
  Users, Briefcase, FileText, BarChart3, Settings, Calendar,
  CreditCard, CheckSquare, Zap, Quote, Home, HeartHandshake, PhoneCall, PenTool
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  // If already logged in, prevent accessing landing page
  useEffect(() => {
    const checkToken = () => {
      if (localStorage.getItem('token')) {
        navigate('/', { replace: true });
      }
    };
    checkToken();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) checkToken();
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100" style={{ overflow: 'auto', height: '100%' }}>
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 h-[48px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-slate-800 rounded flex items-center justify-center font-bold text-white text-xs">Z</div>
            <span className="font-bold text-slate-800 tracking-tight text-[15px]">ZOLVEX</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-500">
            <Link to="/login" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Modules</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Solutions</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Resources</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center text-[13px] font-medium text-white px-3 h-8 rounded bg-slate-900 hover:bg-slate-800"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-16 pb-16 lg:pt-24 lg:pb-24 flex items-center px-4 sm:px-6 bg-slate-50 relative border-b border-slate-200 justify-center text-center">
        <div className="max-w-[800px] mx-auto relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-200/60 border border-slate-300 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-6">
            <Star className="h-3 w-3 text-slate-500" /> All-In-One CRM for Service Businesses
          </div>
          
          <h1 className="text-3xl sm:text-[40px] lg:text-[48px] font-bold text-slate-900 tracking-tight leading-[1.2] mb-4">
            Run Your Business.<br/>
            <span className="text-slate-800">Delight Your Customers.</span>
          </h1>
          
          <p className="text-sm sm:text-[15px] text-slate-600 mb-8 leading-relaxed max-w-[600px]">
            Zolvex CRM helps service businesses manage leads, bookings, jobs, customers, payments, and team operations — all in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              to="/login"
              className="inline-flex justify-center items-center gap-2 text-[13px] font-medium text-white px-5 h-9 rounded bg-slate-900 hover:bg-slate-800"
            >
              Request Demo &rarr;
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center items-center gap-2 text-[13px] font-medium text-slate-700 bg-white hover:bg-slate-50 px-5 h-9 rounded border border-slate-300 shadow-none"
            >
              Contact Sales
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex gap-2 text-left">
              <Shield className="h-4.5 w-4.5 text-slate-500 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Secure & Reliable</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Enterprise-grade security</p>
              </div>
            </div>
            
            <div className="flex gap-2 text-left">
              <Zap className="h-4.5 w-4.5 text-slate-500 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Easy to Use</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Get started in minutes</p>
              </div>
            </div>

            <div className="flex gap-2 text-left">
              <BarChart3 className="h-4.5 w-4.5 text-slate-500 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Built for Growth</h4>
                <p className="text-[11px] text-[#64748B] mt-0.5">Scale your operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY LOGOS */}
      <section className="py-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">Trusted by service businesses across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
             <div className="flex items-center gap-2 text-[18px] font-bold text-slate-400 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default tracking-tight"><Home className="h-4.5 w-4.5" /> HomeCare</div>
             <div className="flex items-center gap-2 text-[18px] font-bold text-slate-400 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default tracking-tight"><PenTool className="h-4.5 w-4.5" /> QuickFix</div>
             <div className="flex items-center gap-2 text-[18px] font-bold text-slate-400 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default tracking-tight"><Shield className="h-4.5 w-4.5" /> CleanPro</div>
             <div className="flex items-center gap-2 text-[18px] font-bold text-slate-400 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default tracking-tight"><Zap className="h-4.5 w-4.5" /> TechServe</div>
             <div className="flex items-center gap-2 text-[18px] font-bold text-slate-400 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default tracking-tight"><Building2 className="h-4.5 w-4.5" /> BrightHome</div>
             <div className="flex items-center gap-2 text-[18px] font-bold text-slate-400 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default tracking-tight"><Settings className="h-4.5 w-4.5" /> FixItFast</div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="py-12 bg-white">
         <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-8">
               <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-4">
                  <Star className="h-3 w-3 text-slate-400" /> Core Features
               </div>
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                 Everything You Need to Grow Your Service Business
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { icon: Users, title: 'Lead Management', desc: 'Capture, track & convert leads into loyal customers.' },
                 { icon: Briefcase, title: 'Job Management', desc: 'Assign jobs, track progress & manage your team.' },
                 { icon: HeartHandshake, title: 'Customer Management', desc: 'Keep all customer details organized in one place.' },
                 { icon: FileText, title: 'Invoicing & Payments', desc: 'Create invoices, send & get paid faster.' },
                 { icon: BarChart3, title: 'Reports & Analytics', desc: 'Make data-driven decisions with powerful insights.' },
                 { icon: Zap, title: 'Automations', desc: 'Automate reminders, follow-ups & business workflows.' }
               ].map((item, i) => (
                 <div key={i} className="group bg-white p-5 rounded border border-slate-200 shadow-none transition-all duration-200 hover:border-slate-400 cursor-default">
                    <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center mb-4 text-slate-600">
                       <item.icon className="h-4.5 w-4.5" strokeWidth={2} />
                    </div>
                    <h4 className="text-[16px] font-bold text-slate-900 mb-1.5">{item.title}</h4>
                    <p className="text-slate-500 text-[13px] leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. STATS GRID */}
      <section className="px-6 py-8 bg-slate-50">
         <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: Building2, stat: '500+', label: 'Businesses' },
              { icon: CheckSquare, stat: '55K+', label: 'Jobs Done' },
              { icon: Users, stat: '100K+', label: 'Customers' },
              { icon: Shield, stat: '99.9%', label: 'Uptime' },
              { icon: PhoneCall, stat: '24/7', label: 'Support' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-4 rounded border border-slate-200 flex flex-col items-center justify-center text-center">
                 <s.icon className="h-4.5 w-4.5 text-slate-500 mb-2" />
                 <div className="text-[20px] font-bold text-slate-900">{s.stat}</div>
                 <div className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">{s.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* 6. CRM MODULES GRID (ICON ROW) */}
      <section className="py-20 bg-white border-y border-slate-200">
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-4">
               <Star className="h-3 w-3 text-slate-400" /> CRM Modules
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-12">All Your Operations, One Platform</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-6 md:gap-8 justify-items-center">
               {[
                 { i: Users, l: 'Leads' }, { i: HeartHandshake, l: 'Customers' }, { i: Calendar, l: 'Bookings' },
                 { i: Briefcase, l: 'Jobs' }, { i: Calendar, l: 'Calendar' }, { i: FileText, l: 'Invoices' },
                 { i: CreditCard, l: 'Payments' }, { i: BarChart3, l: 'Reports' }, { i: Users, l: 'Team' }, { i: Settings, l: 'Settings' }
               ].map((x, i) => (
                 <div key={i} className="group flex flex-col items-center gap-3 min-w-[100px]">
                    <div className="h-14 w-14 bg-white border border-slate-200 shadow-none rounded flex items-center justify-center transition-all duration-200 group-hover:border-slate-400 group-hover:shadow-sm cursor-pointer">
                       <x.i className="h-6 w-6 text-slate-800" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">{x.l}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. SPLIT FEATURE & WORKER IMAGE */}
      <section className="py-12 bg-slate-50">
         <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-[45%]">
               <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-4">
                  <Star className="h-3 w-3 text-slate-400" /> Why Choose Zolvex
               </div>
               <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                  Built for Service Businesses. Designed for Growth.
               </h3>
               <div className="space-y-4 text-[14px] text-slate-600">
                  <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-slate-700" strokeWidth={2} /> Easy to use and quick to implement</div>
                  <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-slate-700" strokeWidth={2} /> Access your business from anywhere</div>
                  <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-slate-700" strokeWidth={2} /> Secure data with role-based access</div>
                  <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-slate-700" strokeWidth={2} /> Scalable as your business grows</div>
                  <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-slate-700" strokeWidth={2} /> Dedicated support whenever you need</div>
               </div>
            </div>
            
            <div className="w-full lg:w-[55%] relative pl-0 lg:pl-8 mt-8 lg:mt-0">
               {/* Worker Image with floating UI elements */}
               <div className="relative rounded overflow-visible aspect-[4/3] lg:aspect-[5/4] shadow-none">
                  <div className="absolute inset-0 rounded overflow-hidden border border-slate-200 shadow-none bg-white">
                     <img src="/service_worker_tablet.png" alt="Service worker using tablet" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Floating Widget 1 */}
                  <div className="absolute top-8 -left-4 bg-white p-3 rounded border border-slate-200 w-40 z-10 shadow-none">
                     <p className="text-[11px] text-slate-500 mb-0.5">Job Status</p>
                     <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                        Completed
                     </div>
                  </div>

                  {/* Floating Widget 2 */}
                  <div className="absolute bottom-12 -left-4 bg-white p-3 rounded border border-slate-200 w-40 z-10 shadow-none">
                     <p className="text-[11px] text-slate-500 mb-0.5">Customer Rating</p>
                     <div className="text-[18px] font-bold text-slate-900 mb-0.5">4.8/5</div>
                     <div className="flex gap-0.5 text-slate-700">
                        <Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current opacity-20" />
                     </div>
                  </div>

                  {/* Floating Widget 3 */}
                  <div className="absolute bottom-6 -right-4 bg-white p-3 rounded border border-slate-200 w-44 z-10 shadow-none">
                     <p className="text-[11px] text-slate-500 mb-0.5">Revenue Growth</p>
                     <div className="text-[16px] font-bold text-slate-800 mb-0.5">+15.8%</div>
                     <p className="text-[11px] text-slate-400 mb-2">This Month</p>
                     <div className="h-8 w-full relative">
                        <svg viewBox="0 0 100 30" className="w-full h-full stroke-slate-400 stroke-[2] fill-none stroke-linecap-round stroke-linejoin-round relative z-10">
                           <path d="M0,25 L15,22 L30,26 L45,15 L60,18 L75,8 L90,12 L100,4" />
                        </svg>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-12 bg-white border-y border-slate-200">
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-4">
               <Star className="h-3 w-3 text-slate-400" /> Testimonials
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Loved by Businesses Like Yours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
               {[
                 { q: "Zolvex CRM has transformed the way we manage our field operations. Highly recommended!", name: "Ravi Sharma", role: "CEO, HomeCare Services", letter: "R" },
                 { q: "The automation and reports save us hours every day. Our team and customers are happier than ever.", name: "Priya Mehta", role: "Operations Head, CleanPro", letter: "P" },
                 { q: "Best CRM for service companies. Simple, powerful and affordable.", name: "Amit Verma", role: "Founder, QuickFix Solutions", letter: "A" }
               ].map((t, i) => (
                 <div key={i} className="bg-white p-5 rounded border border-slate-200 shadow-none relative flex flex-col h-full hover:border-slate-400 transition-all duration-200 cursor-default">
                    <Quote className="absolute top-4 right-4 h-5 w-5 text-slate-100 fill-slate-50" />
                    <div className="flex gap-0.5 text-slate-700 mb-3">
                       <Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" />
                    </div>
                    <p className="text-[14px] text-slate-600 leading-relaxed mb-6 pr-4 flex-1">"{t.q}"</p>
                    <div className="flex items-center gap-2.5 mt-auto">
                       <div className="h-8 w-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">{t.letter}</div>
                       <div>
                          <div className="text-[13px] font-bold text-slate-900">{t.name}</div>
                          <div className="text-[11px] text-slate-500">{t.role}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="py-12 bg-slate-50 px-6 border-b border-slate-200">
         <div className="max-w-[1200px] mx-auto bg-slate-900 rounded p-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-white shadow-none">
            <div>
               <h2 className="text-[24px] font-bold tracking-tight mb-1.5">Ready to Grow Your Business?</h2>
               <p className="text-[14px] text-slate-400">Join hundreds of service businesses already using Zolvex CRM.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
               <Link to="/login" className="inline-flex justify-center items-center text-[13px] font-semibold text-slate-950 bg-white hover:bg-slate-100 px-6 h-9 rounded transition-colors">
                  Get Started Free
               </Link>
               <Link to="/login" className="inline-flex justify-center items-center text-[13px] font-semibold text-white border border-slate-700 bg-transparent px-6 h-9 rounded hover:bg-slate-800 transition-colors">
                  Request Demo
               </Link>
            </div>
         </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-50 py-12">
         <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                 <div className="h-5 w-5 bg-slate-800 rounded flex items-center justify-center font-bold text-white text-xs">Z</div>
                 <span className="font-bold text-[#0F172A] tracking-tight text-md">ZOLVEX</span>
               </div>                <p className="text-[13px] text-slate-500 mb-8 max-w-[200px]">All-In-One CRM for Service Businesses.</p>
               <p className="text-[11px] text-slate-400">&copy; {new Date().getFullYear()} Zolvex CRM. All rights reserved.</p>
            </div>
            <div>
               <h5 className="font-bold text-slate-800 text-[13px] mb-4">Product</h5>
               <ul className="space-y-2 text-[12px] text-slate-500">
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Features</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Modules</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Pricing</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Updates</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold text-slate-800 text-[13px] mb-4">Resources</h5>
               <ul className="space-y-2 text-[12px] text-slate-500">
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Blog</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Guides</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Help Center</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">API Docs</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold text-slate-800 text-[13px] mb-4">Company</h5>
               <ul className="space-y-2 text-[12px] text-slate-500">
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">About Us</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Contact Us</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Careers</Link></li>
                  <li><Link to="/login" className="hover:text-slate-950 transition-colors">Privacy Policy</Link></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
};
