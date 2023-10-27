import { db } from '@/lib/db'
import { SizeClient } from './_components/client'
import { SizeColumn } from './_components/columns'
import { format } from 'date-fns'

export default async function SizesPage({ params }: { params: { storeId: string } }) {
  const sizes = await db.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' }
  })

  const formattedSizes: SizeColumn[] = sizes.map(size => {
    return {
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: format(size.createdAt, 'MMMM do, yyyy')
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  )
}
