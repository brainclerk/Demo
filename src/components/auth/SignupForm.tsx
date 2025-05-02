import React, { useState, ChangeEvent } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import SocialLoginButton from './SocialLoginButton';
import Divider from './Divider';
import Logo from '../UI/Logo';
import Badge from '../UI/Badge';
import { supabase } from '../../lib/supabase';

interface SignupFormProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSignupSuccess(true);
      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="mx-auto w-full max-w-md px-4">
        <div className="mb-4 flex flex-col items-center">
          <Logo />
          <div className="mt-2">
            <Badge color="purple">BETA</Badge>
          </div>
          <h1 className="mt-8 text-3xl font-bold text-gray-800">Check Your Email</h1>
          <div className="mt-4 rounded-md bg-green-50 p-4 text-center">
            <p className="text-sm text-green-800">
              We've sent a confirmation email to <strong>{email}</strong>
            </p>
            <p className="mt-2 text-sm text-green-800">
              Please check your inbox (and spam folder) and click the confirmation link to complete your registration.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="mt-6 inline-block text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="mb-4 flex flex-col items-center">
        <Logo />
        <div className="mt-2">
          <Badge color="purple">BETA</Badge>
        </div>
        <h1 className="mt-8 text-3xl font-bold text-gray-800">Create Account</h1>
        <p className="mt-2 text-gray-600">Join us and start your journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <SocialLoginButton provider="google" onClick={() => console.log('Google signup')} />
        <SocialLoginButton provider="facebook" onClick={() => console.log('Facebook signup')} />

        <Divider text="Or" />

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              showPasswordToggle
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;