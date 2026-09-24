/*
============================================================
   Server Functions & Forms
============================================================

Focus:
- Server Functions / Server Actions
- "use server"
- Forms + FormData
- CRUD mutations
- Validation
- useActionState
- useFormStatus
- redirect()
- Cache invalidation
- Security basics

*/



// ============================================================
// 01. SERVER FUNCTIONS
// ============================================================

/*
Server Function
→ Async function that executes on the server.

"use server"
→ Marks a function/module as server-side.
*/

"use server";

export async function createUser(formData) {
  const name = formData.get("name");

  await db.user.create({
    data: { name },
  });
}

/*
Useful for:

- Create
- Update
- Delete
- Form submission
- Database mutations
- Server-side operations
*/


// ============================================================
// 02. "use server" — FILE LEVEL
// ============================================================

// app/actions.js

"use server";

export async function createUser(formData) {
  // server code
}

export async function deleteUser(id) {
  // server code
}

/*
All exported functions in this file are Server Functions.
*/


// ============================================================
// 03. "use server" — FUNCTION LEVEL
// ============================================================

export default function Page() {
  async function createUser(formData) {
    "use server";

    const name = formData.get("name");

    await db.user.create({
      data: { name },
    });
  }

  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">
        Create
      </button>
    </form>
  );
}

/*
Function-level "use server"
→ Useful for actions local to a Server Component.

File-level
→ Better for reusable actions.
*/


// ============================================================
// 04. FORM + SERVER FUNCTION
// ============================================================

"use server";

export async function createUser(formData) {
  const name = formData.get("name");

  await db.user.create({
    data: { name },
  });
}


// Server Component

import { createUser } from "./actions";

export default function Form() {
  return (
    <form action={createUser}>
      <input
        name="name"
        placeholder="Name"
      />

      <button type="submit">
        Create User
      </button>
    </form>
  );
}

/*
<form action={serverFunction}>

React/Next.js handles invoking the Server Function.
*/


// ============================================================
// 05. FORMDATA
// ============================================================

"use server";

export async function createUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");

  console.log(name, email);
}

/*
HTML:

<input name="name" />
<input name="email" />

→ formData.get("name")
→ formData.get("email")
*/


// ============================================================
// 06. FORMDATA METHODS
// ============================================================

formData.get("email");
formData.getAll("tags");
formData.has("email");

// Convert entries to object:

const values = Object.fromEntries(
  formData.entries()
);

/*
Remember:

formData values normally arrive as strings
(or File objects for file inputs).

Validate/convert before using them.
*/


// ============================================================
// 07. CREATE MUTATION
// ============================================================

"use server";

export async function createProduct(formData) {
  const name = formData.get("name");
  const price = Number(formData.get("price"));

  await db.product.create({
    data: {
      name,
      price,
    },
  });
}


// ============================================================
// 08. UPDATE MUTATION
// ============================================================

"use server";

export async function updateProduct(id, formData) {
  const name = formData.get("name");
  const price = Number(formData.get("price"));

  await db.product.update({
    where: { id },
    data: {
      name,
      price,
    },
  });
}


// ============================================================
// 09. DELETE MUTATION
// ============================================================

"use server";

export async function deleteProduct(id) {
  await db.product.delete({
    where: { id },
  });
}


// ============================================================
// 10. PASSING EXTRA ARGUMENTS WITH bind()
// ============================================================

"use client";

import { updateProduct } from "./actions";

export default function EditForm({ product }) {
  const updateWithId = updateProduct.bind(
    null,
    product.id
  );

  return (
    <form action={updateWithId}>
      <input
        name="name"
        defaultValue={product.name}
      />

      <button type="submit">
        Update
      </button>
    </form>
  );
}

/*
bind()
→ Pass extra arguments to a Server Function.

Useful for:

updateProduct(id, formData)
deleteProduct(id)
*/


// ============================================================
// 11. HIDDEN INPUT vs bind()
// ============================================================

/*
Possible:

<input
  type="hidden"
  name="id"
  value={product.id}
/>

But bind() is often cleaner when the ID is already known
outside the form data.
*/


// ============================================================
// 12. SERVER-SIDE VALIDATION
// ============================================================

"use server";

export async function createUser(formData) {
  const email = formData.get("email");

  if (
    typeof email !== "string" ||
    !email.includes("@")
  ) {
    return {
      error: "Invalid email",
    };
  }

  await db.user.create({
    data: { email },
  });
}

/*
Never trust client-side validation alone.

Server-side validation is mandatory before:

- Database writes
- Payments
- Authentication
- Authorization
- Sensitive operations
*/


// ============================================================
// 13. ZOD VALIDATION
// ============================================================

