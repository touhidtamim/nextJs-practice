/*
============================================================
Server Client Components
============================================================

Focus:
- React Server Components
- Server vs Client Components
- "use client"
- Component boundaries
- Props & serialization
- Server-only / client-only code
- Composition patterns
- Context / providers
- Common mistakes

Revision material — not documentation.
*/


// ============================================================
// 01. SERVER COMPONENTS
// ============================================================

// In the App Router, components are Server Components by default.

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

/*
Server Components can:

✓ Fetch data
✓ Access database/server resources
✓ Use private environment variables
✓ Keep server-only logic on the server
✓ Reduce client-side JavaScript

Server Components cannot directly use:

✗ useState
✗ useEffect
✗ Event handlers like onClick
✗ Browser APIs like window/localStorage
*/


// ============================================================
// 02. CLIENT COMPONENTS
// ============================================================

// "use client" creates a Client Component boundary.

"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

/*
Use Client Components when you need:

- State
- Effects
- Event handlers
- Browser APIs
- Client-side interactivity
*/


// ============================================================
// 03. "use client" IS A BOUNDARY
// ============================================================

// Example:

// Counter.js

"use client";

import Button from "./Button";

export default function Counter() {
  return <Button />;
}

/*
Components imported into this client boundary become part
of the client component tree.

Therefore:

Don't put "use client" unnecessarily high in the tree.
*/


// ============================================================
// 04. SERVER vs CLIENT
// ============================================================

/*
                    Component
                       │
             ┌─────────┴─────────┐
             │                   │
          Server               Client
             │                   │
       Data / DB /           State / Events /
       Secrets / APIs        Browser APIs
             │                   │
             └─────────┬─────────┘
                       ↓
                    Browser
*/


// ============================================================
// 05. WHEN TO USE SERVER COMPONENT
// ============================================================

// Prefer Server Component when the UI does not need
// client-side interactivity.

export default async function UserProfile() {
  const user = await getUser();

  return (
    <section>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  );
}


// ============================================================
// 06. WHEN TO USE CLIENT COMPONENT
// ============================================================

// Interactive UI:

"use client";

import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

/*
Rule:

Need interaction/state/browser API?
→ Client Component

Otherwise:
→ Prefer Server Component
*/


// ============================================================
// 07. SERVER COMPONENT → CLIENT COMPONENT
// ============================================================

// Server Component

import LikeButton from "./LikeButton";

export default async function PostPage() {
  const post = await getPost();

  return (
    <article>
      <h1>{post.title}</h1>

      <LikeButton postId={post.id} />
    </article>
  );
}


// LikeButton.js

"use client";

export default function LikeButton({ postId }) {
  return (
    <button onClick={() => console.log(postId)}>
      Like
    </button>
  );
}

/*
Server Component
      ↓
passes props
      ↓
Client Component
*/


// ============================================================
// 08. PROPS MUST BE SERIALIZABLE
// ============================================================

// Server → Client props should be serializable.

/*
Good:

string
number
boolean
null
plain objects
arrays
*/

// Avoid passing non-serializable values such as:

// functions
// class instances
// complex server-only objects

// Instead, pass the data the Client Component actually needs.


// ============================================================
// 09. SERVER COMPONENT → SERVER COMPONENT
// ============================================================

// Normal composition:

async function UserInfo() {
  const user = await getUser();

  return <p>{user.name}</p>;
}

export default function Page() {
  return (
    <main>
      <UserInfo />
    </main>
  );
}

// Server Components can freely compose other Server Components.


// ============================================================
// 10. CLIENT COMPONENT → CLIENT COMPONENT
// ============================================================

"use client";

function Button() {
  return <button>Click</button>;
}

export default function Toolbar() {
  return (
    <div>
      <Button />
    </div>
  );
}


// ============================================================
// 11. SERVER COMPONENT INSIDE CLIENT COMPONENT
// ============================================================

// Don't directly import a Server Component into a Client
// Component expecting it to execute on the server.

// Instead, use composition with children/props.

/*
Server Component
      ↓
      children
      ↓
Client Component
*/


// Example:

// Server Component

import ClientShell from "./ClientShell";
import ServerContent from "./ServerContent";

export default function Page() {
  return (
    <ClientShell>
      <ServerContent />
    </ClientShell>
  );
}


// ClientShell.js

"use client";

export default function ClientShell({ children }) {
  return <div>{children}</div>;
}

/*
The server-rendered content can remain a Server Component
while the surrounding shell provides client interactivity.
*/


// ============================================================
// 12. CHILDREN COMPOSITION PATTERN
// ============================================================

// Useful when a Client Component provides interaction
// around server-rendered content.

/*
Server
  ↓
<ClientWrapper>
    <ServerContent />
</ClientWrapper>
*/


// ============================================================
// 13. CONTEXT PROVIDERS
// ============================================================

// React Context requires Client Components.

"use client";

import { createContext } from "react";

export const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

/*
Keep providers as low in the component tree as practical.

Avoid making the entire application Client-side just
because a provider is needed.
*/


// ============================================================
// 14. THIRD-PARTY CLIENT LIBRARIES
// ============================================================

// Some libraries depend on:
// - browser APIs
// - React hooks
// - client-side effects

// They may need to be used inside a Client Component.

/*
Example:

"use client";

import SomeInteractiveLibrary from "some-library";
*/


// ============================================================
// 15. SERVER-ONLY MODULE
// ============================================================

// lib/db.js

import "server-only";

export async function getUsers() {
  // database access
}

/*
This helps prevent accidental import of server-only code
into Client Components.
*/


// ============================================================
// 16. CLIENT-ONLY MODULE
// ============================================================

// For browser-only modules:

import "client-only";

export function getBrowserWidth() {
  return window.innerWidth;
}

