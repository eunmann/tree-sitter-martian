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

This grammar isn't in the nvim-treesitter registry yet, so install it directly
(works on any Neovim 0.11+, with or without nvim-treesitter):

```sh
git clone https://github.com/eunmann/tree-sitter-martian
cd tree-sitter-martian && npm install
# build the parser into Neovim's runtime parser dir
npx tree-sitter build --output "$HOME/.config/nvim/parser/martian.so"
# install the highlight/fold queries
mkdir -p "$HOME/.config/nvim/queries/martian"
cp queries/*.scm "$HOME/.config/nvim/queries/martian/"
```

Then in your Neovim config:

```lua
vim.filetype.add({ extension = { mro = 'mro' } })
vim.treesitter.language.register('martian', 'mro')
vim.api.nvim_create_autocmd('FileType', {
  pattern = 'mro',
  callback = function(ev) pcall(vim.treesitter.start, ev.buf, 'martian') end,
})
```

Open a `.mro` file; use `:InspectTree` / `:Inspect` to verify. Once the grammar
lands in the nvim-treesitter registry, `:TSInstall martian` will install it
automatically.

### Helix

Add to `languages.toml` a `[[grammar]]` with `source = { git = "…", rev = "…" }`
for `martian` and a `[[language]]` mapping `file-types = ["mro"]`, then
`hx --grammar fetch && hx --grammar build`. Place the queries under
`runtime/queries/martian/`.

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
