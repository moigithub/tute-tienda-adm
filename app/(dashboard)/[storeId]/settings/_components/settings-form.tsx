'use client'

import { Heading } from '@/components/heading'
import { AlertModal } from '@/components/modals/alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'
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
import { useOrigin } from '@/hooks/use-origin'
import { useStoreModal } from '@/hooks/use-store-modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1)
})

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const origin = useOrigin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values', values)
    try {
      setLoading(true)
      const response = await axios.patch(`/api/stores/${params.storeId}`, values)
      console.log('data', response.data)

      // window.location.assign(`/${response.data.id}`)
      router.refresh()
      toast.success('store updated')
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
      const response = await axios.delete(`/api/stores/${params.storeId}`)
      console.log('data', response.data)
      router.refresh()
      router.push('/')
      toast.success('store deleted')
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
        <Heading title='Settings' description='Manage store preferences' />

        <Button
          variant='destructive'
          size='icon'
          onClick={() => {
            setOpen(true)
          }}
        >
          <Trash className='h-4 w-4' />
        </Button>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Store name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type='submit' className='ml-auto'>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert variant='public' title='API_URL' description={`${origin}/api/${params.storeId}`} />
    </>
  )
}
