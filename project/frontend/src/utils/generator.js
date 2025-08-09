class Generator {
  constructor(name, id, rarity, price, generation = 0, quantity = 0, mutations = []) {
	this.name = name;
    this.id = id;
    this.rarity = this.validatePositiveNumber(rarity, 'rarity');
    this.price = this.validatePositiveNumber(price, 'price');
    this.generation = generation;
    this.quantity = quantity;
    this.mutations = Array.isArray(mutations) ? mutations : [];
  }

  // Validate that a number is positive
  validatePositiveNumber(value, propertyName) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error(`${propertyName} must be a positive number`);
    }
    return value;
  }

  // Add a mutation to the mutations list
  addMutation(mutation) {
    if (mutation instanceof Generator) {
      this.mutations.push(mutation);
    } else {
      throw new Error('Mutation must be a Generator object');
    }
  }

  // Remove a mutation by ID
  removeMutation(mutationId) {
    this.mutations = this.mutations.filter(mutation => mutation.id !== mutationId);
  }

  // Get mutation by ID
  getMutation(mutationId) {
    return this.mutations.find(mutation => mutation.id === mutationId);
  }

  // Update rarity (must remain positive)
  setRarity(newRarity) {
    this.rarity = this.validatePositiveNumber(newRarity, 'rarity');
  }

  // Update price (must remain positive)
  setPrice(newPrice) {
    this.price = this.validatePositiveNumber(newPrice, 'price');
  }

  // Update quantity
  setQuantity(newQuantity) {
    this.quantity = newQuantity;
  }

  incrementQuantity(amount = 1) {
	this.quantity += amount;
  }

  // Get a summary of the generator
  getSummary() {
    return {
      id: this.id,
      rarity: this.rarity,
      price: this.price,
      quantity: this.quantity,
      mutationsCount: this.mutations.length,
      mutations: this.mutations.map(m => ({ id: m.id, rarity: m.rarity }))
    };
  }
}

export default Generator;