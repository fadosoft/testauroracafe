
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export async function generatePdf(htmlContent: string, orderId: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true, // Esegui in modalità headless (senza interfaccia grafica)
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necessario per ambienti server
  });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Assicurati che la directory di output esista
  const outputDir = path.join(process.cwd(), 'public', 'orders');
  await fs.mkdir(outputDir, { recursive: true });

  const pdfPath = path.join(outputDir, `order-${orderId}.pdf`);
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();

  return `/orders/order-${orderId}.pdf`; // Ritorna il percorso relativo per l'accesso web
}
