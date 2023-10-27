import { db } from '@/lib/db'
import { ProductClient } from './_components/client'
import { ProductColumn } from './_components/columns'
import { format } from 'date-fns'

export const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default async function ProductsPage({ params }: { params: { storeId: string } }) {
  const products = await db.product.findMany({
    where: { storeId: params.storeId },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const formattedProducts: ProductColumn[] = products.map(item => {
    return {
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(item.price.toNumber()),
      category: item.category.name,
      size: item.size.name,
      color: item.color.value,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}
