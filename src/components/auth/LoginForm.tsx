import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import SocialLoginButton from './SocialLoginButton';
import Divider from './Divider';
import Logo from '../UI/Logo';
import Badge from '../UI/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const { login, signInWithGoogle, signInWithFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    }
  };

  const handleFacebookLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signInWithFacebook();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Facebook');
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setResendingEmail(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setEmailResent(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend confirmation email');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailResent(false);

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      
      // If the error is about email confirmation, show the resend button
      if (errorMessage.includes('confirm your email')) {
        setError(`${errorMessage} You can request a new confirmation email below.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="mb-4 flex flex-col items-center">
        <Logo />
        <div className="mt-2">
          <Badge text="BETA" className="bg-purple-500" />
        </div>
        <h1 className="mt-8 text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="mt-2 text-gray-600">Let's get you signed in securely.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="w-full space-y-3">
          <SocialLoginButton 
            provider="google" 
            onClick={handleGoogleLogin}
          />
          <SocialLoginButton 
            provider="facebook" 
            onClick={handleFacebookLogin}
          />
        </div>

        <Divider text="Or" />

        {error && (
          <div className="mb-4 rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-800">{error}</p>
            {error.includes('confirm your email') && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendingEmail || emailResent}
                className="mt-2 text-sm font-medium text-blue-800 hover:text-blue-900 disabled:opacity-50"
              >
                {resendingEmail ? 'Sending...' : emailResent ? 'Confirmation email sent!' : 'Resend confirmation email'}
              </button>
            )}
          </div>
        )}

        {emailResent && !error && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Confirmation email has been resent. Please check your inbox (and spam folder).
            </p>
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
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />
            <div className="mt-2 text-right">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                Forgot Your Password?
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" fullWidth disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Log in with Email'}
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;