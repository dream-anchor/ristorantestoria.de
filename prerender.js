import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Define all static routes from App.tsx (excluding dynamic routes like :slug)
const routesToPrerender = [
  '/',
  '/reservierung',
  '/menu',
  '/mittags-menu',
  '/speisekarte',
  '/getraenke',
  '/besondere-anlaesse',
  '/kontakt',
  '/catering',
  '/admin',
  '/admin/login',
  '/impressum',
  '/datenschutz',
  '/cookie-richtlinie',
  '/agb-restaurant',
  '/agb-gutscheine',
  '/widerrufsbelehrung',
  '/zahlungsinformationen',
  '/lebensmittelhinweise',
  '/haftungsausschluss',
  '/ueber-uns',
  // SEO Landingpages
  '/lunch-muenchen',
  '/aperitivo-muenchen',
  '/romantisches-dinner-muenchen',
  '/eventlocation-muenchen',
  '/firmenfeier-muenchen',
  '/geburtstagsfeier-muenchen',
  '/neapolitanische-pizza-muenchen',
]

;(async () => {
  for (const routeUrl of routesToPrerender) {
    const appHtml = render(routeUrl);
    const html = template.replace(`<!--app-html-->`, appHtml)

    // Determine file path - index route goes to /index.html, others go to /route.html
    const filePath = routeUrl === '/' 
      ? 'dist/index.html' 
      : `dist${routeUrl}.html`
    
    // Ensure directory exists before writing
    const dir = path.dirname(toAbsolute(filePath))
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()
