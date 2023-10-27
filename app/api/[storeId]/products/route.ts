import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!name) return new NextResponse('name required', { status: 400 })
    if (!price) return new NextResponse('price required', { status: 400 })
    if (!categoryId) return new NextResponse('categoryId required', { status: 400 })
    if (!colorId) return new NextResponse('colorId required', { status: 400 })
    if (!sizeId) return new NextResponse('sizeId required', { status: 400 })

    //TODO: agregar un file uploader
    //if (!images||!images.length) return new NextResponse('imageUrl required', { status: 400 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    // stores have many products
    // check if store exist before creating products
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const product = await db.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)]
          }
        },
        isFeatured,
        isArchived,
        storeId: params.storeId
      }
    })

    console.log('product created', product)
    return NextResponse.json(product)
  } catch (error) {
    console.log('PRODUCT_POST', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('products', products)
    return NextResponse.json(products)
  } catch (error) {
    console.log('PRODUCT_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
