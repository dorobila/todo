# Todo repo

This project was initialized with `npx create-turbo@latest`. This project utilises npm workspaces to manage the monorepo.

## Getting Started

1. Clone this repo
2. Run `npm install`
3. Run `npm run dev`

### Total time spent on this project

- as of 17/12/2023 15:30 -> 5-6 hours

### What I have done so far

- [x] A user must be able to see their list of todos
- [x] Completed todos should not be shown in the list by default
- [x] It must be possible to show the completed todos
- [x] A user must be able to create a new todo
- [x] A user must be able to edit a todo
- [x] A user must be able to delete a todo
- [x] A user must be able to complete a todo
- [x] A user must be able to incomplete a todo

### Roadmap

- [ ] Add drag and drop functionality
- [x] Move the `api` in memory database to a `sqlite3` database (sequelize??)
- [ ] Fix caching so that it won't refetch the whole list on crud operations
- [ ] Instead of having a dropdown menu for edit/delete, maybe have each field editable? And just add a delete button
- [ ] Add basic tests with supertest for the api endpoints

#### Api Notes

- frameworks like Nestjs makes prototyping with solid project structure very easy. Never take that for granted anymore :D

#### Web Notes

- react-hook-form & zod for forms is a mach in heaven combo
- class-variance-authority seems like a good package for creating variants (will I use it again? not sure yet :D)
- radix-ui primitives very good for out of the box accessability, but for the sake of readability, you NEED to [compose](https://www.radix-ui.com/primitives/docs/guides/composition#composing-with-your-own-react-components) your own components with it. See Button or Form components (maybe even add this as a task for the rest of the components)
- fix "A non-serializable value was detected in the state" - hint: it's always the date

#### General Notes
