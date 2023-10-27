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

    // stores have many colors
    // check if store exist before creating colors
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const color = await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    })

    console.log('color created', color)
    return NextResponse.json(color)
  } catch (error) {
    console.log('color_POST', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    const colors = await db.color.findMany({
      where: { storeId: params.storeId }
    })

    console.log('colors', colors)
    return NextResponse.json(colors)
  } catch (error) {
    console.log('color_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
