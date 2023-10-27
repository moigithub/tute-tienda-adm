import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
  try {
    if (!params.colorId) return new NextResponse('colorId required', { status: 400 })

    const colors = await db.color.findMany({
      where: { id: params.colorId }
    })

    console.log('color get', colors)
    return NextResponse.json(colors)
  } catch (error) {
    console.log('color_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, value } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!name) return new NextResponse('Name required', { status: 400 })
    if (!value) return new NextResponse('value required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.colorId) return new NextResponse('colorId required', { status: 400 })

    // stores have many colors
    // check if store exist before updating colors
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const color = await db.color.updateMany({
      where: { id: params.colorId },
      data: {
        name,
        value
      }
    })

    console.log('color patch', color)
    return NextResponse.json(color)
  } catch (error) {
    console.log('color_PATCH', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.colorId) return new NextResponse('colorId required', { status: 400 })

    // stores have many colors
    // check if store exist before deleting colors
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const color = await db.color.deleteMany({
      where: { id: params.colorId }
    })

    console.log('color delete', color)
    return NextResponse.json(color)
  } catch (error) {
    console.log('color_DELETE', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
