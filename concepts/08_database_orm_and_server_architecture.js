/*
============================================================
Database, Orm and Server architecture
============================================================

Focus:
- Database connection
- ORM
- Prisma-style queries
- CRUD
- Relations
- Migrations
- Transactions
- N+1 problem
- Server-only code
- DB architecture in Next.js
- Production essentials

*/



// ============================================================
// 01. BASIC FULL-STACK ARCHITECTURE
// ============================================================

/*
Browser
   ↓
Next.js UI
   ↓
Server Component / Server Function / Route Handler
   ↓
Service / DB logic
   ↓
ORM
   ↓
Database
*/


// ============================================================
// 02. NEVER EXPOSE DB TO CLIENT
// ============================================================

/*
❌ Client Component
   ↓
Database

✓ Client Component
   ↓
Server Function / API
   ↓
Database
*/

/*
Database credentials must stay on the server.
*/


// ============================================================
// 03. ENVIRONMENT VARIABLES
// ============================================================

// .env

/*
DATABASE_URL="postgresql://..."
API_SECRET="..."
NEXT_PUBLIC_API_URL="..."
*/

/*
Server-only:

DATABASE_URL
API_SECRET

Public:

NEXT_PUBLIC_...

Never put database secrets in NEXT_PUBLIC_ variables.
*/


// ============================================================
// 04. DATABASE CLIENT
// ============================================================

// Example Prisma-style client.

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/*
In development, avoid creating unnecessary DB connections
on every hot reload.

Common pattern:

globalThis.db
→ Reuse one client during development.
*/


// ============================================================
// 05. SERVER-ONLY MODULE
// ============================================================

import "server-only";

/*
Useful when a module contains:

- Database access
- API secrets
- Private server logic

It prevents accidental importing into Client Components.
*/


// ============================================================
// 06. BASIC READ
// ============================================================

const users = await db.user.findMany();


// ============================================================
// 07. FIND ONE
// ============================================================

const user = await db.user.findUnique({
  where: {
    id: userId,
  },
});


// ============================================================
// 08. FIND FIRST
// ============================================================

const user = await db.user.findFirst({
  where: {
    email: userEmail,
  },
});


// ============================================================
// 09. FILTERING
// ============================================================

const users = await db.user.findMany({
  where: {
    role: "admin",
    active: true,
  },
});


// ============================================================
// 10. SELECT ONLY WHAT YOU NEED
// ============================================================

const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

/*
Don't fetch unnecessary sensitive/large fields.
*/


// ============================================================
// 11. CREATE
// ============================================================

const user = await db.user.create({
  data: {
    name: "John",
    email: "john@example.com",
  },
});


// ============================================================
// 12. UPDATE
// ============================================================

const user = await db.user.update({
  where: {
    id: userId,
  },
  data: {
    name: "Updated Name",
  },
});


// ============================================================
// 13. DELETE
// ============================================================

await db.user.delete({
  where: {
    id: userId,
  },
});


// ============================================================
// 14. UPSERT
// ============================================================

const user = await db.user.upsert({
  where: {
    email: userEmail,
  },

  update: {
    name: "Updated",
  },

  create: {
    email: userEmail,
    name: "New User",
  },
});

/*
upsert:

exists
→ update

doesn't exist
→ create
*/


// ============================================================
// 15. RELATIONS
// ============================================================

/*
User
 └── Posts

Post
 └── Author(User)
*/


// ============================================================
// 16. INCLUDE RELATION
// ============================================================

const user = await db.user.findUnique({
  where: {
    id: userId,
  },

  include: {
    posts: true,
  },
});


// ============================================================
// 17. NESTED SELECT
// ============================================================

