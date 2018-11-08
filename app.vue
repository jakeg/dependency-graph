<template>
  <svg class="svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="500" height="500">
    <template v-for="circle in shapes.circles" @click="toggleOption(circle.id)">
      <line
        v-for="dependent in circle.dependents"
        :x1="circle.x"
        :y1="circle.y"
        :x2="xPos(dependent, circle)"
        :y2="yPos(dependent, circle)"
        stroke="white"
        :key="dependent"
      />
    </template>
    <g v-for="(circle, i) in shapes.circles" @click="toggleOption(circle.id)" :key="`circle-${i}`">
      <circle
        :cx="circle.x"
        :cy="circle.y"
        :r="circle.r"
        :fill="circle.isSelected ? 'green' : 'white'"
      />
      <text
        :x="circle.x"
        :y="circle.y"
        class="nodeLabel"
        text-anchor="middle"
        alignment-baseline="middle"
      >
        {{ circle.text.toUpperCase() }}
      </text>
    </g>
  </svg>
</template>

<script>
import { RuleSet, SelectedOptions} from './index.js'

function circle ({ r, x, y, isSelected, id, dependents }) {
  if (!x) x = getRandomInt(460) + 20
  if (!y) y = getRandomInt(460) + 20
  if (!r) r = 20
  return { id, r, x, y, text: id, isSelected, dependents }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export default {
  data () {
    return {
      shapes: [],
      options: [],
      ruleSet: null,
      selectedOptions: null
    }
  },
  mounted () {
    this.options = ['a', 'b', 'c', 'd', 'e']
    this.ruleSet = new RuleSet().addDep('a', 'b').addDep('b', 'c').addDep('c', 'd').addDep('e', 'b').addConflict('a', 'e')
    this.selectedOptions = new SelectedOptions(this.ruleSet)
    const shapes = { circles: [] }
    const selected = this.selectedOptions.items()
    for (let option in this.options) {
      shapes.circles.push(circle({
        id: this.options[option],
        isSelected: selected.includes(this.options[option]),
        dependents: this.ruleSet.dependents[this.options[option]] || []
      }))
    }
    this.shapes = shapes
  },
  methods: {
    toggleOption (id) {
      const selected = this.selectedOptions.toggle(id).items()
      for (let circle of this.shapes.circles) {
        circle.isSelected = selected.includes(circle.id)
      }
    },
    xPos (id, origin) {
      return this.shapes.circles.find(v => v.id === id).x
    },
    yPos (id, origin) {
      return this.shapes.circles.find(v => v.id === id).y
    }
  }
}
</script>

<style>
  body {
    font-family: arial, sans-serif;
  }
  .svg {
    background: black;
  }

  .svg circle, .svg text {
    transition: all 1s ease;
    z-index: 2;
  }
  .svg text {
    font-size: 11px;
  }
  .svg line {
    z-index: 1;
  }
</style>
