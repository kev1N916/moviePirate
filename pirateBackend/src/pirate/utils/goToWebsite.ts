import { Page } from "playwright";
import { config } from "dotenv";
config()
export const goToWebsite = async (page: Page) => {
  try {
    await page.goto(process.env.WEBSITE_URL);
    await page.waitForLoadState("load");
  } catch (error) {
    console.error(error, "Navigating to website failed");
    throw error;
  }
};