const user = await db.user.findUnique({
  where: {
    id: userId,
  },

  select: {
    id: true,
    name: true,

    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
});

/*
Prefer selecting required fields instead of blindly including
everything.
*/


// ============================================================
// 18. RELATION FILTER
// ============================================================

const users = await db.user.findMany({
  where: {
    posts: {
      some: {
        published: true,
      },
    },
  },
});


// ============================================================
// 19. SORTING
// ============================================================

const users = await db.user.findMany({
  orderBy: {
    createdAt: "desc",
  },
});


// ============================================================
// 20. PAGINATION — OFFSET
// ============================================================

const page = 2;
const pageSize = 20;

const users = await db.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

/*
Simple:

page 1 → 0 - 20
page 2 → 20 - 40
page 3 → 40 - 60
*/


// ============================================================
// 21. CURSOR PAGINATION
// ============================================================

const users = await db.user.findMany({
  take: 20,

  cursor: {
    id: lastUserId,
  },

  skip: 1,
});

/*
Cursor pagination is often better for large datasets or
infinite scrolling.

Offset:
→ Simple page navigation

Cursor:
→ Efficient for large/continuously changing datasets
*/


// ============================================================
// 22. COUNT
// ============================================================

const totalUsers = await db.user.count();


// ============================================================
// 23. AGGREGATION
// ============================================================

const result = await db.order.aggregate({
  _sum: {
    total: true,
  },

  _avg: {
    total: true,
  },
});

/*
Use DB aggregation instead of loading thousands of rows into
JavaScript just to calculate totals.
*/


// ============================================================
// 24. DATABASE TRANSACTION
// ============================================================

await db.$transaction(async (tx) => {
  const order = await tx.order.create({
    data: {
      userId,
      total: 100,
    },
  });

  await tx.inventory.update({
    where: {
      productId,
    },

    data: {
      stock: {
        decrement: 1,
      },
    },
  });
});

/*
Transaction:

All operations succeed
        ↓
Commit

If something fails
        ↓
Rollback
*/


// ============================================================
// 25. WHEN TO USE TRANSACTION
// ============================================================

/*
Use when multiple DB operations must succeed/fail together.

Example:

Create order
+
Decrease inventory

If inventory update fails,
order should not remain incorrectly created.
*/


// ============================================================
// 26. DATABASE MIGRATIONS
// ============================================================

/*
Schema change:

users
 ↓
Add phone column
 ↓
Migration
 ↓
Database updated
*/

/*
Migration files provide version-controlled database changes.

Typical workflow:

Change schema
 ↓
Create migration
 ↓
Review
 ↓
Apply migration
*/


// ============================================================
// 27. SEEDING
// ============================================================

/*
Seed database with initial/test data.

Useful for:

- Development
- Testing
- Demo environments

Example:

admin user
sample products
sample categories
*/


// ============================================================
// 28. DATABASE INDEX
// ============================================================

/*
Without useful index:

Search
 ↓
Scan many rows

With index:

Search
 ↓
Index
 ↓
Relevant rows
*/

/*
Common candidates:

- email
- userId
- foreign keys
- frequently filtered columns
- frequently sorted columns
*/

/*
Don't index everything.

Indexes improve reads but add storage/write overhead.
*/


// ============================================================
// 29. UNIQUE CONSTRAINT
// ============================================================

/*
Example:

email UNIQUE

Means:

user1@example.com ✓
user1@example.com ✗
*/

/*
Important for:

- Email
- Username
- External IDs
- Slugs
*/


// ============================================================
// 30. N+1 QUERY PROBLEM
// ============================================================

/*
❌

Get 100 users
 ↓
For each user:
  query posts

1 + 100 queries
→ 101 queries
*/

/*
Better:

Get users
+
related posts

using an appropriate relation query/include/select.
*/


// ============================================================
// 31. SERVER DATA FUNCTION
// ============================================================

import "server-only";

export async function getProducts() {
  return db.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
  });
}

/*
Keep database logic in reusable server-side functions.

UI doesn't need to know DB implementation details.
*/


// ============================================================
// 32. SERVER COMPONENT + DB
// ============================================================

import { getProducts } from "@/lib/products";

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

/*
Server Component
 ↓
Server data function
 ↓
Database
*/


// ============================================================
// 33. CLIENT COMPONENT + SERVER FUNCTION
// ============================================================

/*
Client Component
      ↓
Server Function
      ↓
Database

The client never receives:

DATABASE_URL
DB credentials
private server logic
*/


// ============================================================
// 34. SERVICE LAYER
// ============================================================

/*
For larger apps:

UI
 ↓
Server Function / Route Handler
 ↓
Service
 ↓
Repository / DB
 ↓
Database
*/

/*
Example:

createOrder()
→ business logic

db.order.create()
→ database operation
*/


// ============================================================
// 35. BUSINESS LOGIC ≠ DATABASE LOGIC
// ============================================================

/*
Database logic:

db.order.create(...)


Business logic:

if (stock <= 0) {
  throw new Error("Out of stock");
}

Keep complex business rules separate from raw DB queries.
*/


// ============================================================
// 36. API RESPONSE DATA
// ============================================================

