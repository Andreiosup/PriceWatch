"use server"

import { connectToDB } from "@/database/connection"
import Product from "@/database/product-model"
import { generateEmailBody, sendEmail } from "@/nodemailer"
import { scrapeAmazonProduct } from "@/scraper"
import { User } from "@/types"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const scrapeAndStoreProduct = async (productUrl: string) => {
    if (!productUrl) return
    try {
        connectToDB()

        const amazonProduct = await scrapeAmazonProduct(productUrl)
      
        if(!amazonProduct) return 

        let product= amazonProduct

        const existingProduct= await Product.findOne({url:amazonProduct.url})


        
        if(existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: amazonProduct.currentPrice }
            ]
    
            product = {
                ...amazonProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: amazonProduct.url },
            product,
            { upsert: true, new: true }
          );
        
        revalidatePath(`/products/${newProduct._id}`);

        return newProduct

    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export const getProductById = async (productId: string) =>{
    try {
        connectToDB()
        const product = await Product.findById(productId)

        if (!product) return null

        return product
    } catch (error: any) {
         throw new Error(`Product not found: ${error.message}`)
    }
}
export const getAllProducts = async () =>{
    try {
        connectToDB()
        const products = await Product.find({})

        if (!products) return null

        return products
    } catch (error: any) {
         throw new Error(`Product not found: ${error.message}`)
    }
}

export const getMoreProducts = async (productId: string) =>{
    try {
        connectToDB()
        const currentProduct = await Product.findById(productId)

        if (!currentProduct) return null

        const moreProducts = await Product.find({
            _id:{$ne: productId}
        }).limit(3)

        return moreProducts
        
    } catch (error: any) {
         throw new Error(`Product not found: ${error.message}`)
    }
}

export const getSimilarProducts = async (productId: string) =>{
    const product = await Product.findById(productId);
  
    if (!product) {
      throw new Error("Product not found");
    }
  
    const lowerPriceBound = product.currentPrice * 0.8;
    const upperPriceBound = product.currentPrice * 1.2;
  
    try {
      const similarProducts = await Product.find({
        _id: { $ne: productId }, // Exclude the current product
        currentPrice: { $gte: lowerPriceBound, $lte: upperPriceBound },
      })
      .limit(3); // Limit the result to 3 products
  
      return similarProducts;
    } catch (error:any) {
      throw new Error("Error while finding similar products: " + error.message);
    }
  }

export const addUserEmailToProduct = async (productId: string,userEmail:string) =>{
    
    try {
        const product = await Product.findById(productId);
      
        if (!product) {
          throw new Error("Product not found");
        }
      
        const userExists = product.users.some((user: User)=> user.email === userEmail)

        if(!userExists){
            product.users.push({email: userEmail})

            await product.save()
            
            const emailContent = await generateEmailBody(product,"WELCOME")

            await sendEmail(emailContent, [userEmail]);
        }
     
    } catch (error:any) {
      throw new Error("Error adding email to product " + error.message);
    }
  }
 
export default scrapeAndStoreProduct;