import { Page } from "playwright";

export const goToMovieUrl=async (page:Page,url:string)=>{
    try{
    await page.goto(url)
    await page.waitForLoadState("load")
    await page.screenshot({path:"example.png"})
    }catch(error){
        throw error
    }
}