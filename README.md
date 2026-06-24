# tree-sitter-martian

A [tree-sitter](https://tree-sitter.github.io) grammar for the
[Martian](https://martian-lang.org) (`.mro`) pipeline language — providing
syntax highlighting, folding, and structural selection in editors that use
tree-sitter (Neovim, Helix, Zed, Emacs 29+, …).

It mirrors Martian's own parser (`martian-lang/martian/martian/syntax`) and is
verified against every `.mro` file in the upstream Martian repository.

> For semantic features (diagnostics, completion, go-to-definition, rename, call
> hierarchy, …) use the language server, [`martian-lsp`](https://github.com/eunmann/martian-lsp).
> Tree-sitter handles lexical/structural highlighting; the LSP's semantic tokens
> layer on top.

## Develop

```sh
npm install
npx tree-sitter generate     # regenerate src/ from grammar.js
npx tree-sitter test         # run test/corpus
npx tree-sitter parse examples/example.mro
```

## Editor setup

### Neovim (nvim-treesitter)

```lua
local parsers = require('nvim-treesitter.parsers').get_parser_configs()
parsers.martian = {
  install_info = {
    url = 'https://github.com/eunmann/tree-sitter-martian',
    files = { 'src/parser.c' },
    branch = 'main',
  },
  filetype = 'mro',
}
vim.filetype.add({ extension = { mro = 'mro' } })
```

Then `:TSInstall martian`. Copy `queries/*.scm` into your nvim-treesitter
`queries/mro/` (or rely on the plugin's query discovery).

## Layout

- `grammar.js` — the grammar.
- `queries/highlights.scm`, `queries/folds.scm` — editor queries.
- `test/corpus/` — `tree-sitter test` cases.
- `src/` — generated (committed) parser; editors build `src/parser.c` directly.
  Run `npx tree-sitter init` to scaffold node/rust/etc. bindings if publishing to
  package registries.
- `examples/` — sample `.mro` for `tree-sitter parse`.

## License

MIT — see [`LICENSE`](LICENSE).
