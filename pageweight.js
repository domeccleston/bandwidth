const puppeteer = require('puppeteer');

const getPageWeight = () => {
  const page = window.performance.getEntriesByType("navigation")[0].transferSize;
  const assets = window.performance
  .getEntriesByType("resource")
  .filter(({ name }) => name.startsWith(window.location.origin))
  .map((x) => x.transferSize)
  .reduce((a, b) => (a + b));

  return page + assets;
}

async function main() {
  const browser = await puppeteer.launch({ defaultViewport: null });
  const page = await browser.newPage();
  await page.goto('https://www.wikipedia.org');
  const pageWeight = await page.evaluate(getPageWeight)

  await browser.close();
}

main();
