# React Address Autocomplete Example

The example uses Vite. Use the repository's Node version, or Node 20.19+ / 22.12+.

## Run locally

From the repository root:

```sh
npm ci
npm ci --prefix example
npm start --prefix example
```

Open [http://localhost:3000](http://localhost:3000). Run `npm run build --prefix example` to build the app into `example/build`.

## Lob API key

Set `REACT_APP_LOB_API_KEY` in `example/.env.local` to a Lob test key. Requests go to `api.lob.com`. Restart the development server after changing the key.

## Local development with @lob/react-address-autocomplete

The example uses the published package by default. To use the library from this repository, run:

```sh
# From the repository root
npm link
cd example
npm link @lob/react-address-autocomplete
```

Run `npm run build` from the repository root after changing library code, or run `npm start` there in another terminal to rebuild on changes. When finished, use `npm unlink` in the reverse order.
