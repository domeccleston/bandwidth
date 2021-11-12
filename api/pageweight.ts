import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";

// Automate the process of opening DevTools and checking page weight
const getPageWeight = () => {
  const pagePerformanceEntry = window.performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceResourceTiming;
  const page = pagePerformanceEntry.transferSize;
  const assets = window.performance
    .getEntriesByType("resource")
    .filter(({ name }) => name.startsWith(window.location.origin))
    //@ts-ignore
    .map((x) => x.transferSize)
    .reduce((a, b) => a + b);

  return page + assets;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { url } = req.query as { [key: string]: string };
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    executablePath: await chromium.executablePath,
    defaultViewport: null,
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.goto(url, {
    // Wait until all network requests are finished
    waitUntil: "networkidle0",
  });
  const pageWeight = await page.evaluate(getPageWeight);
  await browser.close();

  res.status(200).json(pageWeight);
}
