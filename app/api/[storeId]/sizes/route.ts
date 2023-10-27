import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, value } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!name) return new NextResponse('name required', { status: 400 })
    if (!value) return new NextResponse('value required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    // stores have many sizes
    // check if store exist before creating sizes
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const size = await db.size.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    })

    console.log('size created', size)
    return NextResponse.json(size)
  } catch (error) {
    console.log('size_POST', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    const sizes = await db.size.findMany({
      where: { storeId: params.storeId }
    })

    console.log('sizes', sizes)
    return NextResponse.json(sizes)
  } catch (error) {
    console.log('size_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
