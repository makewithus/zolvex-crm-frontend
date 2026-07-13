import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AxiosError } from 'axios';
import { loginSchema, LoginFormData } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useAuth';
import { CheckCircle2, Users, BarChart3, Wrench, X } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMsg('');
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        setErrorMsg(error.response?.data?.message || 'Login failed. Please try again.');
      }
    });
  };

  const features = [
    { icon: Users, text: 'Customer & Lead Management' },
    { icon: Wrench, text: 'Field Operations & Job Dispatch' },
    { icon: BarChart3, text: 'Reports & Analytics' },
  ];

  return (
    <div className="h-full flex bg-[#F8FAFC]">
      {/* Left Panel — Brand */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between pt-16 pl-16 pr-12 pb-12 relative overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}
      >

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-none flex items-center justify-center font-bold text-white text-lg">Z</div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">ZOLVEX</span>
            <p className="text-[11px] text-slate-400 tracking-widest uppercase">CRM</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Field Service<br />Management Platform
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed mb-10">
            Manage customers, dispatch technicians, track jobs, and close invoices — all from one place.
          </p>
          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">&copy; {new Date().getFullYear()} Zolvex. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12" style={{ backgroundColor: '#FCFCFD' }}>
        <div className="w-full max-w-[480px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="h-9 w-9 bg-blue-600 rounded-none flex items-center justify-center font-bold text-white">Z</div>
            <span className="font-bold text-slate-900 text-lg">ZOLVEX CRM</span>
          </div>

          <div className="bg-white p-10 border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
            <Link to="/home" className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors" title="Back to Home">
              <X className="h-5 w-5" />
            </Link>

            <div className="mb-8 pr-8">
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Sign in to your account</h2>
              <p className="text-slate-500 text-[15px] mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 rotate-45 text-red-500" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[13px] font-semibold text-slate-700">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="e.g. 9999999999"
                {...register('phone')}
                className={`h-12 rounded-none border-transparent bg-[#F1F5F9] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] text-[15px] text-slate-900 px-4 transition-colors ${errors.phone ? 'border-red-400 focus-visible:ring-red-500' : ''}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`h-12 rounded-none border-transparent bg-[#F1F5F9] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] text-[15px] text-slate-900 px-4 tracking-widest placeholder:tracking-widest transition-colors ${errors.password ? 'border-red-400 focus-visible:ring-red-500' : ''}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <Button
              className="w-full h-12 rounded-none bg-[#2563EB] hover:bg-[#1D4ED8] text-[15px] font-bold tracking-wide text-white mt-6 transition-colors"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
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

