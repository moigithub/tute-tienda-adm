'use client'
import { Plus } from 'lucide-react'
import { Heading } from '../../../../../components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { ColorColumn, columns } from './columns'
import { DataTable } from '@/components/data-table'
import { ApiList } from './api-list'

interface ColorClientProps {
  data: ColorColumn[]
}

export const ColorClient = ({ data }: ColorClientProps) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Colors ${data.length}`} description='Manage color for ur store' />

        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading title='API' description='Color API' />
      <Separator />
      <ApiList entityName='color' entityIdName='colorId' />
    </>
  )
}
