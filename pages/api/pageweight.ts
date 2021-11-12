import type { NextApiRequest, NextApiResponse } from 'next'

import puppeteer from 'puppeteer';

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
  const browser = await puppeteer.launch({ defaultViewport: null });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });
  const pageWeight = await page.evaluate(getPageWeight)
  await browser.close();

  res.status(200).json(pageWeight);
}
