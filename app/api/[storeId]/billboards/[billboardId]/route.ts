import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
  try {
    if (!params.billboardId) return new NextResponse('billboardId required', { status: 400 })

    const billboards = await db.billboard.findUnique({
      where: { id: params.billboardId }
    })

    console.log('billboard get', billboards)
    return NextResponse.json(billboards)
  } catch (error) {
    console.log('BILLBOARD_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { label, imageUrl } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!label) return new NextResponse('Name required', { status: 400 })
    // if (!imageUrl) return new NextResponse('imageUrl required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.billboardId) return new NextResponse('billboardId required', { status: 400 })

    // stores have many billboards
    // check if store exist before updating billboards
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const store = await db.billboard.updateMany({
      where: { id: params.billboardId },
      data: {
        label,
        imageUrl
      }
    })

    console.log('billboard patch', store)
    return NextResponse.json(store)
  } catch (error) {
    console.log('BILLBOARD_PATCH', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.billboardId) return new NextResponse('billboardId required', { status: 400 })

    // stores have many billboards
    // check if store exist before deleting billboards
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const billboard = await db.billboard.deleteMany({
      where: { id: params.billboardId }
    })

    console.log('billboard delete', billboard)
    return NextResponse.json(billboard)
  } catch (error) {
    console.log('BILLBOARD_DELETE', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
