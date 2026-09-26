/*
============================================================
Authentication & Authorization
============================================================

Focus:
- Authentication vs Authorization
- Sessions
- Cookies
- Protected Routes
- Middleware / Proxy concept
- Route protection
- Server-side auth checks
- JWT basics
- OAuth basics
- Login / Logout flow
- Security essentials

*/



// ============================================================
// 01. AUTHENTICATION vs AUTHORIZATION
// ============================================================

/*
Authentication
→ Who are you?

Authorization
→ What are you allowed to do?

Example:

Login
→ Authentication

Admin can delete users
→ Authorization
*/


// ============================================================
// 02. BASIC AUTH FLOW
// ============================================================

/*
User
 ↓
Login form
 ↓
Server
 ↓
Verify credentials
 ↓
Create session
 ↓
Set secure cookie
 ↓
User accesses protected route
 ↓
Server verifies session
 ↓
Allow / deny
*/


// ============================================================
// 03. LOGIN
// ============================================================

"use server";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Validate input

  // 2. Find user
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      error: "Invalid credentials",
    };
  }

  // 3. Compare password hash
  const valid = await verifyPassword(
    password,
    user.passwordHash
  );

  if (!valid) {
    return {
      error: "Invalid credentials",
    };
  }

  // 4. Create session
  const session = await createSession(user.id);

  // 5. Store session identifier in secure cookie

  return {
    success: true,
  };
}


// ============================================================
// 04. PASSWORDS
// ============================================================

/*
NEVER:

password → database

Instead:

password
   ↓
password hashing
   ↓
passwordHash
   ↓
database
*/

/*
Use a password hashing algorithm/library designed for passwords.

Examples:

- Argon2
- bcrypt

Never use plain SHA-256 as a password hashing solution.
*/


// ============================================================
// 05. SESSION
// ============================================================

/*
Session:

User
 ↓
Session ID
 ↓
Server-side session store

Cookie:
sessionId=abc123
*/

/*
Server stores:

abc123 → userId: 42
*/


// ============================================================
// 06. SESSION COOKIE
// ============================================================

import { cookies } from "next/headers";

export async function setSessionCookie(sessionId) {
  const cookieStore = await cookies();

  cookieStore.set(
    "session",
    sessionId,
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    }
  );
}

/*
Important:

httpOnly
→ JavaScript cannot access cookie

secure
→ HTTPS only

sameSite
→ Controls cross-site sending

path
→ Cookie scope
*/


// ============================================================
// 07. GET CURRENT USER
// ============================================================

import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const sessionId =
    cookieStore.get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const session =
    await db.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

  return session?.user ?? null;
}

/*
Server-side helper:

getCurrentUser()
→ Central place for reading the current session.
*/


// ============================================================
// 08. PROTECTED SERVER COMPONENT
// ============================================================

import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>{user.name}</p>
    </main>
  );
}

/*
Important:

Protection must happen on the server.

Don't rely only on:

if (!user) hide button

The API/server mutation must also verify authorization.
*/


// ============================================================
// 09. PROTECTED SERVER FUNCTION
// ============================================================

"use server";

export async function deleteAccount() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.user.delete({
    where: {
      id: user.id,
    },
  });
}

/*
Every sensitive server operation should verify the user
again.

UI protection ≠ security.
*/


// ============================================================
// 10. AUTHORIZATION
// ============================================================

export async function deleteUser(targetUserId) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  await db.user.delete({
    where: {
      id: targetUserId,
    },
  });
}

/*
Authentication:
→ Is there a valid user?

Authorization:
→ Does that user have permission?
*/


// ============================================================
// 11. ROLE-BASED ACCESS CONTROL
// ============================================================

/*
Example roles:

user
admin
editor
moderator
*/

/*
user
→ Own profile

editor
→ Manage content

admin
→ Manage users + system
*/


// ============================================================
// 12. OWNERSHIP CHECK
// ============================================================

export async function updatePost(
  postId,
  data
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Not found");
  }

  if (post.authorId !== user.id) {
    throw new Error("Forbidden");
  }

  return db.post.update({
    where: {
      id: postId,
    },
    data,
  });
}

/*
Don't check only:

user is logged in

Also check:

Does this user own the resource?
*/


// ============================================================
// 13. LOGOUT
// ============================================================

"use server";

import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

/*
Better session systems may also invalidate the server-side
session record.
*/


// ============================================================
// 14. SESSION EXPIRATION
// ============================================================

/*
Session should normally have an expiration.

Example:

createdAt
expiresAt
userId
sessionId
*/

/*
When checking session:

if (session.expiresAt < new Date()) {
  // session expired
}
*/


// ============================================================
// 15. SESSION ROTATION
// ============================================================

/*
After important authentication events:

Old session
    ↓
Invalidate
    ↓
Create new session

Useful against session fixation attacks.
*/


// ============================================================
// 16. JWT — BASIC IDEA
// ============================================================

