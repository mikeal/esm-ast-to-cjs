const copy = o => JSON.parse(JSON.stringify(o))

const exportExpression = {
  type: 'AssignmentExpression',
  operator: '=',
  left: {
    type: 'MemberExpression',
    object: { type: 'Identifier', name: 'module' },
    property: { type: 'Identifier', name: 'exports' },
    computed: false
  }
}

const types = {}

types.ExportDefaultDeclaration = node => {
  const ast = copy(exportExpression)
  ast.right = node.declaration
  return ast
}

types.ExportNamedDeclaration = node => {
  const ast = copy(exportExpression)
  const properties = []
  ast.right = {
    type: 'ObjectExpression',
    properties
  }

  for (const specifier of node.specifiers) {
    if (specifier.type !== 'ExportSpecifier') throw new Error('Not implemented')
    console.log({ specifier })
    if (specifier.local.name === specifier.exported.name) {
      const name = specifier.local.name
      properties.push({
        type: 'Property',
        method: false,
        shorthand: true,
        computed: false,
        key: { type: 'Identifier', name },
        kind: 'init',
        value: { type: 'Identifier', name }
      })
    } else {
      throw new Error('Not implemented')
    }
  }
  return ast
}

export default ast => {
  let i = 0
  for (const node of ast.body) {
    if (types[node.type]) {
      ast.body[i] = types[node.type](node)
    } else {
      // console.log(node)
    }
    i++
  }
  return ast
}
