import { cn } from '../lib/utils';

import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
//import { cn } from "../../lib/utils";

// Schema for sign-in form validation
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Define the SignInForm component
const SignInForm = () => {
  const [signInError, setSignInError] = useState(null);
  const navigate = useNavigate();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      // Simulate an API call (replace with your actual backend call)
      // Example: const response = await axios.post('/api/auth/signin', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      // In a real app, you'd check the response here
      if (data.email && data.password) {
        // Successful sign-in:
        console.log('Sign In successful:', data);
        // Store token and redirect
        // localStorage.setItem('token', response.data.token);
        navigate('/'); // Redirect to home page
      } else {
        setSignInError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      // Handle errors from the API call
      setSignInError(error.message || 'An error occurred during sign in.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              {...register('email')}
              placeholder="Enter your email"
              className={cn(
                "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500",
                errors.email && "border-red-500 focus:ring-red-500" // Apply error class
              )}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              {...register('password')}
              placeholder="Enter your password"
              className={cn(
                "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500",
                errors.password && "border-red-500 focus:ring-red-500"  // Apply error class
              )}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Sign In Error Message */}
          {signInError && (
            <p className="text-red-500 text-sm mt-2">{signInError}</p>
          )}

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-colors duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

function SignInForm() { }

export default SignInForm;

