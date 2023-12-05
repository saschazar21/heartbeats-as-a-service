<div align="center">
  <img alt="A red heart with black border on beige background" src="public/android-chrome-512x512.png" width="192px">
  <br />
  <h1>Heartbeats-as-a-Service</h1>
  <strong>An API for collecting system heartbeats.</strong>
  <br />
  <br />
</div>

## What is it?

This is a ready-to-use repository for deploying an API to Cloudflare pages, which collects heartbeats from Linux-based and macOS-systems.

## Prerequisites

#### Runtimes

- [Node.js v18+](https://nodejs.org/en/)

- [Yarn](https://yarnpkg.dev/) or similar (optional)
- [Postman](https://www.postman.com/) - for interacting with the API (optional)

#### Accounts

- A [Cloudflare Pages](https://pages.cloudflare.com/) account for deploying this repository
- A [Neon](https://neon.tech/) account for storing heartbeats data into a Postgres database

## Quick start

1. Copy `.env.sample` to `.dev.vars` and populate the environment variables
   ```bash
   cp .env.sample .dev.vars
   ```
2. Install dependencies
   ```bash
   yarn # or npm i
   ```
3. Start development server
   ```bash
   yarn dev # or npm run dev
   ```

## Deployment

Follow the guide in the [Cloudflare Docs](https://developers.cloudflare.com/pages/get-started/guide/), as it contains all the necessary information to get up and running.

⚠️ Do not forget to set the environment variables in the Cloudflare Pages admin console! If you forgot or changed one of them after your deployment happened, be sure to re-run the deployment manually for the changes to take effect.

## License

Licensed under the MIT license.

Copyright ©️ 2023 [Sascha Zarhuber](https://sascha.work)
