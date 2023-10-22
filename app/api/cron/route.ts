import { connectToDB } from "@/database/connection"
import Product from "@/database/product-model";
import { generateEmailBody, sendEmail } from "@/nodemailer";
import { scrapeAmazonProduct } from "@/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/utils";
import { connect } from "http2"
import { NextResponse } from "next/server";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET () {
    try {
        connectToDB()
        const products = await Product.find({});

        if (!products) throw new Error ("No products found")

        const updatedProducts = await Promise.all(
            products.map(async (initialProduct)=>{
                const scrapedProduct = await scrapeAmazonProduct(initialProduct.url);

                if (!scrapedProduct) return;

                const updatedPriceHistory = [
                    ...initialProduct.priceHistory,
                    {
                      price: scrapedProduct.currentPrice,
                    },
                  ];

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };
        
                // Update Products in DB
                const updatedProduct = await Product.findOneAndUpdate(
                {
                    url: product.url,
                },
                product
                );

                const emailNotifType = getEmailNotifType(
                    scrapedProduct,
                    initialProduct
                  );
          
                  if (emailNotifType && updatedProduct.users.length > 0) {
                    const productInfo = {
                      title: updatedProduct.title,
                      url: updatedProduct.url,
                    };
                    // Construct emailContent
                    const emailContent = await generateEmailBody(productInfo, emailNotifType);
                    // Get array of user emails
                    const userEmails = updatedProduct.users.map((user: any) => user.email);
                    // Send email notification
                    await sendEmail(emailContent, userEmails);
                  }
          
                  return updatedProduct;
            })
        )

        return NextResponse.json({
            message: "Ok",
            data: updatedProducts,
        });
    } catch (error) {
        throw new Error(`Error in GET: ${error}`)
    }
}