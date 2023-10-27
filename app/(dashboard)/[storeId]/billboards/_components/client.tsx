'use client'
import { Plus } from 'lucide-react'
import { Heading } from '../../../../../components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { BillboardColumn, columns } from './columns'
import { DataTable } from '@/components/data-table'
import { ApiList } from './api-list'

interface BillboardClientProps {
  data: BillboardColumn[]
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Billboards ${data.length}`} description='Manage billboards for ur store' />

        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey='label' />
      <Heading title='API' description='Billboards API' />
      <Separator />
      <ApiList entityName='billboards' entityIdName='billboardId' />
    </>
  )
}
