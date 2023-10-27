import { UserButton, auth } from '@clerk/nextjs'
import { MainNav } from './main-nav'
import { StoreSwitcher } from './store-switcher'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ModeToggle } from './toggle-button'

export const Navbar = async () => {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const stores = await db.store.findMany({
    where: { userId }
  })

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher items={stores} />
        <MainNav className='mx-6' />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton afterSignOutUrl='/' />
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
