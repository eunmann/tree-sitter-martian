# Third-party notices

`tree-sitter-martian` is licensed under the MIT License (see `LICENSE`). It
includes and/or derives from the following third-party material.

| Component                                                                                         | Relationship                                                                                              | License                                      |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [tree-sitter](https://github.com/tree-sitter/tree-sitter) runtime headers (`src/tree_sitter/*.h`) | Vendored into the committed parser by `tree-sitter generate`                                              | MIT (Copyright 2018 Max Brunsfeld)           |
| Generated parser (`src/parser.c`, `src/grammar.json`, `src/node-types.json`)                      | Emitted by the tree-sitter CLI from `grammar.js`                                                          | MIT                                          |
| [martian-lang/martian](https://github.com/martian-lang/martian)                                   | This grammar mirrors Martian's own `martian/syntax/grammar.y` + `tokenizer.go`; no Martian code is copied | MIT (Copyright 2014–2020 10x Genomics, Inc.) |

The `src/tree_sitter/` headers are reproduced verbatim from the tree-sitter
project as part of the generated parser and carry tree-sitter's MIT license.
This grammar is an independent reimplementation of the Martian syntax derived by
reading the upstream grammar; it does not vendor or link any Martian source.

Development-time tooling (the tree-sitter CLI, ESLint, Prettier) is listed in
`package.json` under `devDependencies` and is not distributed with the grammar.
