<template>
  <svg class="svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="500" height="500">
    <g v-for="(circle, i) in shapes.circles" @click="toggleOption(circle.id)" :key="`circle-${i}`">
      <circle
        :cx="circle.x"
        :cy="circle.y"
        :r="circle.r"
        :fill="circle.isSelected ? 'green' : '#ccc'"
      />
      <text :x="circle.x" :y="circle.y" class="nodeLabel" text-anchor="middle" alignment-baseline="middle">{{ circle.text.toUpperCase() }}</text>
    </g>
  </svg>
</template>

<script>
import { RuleSet, SelectedOptions} from './index.js'

function circle ({ r, x, y, isSelected, id }) {
  if (!x) x = getRandomInt(460) + 20
  if (!y) y = getRandomInt(460) + 20
  if (!r) r = 20
  return { id, r, x, y, text: id, isSelected }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export default {
  data () {
    return {
      shapes: [],
      options: [],
      selectedOptions: null
    }
  },
  mounted () {
    this.options = ['a', 'b', 'c', 'd', 'e']
    this.selectedOptions = new SelectedOptions(
      new RuleSet().addDep('a', 'b').addDep('b', 'c').addDep('c', 'd').addDep('e', 'b')
    )
    const shapes = { circles: [] }
    const selected = this.selectedOptions.items()
    for (let option in this.options) {
      shapes.circles.push(circle({
        id: this.options[option],
        isSelected: selected.includes(this.options[option])
      }))
    }
    this.shapes = shapes
  },
  methods: {
    toggleOption (id) {
      this.selectedOptions.toggle(id)
      const selected = this.selectedOptions.items()
      for (let circle of this.shapes.circles) {
        console.log(circle)
        circle.isSelected = selected.includes(circle.id)
      }
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
  }
  .svg text {
    font-size: 11px;
  }
</style>
