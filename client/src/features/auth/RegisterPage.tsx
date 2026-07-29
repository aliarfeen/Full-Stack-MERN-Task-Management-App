import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router-dom';
import { registerSchema, RegisterInput } from '../../validation/auth.schema';
import { useAuth } from './useAuth';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, User as UserIcon, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const { register: registerAuth, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (data: RegisterInput) => {
    registerAuth(data);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Left Column: Branding / Marketing */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-indigo-700 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span>⚡ TaskFlow</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Create an account to join your team.
          </h2>
          <p className="mt-4 text-indigo-100 text-lg">
            Start organizing your tasks with automated priorities, roles, and project member controls.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Instant account creation & auto-login',
              'Create & manage unlimited projects',
              'Invite team members by email address',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-indigo-50">
                <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-indigo-200">
          © {new Date().getFullYear()} TaskFlow Architecture. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your details to get started
            </p>
          </div>

          {registerError && (
            <div className="p-3 text-sm rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              {registerError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<UserIcon className="w-4 h-4" />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" className="w-full" isLoading={isRegistering}>
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
