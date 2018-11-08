/** A way to express rules (dependencies and conflicts/exclusivity) between options */
class RuleSet {
  constructor () {
    // we have a graph of nodes (options) and edges (dependencies)
    // nodes without edges won't be in the graph at all
    // we'll store the edges in both directions to make toggling quicker
    // we could save space by only storing the edges in one direction
    this.dependsOn = {} // option/node: [edges; things it depends on]
    this.dependents = {} // option/node: [edges; things which depend on it]

    this.exclusivePairs = [] // both a and b can't be selected at same time

    return this
  }

  /** a depends on b */
  addDep (a, b) {
    if (!this.dependsOn[a]) this.dependsOn[a] = []
    this.dependsOn[a].push(b)
    if (!this.dependents[b]) this.dependents[b] = []
    this.dependents[b].push(a)
    return this // allow chaining
  }

  /** a and b are exclusive, they can't both be set */
  addConflict (a, b) {
    this.exclusivePairs.push([a, b])
    return this // allow chaining
  }

  /** Checks if the rules create impossibilities */
  isCoherent () {
    // check for dependency loops (no ancester can be a descendent)
    // for every node, check never comes back to self
    // depth-first graph search
    // O = N ?
    for (let node in this.dependents) {
      if (!this._dependentsCheck(node)) return false
    }

    // check for exclusivity impossibilities (eg if a depends b but can't have a and b)
    // for every node, given a list of nodes it is exclusive with,
    // check all descendents and ensure they're not on that list
    // get exclusive nodes list; get list of descendents from graph;
    // find any that are on both lists (O = N*M ?)
    // no, we don't care about nodes which aren't in the dependency graph
    for (let node in this.dependents) {
      const exclusives = []
      for (let pair of this.exclusivePairs) {
        if (pair[0] === node) exclusives.push(pair[1])
        else if (pair[1] === node) exclusives.push(pair[0])
      }
      if (exclusives.length) {
        if (!this._exclusiveCheck(node, exclusives)) return false
      }
    }

    // no problems found
    return true
  }

  /** recursively check if any descendent is on the exclusive list */
  _exclusiveCheck (node, exclusives) {
    const children = this.dependents[node]
    if (!children) return true
    for (let child of children) {
      if (exclusives.includes(child)) return false
      if (!this._exclusiveCheck(child, exclusives)) return false
    }
    return true
  }

  /** recursively check if any descendent of a node is itself */
  _dependentsCheck (checkNode, currentNode = checkNode) {
    const children = this.dependents[currentNode]
    if (!children) return true
    for (let child of children) {
      if (child === checkNode) return false
      if (!this._dependentsCheck(checkNode, child)) return false
    }
    return true
  }
}

/* a way to select options for a given set of rules */
class SelectedOptions {
  constructor (ruleSet) {
    this.ruleSet = ruleSet
    this.selected = new Set()
  }

  /** toggle an option and all its descendents */
  toggle (option) {
    if (this.selected.has(option)) this._unselect(option)
    else this._select(option)
    return this // make chainable
  }

  /** recursively unselect an option and all its descendents */
  _unselect (option) {
    this.selected.delete(option)
    if (this.ruleSet.dependents[option]) {
      for (let descendent of this.ruleSet.dependents[option]) {
        this._unselect(descendent)
      }
    }
  }

  /** recursively select an option and all its ancesters */
  _select (option) {
    this.selected.add(option)
    if (this.ruleSet.dependsOn[option]) {
      for (let ancester of this.ruleSet.dependsOn[option]) {
        this._select(ancester)
      }
    }
  }

  /** list of selected options, separated by comma */
  stringSlice () {
    return this.items().join(', ')
  }

  /** sorted array of selected options */
  items () {
    return [...this.selected].sort()
  }
}

module.exports = { RuleSet, SelectedOptions }
