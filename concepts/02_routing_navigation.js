/*
============================================================
Routing Navigation
============================================================

Focus:
- App Router routing
- Dynamic routes
- Route parameters
- Navigation
- Query/search params
- Redirects
- Route Groups
- Parallel / Intercepting Routes
- Route-level loading/error handling

Revision material — not documentation.
*/


// ============================================================
// 01. FILE-BASED ROUTING
// ============================================================

// Folder structure defines the URL.

/*
app/
├── page.js
├── about/
│   └── page.js
└── dashboard/
    └── page.js
*/

/*
app/page.js
→ /

app/about/page.js
→ /about

app/dashboard/page.js
→ /dashboard
*/


// ============================================================
// 02. NESTED ROUTES
// ============================================================

/*
app/
└── dashboard/
    ├── page.js
    ├── settings/
    │   └── page.js
    └── users/
        └── page.js
*/

/*
/dashboard
/dashboard/settings
/dashboard/users
*/


// ============================================================
// 03. DYNAMIC ROUTES
// ============================================================

// [id] → dynamic URL segment

/*
app/
└── products/
    └── [id]/
        └── page.js
*/

/*
URL:

/products/101
/products/abc
/products/anything
*/

// app/products/[id]/page.js

export default async function ProductPage({ params }) {
  const { id } = await params;

  return <h1>Product: {id}</h1>;
}


// ============================================================
// 04. MULTIPLE DYNAMIC SEGMENTS
// ============================================================

/*
app/
└── shop/
    └── [category]/
        └── [productId]/
            └── page.js
*/

/*
URL:

/shop/electronics/101

params:
{
  category: "electronics",
  productId: "101"
}
*/


// ============================================================
// 05. CATCH-ALL ROUTES
// ============================================================

// [...slug]

/*
app/
└── docs/
    └── [...slug]/
        └── page.js
*/

/*
Matches:

/docs/react
/docs/react/hooks
/docs/react/hooks/useState
*/

/*
params:

{
  slug: ["react", "hooks", "useState"]
}
*/


// ============================================================
// 06. OPTIONAL CATCH-ALL
// ============================================================

// [[...slug]]

/*
Matches:

/docs
/docs/react
/docs/react/hooks
*/

/*
slug can be:

undefined
or
["react", "hooks"]
*/


// ============================================================
// 07. ROUTE GROUPS
// ============================================================

// (group) does NOT appear in the URL.

/*
app/
├── (marketing)/
│   ├── page.js
│   └── about/
│       └── page.js
│
└── (dashboard)/
    └── dashboard/
        └── page.js
*/

/*
(marketing) → URL-এ নেই
(dashboard) → URL-এ নেই

Useful for:
- Organizing routes
- Different layouts
- Logical grouping
*/


// ============================================================
// 08. PRIVATE FOLDERS
// ============================================================

// _folder → excluded from routing

/*
app/
├── _components/
│   └── Navbar.js
└── page.js
*/

// Useful for route-local files that should NOT become routes.


// ============================================================
// 09. ROUTE PARAMETERS
// ============================================================

// app/users/[id]/page.js

export default async function UserPage({ params }) {
  const { id } = await params;

  return <p>User ID: {id}</p>;
}

// params → dynamic URL segments


// ============================================================
// 10. SEARCH PARAMS / QUERY PARAMS
// ============================================================

// URL:
// /products?category=phone&page=2

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;

  const category = params.category;
  const page = params.page;

  return (
    <p>
      {category} - page {page}
    </p>
  );
}

/*
searchParams:

/products?category=phone&page=2

{
  category: "phone",
  page: "2"
}
*/


// ============================================================
// 11. params vs searchParams
// ============================================================

/*
URL:

/products/101?color=black

params
→ {
    id: "101"
   }

searchParams
→ {
    color: "black"
   }
*/

/*
params
→ Dynamic route segments

searchParams
→ Query string
*/


// ============================================================
// 12. MULTIPLE QUERY VALUES
// ============================================================

// /products?tag=js&tag=react

// searchParams.tag
// → ["js", "react"]

