'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

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
import { useState } from 'react';
import ErrorMessage from '@/components/helper/error-message';
import Image from 'next/image';
import { titleSchema } from "../utils/schemas";
import { Edit, Edit2 } from "lucide-react";


 
export default function EditPlanDialog(){
    const form = useForm<z.infer<typeof titleSchema>>({
        resolver: zodResolver(signInSchema),
        
      });
    const [isOpen, setisOpen] = useState(false)

    const onSubmit = async (values: z.infer<typeof titleSchema>) => {
         try {
          
        } catch (error: any) {
         }
      };
    return <Dialog open={isOpen} >
        <DialogTrigger asChild>
            <Edit2 onClick={()=>setisOpen(true)} size={15} color="blue"/>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Title</DialogTitle>
                <DialogDescription>Description</DialogDescription>
            </DialogHeader>
            <Card className="w-full max-w-md font-inter">
      
      <CardContent>
        {false && <ErrorMessage error={'globalError'} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      autoComplete="off"
                      className={`placeholder:text-gray-400 ${
                        form.formState.errors.title
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

            {/* <LoadingButton
              pending={form.formState.isSubmitting || redirecting}
              label="Sign In"
            /> */}
          </form>
           
        </Form>
      </CardContent>
    </Card>
           <DialogFooter>
            <Button onClick={()=>setisOpen(false)} variant={`secondary`}>Close</Button>
           </DialogFooter>
        </DialogContent>
    </Dialog>
}
