import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const store = await db.store.findFirst({
    where: {
      userId
    }
  })

  if (store) return redirect(`/${store.id}`)

  return (
    <>
      <p>root</p>
      {children}
    </>
  )
}
