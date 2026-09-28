/*
============================================================
Performance, SEO & Production
============================================================

Focus:
- Performance optimization
- Image optimization
- Font optimization
- Dynamic imports
- SEO
- Metadata API
- Open Graph
- robots.txt
- sitemap
- JSON-LD basics
- Error handling
- not-found
- Production optimization
- Environment variables
- Bundle awareness

*/



// ============================================================
// 01. PERFORMANCE MINDSET
// ============================================================

/*
Goal:

Less JavaScript
Less unnecessary work
Smaller assets
Faster server response
Faster rendering
Better user experience
*/


// ============================================================
// 02. NEXT/IMAGE
// ============================================================

import Image from "next/image";

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={400}
      height={400}
    />
  );
}

/*
next/image helps with:

- Image sizing
- Responsive delivery
- Lazy loading
- Layout shift prevention
- Modern image formats

Prefer <Image> for application images.
*/


// ============================================================
// 03. PRIORITY IMAGE
// ============================================================

import Image from "next/image";

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}

/*
Use priority for important above-the-fold images.

Don't make every image priority.
*/


// ============================================================
// 04. REMOTE IMAGES
// ============================================================

import Image from "next/image";

export default function ProductImage() {
  return (
    <Image
      src="https://cdn.example.com/product.jpg"
      alt="Product"
      width={600}
      height={400}
    />
  );
}

/*
Remote image hosts need to be configured in Next.js.

Don't allow arbitrary untrusted image hosts.
*/


// ============================================================
// 05. IMAGE SIZING
// ============================================================

/*
Avoid:

<Image
  src="/hero.jpg"
  alt="Hero"
/>

when Next.js cannot determine appropriate dimensions.

Prefer:

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
/>

or use:

fill

when the parent controls the layout.
*/


// ============================================================
// 06. IMAGE ALT
// ============================================================

/*
Good:

<Image
  src="/product.jpg"
  alt="Black running shoes"
/>


Decorative:

<Image
  src="/decoration.svg"
  alt=""
/>

Alt text is for accessibility, not keyword stuffing.
*/


// ============================================================
// 07. NEXT/FONT
// ============================================================

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

/*
next/font:

- Optimizes fonts
- Avoids unnecessary runtime font requests
- Helps reduce layout shift
*/


// ============================================================
// 08. LOCAL FONT
// ============================================================

import localFont from "next/font/local";

const customFont = localFont({
  src: "./fonts/custom.woff2",
});


// ============================================================
// 09. DYNAMIC IMPORT
// ============================================================

import dynamic from "next/dynamic";

const HeavyChart = dynamic(
  () => import("./HeavyChart")
);

export default function Dashboard() {
  return (
    <main>
      <HeavyChart />
    </main>
  );
}

/*
Dynamic import:

Initial bundle
      ↓
Smaller

Heavy component
      ↓
Loaded when needed
*/


// ============================================================
// 10. WHEN TO USE DYNAMIC IMPORT
// ============================================================

/*
Good candidates:

- Large charts
- Rich editors
- Heavy third-party libraries
- Components used only on interaction
- Browser-only libraries
*/


// ============================================================
// 11. DISABLE SSR WHEN NECESSARY
// ============================================================

const BrowserOnlyChart = dynamic(
  () => import("./BrowserOnlyChart"),
  {
    ssr: false,
  }
);

/*
Use only when the component truly requires browser APIs.

Don't disable SSR everywhere.
*/


// ============================================================
// 12. REDUCE CLIENT JAVASCRIPT
// ============================================================

/*
Prefer:

Server Component
     ↓
HTML / RSC

over unnecessarily making everything:

"use client"
*/


/*
Client Component only when needed:

- useState
- useEffect
- Event handlers
- Browser APIs
- Interactive UI
*/


// ============================================================
// 13. CLIENT BOUNDARY
// ============================================================

/*
❌

"use client";

export default function EntirePage() {
  // huge page
}


✓

Server Page
   ↓
Small Client Component
   ↓
Interactive part
*/


// ============================================================
// 14. AVOID UNNECESSARY DEPENDENCIES
// ============================================================

