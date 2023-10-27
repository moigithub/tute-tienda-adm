'use client'

import { Heading } from '@/components/heading'
import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Color } from '@prisma/client'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

interface colorFormProps {
  initialData: Color | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be a valid hex code'
  })
})

export const ColorForm = ({ initialData }: colorFormProps) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })

  const title = initialData ? 'Edit color' : 'Create color'
  const description = initialData ? 'Edit a color.' : 'Add a new color'
  const toastMessage = initialData ? 'color updated.' : 'color created.'
  const action = initialData ? 'Save changes' : 'Create'

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values', values)
    try {
      setLoading(true)
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        )
        console.log('data', response.data)
      } else {
        const response = await axios.post(`/api/${params.storeId}/colors`, values)
        console.log('data', response.data)
      }

      router.refresh()
      toast.success(toastMessage)
      router.push(`/${params.storeId}/colors`)
    } catch (error) {
      console.log('error', error)
      toast.error('something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      const response = await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      console.log('data', response.data)
      router.refresh()
      router.push(`/${params.storeId}/colors`)

      toast.success('color deleted')
    } catch (error) {
      console.log('error', error)
      toast.error('something went wrong')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between p-4'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant='destructive'
            color='icon'
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>color name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='color name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-x-4'>
                      <Input disabled={loading} placeholder='color value' {...field} />
                      <div
                        className='border p-4 rounded-full'
                        style={{ backgroundColor: field.value }}
                      ></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type='submit' className='ml-auto'>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
