import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '../../../../lib/db'
import { SettingsForm } from './_components/settings-form'
import { ApiAlert } from '@/components/ui/api-alert'

interface SettingsProps {
  params: { storeId: string }
}

export default async function Settings({ params }: SettingsProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const store = await db.store.findFirst({ where: { id: params.storeId, userId } })
  if (!store) redirect('/')

  return (
    <div className='flex-col'>
      <div className='flex-1 space-x-2'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