// Always handle possible string | string[] | undefined
// when query parameters can repeat.


/*
============================================================
13. LINK
============================================================
*/

// Preferred navigation method.

import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>

      <Link href="/products">
        Products
      </Link>

      <Link href="/products/101">
        Product 101
      </Link>
    </nav>
  );
}

// Benefits:
// - Client-side navigation
// - Prefetching when applicable
// - Avoids full page reload


// ============================================================
// 14. DYNAMIC LINK
// ============================================================

const productId = "101";

<Link href={`/products/${productId}`}>
  View Product
</Link>;


// ============================================================
// 15. useRouter
// ============================================================

// Client Component only.

"use client";

import { useRouter } from "next/navigation";

export default function ProductActions() {
  const router = useRouter();

  function goToProducts() {
    router.push("/products");
  }

  return (
    <button onClick={goToProducts}>
      Products
    </button>
  );
}

/*
Common methods:

router.push("/products")
→ Navigate

router.replace("/products")
→ Navigate without adding history entry

router.back()
→ Go back

router.forward()
→ Go forward

router.refresh()
→ Request fresh server-rendered data/UI
*/


// ============================================================
// 16. usePathname
// ============================================================

// Client Component only.

"use client";

import { usePathname } from "next/navigation";

export default function CurrentPath() {
  const pathname = usePathname();

  return <p>{pathname}</p>;
}

// Example:
// /dashboard/users
// → "/dashboard/users"


// ============================================================
// 17. useSearchParams
// ============================================================

// Client Component only.

"use client";

import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  return <p>Search: {query}</p>;
}

// URL:
// /search?q=nextjs

// query → "nextjs"


// ============================================================
// 18. UPDATING SEARCH PARAMS
// ============================================================

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(category) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("category", category);

    router.push(`/products?${params.toString()}`);
  }

  return (
    <button onClick={() => setCategory("laptop")}>
      Laptops
    </button>
  );
}


// ============================================================
// 19. redirect()
// ============================================================

// Server-side redirect.

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = null;

  if (!user) {
    redirect("/login");
  }

  return <h1>Dashboard</h1>;
}

// Common use:
// - Authentication
// - Authorization
// - Redirect after server operation


// ============================================================
// 20. permanentRedirect()
// ============================================================

import { permanentRedirect } from "next/navigation";

export default function OldPage() {
  permanentRedirect("/new-page");
}

// Use when a resource has permanently moved.


// ============================================================
// 21. notFound()
// ============================================================

import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <h1>{product.name}</h1>;
}

// notFound()
// → stops rendering
// → displays nearest not-found.js


// ============================================================
// 22. NAVIGATION: LINK vs useRouter
// ============================================================

/*
<Link>
→ Normal user navigation
→ Declarative
→ Prefer this for links

useRouter()
→ Programmatic navigation
→ After an action
→ Button/event-driven navigation
*/


// ============================================================
// 23. PREFETCHING
// ============================================================

// <Link> can prefetch routes when appropriate.

<Link href="/dashboard">
  Dashboard
</Link>;

// Prefetching helps make navigation feel faster.

// Don't manually optimize every Link.
// Use normal <Link> first.


// ============================================================
// 24. PARALLEL ROUTES
// ============================================================

// @slot syntax

/*
app/
├── layout.js
├── @analytics/
│   └── page.js
└── @team/
    └── page.js
*/

/*
Used when multiple route sections need to be rendered
independently in the same layout.

Example:
- Dashboard analytics
- Dashboard team panel
- Dashboard notifications
*/

// Advanced feature → know the concept;
// don't memorize complex patterns for normal projects.


// ============================================================
// 25. INTERCEPTING ROUTES
// ============================================================

// Route convention examples:

// (.)     → same level
// (..)    → one level above
// (..)(..)→ two levels above
// (...)   → root app level

/*
Common use case:

Product page
    ↓
Click product from feed
    ↓
Show product as modal

Direct URL
    ↓
Show full product page
*/

// Advanced routing feature.
// Use only when the UI actually needs this behavior.


