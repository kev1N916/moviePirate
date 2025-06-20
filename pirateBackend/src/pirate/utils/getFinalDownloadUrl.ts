import { Locator, Page } from "playwright";
const goThroughInitialAds = async (url: string, page: Page) => {
  try {
    await page.goto(url);
    await page.waitForSelector("#post-wrapper",{state:"attached",timeout:5000});
    const pageElement: Locator = page.locator("#post-wrapper");
    console.log("wrapper found ");
    const articleLocator: Locator = pageElement.locator("a");
    const links = await articleLocator.all();
    let nextUrlToGoTo = "";
    for (const link of links) {
      const href = await link.getAttribute("href");
      nextUrlToGoTo = href;
      break;
    }
    return nextUrlToGoTo;
  } catch (error) {
    console.log("error in goThroughInitialAds")
    throw error;
  }
};

const goToFinalDownloadPage = async (url: string, page: Page) => {
  try {
    await page.goto(url); 
    await page.mouse.move(100, 100);
    await page.waitForSelector("#landing > span > a", { state:"attached",timeout: 10000 });
    await page.locator("#landing > span > a").dispatchEvent("click");

    await page.waitForSelector("#verify_button", {
      state: "attached",
      timeout: 3000,
    });
    await page.locator("#verify_button").dispatchEvent("click");

    await page.waitForSelector("#verify_button2", {
      state: "attached",
      timeout: 3000,
    });
    await page.locator("#verify_button2").dispatchEvent("click");

    await page.waitForSelector("#two_steps_btn", {
      state: "attached",
      timeout: 3000,
    });
    await page.waitForTimeout(10000);

    const downloadLocator = page.locator("#two_steps_btn");
    const finalUrl = await downloadLocator.getAttribute("href");
    return finalUrl;
  } catch (error) {
    await page.screenshot({path:"example.png"})
    console.log("error in goToFinalDownloadPage",error)
    throw error;
  }
};


const getTheActualFinalLink = async (url: string, page: Page) => {
  try {
    await page.goto(url); 
    await page.waitForSelector("#cf_captcha > div.card-body > div:nth-child(2)");
    const finalDownloadLocator = page.locator(
      "#cf_captcha > div.card-body > div:nth-child(2)"
    );
    const links = await finalDownloadLocator.locator("a").all();
    let theActualFinalHref = "";
    for (const link of links) {
      const href = await link.getAttribute("href");
      const text = await link.textContent();
      console.log(`Article Link: "${text}" -> ${href}`);
      if (text.includes("Instant")) {
        theActualFinalHref = href;
        break;
      }
    }

    await page.goto(theActualFinalHref);
    await page.waitForSelector("#ins");
    await page.screenshot({ path: "example.png" });
    await page.locator("#ins").dispatchEvent("click");

    await page.waitForSelector("#generate > a");
    const downloadLocator=page.locator("#generate > a")
    const finalLink =await downloadLocator.getAttribute("href")
    return finalLink
  } catch (error) {
    throw error;
  }
};


export const getFinalDownloadUrl = async (url: string, page: Page) => {
  try {
    let nextUrl = await goThroughInitialAds(url, page);
    nextUrl = await goToFinalDownloadPage(nextUrl, page);
    await page.screenshot({ path: "example.png" });
    const finalLink=await getTheActualFinalLink(nextUrl,page)
    return finalLink
  } catch (error) {
    await page.screenshot({ path: "example.png" });
    throw error;
  }
};
