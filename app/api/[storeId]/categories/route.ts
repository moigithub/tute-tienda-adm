import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, billboardId } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!name) return new NextResponse('name required', { status: 400 })
    if (!billboardId) return new NextResponse('billboardId required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    // stores have many billboards
    // check if store exist before creating billboards
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    })

    console.log('billboard created', category)
    return NextResponse.json(category)
  } catch (error) {
    console.log('CATEGORY_POST', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    const categories = await db.category.findMany({
      where: { storeId: params.storeId }
    })

    console.log('categories', categories)
    return NextResponse.json(categories)
  } catch (error) {
    console.log('CATEGORY_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
