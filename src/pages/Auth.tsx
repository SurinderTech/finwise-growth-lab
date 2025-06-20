
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Loader2, Shield, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signUp, signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    full_name: '',
    general: ''
  });

  useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, redirecting to home...');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const validateForm = (isSignUp = false) => {
    const newErrors = {
      email: '',
      password: '',
      full_name: '',
      general: ''
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Full name validation for sign up
    if (isSignUp && !formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      full_name: ''
    });
    setErrors({
      email: '',
      password: '',
      full_name: '',
      general: ''
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      console.log('Attempting sign up with:', { 
        email: formData.email, 
        full_name: formData.full_name 
      });

      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.full_name
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Handle specific error types
        if (error.includes('rate limit') || error.includes('security purposes')) {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Too many sign-up attempts. Please wait a few minutes before trying again.' 
          }));
          toast.error('Please wait before trying again');
        } else if (error.includes('already registered')) {
          setErrors(prev => ({ 
            ...prev, 
            email: 'This email is already registered. Try signing in instead.' 
          }));
          setActiveTab('signin');
          toast.error('Email already registered');
        } else {
          setErrors(prev => ({ ...prev, general: error }));
          toast.error(error);
        }
      } else {
        console.log('Sign up successful');
        toast.success('Account created! Please check your email to verify your account.');
        resetForm();
        // Don't switch tabs automatically, let user check email
      }
    } catch (err: any) {
      console.error('Sign up exception:', err);
      const errorMessage = err?.message || 'An unexpected error occurred';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      console.log('Attempting sign in with:', { email: formData.email });

      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Sign in error:', error);
        
        if (error.includes('Invalid login credentials')) {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Invalid email or password. Please check your credentials.' 
          }));
          toast.error('Invalid credentials');
        } else if (error.includes('Email not confirmed')) {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Please check your email and click the confirmation link.' 
          }));
          toast.error('Please verify your email first');
        } else {
          setErrors(prev => ({ ...prev, general: error }));
          toast.error(error);
        }
      } else {
        console.log('Sign in successful');
        toast.success('Successfully signed in!');
        // Navigation will happen in useEffect when user state updates
      }
    } catch (err: any) {
      console.error('Sign in exception:', err);
      const errorMessage = err?.message || 'An unexpected error occurred';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <CardTitle className="text-2xl font-bold">Financial Warrior</CardTitle>
          </div>
          <p className="text-gray-600">Master your finances with gamified learning</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={isLoading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={isLoading}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                    disabled={isLoading}
                    className={errors.full_name ? 'border-red-500' : ''}
                  />
                  {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={isLoading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Learn</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Invest</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Protect</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
