import { getAllProducts } from '@/actions/indext'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'

export default async function Home() {
  const products  = await getAllProducts()

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />

            </p>
            <h1 className="head-text">
              Find the best prices with
              <span className="text-emerald-400"> PriceWatch</span>
            </h1>
            <SearchBar/>
          </div>
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">
          Trending
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-1">
          {products?.map((product) => (

              <ProductCard product={product} />
        
          ))}
        </div>
      </section>
    </>
  )
}
