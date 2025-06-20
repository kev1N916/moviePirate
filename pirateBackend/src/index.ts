import { chromium, Browser, BrowserContext, Page } from "playwright";
import { searchForMovie } from "./pirate/utils/searchForMovie";
import { findMovieCard } from "./pirate/utils/findMovieCard";
import { goToWebsite } from "./pirate/utils/goToWebsite";
import { goToMovieUrl } from "./pirate/utils/goToMovieUrl";
import { getDownloadLinks } from "./pirate/utils/getDownloadLinks";
import { filterLinks } from "./pirate/utils/filterLinks";
import { getFinalDownloadUrl } from "./pirate/utils/getFinalDownloadUrl";
import { findMovieUrl } from "./pirate/utils/findMovieUrl";

export const downloadMovie = async (
  movie: string,
  quality: string
): Promise<string> => {
  const browser: Browser = await chromium.launch({
    headless: true, 
    channel: "chrome", // Use installed Chrome instead of Chromium
  });

  // Create a new browser context
  const context: BrowserContext = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
  });

  const page: Page = await context.newPage();

  try {
    await goToWebsite(page);
    await searchForMovie(movie, page);
    const movieCards = await findMovieCard(movie, page);
    const movieUrl = findMovieUrl(movieCards, movie);
    if (movieUrl === "") {
      console.log(movieCards)
      throw Error("movie does not exist.");
    }

    await goToMovieUrl(page, movieUrl);
    const downloadLinks = await getDownloadLinks(page);
    const downloadUrl = filterLinks(downloadLinks, quality);
    const finalUrl = await getFinalDownloadUrl(downloadUrl, page);
    return finalUrl;
  } catch (error: any) {
    console.error("Error", error);
  } finally {
    // Clean up
    await context.close();
    await browser.close();
  }
};