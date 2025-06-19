import { Page } from "playwright";

export const findMovie = async (movie: string, page: Page) => {
  try {
    await page.waitForSelector("#s");
    await page.fill("#s", movie);
    await page.locator("#search-image").dispatchEvent('click');
  } catch (error) {
    throw error;
  }
};
