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
import { signInSchema } from '@/lib/zod';
import LoadingButton from '@/components/helper/loading-buttons';
import { handleCredentialsSignin } from '@/app/_lib/auth/authActions';
import { useState } from 'react';
import ErrorMessage from '@/components/helper/error-message';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import crypto from 'crypto';
import { identityUrl, originUrl } from '@/app/_services/envService';

function generateFingerprint(): string {
  try {
    const { userAgent, platform, language, hardwareConcurrency } = navigator;
    const { width, height, colorDepth } = screen;

    const fingerprintString = [
      userAgent,
      platform,
      language,
      hardwareConcurrency,
      width,
      height,
      colorDepth,
    ].join('|');

    const hash = crypto
      .createHash('sha256')
      .update(fingerprintString)
      .digest('hex');
    return hash;
  } catch (error) {
    return '';
  }
}

export default function SignIn() {
  const [globalError, setGlobalError] = useState<string>('');
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const fingerprint = generateFingerprint();
    try {
      const result = await handleCredentialsSignin({
        ...values,
        fingerprint,
      });
      if (result?.message) {
        setGlobalError(result.message);
      } else {
        setRedirecting(true);
        router.push('/dashboard');
      }
    } catch (error: any) {
      setGlobalError('Something goes wrong, please try again!');
    }
  };

  return (
    <Card className="w-full max-w-md font-inter">
      <CardHeader>
        <CardTitle className="flex flex-col gap-4">
          <Image
            src="/images/ethiopian.png"
            alt="logo"
            width={400}
            height={300}
            className="w-40 mb-4 mx-auto block"
          />
          <div className="flex flex-col gap-2 font-poppins">
            <span className="text-xl text-center text-gray-800">
              Welcome Back To
            </span>
            <span className="text-3xl font-bold text-center text-green-700">
              SeMS
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {globalError && <ErrorMessage error={globalError} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      autoComplete="off"
                      className={`placeholder:text-gray-400 ${
                        form.formState.errors.username
                          ? 'border border-red-400'
                          : ''
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      className={`placeholder:text-gray-400 ${
                        form.formState.errors.password
                          ? 'border border-red-400'
                          : ''
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-fit accent-primary rounded-2xl text-primary focus:ring-green-600 border-gray-300"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm text-green-800 whitespace-nowrap"
              >
                Remember me
              </label>
            </div> */}

            <LoadingButton
              pending={form.formState.isSubmitting || redirecting}
              label="Sign In"
            />
          </form>
          <div className="my-4 text-sm flex justify-center items-center">
            <a
              className="text-green-600 hover:underline font-semibold"
              href={`${
                identityUrl || 'https://iam.ethiopianairlines.com'
              }/resetpassword?origin=${
                originUrl ? encodeURIComponent(originUrl) : ''
              }`}
            >
              Forgot your password?
            </a>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
