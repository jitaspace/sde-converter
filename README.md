# SDE Converter

This is a simple tool to convert the information in the EVE Static Data Export (SDE) into a static file-based OpenAPI format.

This is specially useful for front-end developers that want to build tools for EVE Online, but don't want to deal with the complexity of the SDE, or if they want to build a tool that doesn't require a database.

## Usage

You can run the tool directly using `npx`:

```bash
npx @jitaspace/sde-converter@latest <command> [options]
```

Or you can install it globally:

```bash
npm install -g @jitaspace/sde-converter@latest
```

And then run it:

```bash
sde-converter <command> [options]
```

## Commands

### `convert`

Converts the SDE into a static file-based OpenAPI format.

#### Options

- `--sde <path>`: Path to the SDE folder. Defaults to `./sde`.
- `--output <path>`: Path to the output folder. Defaults to `./output`.

### `serve`

Serves the converted SDE using a local HTTP server.

#### Options

- `--port <port>`: Port to use for the HTTP server. Defaults to `8080`.
