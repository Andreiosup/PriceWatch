"use client"

import scrapeAndStoreProduct from "@/actions/indext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes('amazon.com') || 
      hostname.includes ('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

const SearchBar = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit  = async(event: FormEvent<HTMLFormElement>) =>{
    event.preventDefault()
    const isValidLink = isValidAmazonProductURL(searchTerm)

    if(!isValidLink) return alert('Please provide a valid Amazon link')

    try {
      setIsLoading(true)
      const product = await scrapeAndStoreProduct(searchTerm);
      router.push(`/product/${product._id}`)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <form  className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit} >
      <input  
        className="searchbar-input"
        value={searchTerm} 
        onChange={(e)=> setSearchTerm(e.target.value)}
        placeholder="Add a product to track here"
      />
      <button className="searchbar-btn">
        {isLoading ? "Searching..." :"Find Product"}
      </button>
    </form>
  )
}

export default SearchBar