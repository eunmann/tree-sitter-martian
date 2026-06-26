# tree-sitter-martian

[![PR Validation](https://github.com/eunmann/tree-sitter-martian/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/eunmann/tree-sitter-martian/actions/workflows/pr-validation.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A [tree-sitter](https://tree-sitter.github.io) grammar for the
[Martian](https://martian-lang.org) (`.mro`) pipeline language — providing
syntax highlighting, folding, and structural selection in editors that use
tree-sitter (Neovim, Helix, Zed, Emacs 29+, …).

It mirrors Martian's own parser
([`martian-lang/martian/martian/syntax`](https://github.com/martian-lang/martian/tree/master/martian/syntax):
`grammar.y` + `tokenizer.go`) and is verified in CI against every `.mro` file in
the upstream Martian repository.

> For semantic features (diagnostics, completion, go-to-definition, rename, call
> hierarchy, …) use the language server, [`martian-lsp`](https://github.com/eunmann/martian-lsp).
> Tree-sitter handles lexical/structural highlighting; the LSP's semantic tokens
> layer on top.

## What it parses

The grammar covers the full Martian surface syntax:

- `@include` directives and `filetype` declarations.
- `stage` declarations: `in`/`out` params (with help text and out-names), the
  `src` statement (`py`/`exec`/`comp`/`compiled`), `split (using)` blocks,
  `using (…)` resources (`threads`, `mem_gb`/`memgb`, `vmem_gb`/`vmemgb`,
  `special`, `volatile`), and `retain (…)`.
- `pipeline` declarations: `call` statements (with `local`/`preflight`/`volatile`
  modifiers, `as` aliases, `map call`, `using` call modifiers including
  `disabled`), `return`, and `retain`.
- `struct` declarations.
- Expressions: ints, floats, strings (with escapes), booleans, `null`, arrays,
  maps/structs, `self.`/`CALL.output` references, `split` expressions, and
  wildcard (`* = …`) bindings.
- Types: the primitive types (`int`, `float`, `string`, `bool`, `path`), `map`
  and `map<…>`, array suffixes, and dotted user/file type names.

## Develop

```sh
npm install
make generate     # regenerate src/ from grammar.js  (npx tree-sitter generate)
make test         # corpus + highlight tests          (npx tree-sitter test)
make lint         # ESLint grammar.js + Prettier check
make parse        # parse the bundled examples
make help         # list all targets
```

`make upstream-test MARTIAN=/path/to/martian` parses every `.mro` in a local
Martian checkout — the same fidelity check CI runs against
`martian-lang/martian`.

## Testing

- **Corpus tests** (`test/corpus/*.txt`) assert the parse tree for a snippet —
  declarations, pipelines, structs, types, expressions, edge cases (keywords
  used as identifiers, multi-line strings), and intentional `:error` cases.
- **Highlight tests** (`test/highlight/*.mro`) assert capture names produced by
  `queries/highlights.scm` using inline `# <-`/`# ^` annotations.

Both run under `npx tree-sitter test`. When changing the grammar, regenerate the
expected trees with `npx tree-sitter test --update` and review the diff.

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
- `test/corpus/` — `tree-sitter test` parse-tree cases.
- `test/highlight/` — highlight-query assertion cases.
- `src/` — generated (committed) parser; editors build `src/parser.c` directly.
  Run `npx tree-sitter init` to scaffold node/rust/etc. bindings if publishing to
  package registries.
- `examples/` — sample `.mro` for `tree-sitter parse`.

## Contributing

1. Edit `grammar.js`.
2. `make test` (regenerates `src/` and runs corpus + highlight tests).
3. `make lint` (ESLint + Prettier).
4. Commit the regenerated `src/` together with your grammar change — CI fails if
   `src/` is stale.

## License

MIT — see [`LICENSE`](LICENSE). Third-party material is listed in
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
