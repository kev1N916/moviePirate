import { Browser, BrowserContext, chromium, Page } from "playwright";
import { getDownloadLinks } from "./utils/getDownloadLinks";
import { goToWebsite } from "./utils/goToWebsite";
import { searchForMovie } from "./utils/searchForMovie";
import { findMovieCard } from "./utils/findMovieCard";
import { goToMovieUrl } from "./utils/goToMovieUrl";
import { filterLinks } from "./utils/filterLinks";
import { getFinalDownloadUrl } from "./utils/getFinalDownloadUrl";
export class Pirate {
  private browserContext: BrowserContext;
  private currentPage: Page;
  public headless: boolean;

  constructor() {
    this.headless = true;
  }

  public init = async () => {
    const browser: Browser = await chromium.launch({
      headless: this.headless,
      channel: "chrome",
    });

    // Create a new browser context
    const context: BrowserContext = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
    });
    this.browserContext = context;

  };

  public searchMovie = async (movie: string) => {
    this.currentPage=await this.browserContext.newPage()
    await goToWebsite(this.currentPage);
    await searchForMovie(movie, this.currentPage);
    const movieCards = await findMovieCard(movie, this.currentPage);
    await this.currentPage.close()
    return movieCards;
  };

  public getMovieDownloadLink = async (movie: string, movieUrl: string,quality:string) => {
    this.currentPage=await this.browserContext.newPage()
    await goToMovieUrl(this.currentPage, movieUrl);
    const downloadLinks = await getDownloadLinks(this.currentPage);
    const downloadUrl = filterLinks(downloadLinks, quality);
    const finalUrl = await getFinalDownloadUrl(downloadUrl, this.currentPage);
    await this.currentPage.close()
    return finalUrl;
  };
}
