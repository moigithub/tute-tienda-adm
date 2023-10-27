'use client'
import { Store } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { useStoreModal } from '@/hooks/use-store-modal'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from './ui/command'
import { format } from 'path'

interface StoreSwitcherProps extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  items: Store[]
}

export const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const formattedItems = items.map(item => ({ label: item.name, value: item.id }))
  const currentStore = formattedItems.find(item => item.value === params.storeId)

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size='sm'
          role='combobox'
          aria-expanded={open}
          aria-label='Select a store'
          className={cn('w-[200px] justify-between')}
        >
          <StoreIcon className='mr-2 h-4 w-4' /> {currentStore?.label}
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandList>
            <CommandInput placeholder='search store...' />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map(store => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className='text-sm'
                >
                  <StoreIcon className='mr-2 h-4 w-4' />
                  {store.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === store.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}