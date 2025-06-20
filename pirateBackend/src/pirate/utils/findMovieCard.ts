import { Page } from "playwright";

export type MovieCard = {
  url: string;
  title: string;
};
export const findMovieCard = async (
  movie: String,
  page: Page
): Promise<MovieCard[]> => {
  try {
    const selector = "#content_box > div.post-cards";
    await page.waitForSelector(selector);
    const articles = await page.$$(".post-cards article.latestPost.excerpt");
    const extractedData: MovieCard[] = [];
    for (const article of articles) {
      const titleElement = await article.$(".title.front-view-title a");
      const title = titleElement ? await titleElement.textContent() : "N/A";
      const url = titleElement
        ? await titleElement.getAttribute("href")
        : "N/A";
      extractedData.push({
        title: title?.trim(),
        url,
      });
    }
    await page.screenshot({ path: "example.png" });
    return extractedData;
  } catch (error) {
    throw error;
  }
};
