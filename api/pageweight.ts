import type { NextApiRequest, NextApiResponse } from 'next'

import chromium from 'chrome-aws-lambda';

const getPageWeight = () => {
  const pagePerformanceEntry = window.performance.getEntriesByType("navigation")[0] as PerformanceResourceTiming
  const page = pagePerformanceEntry.transferSize;
  const assets = window.performance
  .getEntriesByType("resource")
  .filter(({ name }) => name.startsWith(window.location.origin))
  //@ts-ignore
  .map((x) => x.transferSize)
  .reduce((a, b) => (a + b));

  return page + assets;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query as { [key: string]: string };
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    executablePath: await chromium.executablePath,
    defaultViewport: null
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });
  const pageWeight = await page.evaluate(getPageWeight)
  await browser.close();

  res.status(200).json(pageWeight);
}
