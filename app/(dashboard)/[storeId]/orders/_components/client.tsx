'use client'
import { Heading } from '../../../../../components/heading'
import { Separator } from '@/components/ui/separator'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/data-table'

interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading title={`Orders ${data.length}`} description='Manage orders for ur store' />
      <Separator />
      <DataTable columns={columns} data={data} searchKey='products' />
    </>
  )
}
