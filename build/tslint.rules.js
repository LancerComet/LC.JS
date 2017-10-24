module.exports = {
  'class-name': true,
  'completed-docs': [
    true,
    'classes', 'functions', 'enums', 'interfaces', 'namespaces'
  ],
  "curly": true,
  'jsdoc-format': true,
  'import-spacing': true,
  'interface-name': [true, 'always-prefix'],
  'new-parens': true,
  'newline-before-return': false,
  'no-arg': true,
  'no-consecutive-blank-lines': true,
  'no-debugger': process.env.NODE_ENV === 'production',
  'no-duplicate-super': true,
  'no-duplicate-variable': [true, 'check-parameters'],
  'no-empty': true,
  'no-empty-interface': true,
  'no-floating-promises': true,
  'no-irregular-whitespace': true,
  'no-trailing-whitespace': true,
  'no-unnecessary-initializer': true,
  'no-unused-expression': false,
  'no-unused-variable': true,
  'number-literal-format': true,
  'one-variable-per-declaration': [true, 'ignore-for-loop'],
  'quotemark': [true, 'single', 'avoid-escape'],
  'semicolon': [true, 'never'],
  'space-before-function-paren': [true, 'always'],
  'trailing-comma': [true, 'never'],
  'triple-equals': true,
  'typeof-compare': true,
  'variable-name': [
    false,
    'ban-keywords', 'check-format'
  ]
}
