import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query'
import App from './App'

interface SpecialMenuData {
  basicMenu: any;
  fullMenu: any;
  slug: string;
}

interface RenderContext {
  menuData?: any;
  menuType?: string;
  specialMenuData?: SpecialMenuData;
}

export function render(url: string, context: RenderContext = {}) {
  const helmetContext = {} as any

  // Create QueryClient for SSR
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // No refetches during SSR
        retry: false,
      },
    },
  })

  // Pre-populate cache with server-fetched menu data (for standard menus)
  if (context.menuData && context.menuType) {
    queryClient.setQueryData(['menu', context.menuType], context.menuData)
  }

  // Pre-populate cache with special menu data (for special occasion pages)
  if (context.specialMenuData) {
    const { basicMenu, fullMenu, slug } = context.specialMenuData
    // For useSpecialMenuBySlug hook
    queryClient.setQueryData(['special-menu', slug], basicMenu)
    // For useMenuById hook (used by MenuDisplay)
    queryClient.setQueryData(['menu-by-id', basicMenu.id], fullMenu)
  }

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )

  const { helmet } = helmetContext
  const dehydratedState = dehydrate(queryClient)

  return { html, helmet, dehydratedState }
}
