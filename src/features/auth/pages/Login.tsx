import { useState, useEffect } from 'react';
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

  // If already logged in, prevent accessing login page
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
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-7 w-7 bg-slate-800 border border-slate-700 rounded flex items-center justify-center font-bold text-white text-sm">Z</div>
          <div>
            <span className="font-bold text-white text-[15px] tracking-tight">ZOLVEX</span>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">CRM</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white leading-tight tracking-tight mb-4">
            Field Service<br />Management Platform
          </h1>
          <p className="text-slate-400 text-[14px] leading-relaxed mb-8">
            Manage customers, dispatch technicians, track jobs, and close invoices — all from one place.
          </p>
          <ul className="space-y-3.5">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-slate-300" />
                </div>
                <span className="text-slate-300 text-[13px]">{text}</span>
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
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="h-6 w-6 bg-slate-800 rounded flex items-center justify-center font-bold text-white text-xs">Z</div>
            <span className="font-bold text-slate-900 text-md">ZOLVEX CRM</span>
          </div>

          <div className="bg-white p-8 border border-[#E2E8F0] shadow-none rounded relative z-10">
            <Link to="/home" className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" title="Back to Home">
              <X className="h-4 w-4" />
            </Link>

            <div className="mb-6 pr-6">
              <h2 className="text-[20px] font-bold text-slate-900 tracking-tight leading-tight">Sign in to your account</h2>
              <p className="text-slate-500 text-[13px] mt-1">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 rotate-45 text-red-500" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[12px] font-bold text-slate-700">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="e.g. 9999999999"
                {...register('phone')}
                className={`h-8.5 rounded border-slate-300 bg-white focus-visible:ring-1 focus-visible:ring-slate-700 text-[13px] text-slate-900 px-3 transition-colors ${errors.phone ? 'border-red-400 focus-visible:ring-red-500' : ''}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[12px] font-bold text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`h-8.5 rounded border-slate-300 bg-white focus-visible:ring-1 focus-visible:ring-slate-700 text-[13px] text-slate-900 px-3 tracking-widest placeholder:tracking-widest transition-colors ${errors.password ? 'border-red-400 focus-visible:ring-red-500' : ''}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <Button
              className="w-full h-8.5 rounded bg-slate-900 hover:bg-slate-800 text-[13px] font-semibold text-white mt-4 transition-colors"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[12px] text-slate-400 font-medium">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

