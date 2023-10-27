import { Navbar } from '@/components/navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  })

  if (!store) return redirect('/')

  return (
    <>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <Navbar />
        {children}
      </ThemeProvider>
    </>
  )
}