/*
Don't return unnecessary database fields.

❌

return entireUser;

May expose:

passwordHash
internal IDs
private metadata
etc.


✓

return {
  id: user.id,
  name: user.name,
};
*/


// ============================================================
// 37. SERIALIZATION
// ============================================================

/*
Server → Client data must be serializable in the relevant
Next.js/React boundary.

Be careful with:

- Functions
- Database client objects
- Class instances
- Huge/unnecessary objects
- Sensitive server-only values
*/


// ============================================================
// 38. CONNECTION MANAGEMENT
// ============================================================

/*
Traditional server:

Request
 ↓
DB connection
 ↓
Query
 ↓
Close/reuse


Serverless environments:

Many short-lived instances
        ↓
Potential connection spikes
        ↓
Use pooling / provider-supported connection strategy
*/


// ============================================================
// 39. DATABASE SECURITY
// ============================================================

/*
✓ Keep DB credentials server-side
✓ Use environment variables
✓ Validate input
✓ Use parameterized/ORM queries
✓ Enforce authorization
✓ Don't expose sensitive fields
✓ Use least-privilege DB credentials
✓ Use TLS where supported
✓ Add indexes intentionally
*/


// ============================================================
// 40. QUICK RECALL
// ============================================================

/*
DATABASE_URL
→ Server-side database connection string

server-only
→ Prevent accidental client import

ORM
→ Application-friendly database abstraction

findMany()
→ Multiple records

findUnique()
→ One unique record

select
→ Return only required fields

include
→ Load relations

transaction
→ Atomic group of DB operations

migration
→ Version-controlled schema change

seed
→ Initial/test data

index
→ Faster lookup/filtering

unique
→ Prevent duplicate values

N+1
→ Excessive repeated queries

offset pagination
→ skip + take

cursor pagination
→ Continue from last record

service layer
→ Business logic boundary
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. Why shouldn't a Client Component directly access a database?

A:
Database credentials and server-side database operations must
remain on the server.


Q2. What is an ORM?

A:
A tool that provides a programmatic abstraction for interacting
with a relational database.


Q3. What is the difference between select and include?

A:
select chooses specific fields/relations to return.
include loads specified relations while generally returning
the model's fields.


Q4. What is a database transaction?

A:
A group of operations that should succeed or fail together.


Q5. Give a real transaction example.

A:
Create an order and decrease inventory. If either operation
fails, the transaction should roll back.


Q6. What is the N+1 query problem?

A:
One query retrieves a list, followed by one additional query
for each item in that list.


Q7. How can you reduce N+1 queries?

A:
Fetch required related data together using joins, relation
queries, include/select or an appropriate data-loading strategy.


Q8. Offset vs cursor pagination?

A:
Offset uses page/skip values and is simple.
Cursor pagination continues from a known record and is often
better for large or frequently changing datasets.


Q9. Why use database indexes?

A:
They can significantly improve lookup/filter/sort performance,
but they add storage and write/update overhead.


Q10. Should every column have an index?

A:
No. Indexes have a cost. Index columns based on actual
query patterns and constraints.


Q11. What is a migration?

A:
A version-controlled change to the database schema.


Q12. Why use unique constraints?

A:
To enforce uniqueness at the database level rather than
relying only on application code.


Q13. Why use server-only modules?

A:
To prevent server-only code such as database access and secrets
from accidentally entering client-side code.


Q14. Where should business logic live in a larger application?

A:
In a server-side service/domain layer rather than scattering
complex rules across UI components and raw database queries.


Q15. Why shouldn't you return the complete database user object?

A:
It may contain sensitive or unnecessary fields such as password
hashes or internal metadata.


Q16. What problem can serverless environments cause for databases?

A:
Many short-lived instances can create too many database
connections. Connection pooling or a provider-compatible
strategy may be necessary.


Q17. What is the difference between authentication and database
authorization?

A:
Authentication identifies the user. Authorization determines
whether that user can perform the requested database operation.


Q18. Why is server-side authorization still necessary if the UI
hides restricted actions?

A:
A user can bypass the UI and call the server directly.


Q19. Why should aggregation often happen in the database?

A:
The database can calculate totals/counts/averages without
transferring large datasets to the application server.


Q20. What is the basic Next.js database architecture?

A:

UI
→ Server boundary
→ Service/data layer
→ ORM
→ Database
*/


/*
============================================================
END
============================================================
*/
