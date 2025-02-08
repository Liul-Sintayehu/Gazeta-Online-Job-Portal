'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LoadingButton from '@/components/helper/loading-buttons';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/helper/error-message';
import axios from 'axios';
import { tokenProvider } from '@/app/_services/tokenServices';
import { authUrl } from '@/app/_services/envService';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

// Change password form schema
const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: 'Old password must be at least 8 characters long' }),
    newPassword: z
      .string()
      .min(8, { message: 'New password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters long',
    }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Confirm password must match new password',
    path: ['confirmPassword'],
  });

export default function ChangePassword() {
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State for password visibility
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    setIsSubmitting(true);
    setSubmitError('');

    const { accessToken, idToken } = await tokenProvider();

    try {
      const response = await axios.post(
        `${authUrl}/api/v1/Password/ChangePassword`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-control-Allow-Origin': '*',
            clientClaim: 'Password-ChangePassword',
            accessToken: accessToken,
            idToken: idToken,
          },
        },
      );

      if (!response?.data?.IsError) {
        toast.success(
          response?.data?.message || 'Password Changed Successfully!',
        );
      } else {
        setSubmitError('Error occurred while changing password!');
      }
    } catch (error: any) {
      // Handle the error response properly
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Error occurred while changing password!';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="all-center min-h-screen">
      <Card className="w-full max-w-md font-inter">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4 text-2xl font-bold text-center text-gray-800">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitError && <ErrorMessage error={submitError} />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Old Password Field */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? 'text' : 'password'}
                          placeholder="Enter your old password"
                          className={`placeholder:text-gray-400 ${
                            form.formState.errors.oldPassword
                              ? 'border border-red-400'
                              : ''
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          className={`placeholder:text-gray-400 ${
                            form.formState.errors.newPassword
                              ? 'border border-red-400'
                              : ''
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          className={`placeholder:text-gray-400 ${
                            form.formState.errors.confirmPassword
                              ? 'border border-red-400'
                              : ''
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <LoadingButton pending={isSubmitting} label="Change Password" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
