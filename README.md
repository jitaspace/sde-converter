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

## Useful commands (for myself)

### Generate list of changed files between two directories

`rclone` needs a list of files in the following format:
```
user1/42
user1/dir/ford
user2/prefect
```

Note the lack of `./` prefix.

We can generate these with the following command from the 

```bash
diff -qrN <path/to/new/sde/root> <path/to/old/sde/root> | cut -d' ' -f2 | cut -c 3- > diff_files.txt
```

### Copy changed files 

We can run the following from the same directory as the above command.

```bash
rclone copy -P --dry-run --files-from diff_files.txt . sde.jita.space:/jitaspace-sde/
```
