//--------------------------------------------------------------------------------
// CLASS
//--------------------------------------------------------------------------------

class Flipper {

  constructor () { this.weights = {}; this.data = {}; }
  
  //--------------------------------------
  
  calculateFlips (data) {
    this.data = structuredClone(data);
    
    this.#getFlipScore();
    
    let FLIPS = Object.entries(this.data);
    
    FLIPS = FLIPS.filter((i) => isFinite(i[1].score ?? Infinity));
    FLIPS = FLIPS.sort((a,b) => b[1].score - a[1].score);
    
    console.log(FLIPS);
  }
  
  //--------------------------------------
  
  #getFlipScore () {
    for (let NOTLOOPING = false, LOOP = 0; !NOTLOOPING && LOOP < 20; LOOP++) {
  
      NOTLOOPING = true;
    
      for (let item of Object.values(this.data)) {
        NOTLOOPING = this.#getCostScoreItem(item) && NOTLOOPING;
        NOTLOOPING = this.#getValueScoreItem(item) && NOTLOOPING;
      }
    }
    
    for (let item of Object.values(this.data)) {
      item.score = (item.valueScore ?? -Infinity) - (item.costScore ?? Infinity);
    }
  }
  
  //--------------------------------------
  
  #getCostScoreItem (item) {
    if (!isNaN(item.costScore ?? NaN)) return true;
  
    let VALID = true;
    
    for (let recipe of item.cost ?? []) {
      VALID = this.#getCostScoreRecipe(recipe) && VALID;
    }
    
    if (!VALID) return false;
    
    item?.cost?.sort((a,b) => a.score - b.score);
    
    item.costScore = item?.cost?.[0]?.score ?? Infinity;
    
    return true;
  }
  
  //--------------------------------------
  
  #getCostScoreRecipe (recipe) {
    if (!isNaN(recipe.score ?? NaN)) return true;
  
    let SCORE = recipe.time * this.weights.TIME;
    
    for (let item of recipe.items) {
    
      let cost = this.data[item.id]?.cost;
    
      let score1 = this.data[item.id]?.costScore;
      
      if (cost?.length > 0 && isNaN(score1 ?? NaN)) return false;

      let score2 = this.weights[item.id];
      
      SCORE += (score1 ?? score2 ?? Infinity) * item.amount;
    
    }
    
    recipe.score = SCORE / recipe.amount;
    
    return true;
  }
  
  //--------------------------------------
  
  #getValueScoreItem (item) {
    if (!isNaN(item.valueScore ?? NaN)) return true;
  
    let VALID = true;
    
    for (let recipe of item.value ?? []) {
      VALID = this.#getValueScoreRecipe(recipe) && VALID;
    }
    
    if (!VALID) return false;
    
    item?.value?.sort((a,b) => b.score - a.score);
    
    item.valueScore = item?.value?.[0]?.score ?? -Infinity;
    
    return true;
  }
  
  //--------------------------------------
  
  #getValueScoreRecipe (recipe) {
    if (!isNaN(recipe.score ?? NaN)) return true;
  
    let SCORE = -1 * recipe.time * this.weights.TIME;
    
    for (let item of recipe.items) {
    
      let value = this.data[item.id]?.value;
    
      let score1 = this.data[item.id]?.valueScore;
      
      if (value?.length > 0 && isNaN(score1 ?? NaN)) return false;

      let score2 = this.weights[item.id];
      
      SCORE += (score1 ?? score2 ?? -Infinity) * item.amount;
    
    }
    
    recipe.score = SCORE / recipe.amount;
    
    return true;
  }

}

//--------------------------------------------------------------------------------
