/// <reference types="tree-sitter-cli/dsl" />
// Tree-sitter grammar for the Martian (MRO) pipeline language.
// Mirrors github.com/martian-lang/martian/martian/syntax/grammar.y + tokenizer.go.

const PRIMITIVE_TYPES = ['int', 'float', 'string', 'bool', 'path', 'file'];

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

module.exports = grammar({
  name: 'martian',

  word: ($) => $.identifier,
  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) =>
      seq(repeat($.include), repeat($._declaration), optional($.call)),

    include: ($) => seq('@include', field('path', $.string)),

    _declaration: ($) =>
      choice($.filetype_decl, $.stage, $.pipeline, $.struct),

    filetype_decl: ($) => seq('filetype', field('name', $.dotted_id), ';'),

    // ---- stage ----
    stage: ($) =>
      seq(
        'stage',
        field('name', $.identifier),
        '(',
        repeat($.in_param),
        repeat($.out_param),
        $.src_statement,
        ')',
        optional($.split),
        optional($.using_resources),
        optional($.retain),
      ),

    in_param: ($) =>
      seq('in', field('type', $.type), field('name', $.identifier), optional(field('help', $.string)), ','),

    out_param: ($) =>
      seq(
        'out',
        field('type', $.type),
        optional(field('name', $.identifier)),
        optional(seq(field('help', $.string), optional(field('out_name', $.string)))),
        ',',
      ),

    src_statement: ($) =>
      seq('src', field('lang', $.src_lang), field('cmd', $.string), ','),
    src_lang: ($) => choice('py', 'exec', 'comp', 'compiled'),

    split: ($) =>
      seq('split', optional('using'), '(', repeat($.in_param), repeat($.out_param), ')'),

    using_resources: ($) => seq('using', '(', repeat($.resource), ')'),
    resource: ($) =>
      choice(
        seq(field('key', choice('threads', 'mem_gb', 'memgb', 'vmem_gb', 'vmemgb')), '=', $._number, ','),
        seq(field('key', 'special'), '=', $.string, ','),
        seq(field('key', 'volatile'), '=', choice('strict', 'false'), ','),
      ),

    retain: ($) => seq('retain', '(', repeat(seq($.ref, ',')), ')'),

    // ---- pipeline ----
    pipeline: ($) =>
      seq(
        'pipeline',
        field('name', $.identifier),
        '(',
        repeat($.in_param),
        repeat($.out_param),
        ')',
        '{',
        repeat($.call),
        $.return_statement,
        optional($.retain),
        '}',
      ),

    return_statement: ($) =>
      seq('return', '(', repeat($.binding), optional($.wildcard_binding), ')'),

    // ---- struct ----
    struct: ($) =>
      seq('struct', field('name', $.identifier), '(', repeat($.struct_field), ')'),
    struct_field: ($) =>
      seq(
        field('type', $.type),
        field('name', $.identifier),
        optional(seq(field('help', $.string), optional(field('out_name', $.string)))),
        ',',
      ),

    // ---- call ----
    call: ($) =>
      seq(
        optional('map'),
        'call',
        repeat($.modifier),
        field('callable', $.identifier),
        optional(seq('as', field('alias', $.identifier))),
        '(',
        repeat($.binding),
        optional($.wildcard_binding),
        ')',
        optional($.call_using),
      ),
    modifier: ($) => choice('local', 'preflight', 'volatile'),
    call_using: ($) => seq('using', '(', repeat($.call_modifier), ')'),
    call_modifier: ($) =>
      choice(
        seq(field('key', choice('local', 'preflight', 'volatile')), '=', $._bool, ','),
        seq(field('key', 'disabled'), '=', $.ref, ','),
      ),

    // ---- bindings ----
    binding: ($) =>
      seq(field('name', $.identifier), '=', choice($._expr, $.split_expr), ','),
    split_expr: ($) => seq('split', $._expr),
    wildcard_binding: ($) => seq('*', '=', $.ref, ','),

    // ---- expressions ----
    _expr: ($) =>
      choice($.float, $.integer, $.string, $._bool, $.null, $.array, $.map, $.ref),

    _bool: ($) => choice($.true, $.false),
    true: ($) => 'true',
    false: ($) => 'false',
    null: ($) => 'null',

    array: ($) => seq('[', optional(seq(commaSep1($._expr), optional(','))), ']'),

    map: ($) => seq('{', optional(seq(commaSep1($.pair), optional(','))), '}'),
    pair: ($) => seq(field('key', choice($.string, $.identifier)), ':', field('value', $._expr)),

    ref: ($) =>
      choice(
        $.self,
        seq(field('base', $.identifier), repeat(seq('.', $._ref_segment))),
      ),
    self: ($) => seq('self', repeat(seq('.', $._ref_segment))),
    _ref_segment: ($) => choice($.identifier, alias('default', $.identifier)),

    // ---- types ----
    type: ($) =>
      seq(
        choice(
          alias(choice(...PRIMITIVE_TYPES), $.primitive_type),
          $.map_type,
          $.dotted_id,
        ),
        repeat($.array_suffix),
      ),
    map_type: ($) => seq('map', optional(seq('<', $.type, '>'))),
    array_suffix: ($) => seq('[', ']'),

    // ---- lexical ----
    dotted_id: ($) => seq($.identifier, repeat(seq('.', $.identifier))),
    identifier: ($) => /_?[A-Za-z]\w*/,

    _number: ($) => choice($.integer, $.float),
    integer: ($) => /-?\d+/,
    float: ($) => /-?\d+(\.\d+([eE][+-]?\d+)?|[eE][+-]?\d+)/,

    string: ($) =>
      token(
        seq(
          '"',
          repeat(
            choice(
              /[^"\\\n]/,
              /\\[abfnrtv\\"]/,
              /\\[0-7]{3}/,
              /\\x[0-9a-fA-F]{2}/,
              /\\u[0-9a-fA-F]{4}/,
              /\\U[0-9a-fA-F]{8}/,
            ),
          ),
          '"',
        ),
      ),

    comment: ($) => token(seq('#', /.*/)),
  },
});