/*
Before installing a package:

Ask:

Can native JS do it?

Can React do it?

Can Next.js do it?

Is the package worth its bundle cost?
*/


// ============================================================
// 15. SEO — METADATA
// ============================================================

export const metadata = {
  title: "Products",
  description: "Browse our products",
};

/*
App Router automatically handles Metadata API.

Metadata can be defined in:

layout.js
page.js
*/


// ============================================================
// 16. TITLE TEMPLATE
// ============================================================

export const metadata = {
  title: {
    template: "%s | My App",
    default: "My App",
  },

  description:
    "My full-stack application",
};

/*
Page:

export const metadata = {
  title: "Products",
};

Result:

Products | My App
*/


// ============================================================
// 17. DYNAMIC METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product =
    await getProduct(id);

  return {
    title: product.name,
    description: product.description,
  };
}

/*
Useful for:

/products/1
/products/2
/products/3

Each page can have different metadata.
*/


// ============================================================
// 18. OPEN GRAPH
// ============================================================

export const metadata = {
  title: "Product",
  description: "Product description",

  openGraph: {
    title: "Product",
    description: "Product description",
    images: ["/product-og.jpg"],
  },
};

/*
Open Graph:

Controls how shared links can appear on platforms
that consume OG metadata.
*/


// ============================================================
// 19. CANONICAL URL
// ============================================================

export const metadata = {
  alternates: {
    canonical: "https://example.com/products",
  },
};

/*
Useful when multiple URLs can represent the same content.
*/


// ============================================================
// 20. ROBOTS METADATA
// ============================================================

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

/*
For private pages:

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
*/


// ============================================================
// 21. robots.txt
// ============================================================

/*
Next.js supports a special robots file.

app/
└── robots.js
*/


// app/robots.js

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
    ],

    sitemap:
      "https://example.com/sitemap.xml",
  };
}

/*
robots.txt:

Controls crawler access.

It is NOT an authentication/security mechanism.
*/


// ============================================================
// 22. SITEMAP
// ============================================================

/*
app/
└── sitemap.js
*/


// app/sitemap.js

export default async function sitemap() {
  const products =
    await getProducts();

  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
    },

    ...products.map((product) => ({
      url:
        `https://example.com/products/${product.id}`,
      lastModified: product.updatedAt,
    })),
  ];
}

/*
Sitemap helps crawlers discover important URLs.

Especially useful for:

- Large sites
- Content sites
- Dynamic pages
*/


// ============================================================
// 23. SEO BASIC CHECKLIST
// ============================================================

/*
✓ Meaningful title
✓ Useful description
✓ Correct canonical URL
✓ Proper headings
✓ Semantic HTML
✓ Descriptive URLs
✓ Alt text for meaningful images
✓ robots configuration
✓ sitemap
✓ Fast page
✓ Mobile-friendly UI
✓ Useful actual content

Don't:

❌ Keyword stuff
❌ Duplicate content everywhere
❌ Hide important content unnecessarily
*/


// ============================================================
// 24. JSON-LD
// ============================================================

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",

  name: "Running Shoes",

  description:
    "Lightweight running shoes",

  offers: {
    "@type": "Offer",
    price: "99.99",
    priceCurrency: "USD",
  },
};

/*
JSON-LD gives search engines structured information
about content.

Common types:

Product
Article
Organization
BreadcrumbList
Event
*/


// ============================================================
// 25. ERROR.JS
// ============================================================

/*
app/
├── error.js
└── page.js

error.js creates an error boundary for that route segment.
*/


// app/error.js

"use client";

export default function Error({
  error,
  reset,
}) {
  return (
    <main>
      <h2>Something went wrong.</h2>

      <button onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}

/*
error.js:

- Must be Client Component
- Handles uncaught errors in route segment
- reset() retries rendering
*/


// ============================================================
// 26. NOT-FOUND
// ============================================================

import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}) {
  const { id } = await params;

  const product =
    await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <h1>{product.name}</h1>
  );
}


/*
app/
└── products/
    └── [id]/
        ├── page.js
        └── not-found.js
*/


// ============================================================
// 27. NOT-FOUND UI
// ============================================================

