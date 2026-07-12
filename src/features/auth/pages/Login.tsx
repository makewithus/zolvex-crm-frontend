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
import { CheckCircle2, Users, BarChart3, Wrench, ArrowLeft } from 'lucide-react';

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
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg">Z</div>
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
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">Z</div>
            <span className="font-bold text-slate-900 text-lg">ZOLVEX CRM</span>
          </div>

          <Link to="/home" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
            <p className="text-slate-500 text-sm mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 rotate-45 text-red-500" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="e.g. 9999999999"
                {...register('phone')}
                className={`h-10 bg-white border-slate-200 focus-visible:ring-blue-500 ${errors.phone ? 'border-red-400' : ''}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={`h-10 bg-white border-slate-200 focus-visible:ring-blue-500 ${errors.password ? 'border-red-400' : ''}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <Button
              className="w-full h-10 text-sm font-semibold mt-2"
              style={{ backgroundColor: '#2563eb' }}
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

          <p className="text-center text-xs text-slate-400 mt-8">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

