---
trigger: always_on
---

- when we building the pages, the pages i will provide you will have their own navigation side-bar but do not implement their side-bar use the sidebar that is already generated in the Components/Sidebar.tsx cause consistency is what matters.
- always use nextjs v16 rules
- every table should have created at and updated at (i'm using postgresql)
- use snake_case format for naming
- for form submitions always use next js server actions with useactionstate
  -- if we are doing any operation about react-qr-scanner do not write code just guide me i will write it on my own

- When a new UI component is provided that includes its own internal Dialog/Modal logic, you must perform a "Component Swap" based on the following steps:

  Identify & Extract: Identify the core content (children elements, forms, or text) inside the new component's dialog.

  Discard: Ignore the native dialog/modal wrapper, styling, and state logic provided by the new component.

  Encapsulate: Wrap the extracted content as children within the existing Reusable Dialog Model component.

  Preserve: Maintain all other non-dialog functionality, props, or logic from the new component that does not conflict with the Reusable Dialog.

--- use pnpm as a package manager