export default function NotFound() {
  return (
    <main>
      <h1>Product not found</h1>
      <p>The requested product does not exist.</p>
    </main>
  );
}


// ============================================================
// 28. ERROR vs NOT-FOUND
// ============================================================

/*
error.js

→ Unexpected application error


notFound()

→ Requested resource doesn't exist
*/


// ============================================================
// 29. REDIRECT
// ============================================================

import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <Dashboard />;
}

/*
Use redirect for intentional navigation decisions.

Don't use errors as normal navigation logic.
*/


// ============================================================
// 30. ENVIRONMENT VARIABLES
// ============================================================

/*
Server:

DATABASE_URL
API_SECRET
STRIPE_SECRET_KEY


Browser:

NEXT_PUBLIC_API_URL
NEXT_PUBLIC_ANALYTICS_ID
*/


// ============================================================
// 31. NEVER EXPOSE SECRETS
// ============================================================

/*
❌

NEXT_PUBLIC_DATABASE_URL
NEXT_PUBLIC_SECRET_KEY
NEXT_PUBLIC_STRIPE_SECRET


Anything prefixed with:

NEXT_PUBLIC_

can be exposed to the browser.
*/


// ============================================================
// 32. BUILD CHECK
// ============================================================

/*
Before production:

npm run build
npm start

Check:

✓ Build succeeds
✓ Environment variables exist
✓ No server/client boundary errors
✓ Images load
✓ Dynamic routes work
✓ Authentication works
✓ API endpoints work
✓ SEO metadata exists
✓ Error pages work
*/


// ============================================================
// 33. BUNDLE AWARENESS
// ============================================================

/*
Large client bundle
        ↓
More JS
        ↓
More download
        ↓
More parsing/execution
        ↓
Slower interaction
*/

/*
Reduce by:

✓ Server Components
✓ Dynamic imports
✓ Smaller dependencies
✓ Avoid unnecessary client state
✓ Avoid giant client components
*/


// ============================================================
// 34. THIRD-PARTY SCRIPTS
// ============================================================

import Script from "next/script";

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        strategy="afterInteractive"
      />
    </>
  );
}

/*
Common strategies:

beforeInteractive
afterInteractive
lazyOnload

Don't load third-party scripts earlier than necessary.
*/


// ============================================================
// 35. CORE WEB VITALS
// ============================================================

/*
LCP
→ Largest Contentful Paint
→ Loading performance


INP
→ Interaction to Next Paint
→ Responsiveness


CLS
→ Cumulative Layout Shift
→ Visual stability
*/


// ============================================================
// 36. PERFORMANCE → PRACTICAL
// ============================================================

/*
Slow page?

Check:

1. Server response time
2. Database query
3. API calls
4. Request waterfall
5. Large JS bundle
6. Large images
7. Fonts
8. Third-party scripts
9. Client-side rendering
10. Unnecessary re-renders
*/


// ============================================================
// 37. PRODUCTION LOGGING
// ============================================================

/*
Development:

console.log()
→ Useful for debugging


Production:

Use structured logging / monitoring.

Avoid logging:

❌ passwords
❌ tokens
❌ session IDs
❌ sensitive personal data
*/


// ============================================================
// 38. ERROR MONITORING
// ============================================================

/*
Production apps commonly use monitoring tools to capture:

- Exceptions
- Failed requests
- Performance problems
- Server errors

Example categories:

Sentry
Datadog
OpenTelemetry-based systems
etc.
*/


// ============================================================
// 39. SECURITY + PERFORMANCE
// ============================================================

/*
Performance optimization must NOT break security.

Don't:

❌ Cache private user data publicly
❌ Expose secrets for smaller architecture
❌ Disable authentication for speed
❌ Allow arbitrary remote images
❌ Trust client-side validation
*/


// ============================================================
// 40. PRODUCTION MENTAL MODEL
// ============================================================

/*
                    Next.js App
                         |
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       UI/SEO        Server Logic     Database
          |              |              |
       Image          Auth/API        Queries
       Font           Validation      Indexes
       Metadata       Errors          Transactions
          |
      Performance
          |
   ┌──────┼───────┐
   ↓      ↓       ↓
 Bundle  Images  Network
*/