// Common real-world pattern.

import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

"use server";

export async function createUser(formData) {
  const result = UserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!result.success) {
    return {
      error: "Invalid input",
    };
  }

  await db.user.create({
    data: result.data,
  });
}

/*
Zod:
→ Runtime validation
→ Useful for API/forms/server boundaries

Client validation improves UX.
Server validation protects the application.
*/


// ============================================================
// 14. USE ACTION STATE
// ============================================================

// React hook for Server Function result/state.

"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

const initialState = {
  error: null,
};

export default function Form() {
  const [state, formAction] = useActionState(
    createUser,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="email" />

      <button type="submit">
        Create
      </button>

      {state.error && (
        <p>{state.error}</p>
      )}
    </form>
  );
}

/*
useActionState():

[action state, formAction]

Useful for:

- Validation errors
- Success messages
- Server-returned state
*/


// ============================================================
// 15. ACTION STATE FUNCTION SIGNATURE
// ============================================================

// With useActionState:

"use server";

export async function createUser(
  previousState,
  formData
) {
  // validate
  // mutate

  return {
    error: null,
  };
}

/*
Arguments:

previousState
→ Previous action state

formData
→ Submitted form data
*/


// ============================================================
// 16. USE FORM STATUS
// ============================================================

// Show pending state during form submission.

"use client";

import { useFormStatus } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export default function Form() {
  return (
    <form action={someServerFunction}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}

/*
useFormStatus()
→ Reads status of the nearest parent <form>.

Common:
pending
→ true while submission is running.
*/


// ============================================================
// 17. ERROR HANDLING
// ============================================================

"use server";

export async function createUser(formData) {
  try {
    const email = formData.get("email");

    await db.user.create({
      data: { email },
    });

    return {
      error: null,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Failed to create user",
    };
  }
}

/*
Don't expose internal database/server errors directly
to users.
*/


// ============================================================
// 18. REDIRECT AFTER MUTATION
// ============================================================

"use server";

import { redirect } from "next/navigation";

export async function createProduct(formData) {
  const name = formData.get("name");

  await db.product.create({
    data: { name },
  });

  redirect("/products");
}

/*
Common flow:

Submit
  ↓
Validate
  ↓
Database mutation
  ↓
Invalidate cache
  ↓
Redirect
*/


// ============================================================
// 19. REDIRECT + TRY/CATCH
// ============================================================

"use server";

import { redirect } from "next/navigation";

export async function createProduct(formData) {
  try {
    await db.product.create({
      data: {
        name: formData.get("name"),
      },
    });
  } catch (error) {
    return {
      error: "Failed to create product",
    };
  }

  redirect("/products");
}

/*
Keep redirect() outside try/catch when appropriate.

redirect() internally interrupts the current render/action
flow, so catching it accidentally can cause problems.
*/


// ============================================================
// 20. REVALIDATE AFTER MUTATION
// ============================================================

"use server";

import { revalidatePath } from "next/cache";

export async function createProduct(formData) {
  await db.product.create({
    data: {
      name: formData.get("name"),
    },
  });

  revalidatePath("/products");
}

/*
Database changes
      ↓
Cache may contain old data
      ↓
revalidatePath()
      ↓
Fresh route data
*/


// ============================================================
// 21. REVALIDATE TAG
// ============================================================

"use server";

import { revalidateTag } from "next/cache";

export async function updateProduct(id, formData) {
  await db.product.update({
    where: { id },
    data: {
      name: formData.get("name"),
    },
  });

  revalidateTag(`product:${id}`);
}

/*
Use tags when multiple places depend on the same data.
*/


// ============================================================
// 22. AUTHORIZATION
// ============================================================

"use server";

export async function deleteUser(id) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  await db.user.delete({
    where: { id },
  });
}

/*
IMPORTANT:

Server Functions are NOT automatically authorization checks.

Always verify:

- Authentication
- Authorization
- Ownership
- Input validity

inside sensitive server operations.
*/


// ============================================================
// 23. NEVER TRUST HIDDEN INPUTS
// ============================================================

/*
❌ This is NOT security:

<input
  type="hidden"
  name="role"
  value="admin"
/>

A user can modify HTML.

Always validate sensitive values on the server.
*/


// ============================================================
// 24. FORM ACTION FLOW
// ============================================================

/*
User submits form
        ↓
Server Function
        ↓
Read FormData
        ↓
Validate
        ↓
Authenticate
        ↓
Authorize
        ↓
Database mutation
        ↓
Revalidate cache
        ↓
Return state / redirect
*/


// ============================================================
// 25. SERVER FUNCTION vs ROUTE HANDLER
// ============================================================

