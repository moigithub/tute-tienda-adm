import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { label, imageUrl } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!label) return new NextResponse('label required', { status: 400 })
    //TODO: agregar un file uploader
    //if (!imageUrl) return new NextResponse('imageUrl required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    // stores have many billboards
    // check if store exist before creating billboards
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      }
    })

    console.log('billboard created', billboard)
    return NextResponse.json(billboard)
  } catch (error) {
    console.log('BILLBOARD_POST', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    const billboards = await db.billboard.findMany({
      where: { storeId: params.storeId }
    })

    console.log('billboards', billboards)
    return NextResponse.json(billboards)
  } catch (error) {
    console.log('BILLBOARD_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
