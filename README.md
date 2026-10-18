# Catnip Kanban

A responsive Kanban application built with React, TypeScript, Vite and Express.

## Future development

A future version could support several separate Kanban boards and collaboration between users. A user could be an admin on one board and a regular user on another. The role would belong to the user's membership in a specific board rather than to the user account itself.

In that version:

- users would have their own accounts;
- tasks would belong to a specific Kanban board;
- memberships would connect users to boards with an `admin` or `user` role;
- admins could invite other users to their boards;
- users without a membership could not see a board or its tasks.

This larger authorization and collaboration model is intentionally left outside the scope of the course project. It would be suitable for future development with a persistent database and secure authentication.
