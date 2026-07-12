import { Link } from 'react-router-dom';
import {
  Users, Briefcase, FileText, BarChart3, Bell, Shield,
  CalendarDays, ArrowRight, Star, Check
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200" style={{ overflow: 'auto', height: '100%' }}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm">Z</div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">ZOLVEX</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
              style={{ backgroundColor: '#2563eb' }}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-current" />
            Enterprise Field Service Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
            Run your field operations <br className="hidden md:block" />
            <span className="text-blue-600">with precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            Manage leads, dispatch technicians, track jobs, and close invoices — all from a single, high-performance platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-base font-semibold text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#2563eb' }}
            >
              Access Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              Explore Features
            </a>
          </div>

          {/* Abstract UI Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white shadow-2xl p-2 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 h-[400px] md:h-[600px] flex overflow-hidden">
              {/* Fake Sidebar */}
              <div className="w-16 md:w-64 bg-slate-900 border-r border-slate-800 hidden sm:flex flex-col">
                <div className="h-14 border-b border-white/10 flex items-center px-4 gap-3">
                  <div className="h-6 w-6 bg-blue-600 rounded flex-shrink-0" />
                  <div className="h-4 w-20 bg-white/20 rounded hidden md:block" />
                </div>
                <div className="p-4 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-white/10 rounded flex-shrink-0" />
                      <div className={`h-3 bg-white/10 rounded hidden md:block ${i === 0 ? 'w-24' : i === 1 ? 'w-16' : 'w-20'}`} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 flex flex-col bg-slate-50">
                <div className="h-14 border-b border-slate-200 bg-white flex items-center px-6 gap-4">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="h-3 w-16 bg-slate-200 rounded mb-4" />
                        <div className="h-8 w-24 bg-slate-800 rounded mb-2" />
                        <div className="h-2 w-32 bg-slate-100 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col">
                     <div className="h-4 w-32 bg-slate-200 rounded mb-6" />
                     <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center">
                        <div className="h-8 w-8 bg-slate-100 rounded-full" />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="py-4 md:py-0">
              <p className="text-4xl font-extrabold text-slate-900 tracking-tight">10,000+</p>
              <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">Jobs Managed</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-4xl font-extrabold text-slate-900 tracking-tight">99.9%</p>
              <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">Uptime SLA</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-4xl font-extrabold text-slate-900 tracking-tight">&lt; 2s</p>
              <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">Avg. Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-4">Complete Platform</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Everything you need to scale</h3>
          <p className="text-lg text-slate-500 leading-relaxed">
            A cohesive suite of tools designed to eliminate manual data entry, optimize scheduling, and accelerate cash flow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Customer Management', desc: 'Centralize records, interaction history, and lead pipelines securely.' },
            { icon: Briefcase, title: 'Field Operations', desc: 'Dispatch technicians and track live job status from a single dashboard.' },
            { icon: CalendarDays, title: 'Smart Scheduling', desc: 'Intelligent booking engine with conflict detection and real-time views.' },
            { icon: FileText, title: 'Invoicing & Billing', desc: 'Auto-generate compliant invoices and track payments effortlessly.' },
            { icon: BarChart3, title: 'Rich Analytics', desc: 'Real-time financial dashboards and technician productivity metrics.' },
            { icon: Bell, title: 'Automated Alerts', desc: 'Set up WhatsApp and SMS notifications for job and payment reminders.' },
          ].map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-slate-900 py-32 text-white relative overflow-hidden">
        {/* Dark subtle grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-4">Enterprise Grade</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-6">Security you can trust.</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
              Your business data is protected by industry-standard encryption, strict role-based access controls, and a hardened cloud infrastructure.
            </p>
            <ul className="space-y-4">
              {[
                'Role-based access control (RBAC)',
                'JWT token authentication',
                'Encrypted credential storage',
                'Isolated tenant data architectures',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full" />
             <div className="relative p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <Shield className="h-16 w-16 text-blue-400 mb-6" />
                <h4 className="text-2xl font-bold mb-4">Access Controlled</h4>
                <p className="text-slate-400 leading-relaxed">
                  Every module and action is gated by precise role permissions. Super Admins, Finance Teams, Managers, and Technicians only see exactly what they need to see.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Ready to streamline your business?</h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Join the companies using Zolvex to manage their field operations efficiently and securely.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-lg font-semibold text-white px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#2563eb' }}
          >
            Go to Dashboard <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center font-bold text-white text-xs">Z</div>
            <span className="font-bold text-slate-900 tracking-tight">ZOLVEX CRM</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">&copy; {new Date().getFullYear()} Zolvex. Field Service Management Platform.</p>
        </div>
      </footer>
    </div>
  );
};
