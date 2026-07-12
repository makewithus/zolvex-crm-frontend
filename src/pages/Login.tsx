import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Users, Wrench, BarChart3, X } from 'lucide-react';

export const Login = () => {
  return (
    <div className="min-h-screen flex font-sans selection:bg-blue-100">
      
      {/* Left Column - Branding */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#0F172A] p-12 text-white relative">

        {/* Brand Logo */}
        <div className="flex items-start gap-3 mb-auto relative z-10">
          <div className="h-10 w-10 bg-[#000000] rounded-none flex items-center justify-center font-bold text-white text-lg">Z</div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white tracking-tight text-xl leading-none mt-0.5">ZOLVEX</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">CRM</span>
          </div>
        </div>

        {/* Value Prop */}
        <div className="max-w-[480px] relative z-10">
          <h1 className="text-[40px] font-bold text-white leading-[1.15] tracking-tight mb-6">
            Field Service <br />
            Management Platform
          </h1>
          <p className="text-[16px] text-slate-300 leading-relaxed mb-10">
            Manage customers, dispatch technicians, track jobs, and close invoices — all from one place.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-none bg-[#1E293B] flex items-center justify-center text-[#3B82F6]">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-medium text-slate-200">Customer & Lead Management</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-none bg-[#1E293B] flex items-center justify-center text-[#3B82F6]">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-medium text-slate-200">Field Operations & Job Dispatch</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-none bg-[#1E293B] flex items-center justify-center text-[#3B82F6]">
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-medium text-slate-200">Reports & Analytics</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto relative z-10">
          <p className="text-[13px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Zolvex. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#F8FAFC] p-6 lg:p-12">
        <div className="w-full max-w-[460px]">
          
          <div className="bg-white p-10 border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
            <Link to="/home" className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors" title="Back to Home">
              <X className="h-5 w-5" />
            </Link>
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight mb-2 pr-8">Sign in to your account</h2>
            <p className="text-[15px] text-slate-500 mb-10">Enter your credentials to continue</p>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[13px] font-semibold text-slate-700">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="1234567890" 
                required 
                className="rounded-none border-transparent bg-[#EFF6FF] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] h-12 text-[15px] text-slate-900 px-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••" 
                required 
                className="rounded-none border-transparent bg-[#EFF6FF] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] h-12 text-[15px] text-slate-900 px-4 tracking-widest placeholder:tracking-widest"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-none bg-[#2563EB] hover:bg-[#1D4ED8] text-[15px] font-semibold text-white mt-4"
            >
              Sign In
            </Button>
          </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-slate-400 font-medium">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};
