/*
============================================================
Data fetching & Caching
============================================================

Focus:
- Server-side data fetching
- Client-side data fetching
- fetch()
- Parallel vs sequential fetching
- Request waterfalls
- Caching
- Revalidation
- Cache Components / "use cache"
- Cache invalidation
*/



// ============================================================
// 01. SERVER-SIDE DATA FETCHING
// ============================================================

// Server Components can fetch data directly.

export default async function ProductsPage() {
  const response = await fetch(
    "https://api.example.com/products"
  );

  const products = await response.json();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

/*
Server fetching is preferred when:

- Data is needed to render the page
- Data comes from a database
- Private API / secret is required
- Data doesn't need browser-only interaction
*/


// ============================================================
// 02. DATABASE FETCHING
// ============================================================

// Server Components can directly query a database.

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

/*
You don't need to create:

Browser
  ↓
API route
  ↓
Database

just to fetch server-side data.

Server Component
  ↓
Database
*/


// ============================================================
// 03. FETCH RESPONSE
// ============================================================

const response = await fetch("https://api.example.com/users");

if (!response.ok) {
  throw new Error("Failed to fetch users");
}

const users = await response.json();

/*
Important:

fetch() does NOT reject just because the server returns
HTTP 404 / 500.

Check:

response.ok
response.status
*/


// ============================================================
// 04. REQUEST HEADERS
// ============================================================

const response = await fetch(
  "https://api.example.com/users",
  {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();


// ============================================================
// 05. POST REQUEST
// ============================================================

const response = await fetch(
  "https://api.example.com/users",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "John",
      email: "john@example.com",
    }),
  }
);

const user = await response.json();


// ============================================================
// 06. ERROR HANDLING
// ============================================================

