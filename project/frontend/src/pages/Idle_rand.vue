<template>
  <div class="game-main-page">
  <p>{{ Math.round(this.cash) }}</p>
  <div class="roller_container">
 	<p>{{ this.number_of_rolls }}</p>
 	<p>{{ this.price }}</p>
    <button @click="rollDice" class="roller_button">Click Me</button>
  </div>

  <div class="game-stats">
	<p>Cash per second: {{ cash_per_second }}</p>
	<p>Luck multiplicator: {{ numRolls }}</p>
	<p>Rolls multiplicator: {{ numTries }}</p>
  </div>

	<div class="game-shop">
		<div class="game-shop-item">
			<p>Luck Upgrade :</p>
			<button >Upgrade Luck</button>
		</div>
		<div class="game-shop-item">
			<p>Luck Upgrade :</p>
			<button >Upgrade Luck</button>
		</div>
	</div>
  
    <div v-if="results && results.length > 0">
      <h3>Results ({{ results.length }} rolls):</h3>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          Roll {{ index + 1 }}: 
          <span v-if="result !== null">1 in {{ formatProbability(result) }}</span>
          <span v-else>No result occurred</span>
        </li>
      </ul>
    </div>
    <p v-else>No results yet. Click the button to roll!</p>

  <div class="generator_grid">
    <div 
      v-for="generator in ownedGenerators" 
      :key="generator.name"
      class="generator_container"
      @click="purchaseGenerator(generator.id)"
    >
      <h2>{{ generator.name }}</h2>
      <p>Rarity: 1/{{ Math.round(1/generator.rarity) }}</p>
      <p>Generation: {{ generator.generation  * generator.quantity }}</p>
      <p>Owned: {{ generator.quantity }}</p>
    </div>
  </div>
  </div>
</template>

<script>
import { createGameData, rollDice, formatProbability, getOwnedGenerators, purchaseGenerator, incrementGeneratorQuantity, startGameLoop, stopGameLoop, update_price_per_second } from '../script/game-script.js'
import '../assets/game_style.css' // ✅ Page-specific CSS

export default {
  name: 'IdleDice',
  data() {
    return createGameData()
  },
  mounted() {
    // Start the game loop when component mounts
    this.gameLoop = startGameLoop(this.$data, () => {
      // Update cash_per_second whenever generators change
      this.cash_per_second = update_price_per_second(this.generators);
    });
  },
  beforeUnmount() {
    // Clean up when component is destroyed
    stopGameLoop();
  },
  computed: {
    ownedGenerators() {
      return getOwnedGenerators(this.generators)
    }
  },
  methods: {
    rollDice() {
      this.results = rollDice.call(this)
	  for (let i = 0; i < this.results.length; i++) {
		if (this.results[i] !== null) {
		  this.incrementGeneratorQuantity(this.results[i] + 1)
		}
	  }
	  console.log(this.results)
    },

    formatProbability(index) {
      return formatProbability(index)
    },

    purchaseGenerator(generatorId) {
      // You'll need to add playerMoney to your data when you implement currency
      const cost = purchaseGenerator(this.generators, generatorId, 999999) // Using high number for now
      if (cost > 0) {
        console.log(`Purchased ${generatorId} for ${cost}`)
      }
    },

	incrementGeneratorQuantity(generatorId) {
	  const result = incrementGeneratorQuantity(this.generators, generatorId)
	  if (result) {
		this.cash_per_second = result.cashPerSecond
	  }
	}
  }
}
</script>
