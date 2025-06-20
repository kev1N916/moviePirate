import { Locator, Page } from "playwright";

export type DownloadLinks = {
  linkTitle: string;
  linkUrl: string;
};
export const getDownloadLinks = async (page: Page):Promise<DownloadLinks[]> => {
    const result:DownloadLinks[]=[]
  try {
    const parentDivLocator: Locator = page.locator("div.thecontent.clearfix");

    const h4ElementsLocator: Locator = parentDivLocator.locator(
      'h4[style*="text-align: center"]'
    );
    const allH4Locators: Locator[] = await h4ElementsLocator.all();

    const centeredParagraphsLocator: Locator = parentDivLocator.locator(
      'p[style*="text-align: center"]'
    );
    const filteredParagraphs: Locator[] = await centeredParagraphsLocator.all();
    for (let index = 0; index < filteredParagraphs.length; index++) {
      const para = filteredParagraphs[index];
      const titleLocators = allH4Locators[index];
      const title=await titleLocators.textContent();
      const spanText = await para.locator("span").textContent();
      if (spanText.includes("Download") && title.includes("Download")) {
        const anchorTag = para.locator("a");
        const downloadLink = await anchorTag.getAttribute("href");
        result.push({
            linkTitle:title,
            linkUrl:downloadLink
        })
      }
    }
    return result
  } catch (error) {
    throw error;
  }
};
