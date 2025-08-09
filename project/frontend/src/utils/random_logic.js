export const probabilities = [1/2, 1/4, 1/8, 1/15, 1/25, 1/50, 1/100, 1/500, 1/1000, 1/2500]

export function simulateBestResult(n) {
	let bestIndex = 0
	for (let i = 0; i < probabilities.length; i++) {
		const p = probabilities[i]
		const chance = 1 - Math.pow(1 - p, n)
		if (Math.random() < chance) {
			bestIndex = i
		}
	}
	return bestIndex
}

export function simulateMultipleRolls(numRolls, numTries) {
  const results = []
  for (let i = 0; i < numRolls; i++) {
    const result = simulateBestResult(numTries)
    results.push(result)
  }
  return results
}
