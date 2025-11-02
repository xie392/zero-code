'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/common/logo'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export interface FormFieldConfig {
  name: string
  placeholder: string
  type?: 'text' | 'password' | 'email'
}

interface AuthFormProps<T extends z.ZodType<any, any, any>> {
  formSchema: T
  defaultValues: z.infer<T>
  fields: FormFieldConfig[]
  submitButtonText: string
  onSubmit: (values: z.infer<T>) => Promise<void>
  footerLink: {
    text: string
    linkText: string
    href: string
  }
}

export function AuthForm<T extends z.ZodType<any, any, any>>({
  formSchema,
  defaultValues,
  fields,
  submitButtonText,
  onSubmit,
  footerLink,
}: AuthFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  const params = useSearchParams()
  const redirectPath = useMemo(() => params.get('redirect') ?? '/', [params])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full shadow-md p-4 max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as any}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={field.placeholder}
                        type={field.type || 'text'}
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              className="w-full"
              type="submit"
              loading={form.formState.isSubmitting}
            >
              {submitButtonText}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {footerLink.text}
          <Link
            href={`${footerLink.href}?redirect=${redirectPath}`}
            className="text-blue-600 font-medium"
          >
            {footerLink.linkText}
          </Link>
        </p>
      </div>
    </div>
  )
}
