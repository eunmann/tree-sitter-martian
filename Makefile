TS := npx tree-sitter

.PHONY: all generate test lint format parse upstream-test clean help

all: generate test ## Generate the parser and run the test suite

generate: ## Regenerate src/ from grammar.js
	$(TS) generate

test: generate ## Run corpus + highlight tests
	$(TS) test

lint: ## Lint grammar.js (ESLint) and check formatting (Prettier)
	npm run lint
	npm run format:check

format: ## Auto-format JS/JSON/Markdown with Prettier
	npm run format

parse: generate ## Parse the bundled examples (must be error-free)
	$(TS) parse -q examples/*.mro

# Parse every .mro file in a local martian checkout to verify upstream fidelity.
# Override the path: make upstream-test MARTIAN=/path/to/martian
MARTIAN ?= ../martian
upstream-test: generate ## Parse every .mro in a local martian checkout
	@test -d "$(MARTIAN)" || { echo "MARTIAN dir '$(MARTIAN)' not found; set MARTIAN=/path/to/martian"; exit 1; }
	@find $(MARTIAN) -name '*.mro' -print0 | xargs -0 -r $(TS) parse -q

clean: ## Remove build artifacts
	rm -rf build *.wasm

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'
