const { RuleSet, SelectedOptions } = require('./index.js')

function assert (...args) {
  console.assert(...args)
}

// test RuleSet class

// test things that should be coherent
assert(new RuleSet().addDep('a', 'b').addDep('b', 'c').isCoherent())
assert(new RuleSet().addDep('a', 'b').addConflict('a', 'd').isCoherent())
assert(new RuleSet().addDep('a', 'b').addDep('b', 'c').addConflict('a', 'e').isCoherent())

// test things that should NOT be coherent
assert(new RuleSet().addDep('a', 'b').addDep('b', 'a').isCoherent() === false)
assert(new RuleSet().addDep('a', 'b').addConflict('a', 'b').isCoherent() === false)
assert(new RuleSet().addDep('a', 'b').addDep('b', 'c').addConflict('a', 'c').isCoherent() === false)
assert(new RuleSet().addDep('a', 'b').addDep('b', 'c').addDep('c', 'a').isCoherent() === false)

// test SelectedOptions class

const selected = new SelectedOptions(
  new RuleSet().addDep('a', 'b').addDep('b', 'c').addDep('c', 'd').addDep('e', 'b')
)
assert(selected.toggle('a').stringSlice() === 'a, b, c, d') // turn a on
assert(selected.toggle('c').stringSlice() === 'd') // turn c off
assert(selected.toggle('b').stringSlice() === 'b, c, d') // turn b on
assert(selected.toggle('e').stringSlice() === 'b, c, d, e') // turn e on
assert(selected.toggle('d').stringSlice() === '') // turn d off
assert(selected.toggle('e').stringSlice() === 'b, c, d, e') // turn e on

console.log('Tests passed')
