import { db } from '@/lib/db'
import { OrderClient } from './_components/client'
import { OrderColumn } from './_components/columns'
import { format } from 'date-fns'
import { formatter } from '../products/page'

export default async function OrdersPage({ params }: { params: { storeId: string } }) {
  const orders = await db.order.findMany({
    where: { storeId: params.storeId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  const formattedOrders: OrderColumn[] = orders.map(item => {
    return {
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems.map(order => order.product.name).join(', '),
      totalPrice: formatter.format(
        item.orderItems.reduce((total, item) => total + Number(item.product.price), 0)
      ),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}
