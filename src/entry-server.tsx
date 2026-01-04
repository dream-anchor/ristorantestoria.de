import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
// Use default import for CommonJS compatibility in Node.js ESM
import pkg from 'react-helmet-async';
const { HelmetProvider } = pkg;
import App from './App';

export function render(url: string) {
  const helmetContext = {};
  
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  
  return html;
}
