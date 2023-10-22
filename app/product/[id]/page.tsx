import { getMoreProducts, getProductById, getSimilarProducts } from '@/actions/indext';
import Modal from '@/components/Modal';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { formatNumber } from '@/utils';
import Image from 'next/image'
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string }
}

const ProductDetails = async ({ params: { id } }: Props) => {

  const product: Product = await getProductById(id);
  const moreProducts = await getMoreProducts(id)
  const similarProducts = await getSimilarProducts(id);

  if (!product) redirect('/')
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col align-center">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={2000}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-white font-semibold">
                {product.title}
              </p>

              {/* <Link
                href={product.url}
                target="_blank"
                className="text-base text-neutral-300 opacity-50"
              >
                Visit Product
              </Link> */}

            </div>
          </div>
          <div className="product-info">
            <div className="flex align-center gap-2">
              <p className="text-[34px] text-white font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-white opacity-50 line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>
            <Link
              href={product.url}
              target="_blank"
              className="text-base text-neutral-300 opacity-50"
            >
              Visit Product
            </Link>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
              />
            </div>
          </div>
          <Modal productId={id}/>
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-white font-semibold">
            Product Description
          </h3>

          <div className="flex flex-col gap-4 text-white">
            {product?.description?.split('\n')}
          </div>
        </div>
      </div>

      {moreProducts && moreProducts?.length > 0 && (
        <div className="pt-14 flex flex-col gap-2 w-full">
          <p className="section-text">More Products</p>

          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {moreProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {similarProducts && similarProducts?.length > 0 && (
        <div className=" flex flex-col gap-2 w-full">
          <p className="section-text">Similar Prices</p>

          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductDetails