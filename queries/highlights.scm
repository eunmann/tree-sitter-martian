; Keywords
[
  "stage"
  "pipeline"
  "filetype"
  "struct"
  "call"
  "return"
  "retain"
  "using"
  "split"
  "in"
  "out"
  "src"
  "as"
  "map"
] @keyword

"@include" @keyword.import

(src_lang) @keyword
(modifier) @keyword.modifier

; Types
(primitive_type) @type.builtin
(type (dotted_id) @type)

; `file` is a builtin file type but lexes as a plain identifier (no `file`
; keyword in Martian), so highlight it as builtin to match `path`/`int`/etc.
((type (dotted_id (identifier) @type.builtin))
 (#eq? @type.builtin "file"))

; Declarations
(stage name: (identifier) @type)
(struct name: (identifier) @type)
(pipeline name: (identifier) @function)
(filetype_decl name: (dotted_id) @type)

; Calls
(call callable: (identifier) @function.call)
(call alias: (identifier) @variable)

; Parameters
(in_param name: (identifier) @variable.parameter)
(out_param name: (identifier) @variable.parameter)
(struct_field name: (identifier) @variable.parameter)

; Bindings / map keys / resource & modifier keys
(binding name: (identifier) @property)
(pair key: (identifier) @property)
(resource key: _ @property)
(call_modifier key: _ @property)

; References
(self) @variable.builtin
(ref base: (identifier) @variable)

; Literals
(string) @string
(integer) @number
(float) @number.float
(true) @boolean
(false) @boolean
(null) @constant.builtin

(comment) @comment @spell

; Punctuation
[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
  "<"
  ">"
] @punctuation.bracket

[
  ","
  "."
  ":"
  ";"
] @punctuation.delimiter

[
  "="
  "*"
] @operator
