import { useState } from 'react';
import { customerIO, type NewsletterSignupData } from '@/integrations/customerio/client';

interface UseNewsletterSignupReturn {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export const useNewsletterSignup = (): UseNewsletterSignupReturn => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous state
    setError(null);
    setIsSuccess(false);
    
    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const signupData: NewsletterSignupData = {
        email: email.trim(),
        source: 'website_footer'
      };

      const result = await customerIO.signupForNewsletter(signupData);

      if (result.success) {
        setIsSuccess(true);
        setEmail(''); // Clear the form
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Newsletter signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setEmail('');
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  };

  return {
    email,
    setEmail,
    isLoading,
    isSuccess,
    error,
    handleSubmit,
    reset
  };
}; 