/*
Server Function:

UI/form mutation
      ↓
Server Function
      ↓
Database


Route Handler:

HTTP request
      ↓
/api/products
      ↓
HTTP response


Use Server Functions when:
→ Your Next.js UI directly triggers a server mutation.

Use Route Handlers when:
→ You need an HTTP endpoint/API.
→ External clients need to call it.
→ Webhooks are involved.
→ Custom HTTP methods/headers/responses are required.
*/


// ============================================================
// 26. SERVER FUNCTION vs API ROUTE
// ============================================================

/*
Server Function:
→ Function-oriented
→ Excellent for UI mutations
→ Form integration
→ No manual API endpoint required

Route Handler:
→ HTTP-oriented
→ GET / POST / PUT / PATCH / DELETE
→ External consumers
→ Webhooks / APIs
*/


// ============================================================
// 27. PROGRESSIVE ENHANCEMENT
// ============================================================

/*
Forms using Server Functions can work with submission before
client JavaScript has fully loaded.

This is one reason forms + Server Functions are useful for
progressive enhancement.
*/


// ============================================================
// 28. PRACTICAL CRUD PATTERN
// ============================================================

// actions.js

"use server";

import { revalidatePath } from "next/cache";

export async function createProduct(formData) {
  // 1. Validate
  const name = formData.get("name");

  if (!name) {
    return { error: "Name is required" };
  }

  // 2. Authorize
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 3. Mutate
  await db.product.create({
    data: { name },
  });

  // 4. Revalidate
  revalidatePath("/products");

  // 5. Return result
  return { error: null };
}


// ============================================================
// 29. WHAT SERVER FUNCTIONS ARE NOT
// ============================================================

/*
Server Functions are NOT:

✗ A replacement for every API
✗ Automatically secure
✗ A reason to skip validation
✗ A reason to skip authorization
✗ Only for forms

They are a convenient server-side mutation mechanism.
*/


// ============================================================
// 30. QUICK RECALL
// ============================================================

/*
"use server"
→ Server Function / Server Action boundary

<form action={fn}>
→ Invoke Server Function from form

FormData
→ Submitted form values

bind()
→ Pass extra arguments

useActionState()
→ Manage action result/state

useFormStatus()
→ Read form pending status

Zod
→ Validate server input

redirect()
→ Navigate after mutation

revalidatePath()
→ Revalidate route-related cache

revalidateTag()
→ Revalidate tagged data

Server Function
→ UI-triggered server mutation

Route Handler
→ HTTP endpoint/API

Security
→ Validate + authenticate + authorize on server
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is a Server Function?

A:
An async function that executes on the server and can be
invoked from React/Next.js UI interactions.


Q2. What does "use server" do?

A:
It marks a function or module so the function executes on
the server.


Q3. How do you connect a Server Function to a form?

A:
Pass it to the form's action prop.

<form action={createUser}>


Q4. What does FormData contain?

A:
The values submitted by the form controls.


Q5. Why is server-side validation necessary?

A:
Client-side validation can be bypassed. Server-side validation
protects the database and server logic.


Q6. What is useActionState() used for?

A:
It connects a form action with state so the UI can display
server-returned results such as validation errors.


Q7. What is useFormStatus() used for?

A:
It provides the submission status of the nearest parent form,
commonly to show a pending/loading state.


Q8. How do you pass an ID to a Server Function?

A:
You can bind the ID with Function.bind(), for example:

const action = updateUser.bind(null, userId);


Q9. What should happen after a successful database mutation?

A:
Typically revalidate affected cached data and/or redirect
the user to the appropriate route.


Q10. Are Server Functions automatically secure?

A:
No. You must still perform authentication, authorization,
input validation and other security checks.


Q11. Why can't a hidden input be trusted for authorization?

A:
Users can modify HTML and submit different values. Sensitive
authorization decisions must happen on the server.


Q12. Server Function vs Route Handler?

A:
Server Functions are convenient for server-side operations
triggered by the application's UI. Route Handlers expose
HTTP endpoints and are better when external clients,
webhooks or custom HTTP behavior are required.


Q13. Why use revalidatePath() after a mutation?

A:
The database may have changed while cached route data is
still stale. Revalidation tells Next.js to refresh the
affected cached data.


Q14. What is the typical Server Function flow?

A:
Receive input
→ validate
→ authenticate
→ authorize
→ mutate database
→ revalidate cache
→ return state or redirect.


Q15. Why are Server Functions useful for forms?

A:
They provide direct server-side form mutation handling,
integrate with FormData and can support progressive
enhancement without requiring a manually created API endpoint.
*/


/*
============================================================
END
============================================================
*/
