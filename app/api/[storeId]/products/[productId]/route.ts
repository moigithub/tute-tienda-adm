import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) return new NextResponse('productId required', { status: 400 })

    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      }
    })

    console.log('product get', product)
    return NextResponse.json(product)
  } catch (error) {
    console.log('PRODUCT_GET', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
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
    //if (!images||!images.length) return new NextResponse('imageUrl required', { status: 400 })

    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.productId) return new NextResponse('productId required', { status: 400 })

    // stores have many products
    // check if store exist before updating products
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const product = await db.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {}
        },

        isFeatured,
        isArchived
      }
    })

    const product2 = await db.product.update({
      where: { id: params.productId },
      data: {
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)]
          }
        }
      }
    })

    console.log('product patch', product2)
    return NextResponse.json(product2)
  } catch (error) {
    console.log('PRODUCT_PATCH', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    if (!params.storeId) return new NextResponse('Storeid required', { status: 400 })
    if (!params.productId) return new NextResponse('productId required', { status: 400 })

    // stores have many products
    // check if store exist before deleting products
    const existingStore = await db.store.findFirst({
      where: { id: params.storeId, userId }
    })

    if (!existingStore) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const product = await db.product.deleteMany({
      where: { id: params.productId }
    })

    console.log('product delete', product)
    return NextResponse.json(product)
  } catch (error) {
    console.log('PRODUCT_DELETE', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
