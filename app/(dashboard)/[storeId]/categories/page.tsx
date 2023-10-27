import { db } from '@/lib/db'
import { BillboardClient } from './_components/client'
import { format } from 'date-fns'
import { CategoryColumn } from './_components/columns'
import { Label } from '@/components/ui/label'

export default async function BillboardsPage({ params }: { params: { storeId: string } }) {
  const categories = await db.category.findMany({
    where: { storeId: params.storeId },
    include: { billboard: true },
    orderBy: { createdAt: 'desc' }
  })

  const formattedCategories: CategoryColumn[] = categories.map(category => {
    return {
      id: category.id,
      name: category.name,
      billboardLabel: category.billboard.label,
      createdAt: format(category.createdAt, 'MMMM do, yyyy')
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedCategories} />
      </div>
    </div>
  )
}
