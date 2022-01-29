# NextJS Redux Observable Integration

This is a template for creating a NextJS application that uses `redux-observable` to manage side effects.

We use `redux-devtools-extension` when running in developer mode to log actions and state changes and we
use `redux-persist` to save state between browser refreshes.

## Tech Stack

- NextJS
- Formik
- Redux Observable
- MUI5
- Yup

## How to use

To get the User (CRUD example) page working, [prisma](https://www.prisma.io/) must be initialized by running:

```sh
npx prisma migrate dev --name=init
```

This will create a new [sqlite](https://sqlite.org/about.html) database where the user details will be stored.

You can install [Prisma Studio](https://www.prisma.io/studio) to seed data.

Then start the NextJs app in developer mode by using:

```sh
npm run dev
```

Note: we are not using `AjaxObservable` from the `rxjs` library; as of rxjs v5.5.6, it will not work on both the server
and client-side. Instead we call the default export from
[universal-rxjs-ajax](https://www.npmjs.com/package/universal-rxjs-ajax) (as
`request`).

We transform the Observable we get from `ajax` into a Promise in order to await its resolution. That resolution should
be an action (since the epic returns Observables of actions). We immediately dispatch that action to the store.

This server-side solution allows compatibility with Next. It may not be something you wish to emulate. In other
situations, calling or awaiting epics directly and passing their result to the store would be an anti-pattern. You
should only trigger epics by dispatching actions. This solution may not generalise to resolving more complicated sets of
actions.

The layout of the redux related functionality uses the [redux-ducks](https://github.com/erikras/ducks-modular-redux)
pattern.

Excepting in those manners discussed above, the configuration is similar to the configuration found
in [with-redux example](https://github.com/vercel/next.js/tree/canary/examples/with-redux) on the NextJS repository
and [redux-observable docs](https://redux-observable.js.org/).
