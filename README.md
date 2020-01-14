# Ink

Experimental [Electron](https://electronjs.org/) application (using [nextron](https://github.com/saltyshiomix/nextron)) for our "Git for Music" P2P collaboration and tracking platform.

## Usage
1. Install all dependencies via `npm install` (works with Node.js 12.4).
2. Create a `.env` file in the root directory.
3. You need to generate and add the [SENDGRID TOKEN](docs/setup.md#Steps-to-generate-SENDGRID-TOKEN) and [GITHUB TOKEN with the required permissions](docs/setup.md#Steps-to-generate-GITHUB-TOKEN).
4. Run the development server with `npm run dev`, and build packages with `npm run build`. You may need to specify respective packaging targets.

If some errors occur, especially due to native bindings, try to reinstall and rebuild all dependencies via `npm ci`.