async function getUsers() {
  const response = await fetch(
    "https://api.example.com/users"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export default async function Page() {
  try {
    const users = await getUsers();

    return <pre>{JSON.stringify(users, null, 2)}</pre>;
  } catch (error) {
    return <p>Unable to load users.</p>;
  }
}


// ============================================================
// 07. SEQUENTIAL FETCHING
// ============================================================

// ❌ Second request waits for the first one.

const user = await getUser();
const posts = await getPosts();


// ============================================================
// 08. PARALLEL FETCHING
// ============================================================

// If requests don't depend on each other:

const [user, posts] = await Promise.all([
  getUser(),
  getPosts(),
]);

/*
Parallel fetching:

Request A ────────┐
                  ├──→ Result
Request B ────────┘

Usually faster than unnecessary sequential requests.
*/


// ============================================================
// 09. REQUEST WATERFALL
// ============================================================

/*
❌ Waterfall:

Page
 ↓
Request A
 ↓
Request B
 ↓
Request C

Each request waits for the previous one.
*/

/*
Better when independent:

Page
 ├── Request A
 ├── Request B
 └── Request C
*/

// Use Promise.all() when requests are independent.


// ============================================================
// 10. CLIENT-SIDE DATA FETCHING
// ============================================================

// Client fetching is useful for highly interactive data.

"use client";

import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

/*
Useful for:

- Client interactions
- Live updates
- Browser-dependent data
- Data that changes frequently on the client
*/


// ============================================================
// 11. SERVER vs CLIENT FETCHING
// ============================================================

/*
Server:

Server Component
    ↓
Database / API
    ↓
UI

Best when:
- Initial page data
- Private data
- Server resources
- SEO/content rendering


Client:

Client Component
    ↓
Browser
    ↓
API
    ↓
State

Best when:
- User interaction controls the request
- Browser-only behavior
- Frequent client-side updates
*/


// ============================================================
// 12. NEXT.JS CACHING — BIG PICTURE
// ============================================================

/*
Modern Next.js has multiple caching layers/concepts.

Important:

1. Request/Data caching
2. Full Route Cache
3. Router Cache
4. Cache Components / "use cache"

Don't confuse them.
*/


// ============================================================
// 13. "use cache"
// ============================================================

// Modern Next.js caching model.

// Example:

"use cache";

export async function getProducts() {
  const response = await fetch(
    "https://api.example.com/products"
  );

  return response.json();
}

/*
"use cache"
→ Marks the function/component for caching.

Cache Components are enabled/configured as part of the
modern Next.js caching model.
*/


// ============================================================
// 14. CACHE COMPONENTS
// ============================================================

/*
Without caching:

Request
  ↓
Run server code
  ↓
Return result


With cached component/data:

Request
  ↓
Cache
  ├── HIT  → return cached result
  └── MISS → run code → store result
*/

/*
Useful for:

- Expensive database queries
- External API data
- Reusable server-generated content
*/


// ============================================================
// 15. cacheLife()
// ============================================================

import { cacheLife } from "next/cache";

export async function getProducts() {
  "use cache";

  cacheLife("hours");

  return db.product.findMany();
}

/*
cacheLife()
→ Controls how long cached data remains fresh.

Use a suitable profile/strategy instead of manually managing
time everywhere.
*/


// ============================================================
// 16. cacheTag()
// ============================================================

import { cacheTag } from "next/cache";

export async function getProduct(id) {
  "use cache";

  cacheTag(`product:${id}`);

  return db.product.findUnique({
    where: { id },
  });
}

/*
Tag cache entries so they can later be invalidated
selectively.
*/


// ============================================================
// 17. REVALIDATION
// ============================================================

/*
Revalidation means:

"Cached data can become stale and should be refreshed."
*/

/*
Two common ideas:

Time-based
→ Revalidate after a period

On-demand
→ Revalidate after a mutation/event
*/


// ============================================================
// 18. REVALIDATE PATH
// ============================================================

import { revalidatePath } from "next/cache";

revalidatePath("/products");

/*
Invalidates/revalidates cached information associated with
the specified path.

Useful after:

Create product
Update product
Delete product
*/


// ============================================================
// 19. REVALIDATE TAG
// ============================================================

import { revalidateTag } from "next/cache";

// Example:
revalidateTag("products");

/*
Useful when multiple pages/components use the same tagged
data.

Path-based:
→ Which route?

Tag-based:
→ Which data?
*/


// ============================================================
// 20. UPDATE TAG
// ============================================================

import { updateTag } from "next/cache";

// Example:
updateTag(`product:${id}`);

/*
Useful in Server Functions when data has changed and the
current request should see updated data.

Think:

revalidateTag()
→ Mark/revalidate tagged cache

updateTag()
→ Update/invalidate tagged cached data immediately for
  the current flow
*/


// ============================================================
// 21. CACHING + MUTATION
// ============================================================

/*
Example:

User updates product
        ↓
Database updated
        ↓
Invalidate related cache
        ↓
UI gets fresh data
*/

/*
Without invalidation:

Database = NEW data
Cache    = OLD data

User may still see stale information.
*/


// ============================================================
// 22. FETCH CACHING — IMPORTANT NOTE
// ============================================================

/*
Do NOT rely on old mental models like:

"Every fetch in Next.js is automatically cached."

Modern Next.js uses the newer Cache Components model.

Explicitly decide what should be cached and how it should
be revalidated.
*/


// ============================================================
// 23. FULL ROUTE CACHE — CONCEPT
// ============================================================

/*
Next.js can cache rendered route output.

Concept:

Route
  ↓
Render
  ↓
Cached output
  ↓
Future requests
*/

/*
Whether a route can be cached depends on:

- Rendering behavior
- Dynamic data
- Cache configuration
- Revalidation
*/


// ============================================================
// 24. ROUTER CACHE — CONCEPT
// ============================================================

/*
Router Cache is client-side.

It can keep previously visited route segments in memory
during navigation.

This helps make client-side navigation faster.
*/


// ============================================================
// 25. CACHE LAYERS — QUICK DIFFERENCE
// ============================================================

/*
Data / Function Cache
→ Cached server data/result

Full Route Cache
→ Cached rendered route output

Router Cache
→ Client-side cached route segments

Cache Components
→ Modern explicit caching model
   using "use cache"
*/


// ============================================================
// 26. DYNAMIC DATA
// ============================================================

/*
Examples:

- User-specific dashboard
- Current session
- Request-specific information
- Frequently changing data

These may require dynamic rendering or carefully designed
caching.
*/


// ============================================================
// 27. PERSONALIZED DATA
// ============================================================

export default async function Dashboard() {
  const user = await getCurrentUser();

  return <h1>Hello {user.name}</h1>;
}

/*
Be careful when caching personalized data.

A user's private data must never accidentally be served
from a shared cache to another user.
*/


// ============================================================
// 28. CACHING DECISION
// ============================================================

/*
Ask:

1. Is the data expensive to calculate/fetch?
2. Can multiple users share the result?
3. How fresh must the data be?
4. When should it become invalid?
5. Is the data user-specific?

Then decide:

→ Cache
→ Revalidate
→ Keep dynamic
*/


// ============================================================
// 29. PRACTICAL PATTERN
// ============================================================

// Server data function:

import { cacheLife, cacheTag } from "next/cache";

export async function getProducts() {
  "use cache";

  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany();
}


// Server Component:

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
}


// After mutation:

import { revalidateTag } from "next/cache";

export async function updateProduct(id, data) {
  await db.product.update({
    where: { id },
    data,
  });

  revalidateTag("products");
}


// ============================================================
// 30. DATA FETCHING QUICK RECALL
// ============================================================

/*
Server Component
→ Preferred for initial/server data

Client Component
→ Interactive/browser-dependent data

Independent requests
→ Promise.all()

Dependent requests
→ Sequential await

fetch()
→ Does not reject automatically on HTTP 4xx/5xx

response.ok
→ Check HTTP success

"use cache"
→ Explicit caching model

cacheLife()
→ Cache lifetime/freshness profile

cacheTag()
→ Tag cached data

revalidatePath()
→ Revalidate by route/path

revalidateTag()
→ Revalidate by cache tag

updateTag()
→ Update/invalidate tagged cached data for current flow

Full Route Cache
→ Cached rendered route output

Router Cache
→ Client-side route segment cache
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. Where should data fetching happen in Next.js?

A:
Prefer Server Components for server-side/initial data fetching.
Use Client Components when the data depends on client-side
interaction or browser state.


Q2. Can a Server Component directly query a database?

A:
Yes. Server Components run on the server.


Q3. What is a request waterfall?

A:
When one request waits for another request unnecessarily,
creating a chain of sequential network/database operations.


Q4. How do you run independent requests in parallel?

A:
Use Promise.all().

const [users, posts] = await Promise.all([
  getUsers(),
  getPosts(),
]);


Q5. Does fetch() reject when the server returns 404?

A:
No. HTTP errors such as 404 or 500 do not automatically
reject the Promise. Check response.ok or response.status.


Q6. When is client-side data fetching useful?

A:
For browser-dependent data, highly interactive UI, live
updates or requests controlled by client-side state.


Q7. What does "use cache" do?

A:
It marks a component/function for the modern explicit
Next.js caching model.


Q8. What is cacheLife() used for?

A:
It controls the freshness/lifetime behavior of cached data.


Q9. What is cacheTag() used for?

A:
It associates cached data with a tag so related cache entries
can be invalidated or revalidated later.


Q10. What is revalidatePath()?

A:
It invalidates/revalidates cached information associated with
a specific route path.


Q11. What is revalidateTag()?

A:
It revalidates cached data associated with a specific cache tag.


Q12. Why is cache invalidation important after a mutation?

A:
Without invalidation, the database may contain new data while
the application still serves stale cached data.


Q13. What is the Full Route Cache?

A:
A server-side cache for rendered route output.


Q14. What is the Router Cache?

A:
A client-side cache of route segments used during navigation.


Q15. Should personalized user data be blindly cached?

A:
No. Shared caching of personalized data can expose one user's
data to another user if the cache is not correctly scoped.


Q16. What is the main caching question you should ask?

A:
What can be cached, for how long, for whom, and when should it
be invalidated?


Q17. What is the difference between path-based and tag-based
cache invalidation?

A:
Path-based invalidation targets a route/path.
Tag-based invalidation targets related cached data regardless
of which route uses it.


Q18. Why is Promise.all() not always appropriate?

A:
If requests depend on each other's results, they must be
performed sequentially.


Q19. Why should server-side data fetching usually be preferred
for initial page data?

A:
It keeps data access on the server, can protect secrets,
reduces unnecessary client-side JavaScript and can improve
initial rendering.


Q20. What is the biggest caching mistake in a full-stack app?

A:
Caching data without considering freshness, invalidation and
whether the data is shared or user-specific.
*/


/*
============================================================
END
============================================================
*/