// ============================================================
// 41. QUICK RECALL
// ============================================================

/*
next/image
→ Image optimization

next/font
→ Font optimization

dynamic()
→ Code splitting / lazy loading

metadata
→ Page SEO/share metadata

generateMetadata()
→ Dynamic metadata

openGraph
→ Social sharing metadata

canonical
→ Preferred URL

robots
→ Crawler directives

sitemap
→ URL discovery

JSON-LD
→ Structured data

error.js
→ Route error boundary

notFound()
→ 404 handling

not-found.js
→ Custom not-found UI

redirect()
→ Server-side navigation

NEXT_PUBLIC_
→ Browser-exposed environment variable

LCP
→ Loading performance

INP
→ Interaction responsiveness

CLS
→ Layout stability
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. Why use next/image instead of <img>?

A:
It provides Next.js image optimization such as appropriate
sizing, responsive delivery, lazy loading and layout-shift
prevention.


Q2. When should an image use priority?

A:
When it is an important above-the-fold image, such as a hero
image. Don't mark every image as priority.


Q3. What does next/font do?

A:
It optimizes font loading and allows fonts to be handled by
Next.js rather than requiring the browser to fetch them from
an external font service at runtime.


Q4. Why use dynamic import?

A:
To split code and avoid loading heavy modules in the initial
bundle when they are not immediately required.


Q5. What is the purpose of "use client" from a performance
perspective?

A:
It creates a Client Component boundary. Keeping that boundary
small can reduce the amount of JavaScript sent to the browser.


Q6. What is the Metadata API?

A:
Next.js's API for defining page/layout metadata such as title,
description, Open Graph and robots information.


Q7. metadata vs generateMetadata?

A:
metadata is useful for static metadata.
generateMetadata is useful when metadata depends on dynamic data.


Q8. What is Open Graph metadata?

A:
Metadata used by social platforms and other link consumers to
represent a shared page.


Q9. What is a canonical URL?

A:
It identifies the preferred URL for a piece of content when
multiple URLs may represent similar content.


Q10. What does robots.txt do?

A:
It gives web crawlers rules about which URLs they may or may
not crawl. It is not an access-control mechanism.


Q11. What is a sitemap?

A:
A structured list of important URLs that helps search engines
discover site content.


Q12. What is JSON-LD?

A:
A JSON-based structured-data format commonly used to describe
content using Schema.org vocabulary.


Q13. What is error.js?

A:
A route-segment error boundary that displays fallback UI when
an uncaught error occurs.


Q14. Why is error.js a Client Component?

A:
The error boundary needs client-side behavior such as the
reset() action.


Q15. error.js vs notFound()?

A:
error.js handles unexpected errors.
notFound() handles a missing resource.


Q16. What does NEXT_PUBLIC_ mean?

A:
The variable is intended to be exposed to browser-side code.
Therefore it must not contain secrets.


Q17. What is LCP?

A:
Largest Contentful Paint. It measures when the main/large
content of the page becomes visible.


Q18. What is INP?

A:
Interaction to Next Paint. It measures responsiveness to user
interactions.


Q19. What is CLS?

A:
Cumulative Layout Shift. It measures unexpected visual movement
during page loading.


Q20. How can you reduce a Next.js client bundle?

A:
Use Server Components where possible, keep Client Components
small, dynamically import heavy modules and avoid unnecessary
large dependencies.


Q21. Why should third-party scripts be loaded carefully?

A:
They consume network, parsing and execution resources and can
hurt page performance.


Q22. Should robots.txt be used to protect an admin page?

A:
No. robots.txt is not security. Authentication and
authorization must protect the resource.


Q23. Why shouldn't production logs contain tokens or passwords?

A:
Logs can be stored and accessed by multiple systems/users.
Sensitive values should not be exposed through logs.


Q24. What should you check before deploying a Next.js app?

A:
Production build, environment variables, authentication,
database/API behavior, error handling, images, SEO and
performance.


Q25. What is the simplest performance rule for a Next.js app?

A:
Send less JavaScript, load smaller assets, avoid unnecessary
work and keep expensive operations server-side when possible.
*/


/*
============================================================
END
============================================================
*/
