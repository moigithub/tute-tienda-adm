'use client'
import { Plus } from 'lucide-react'
import { Heading } from '../../../../../components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { SizeColumn, columns } from './columns'
import { DataTable } from '@/components/data-table'
import { ApiList } from './api-list'

interface SizeClientProps {
  data: SizeColumn[]
}

export const SizeClient = ({ data }: SizeClientProps) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Sizes ${data.length}`} description='Manage sizes for ur store' />

        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading title='API' description='Sizes API' />
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  )
}
