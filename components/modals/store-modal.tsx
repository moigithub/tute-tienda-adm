'use client'

import { Button } from '../ui/button'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Modal } from './modal'
import { useStoreModal } from '@/hooks/use-store-modal'

const formSchema = z.object({
  name: z.string().min(1)
})

export const StoreModal = () => {
  const storeModal = useStoreModal()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values', values)
    try {
      setLoading(true)
      const response = await axios.post('/api/stores', values)
      console.log('data', response.data)

      window.location.assign(`/${response.data.id}`)
    } catch (error) {
      console.log('error', error)
      toast.error('something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Create store'
      description='Add a new store'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <div className='space-y-2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder='E-commerce' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='pt-6 space-x-2 flex items-center justify-end'>
                  <Button disabled={loading} variant={'outline'} onClick={storeModal.onClose}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type='submit'>
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}