/*
JWT:

header.payload.signature

Example:

eyJ... . eyJ... . abc...
*/

/*
JWT is self-contained.

Server can verify:

signature
expiration
claims
*/


// ============================================================
// 17. JWT CLAIMS
// ============================================================

/*
Common claims:

sub
→ Subject / user identifier

exp
→ Expiration

iat
→ Issued at

iss
→ Issuer

aud
→ Audience
*/


// ============================================================
// 18. SESSION vs JWT
// ============================================================

/*
Session:

Client
 ↓
Session ID
 ↓
Server-side session store

Advantages:
→ Easy revocation
→ Server controls session state


JWT:

Client
 ↓
JWT
 ↓
Server verifies token

Advantages:
→ Self-contained
→ Useful for distributed systems/API auth

Trade-off:
→ Revocation is more complicated
*/


// ============================================================
// 19. JWT DOES NOT MEAN "STORE IT ANYWHERE"
// ============================================================

/*
Avoid casually storing sensitive auth tokens in:

localStorage

because JavaScript can access localStorage.

For browser authentication, an httpOnly secure cookie is
often safer against token theft through XSS.
*/


// ============================================================
// 20. OAUTH
// ============================================================

/*
OAuth / OpenID Connect flow:

User
 ↓
"Continue with Google"
 ↓
Google
 ↓
User authenticates
 ↓
Authorization code
 ↓
Your server
 ↓
Identity/session
*/

/*
OAuth
→ Authorization framework

OpenID Connect
→ Authentication/identity layer built on OAuth 2.0
*/


// ============================================================
// 21. OAUTH CALLBACK
// ============================================================

/*
Typical route:

/api/auth/callback/provider

Provider redirects user here after authorization.

Server:

1. Verify callback
2. Exchange code
3. Get identity
4. Find/create user
5. Create application session
6. Redirect user
*/


// ============================================================
// 22. PROTECTED API
// ============================================================

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
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
    user,
  });
}

/*
Never assume:

"Because the page is protected,
the API is protected too."

Each sensitive server boundary needs protection.
*/


// ============================================================
// 23. PROTECTED API + ROLE
// ============================================================

export async function DELETE(
  request,
  { params }
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (user.role !== "admin") {
    return Response.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const { id } = await params;

  await db.user.delete({
    where: {
      id,
    },
  });

  return new Response(null, {
    status: 204,
  });
}


// ============================================================
// 24. MIDDLEWARE / PROXY CONCEPT
// ============================================================

/*
Next.js uses a request interception layer commonly referred
to as Proxy in current versions.

Historically this was called Middleware.

Concept:

Request
   ↓
Proxy / Middleware
   ↓
Route
*/

/*
Useful for:

- Redirects
- Rewrites
- Request checks
- Locale handling
- Early access decisions
*/


// ============================================================
// 25. PROXY — SIMPLE EXAMPLE
// ============================================================

// proxy.js

import { NextResponse } from "next/server";

export function proxy(request) {
  const isLoggedIn = true;

  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}


/*
IMPORTANT:

Proxy can improve request-level routing decisions.

It should NOT replace authorization inside:

- Server Functions
- Route Handlers
- Database operations
*/


// ============================================================
// 26. PROXY MATCHER
// ============================================================

// proxy.js

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

/*
Only selected paths go through the proxy logic.
*/


// ============================================================
// 27. PROXY vs SERVER AUTH CHECK
// ============================================================

/*
Proxy:

Request
 ↓
Early check
 ↓
Redirect / continue


Server:

Route / Function
 ↓
Verify session
 ↓
Verify authorization
 ↓
Database
*/

/*
Use both where appropriate.

Security boundary:
→ Server-side authorization
*/


// ============================================================
// 28. CSRF — BASIC IDEA
// ============================================================

/*
CSRF:

Attacker-controlled site
        ↓
Tries to make victim's browser
send authenticated request
        ↓
Your application
*/

/*
Important defenses:

- SameSite cookies
- CSRF tokens where required
- Origin / Referer checks where appropriate
- Avoid unsafe state-changing GET requests
*/


// ============================================================
// 29. STATE-CHANGING REQUESTS
// ============================================================

/*
❌ Bad:

GET /api/delete-user?id=10

GET should not perform destructive mutations.


Better:

DELETE /api/users/10
or
POST /api/users/10/delete
*/


// ============================================================
// 30. XSS + AUTH COOKIES
// ============================================================

/*
XSS:
Attacker executes JavaScript in your application.

If auth token is stored in localStorage:

XSS
 ↓
localStorage.getItem("token")
 ↓
Token stolen


httpOnly cookie:

XSS
 ↓
JavaScript cannot directly read cookie
*/


// ============================================================
// 31. SESSION SECURITY CHECKLIST
// ============================================================

/*
✓ HTTPS
✓ httpOnly cookie
✓ secure cookie
✓ appropriate SameSite policy
✓ Session expiration
✓ Session invalidation on logout
✓ Session rotation when appropriate
✓ Server-side authorization
✓ Password hashing
✓ Rate limiting on login
✓ Generic login error messages
*/


// ============================================================
// 32. LOGIN ERROR
// ============================================================

/*
Avoid:

"Email exists but password is wrong."

Better:

"Invalid email or password."

Why?

→ Reduces account enumeration.
*/


// ============================================================
// 33. RATE LIMITING
// ============================================================

/*
Sensitive endpoints should be rate-limited:

POST /login
POST /forgot-password
POST /api/payment
POST /api/comments
*/

/*
Goal:

Prevent:

- Brute-force attacks
- Abuse
- Excessive requests
*/


// ============================================================
// 34. AUTH ARCHITECTURE
// ============================================================

/*
Browser
   ↓
Login
   ↓
Server
   ↓
Verify credentials
   ↓
Create session
   ↓
httpOnly cookie
   ↓
Protected request
   ↓
Read session
   ↓
Authentication
   ↓
Authorization
   ↓
Database
*/


// ============================================================
// 35. PRACTICAL PROTECTED PAGE
// ============================================================

import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/forbidden");
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>
    </main>
  );
}


