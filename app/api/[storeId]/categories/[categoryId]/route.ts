import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
  try {
    if (!params.categoryId) return new NextResponse('categoryId required', { status: 400 })

    const category = await db.category.findUnique({
      where: { id: params.categoryId },
      include: {
        billboard: true
      }
    })

    console.log('category get', category)
    return NextResponse.json(category)
  } catch (error) {
    console.log('CATEGORY_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, billboardId } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!name) return new NextResponse('name required', { status: 400 })
    if (!billboardId) return new NextResponse('billboardId required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.categoryId) return new NextResponse('categoryId required', { status: 400 })

    // stores have many billboards
    // check if store exist before updating billboards
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const category = await db.category.updateMany({
      where: { id: params.categoryId },
      data: {
        name,
        billboardId
      }
    })

    console.log('category patch', category)
    return NextResponse.json(category)
  } catch (error) {
    console.log('CATEGORY_PATCH', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.categoryId) return new NextResponse('categoryId required', { status: 400 })

    // stores have many billboards
    // check if store exist before deleting billboards
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const category = await db.category.deleteMany({
      where: { id: params.categoryId }
    })

    console.log('category delete', category)
    return NextResponse.json(category)
  } catch (error) {
    console.log('CATEGORY_DELETE', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