// Prevents accidental use from server-side code.


// ============================================================
// 17. SERVER COMPONENTS + DATABASE
// ============================================================

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
Server Component
      ↓
Database
      ↓
HTML / RSC payload
      ↓
Browser

No need to create a public API only for this server-side
data access.
*/


// ============================================================
// 18. SERVER COMPONENTS + SECRET
// ============================================================

export default async function Page() {
  const response = await fetch(
    process.env.PRIVATE_API_URL,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
    }
  );

  const data = await response.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

/*
Private API key stays on the server.

Do NOT expose it through:

NEXT_PUBLIC_API_SECRET
*/


// ============================================================
// 19. CLIENT COMPONENT + SERVER DATA
// ============================================================

// Server Component

import InteractiveList from "./InteractiveList";

export default async function Page() {
  const products = await getProducts();

  return (
    <InteractiveList products={products} />
  );
}


// Client Component

"use client";

export default function InteractiveList({ products }) {
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

/*
Fetch data on the server when possible,
then pass only the required data to the Client Component.
*/


// ============================================================
// 20. COMMON WRONG PATTERN
// ============================================================

// ❌ Making the entire page client-side unnecessarily:

"use client";

export default function Dashboard() {
  // Everything becomes part of client-side application
  // even if most of the UI doesn't need interaction.

  return <div>Dashboard</div>;
}

/*
Better:

Server Component
    ↓
Interactive Client Components only where required
*/


// ============================================================
// 21. SERVER ACTION vs SERVER COMPONENT
// ============================================================

/*
Server Component
→ Mainly renders UI / fetches server-side data.

Server Function / Server Action
→ Performs server-side operation/mutation.

Example:

Server Component
→ Show products

Server Function
→ Create/update/delete product

Details:
05_server_functions_and_forms.js
*/


// ============================================================
// 22. CLIENT COMPONENT AND DATA FETCHING
// ============================================================

// Client-side fetching is useful when data depends heavily
// on browser interaction or needs live client updates.

/*
Examples:

- Search suggestions
- Live notifications
- Browser-dependent data
- Frequently changing client state
*/

// Don't automatically fetch everything from the client.


// ============================================================
// 23. HYDRATION — QUICK CONCEPT
// ============================================================

/*
Hydration:
React attaches client-side behavior to the server-rendered
UI so Client Components become interactive.
*/

// Important mainly for understanding:

// Server-rendered UI
//       ↓
// Browser receives result
//       ↓
// Client JavaScript hydrates interactive parts


// ============================================================
// 24. COMMON MISTAKES
// ============================================================

/*
❌ Using "use client" everywhere

❌ Accessing window/localStorage in Server Components

❌ Using useState/useEffect in Server Components

❌ Exposing secrets to Client Components

❌ Passing non-serializable data unnecessarily

❌ Turning an entire page into a Client Component for
   one small interactive element

❌ Importing server-only code into client code
*/


// ============================================================
// 25. BEST-PRACTICE MENTAL MODEL
// ============================================================

/*
Default:
→ Server Component

Need:
  state?
  event?
  effect?
  browser API?
       ↓
→ Small Client Component

Need:
  DB?
  secret?
  server API?
       ↓
→ Server Component / Server Function / Route Handler
*/


// ============================================================
// 26. QUICK RECALL
// ============================================================

/*
Server Component
→ Default
→ Server-side data/resources
→ No client hooks/events

Client Component
→ "use client"
→ State/events/browser APIs

"use client"
→ Creates client boundary

Props
→ Server → Client data should be serializable

Context
→ Client-side feature
→ Keep provider boundary small

server-only
→ Protect server-only modules

client-only
→ Protect browser-only modules

Composition
→ Keep server rendering while adding small interactive
   client components
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is the default component type in the Next.js App Router?

A:
Server Component.


Q2. What does "use client" do?

A:
It marks a module as a Client Component boundary, allowing
client-side features such as state, effects and event handlers.


Q3. Why shouldn't every component be a Client Component?

A:
It increases client-side JavaScript and removes the benefits
of keeping non-interactive work on the server.


Q4. Can Server Components use useState?

A:
No. useState requires a Client Component.


Q5. Can Server Components access a database?

A:
Yes. They run on the server and can directly access server-side
resources.


Q6. Can Client Components access private environment variables?

A:
No. Private secrets must remain on the server.


Q7. Why use server-only?

A:
It helps prevent a server-only module from being accidentally
imported into Client Components.


Q8. What is the main benefit of Server Components?

A:
They allow server-side work while reducing the amount of
JavaScript that needs to be sent to the browser.


Q9. How can a Server Component provide data to a Client Component?

A:
Fetch/prepare the data on the server and pass the required
serializable data as props.


Q10. Can a Client Component directly import a Server Component?

A:
A Client Component should not directly import a Server
Component as a way to make that Server Component execute
on the server. Use composition, such as passing Server
Components as children.


Q11. How can a Client Component wrap Server Component content?

A:
A Server Component can pass the Server Component as children
to a Client Component.


Q12. Why is React Context usually a Client Component concern?

A:
React Context uses client-side React features and therefore
the provider generally needs to be a Client Component.


Q13. Should a Context Provider make the whole application
Client-side?

A:
No. Keep the provider boundary as small as practical.


Q14. When should you choose Client-side data fetching?

A:
When the data depends heavily on client interaction, browser
state or needs frequent client-side updates.


Q15. What is hydration?

A:
The process where React attaches client-side behavior to
server-rendered UI so interactive components can work.


Q16. What is the main architectural rule for Server/Client
Components?

A:
Keep components on the server by default and move only the
interactive/browser-dependent parts to the client.
*/


/*
============================================================
END
============================================================
*/

