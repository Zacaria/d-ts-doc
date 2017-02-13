# d-ts-doc
Comment a definition typescript and get Markdown !

## Features

* Comment d.ts and get merkdown
* support versions => keep old versions in `content` folder to import old commentss

## How to use ?

1. Put your .d.ts in src/sources
2. name it like <name>.<major>.<minor>.d.ts
3. Update config.js => check comments
4. `npm run start`
5. Output is in `content/classes/<version>`
