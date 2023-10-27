'use client'
import { Plus } from 'lucide-react'
import { Heading } from '../../../../../components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { ProductColumn, columns } from './columns'
import { DataTable } from '@/components/data-table'
import { ApiList } from './api-list'

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient = ({ data }: ProductClientProps) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Products ${data.length}`} description='Manage products for ur store' />

        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading title='API' description='Products API' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}
