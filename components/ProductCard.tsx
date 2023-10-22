import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Link href={`/product/${product._id}`} className="product-card" >
            <div className="product-card_img-container">
                <Image
                    src={product.image}
                    alt={product.title}
                    width={700}
                    height={200}
                    className="product-card_img"
                />
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="product-title">{product.title}</h3>

                <div className="flex justify-between">
                    <p className="text-white opacity-50 text-lg capitalize">
                        {product.category}
                    </p>

                    <p className="text-white text-lg font-semibold">
                        <span>{product?.currency}</span>
                        <span>{product?.currentPrice}</span>
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard