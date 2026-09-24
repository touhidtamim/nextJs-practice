/*
============================================================
    Route Handlers and Api's
============================================================

Focus:
- Route Handlers
- HTTP methods
- Request / Response
- Dynamic API routes
- Query params
- Headers
- Cookies
- JSON responses
- Status codes
- Validation
- Webhooks
- Route Handler vs Server Function
- Basic API security


*/



// ============================================================
// 01. ROUTE HANDLERS
// ============================================================

/*
Route Handler
→ Build HTTP endpoints inside the app/ directory.

File:
app/api/users/route.js

URL:
GET /api/users
POST /api/users
*/

export async function GET() {
  return Response.json({
    message: "Users API",
  });
}


// ============================================================
// 02. HTTP METHODS
// ============================================================

/*
Supported methods commonly used:

GET
POST
PUT
PATCH
DELETE
HEAD
OPTIONS
*/

export async function GET() {
  return Response.json({
    users: [],
  });
}

export async function POST() {
  return Response.json({
    message: "User created",
  });
}

export async function PUT() {
  return Response.json({
    message: "User replaced",
  });
}

export async function PATCH() {
  return Response.json({
    message: "User updated",
  });
}

export async function DELETE() {
  return Response.json({
    message: "User deleted",
  });
}


// ============================================================
// 03. REQUEST OBJECT
// ============================================================

export async function POST(request) {
  const body = await request.json();

  return Response.json({
    received: body,
  });
}

/*
Useful Request properties/methods:

request.json()
request.text()
request.formData()
request.headers
request.url
request.method
*/


// ============================================================
// 04. JSON REQUEST
// ============================================================

// Client sends:

/*
POST /api/users

{
  "name": "John",
  "email": "john@example.com"
}
*/

// Route Handler:

export async function POST(request) {
  const { name, email } = await request.json();

  return Response.json({
    name,
    email,
  });
}


// ============================================================
// 05. RESPONSE
// ============================================================

export async function GET() {
  return Response.json(
    {
      message: "Success",
    },
    {
      status: 200,
    }
  );
}


// ============================================================
// 06. IMPORTANT HTTP STATUS CODES
// ============================================================

/*
200
→ OK

201
→ Created

204
→ No Content

400
→ Bad Request

401
→ Unauthenticated

403
→ Forbidden

404
→ Not Found

409
→ Conflict

422
→ Validation problem

429
→ Too Many Requests

500
→ Internal Server Error
*/


// ============================================================
// 07. CREATED RESPONSE
// ============================================================

export async function POST() {
  const user = {
    id: "101",
    name: "John",
  };

  return Response.json(
    user,
    {
      status: 201,
    }
  );
}


// ============================================================
// 08. ERROR RESPONSE
// ============================================================

export async function GET() {
  const user = null;

  if (!user) {
    return Response.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(user);
}


// ============================================================
// 09. QUERY PARAMETERS
// ============================================================

// URL:
// /api/products?category=phone&page=2

export async function GET(request) {
  const { searchParams } =
    new URL(request.url);

  const category =
    searchParams.get("category");

  const page =
    searchParams.get("page");

  return Response.json({
    category,
    page,
  });
}

/*
searchParams.get()
→ Read one query value
*/


// ============================================================
// 10. MULTIPLE QUERY VALUES
// ============================================================

// /api/products?tag=js&tag=react

export async function GET(request) {
  const { searchParams } =
    new URL(request.url);

  const tags = searchParams.getAll("tag");

  return Response.json({
    tags,
  });
}


// ============================================================
// 11. DYNAMIC API ROUTES
// ============================================================

/*
app/
└── api/
    └── users/
        └── [id]/
            └── route.js
*/

/*
GET /api/users/101
→ params.id = "101"
*/

export async function GET(request, { params }) {
  const { id } = await params;

  return Response.json({
    userId: id,
  });
}


// ============================================================
// 12. DYNAMIC API + DATABASE
// ============================================================

export async function GET(request, { params }) {
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) {
    return Response.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(user);
}


// ============================================================
// 13. REQUEST HEADERS
// ============================================================

export async function GET(request) {
  const authorization =
    request.headers.get("authorization");

  return Response.json({
    hasAuthHeader: Boolean(authorization),
  });
}


// ============================================================
// 14. RESPONSE HEADERS
// ============================================================

export async function GET() {
  return Response.json(
    {
      message: "Hello",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}


// ============================================================
// 15. COOKIES
// ============================================================

import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const session =
    cookieStore.get("session");

  return Response.json({
    loggedIn: Boolean(session),
  });
}


// ============================================================
// 16. SET COOKIE
// ============================================================

import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set(
    "session",
    "session-value",
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    }
  );

  return Response.json({
    success: true,
  });
}

/*
Important cookie security options:

httpOnly
→ JavaScript cannot read it

secure
→ Send over HTTPS

sameSite
→ Controls cross-site cookie sending

path
→ Cookie scope
*/


// ============================================================
// 17. DELETE COOKIE
// ============================================================

import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("session");

  return Response.json({
    success: true,
  });
}


// ============================================================
// 18. AUTH CHECK IN API
// ============================================================

import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const session =
    cookieStore.get("session");

  if (!session) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  return Response.json({
    message: "Authenticated",
  });
}

/*
Authentication
→ Who are you?

Authorization
→ Are you allowed to do this?
*/


// ============================================================
// 19. AUTHORIZATION
// ============================================================

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await params;

  await db.user.delete({
    where: { id },
  });

  return new Response(null, {
    status: 204,
  });
}


// ============================================================
// 20. INPUT VALIDATION
// ============================================================

import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

export async function POST(request) {
  const body = await request.json();

  const result =
    UserSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        error: "Invalid input",
      },
      {
        status: 400,
      }
    );
  }

  const user = await db.user.create({
    data: result.data,
  });

  return Response.json(
    user,
    {
      status: 201,
    }
  );
}

/*
Never trust:

- Request body
- Query params
- URL params
- Headers
- Cookies

Validate before using sensitive input.
*/


// ============================================================
// 21. API ERROR HANDLING
// ============================================================

export async function GET() {
  try {
    const users =
      await db.user.findMany();

    return Response.json(users);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

/*
Don't expose:

error.stack
database errors
internal paths
secrets

to API clients.
*/


// ============================================================
// 22. WEBHOOKS
// ============================================================

/*
Webhook:

External service
      ↓
POST /api/webhook
      ↓
Your server

Examples:

- Payment provider
- GitHub
- Email service
- Other external systems
*/

export async function POST(request) {
  const payload = await request.json();

  // Verify webhook signature
  // Process event

  return Response.json({
    received: true,
  });
}

/*
IMPORTANT:

For real webhooks:
→ Verify signature
→ Validate payload
→ Handle duplicate events safely
→ Return appropriate status
*/


// ============================================================
// 23. RAW REQUEST BODY
// ============================================================

/*
Some webhook providers require the raw request body
for signature verification.

Don't always call request.json() first.

Use:

const body = await request.text();

Then verify the signature against the raw body.
*/


// ============================================================
// 24. CORS — BASIC
// ============================================================

export async function GET() {
  return Response.json(
    {
      message: "Public API",
    },
    {
      headers: {
        "Access-Control-Allow-Origin":
          "https://example.com",
      },
    }
  );
}

/*
CORS controls which browser origins may call an API.

Avoid blindly using:

Access-Control-Allow-Origin: *

for private/sensitive APIs.
*/


// ============================================================
// 25. OPTIONS
// ============================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":
        "https://example.com",

      "Access-Control-Allow-Methods":
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",

      "Access-Control-Allow-Headers":
        "Content-Type, Authorization",
    },
  });
}


// ============================================================
// 26. ROUTE HANDLER + DATABASE CRUD
// ============================================================

// app/api/products/route.js

export async function GET() {
  const products =
    await db.product.findMany();

  return Response.json(products);
}

export async function POST(request) {
  const body = await request.json();

  const product =
    await db.product.create({
      data: body,
    });

  return Response.json(
    product,
    {
      status: 201,
    }
  );
}


// ============================================================
// 27. ROUTE HANDLER + DYNAMIC CRUD
// ============================================================

// app/api/products/[id]/route.js

export async function GET(request, { params }) {
  const { id } = await params;

  const product =
    await db.product.findUnique({
      where: { id },
    });

  if (!product) {
    return Response.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return Response.json(product);
}


export async function PATCH(request, { params }) {
  const { id } = await params;

  const body = await request.json();

  const product =
    await db.product.update({
      where: { id },
      data: body,
    });

  return Response.json(product);
}


export async function DELETE(request, { params }) {
  const { id } = await params;

  await db.product.delete({
    where: { id },
  });

  return new Response(null, {
    status: 204,
  });
}


// ============================================================
// 28. ROUTE HANDLER vs SERVER FUNCTION
// ============================================================

/*
Server Function:

UI
 ↓
Server Function
 ↓
Database


Route Handler:

Client / external service
 ↓
HTTP request
 ↓
Route Handler
 ↓
Database
*/

/*
Server Function:
→ UI-driven server mutations
→ Forms
→ Internal app operations

Route Handler:
→ HTTP API
→ External clients
→ Webhooks
→ Custom HTTP behavior
*/


// ============================================================
// 29. ROUTE HANDLER vs PAGE
// ============================================================

/*
page.js
→ UI

route.js
→ HTTP endpoint

Example:

app/products/page.js
→ /products
→ HTML/UI

app/api/products/route.js
→ /api/products
→ HTTP API
*/


// ============================================================
// 30. RUNTIME
// ============================================================

// Route Handlers can run on supported Next.js runtimes.

// Default/general choice:
// Node.js runtime

export const runtime = "nodejs";

// Edge when specifically needed:

// export const runtime = "edge";

/*
Choose Edge only when its runtime/API limitations are
compatible with your application.
*/


// ============================================================
// 31. API DESIGN BASICS
// ============================================================

/*
Good:

GET    /api/products
POST   /api/products

GET    /api/products/123
PATCH  /api/products/123
DELETE /api/products/123

Avoid designing everything as:

POST /api/doEverything
*/


// ============================================================
// 32. BASIC API SECURITY CHECKLIST
// ============================================================

/*
✓ Validate request body
✓ Validate query params
✓ Validate route params
✓ Authenticate private endpoints
✓ Authorize actions
✓ Use HTTPS
✓ Protect cookies
✓ Verify webhook signatures
✓ Avoid leaking server errors
✓ Rate-limit sensitive/public endpoints
✓ Never trust client-provided roles/permissions
*/


// ============================================================
// 33. QUICK RECALL
// ============================================================

/*
route.js
→ HTTP endpoint

GET()
→ Read

POST()
→ Create

PUT()
→ Replace

PATCH()
→ Partial update

DELETE()
→ Delete

request.json()
→ Parse JSON body

request.headers
→ Read headers

new URL(request.url)
→ Read query params

cookies()
→ Read/write cookies

Response.json()
→ JSON response

401
→ Unauthenticated

403
→ Authenticated but not allowed

404
→ Not found

201
→ Created

204
→ No content

Route Handler
→ HTTP/API layer

Server Function
→ UI-triggered server operation

Webhook
→ External service → your endpoint
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is a Route Handler?

A:
A server-side HTTP endpoint defined using route.js inside
the app/ directory.


Q2. Where do you create an API endpoint?

A:

app/api/users/route.js

→ /api/users


Q3. Which HTTP methods can Route Handlers implement?

A:
GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS.


Q4. How do you read a JSON request body?

A:

const body = await request.json();


Q5. How do you read query parameters?

A:

const { searchParams } =
  new URL(request.url);

const page = searchParams.get("page");


Q6. How do you access a dynamic route parameter?

A:

export async function GET(request, { params }) {
  const { id } = await params;
}


Q7. What is the difference between 401 and 403?

A:
401 means the request is not authenticated.
403 means the requester is authenticated but not allowed
to perform the operation.


Q8. Why should API input be validated on the server?

A:
Clients can send arbitrary requests. Server-side validation
protects the application and database from invalid or
malicious input.


Q9. How do you set a cookie in a Route Handler?

A:
Use cookies() from next/headers and call cookieStore.set().


Q10. Why is httpOnly important for authentication cookies?

A:
It prevents normal client-side JavaScript from reading the
cookie, reducing exposure to certain XSS-based cookie theft.


Q11. What is a webhook?

A:
An HTTP endpoint that receives event notifications from
another service.


Q12. Why should webhook signatures be verified?

A:
To ensure the request actually came from the expected
provider and was not forged.


Q13. Why might request.text() be needed instead of request.json()
for a webhook?

A:
Some providers calculate signatures from the exact raw request
body. Parsing and re-serializing JSON can change the bytes.


Q14. Route Handler vs Server Function?

A:
A Route Handler exposes an HTTP endpoint. A Server Function is
primarily a server-side function invoked by the application UI.


Q15. When should you use a Route Handler?

A:
For APIs, external consumers, webhooks, custom HTTP behavior
and situations where an actual HTTP endpoint is required.


Q16. What is the purpose of CORS?

A:
It controls which browser origins are allowed to make
cross-origin requests to an API.


Q17. Why shouldn't sensitive APIs blindly use
Access-Control-Allow-Origin: *?

A:
It allows requests from any browser origin and may expose
resources more broadly than intended.


Q18. What should a secure API check before a sensitive mutation?

A:
Validate input, authenticate the requester, authorize the
operation and then perform the mutation.


Q19. What is the difference between PUT and PATCH?

A:
PUT generally represents replacing a resource, while PATCH
represents a partial update.


Q20. Should client-provided role data be trusted?

A:
No. Roles and permissions must be determined and enforced
server-side.
*/


/*
============================================================
END
============================================================
*/
