import Generator from '../utils/generator.js'
import { simulateMultipleRolls, probabilities } from '../utils/random_logic.js'

// Game data setup
export function createGameData() {
  return {
	cash : 100,
	cash_per_second: 0,
    numRolls: 1,
    numTries: 1,
	number_of_rolls: 0, // Default number of rolls
	price: 0,
    results: [],
    generators: [
      new Generator('basic : 1/2', 1, 2, 1, 1, 0, []),      // quantity: 0 (hidden)
      new Generator('basic : 1/4', 2, 4, 5, 5, 0, []),    // quantity: 2 (visible)
      new Generator('basic : 1/8', 3, 8, 10, 10, 0, []),  // quantity: 1 (visible)
      new Generator('common : 1/15', 4, 15, 20, 20, 0, []),     // quantity: 0 (hidden)
      new Generator('common : 1/25', 5, 25, 50, 50, 0, []),   // quantity: 0 (hidden)
      new Generator('common : 1/50', 6, 50, 100, 100, 0, []), // quantity: 0 (hidden)
      new Generator('uncommon : 1/100', 7, 100, 250, 250, 0, []),  // quantity: 0 (hidden)
      new Generator('uncommon : 1/500', 8, 500, 750, 750, 0, []), // quantity: 0 (hidden)
      new Generator('uncommon : 1/1000', 9, 1000, 1500, 1500, 0, []), // quantity: 0 (hidden)
      new Generator('rare : 1/2500', 10, 2500, 2750, 2750, 0, []) // quantity: 0 (hidden)
    ]
  }
}



// Game methods
export function update_price_per_second(generators) {
	let cash_per_second = 0;
	generators.forEach(generator => {
		if (generator.quantity > 0) {
			cash_per_second += generator.generation * generator.quantity;
		}
	});
	return cash_per_second;
}

export function rollDice() {
	if (this.cash < this.price) {
		throw new Error("Not enough cash to roll the dice.");
	}
	this.cash -= this.price
	this.number_of_rolls += this.numRolls
	this.price = ((this.number_of_rolls * 10) * this.number_of_rolls) + this.number_of_rolls * (this.price / 100)
	this.price = Math.round(this.price)
  	return simulateMultipleRolls(this.numRolls, this.numTries)
}

export function formatProbability(index) {
  return Math.round(1 / probabilities[index])
}

export function getOwnedGenerators(generators) {
  return generators.filter(generator => generator.quantity > 0)
}

export function purchaseGenerator(generators, generatorId, playerMoney) {
  const generator = generators.find(g => g.id === Number(generatorId))
  if (generator && playerMoney >= generator.price) {
    generator.quantity += 1
    return generator.price // Return cost to deduct from player money
  }
  return 0 // No purchase made
}

export function incrementGeneratorQuantity(generators, generatorId, amount = 1) {
  const generator = generators.find(obj => obj.id === Number(generatorId))
  if (generator) {
	generator.incrementQuantity(amount)
	const newCashPerSecond = update_price_per_second(generators)
	return { quantity: generator.quantity, cashPerSecond: newCashPerSecond }
  }
  return null // Generator not found
}


// Game loop - runs at 20 ticks per second (50ms intervals)
let gameLoopInterval = null;

export function startGameLoop(gameData, updateCallback) {
  // Stop existing loop if running
  if (gameLoopInterval) {
    clearInterval(gameLoopInterval);
  }
  
  const TICK_RATE = 20; // 20 ticks per second
  const TICK_INTERVAL = 1000 / TICK_RATE; // 50 milliseconds
  
  gameLoopInterval = setInterval(() => {
    // Update cash based on cash_per_second
    if (gameData.cash_per_second > 0) {
      gameData.cash += gameData.cash_per_second / TICK_RATE; // Divide by tick rate for smooth progression
    }

    // Call the update callback to trigger Vue reactivity
    if (updateCallback && typeof updateCallback === 'function') {
      updateCallback();
    }
  }, TICK_INTERVAL);
  
  return gameLoopInterval;
}

export function stopGameLoop() {
  if (gameLoopInterval) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
  }
}


