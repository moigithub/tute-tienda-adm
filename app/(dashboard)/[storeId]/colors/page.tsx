import { db } from '@/lib/db'
import { ColorClient } from './_components/client'
import { ColorColumn } from './_components/columns'
import { format } from 'date-fns'

export default async function ColorsPage({ params }: { params: { storeId: string } }) {
  const colors = await db.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' }
  })

  const formattedColors: ColorColumn[] = colors.map(color => {
    return {
      id: color.id,
      name: color.name,
      value: color.value,
      createdAt: format(color.createdAt, 'MMMM do, yyyy')
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}
