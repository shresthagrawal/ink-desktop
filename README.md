# Ink

Experimental [Electron](https://electronjs.org/) application (using [nextron](https://github.com/saltyshiomix/nextron)) for our "Git for Music" P2P collaboration and tracking platform.

## Usage
Install all dependencies via `npm install` (tried with Node.js 12.4).

You need to [generate SENDGRID TOKEN](docs/setup.md#Steps-to-generate-SENDGRID-TOKEN) and you need to[generate a GITHUB TOKEN](docs/setup.md#Steps-to-generate-GITHUB-TOKEN).

Also, you need to create a .env file and then generate the tokens.

Run the development server with `npm run dev`, and build packages with `npm run build`. You may need to specify respective packaging targets.

If some errors occur, especially due to native bindings, try to reinstall and rebuild all dependencies via `npm ci`.

