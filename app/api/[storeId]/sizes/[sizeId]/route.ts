import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
  try {
    if (!params.sizeId) return new NextResponse('sizeId required', { status: 400 })

    const sizes = await db.size.findMany({
      where: { id: params.sizeId }
    })

    console.log('size get', sizes)
    return NextResponse.json(sizes)
  } catch (error) {
    console.log('size_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, value } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!name) return new NextResponse('Name required', { status: 400 })
    if (!value) return new NextResponse('value required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.sizeId) return new NextResponse('sizeId required', { status: 400 })

    // stores have many sizes
    // check if store exist before updating sizes
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const size = await db.size.updateMany({
      where: { id: params.sizeId },
      data: {
        name,
        value
      }
    })

    console.log('size patch', size)
    return NextResponse.json(size)
  } catch (error) {
    console.log('size_PATCH', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.sizeId) return new NextResponse('sizeId required', { status: 400 })

    // stores have many sizes
    // check if store exist before deleting sizes
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const size = await db.size.deleteMany({
      where: { id: params.sizeId }
    })

    console.log('size delete', size)
    return NextResponse.json(size)
  } catch (error) {
    console.log('size_DELETE', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