// ============================================================
// 26. ROUTE-LEVEL LOADING
// ============================================================

/*
app/
└── dashboard/
    ├── page.js
    └── loading.js
*/

// loading.js automatically provides loading UI
// while the route is loading.


// ============================================================
// 27. ROUTE-LEVEL ERROR
// ============================================================

/*
app/
└── dashboard/
    ├── page.js
    └── error.js
*/

// error.js catches errors for that route segment
// and provides recovery UI.


// ============================================================
// 28. STATIC PARAMS
// ============================================================

// generateStaticParams()
// → Pre-generate known dynamic routes.

/*
app/
└── products/
    └── [id]/
        └── page.js
*/

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    id: product.id,
  }));
}

// Useful when known dynamic routes can be generated ahead of time.


// ============================================================
// 29. ROUTING QUICK RECALL
// ============================================================

/*
page.js
→ Route

[id]
→ Dynamic segment

[...slug]
→ Catch-all

[[...slug]]
→ Optional catch-all

(group)
→ Organize routes without changing URL

_folder
→ Private route folder

params
→ Dynamic URL segments

searchParams
→ Query string

<Link>
→ Normal navigation

useRouter()
→ Programmatic navigation

usePathname()
→ Current pathname

useSearchParams()
→ Read query params

redirect()
→ Server redirect

notFound()
→ 404

generateStaticParams()
→ Pre-generate dynamic routes

@slot
→ Parallel Routes

(.) / (..) / (...)
→ Intercepting Routes
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. How does routing work in the Next.js App Router?

A:
The folder structure inside app/ defines the URL structure,
and page.js defines the UI for that route.


Q2. What does [id] mean?

A:
It creates a dynamic route segment.

Example:
products/[id]/page.js
→ /products/123


Q3. What is the difference between [slug] and [...slug]?

A:
[slug] matches one segment.
[...slug] matches one or more segments as an array.


Q4. What is [[...slug]]?

A:
An optional catch-all route. It can match the route with
zero or more segments.


Q5. What are params and searchParams?

A:
params contains dynamic URL segments.
searchParams contains query-string values.


Q6. What is the difference?

/products/101?sort=price

params
→ { id: "101" }

searchParams
→ { sort: "price" }


Q7. Why should <Link> generally be preferred for navigation?

A:
It provides Next.js client-side navigation and can use
prefetching instead of performing a full page reload.


Q8. When should useRouter() be used?

A:
For programmatic navigation, such as redirecting after a
user action or successful operation.


Q9. What is the difference between push() and replace()?

A:
push() adds a new browser history entry.
replace() replaces the current history entry.


Q10. What does router.refresh() do?

A:
It requests a fresh server-rendered result for the current
route without doing a full browser reload.


Q11. What does redirect() do?

A:
It redirects the current request/navigation to another route
and is commonly used in server-side logic.


Q12. What does notFound() do?

A:
It stops rendering the current route and shows the nearest
not-found.js UI.


Q13. What is a Route Group?

A:
A folder wrapped in parentheses, such as (dashboard), that
helps organize routes without becoming part of the URL.


Q14. What are Parallel Routes?

A:
A way to render multiple route segments/slots independently
within the same layout.


Q15. What are Intercepting Routes useful for?

A:
They allow one route to display another route inside the
current UI, commonly for modal-based navigation.


Q16. What is generateStaticParams()?

A:
It provides known dynamic route parameters so Next.js can
pre-generate those routes.


Q17. Can useRouter() be used in a Server Component?

A:
No. useRouter() is a Client Component hook.


Q18. Can useSearchParams() be used in a Server Component?

A:
No. useSearchParams() is a Client Component hook. Server
Components can receive searchParams as a page prop.


Q19. What is the difference between redirect() and
permanentRedirect()?

A:
redirect() is used for normal redirects; permanentRedirect()
indicates that the resource has permanently moved.


Q20. What happens when a dynamic route doesn't find its data?

A:
The application can call notFound(), which renders the
nearest not-found.js UI.
*/


/*
============================================================
END
============================================================
*/