// ============================================================
// 36. AUTH LIBRARIES
// ============================================================

/*
In real applications, authentication is usually handled with
a dedicated authentication solution instead of implementing
every protocol manually.

Examples:

- Auth.js
- Clerk
- Better Auth
- Supabase Auth
- Auth0

Learn the underlying concepts first.

Then learn the API of the library used by the project.
*/


// ============================================================
// 37. QUICK RECALL
// ============================================================

/*
Authentication
→ Who are you?

Authorization
→ What can you do?

Session
→ Server-managed login state

Cookie
→ Common browser mechanism for carrying session identifier

httpOnly
→ JavaScript cannot read cookie

secure
→ HTTPS only

sameSite
→ Cross-site cookie behavior

JWT
→ Signed self-contained token

OAuth
→ Authorization framework

OpenID Connect
→ Authentication/identity layer

Proxy / Middleware
→ Request interception layer

401
→ Not authenticated

403
→ Not allowed

CSRF
→ Forged authenticated request

XSS
→ Injected JavaScript execution

Rate limiting
→ Restrict request frequency
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. Authentication vs authorization?

A:
Authentication verifies identity.
Authorization verifies permissions.


Q2. Where should authorization be checked?

A:
At the server-side security boundary, such as Server Functions,
Route Handlers and database operations.


Q3. Is hiding an admin button enough for security?

A:
No. A user can call the server endpoint directly. The server
must enforce the permission.


Q4. Why use httpOnly cookies for sessions?

A:
Client-side JavaScript cannot directly read them, which reduces
the impact of some XSS-based token theft.


Q5. What does secure mean on a cookie?

A:
The browser sends the cookie only over HTTPS connections.


Q6. What does SameSite control?

A:
It controls when cookies are sent in cross-site contexts and
helps reduce CSRF risk.


Q7. Session vs JWT?

A:
A session usually stores authentication state server-side and
the browser holds a session identifier. A JWT carries signed
claims in the token itself.


Q8. Is JWT automatically more secure than sessions?

A:
No. They are different mechanisms with different trade-offs.


Q9. What is OAuth?

A:
An authorization framework commonly used to allow an application
to access resources or delegate authentication through an
identity provider.


Q10. What is OpenID Connect?

A:
An identity layer built on OAuth 2.0 that provides
authentication and user identity information.


Q11. What is Proxy/Middleware used for?

A:
It can inspect/intercept requests and perform routing,
redirects, rewrites or early request-level decisions.


Q12. Should Proxy/Middleware be the only authorization layer?

A:
No. Sensitive operations must enforce authorization on the
server-side operation itself.


Q13. What is CSRF?

A:
An attack where a victim's browser is tricked into sending an
authenticated request to another site.


Q14. Why should destructive operations not use GET?

A:
GET should be safe/read-oriented. State-changing operations
should use appropriate mutation methods.


Q15. Why hash passwords?

A:
Passwords should not be stored in plaintext. Password hashing
makes database compromise less immediately useful to an attacker.


Q16. Why shouldn't passwords be encrypted instead of hashed?

A:
Encryption is reversible. Password storage should use a
password-specific one-way hashing approach.


Q17. Why should login attempts be rate-limited?

A:
To reduce brute-force and credential-stuffing abuse.


Q18. Why use a generic login error?

A:
It reduces information leakage about whether a particular
account exists.


Q19. What should happen during logout?

A:
Invalidate/delete the session and remove the corresponding
browser cookie.


Q20. What is the most important authentication rule?

A:
Never trust the client. Authentication and authorization
decisions must be enforced server-side.
*/


/*
============================================================
END
============================================================
*/

