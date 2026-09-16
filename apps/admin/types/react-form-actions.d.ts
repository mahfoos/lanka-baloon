/**
 * Makes `<form action={someServerAction}>` type-check on React 18.
 *
 * Passing a function to `action` is a Server Actions feature. React 19's types
 * allow it outright, but React 18's types only permit a `string` plus whatever a
 * framework contributes through this extension point — and Next 14 doesn't
 * contribute one, so we do it here.
 *
 * The runtime has always supported this; only the types were missing. Delete this
 * file if the ERP ever moves to React 19, where the same thing is built in.
 */
import "react";

declare module "react" {
  // The name is React's own, and is deliberately shouty — it marks an API that
  // was experimental when React 18's types were written.
  interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS {
    nextServerAction: (formData: FormData) => void | Promise<void>;
  }
}
