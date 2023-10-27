'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-actions'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  color: string
  category: string
  isArchived: boolean
  isFeatured: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'name'
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived'
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured'
  },
  {
    accessorKey: 'price',
    header: 'price'
  },
  {
    accessorKey: 'category',
    header: 'category'
  },
  {
    accessorKey: 'size',
    header: 'size'
  },
  {
    accessorKey: 'color',
    header: 'color',
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        {row.original.color}
        <div
          className='h-6 w-6 rounded-full border'
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
