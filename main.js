//--------------------------------------------------------------------------------
// GLOBAL VARIABLES
//--------------------------------------------------------------------------------

let WEIGHTS = { "COIN": 1, "TIME": 0 };

let FLIPPER_DATA = {};

//--------------------------------------------------------------------------------
// BAZAAR DATA INTEGRATION
//--------------------------------------------------------------------------------

let BAZAAR_DATA = {};

for (let item of Object.values(BAZAAR_DATA)) {

  FLIPPER_DATA[item.productId] ??= {cost:[], value:[]};
  
  FLIPPER_DATA[item.productId].cost.push({
    type: "BAZAARINSTABUY",
    amount: 1,
    time: 1,
    items: [{id:"COIN", amount: item.buyPrice}]
  },{
    type: "BAZAARBUYORDER",
    amount: 1,
    time: item.sellMovingWeek / 604800,
    items: [{id:"COIN", amount: item.sellPrice}]
  });
  
  FLIPPER_DATA[item.productId].value.push({
    type: "BAZAARINSTASELL",
    amount: 1,
    time: 1,
    items: [{id:"COIN", amount: item.sellPrice}]
  },{
    type: "BAZAARSELLORDER",
    amount: 1,
    time: item.buyMovingWeek / 604800,
    items: [{id:"COIN", amount: item.buyPrice}]
  });

}

//--------------------------------------------------------------------------------
// FLIP SCORE CALCULATION
//--------------------------------------------------------------------------------

function calculateFlipScore () {
  for (let item of Object.values(FLIPPER_DATA)) {
    let loop
    item.cost?.forEach(calculateCostScore);
    item.value?.forEach(calculateValueScore);
    
    item.score = (item?.value?.[0]?.score ?? -Infinity) - (item?.cost?.[0]?.score ?? Infinity);
  }
  
  let FLIPS = Object.entries(FLIPPER_DATA);
  
  console.log(FLIPS.sort((a,b) => a.score - b.score));
}

//--------------------------------------------------------------------------------
// COST SCORE CALCULATION
//--------------------------------------------------------------------------------

function calculateCostScore (recipe) {
  if (recipe.score) return recipe.score;
  
  let SCORE = recipe.time * WEIGHTS.TIME;
  
  for (let item of recipe.items) {
  
    let cost = FLIPPER_DATA[item.id]?.cost;
  
    cost?.forEach(calculateCostScore);
    cost?.sort((a,b) => a.score - b.score);
    
    let score1 = cost?.[0]?.score ?? null;

    let score2 = WEIGHTS[item.id] ?? null;
    
    let score = score1 ?? score2 ?? Infinity;

    SCORE += score * item.amount;
  
  }
  
  recipe.score = SCORE / recipe.amount;
}

//--------------------------------------------------------------------------------
// VALUE SCORE CALCULATION
//--------------------------------------------------------------------------------

function calculateValueScore (recipe) {
  if (recipe.score) return recipe.score;
  
  let SCORE = -1 * recipe.time * WEIGHTS.TIME;
  
  for (let item of recipe.items) {
  
    let value = FLIPPER_DATA[item.id]?.value;
  
    value?.forEach(calculateValueScore);
    value?.sort((a,b) => b.score - a.score);
    
    let score1 = value?.[0]?.score ?? null;
    
    let score2 = WEIGHTS[item.id] ?? null;
    
    let score =  score1 ?? score2 ?? -Infinity;

    SCORE += score * item.amount;
  
  }
  
  recipe.score = SCORE / recipe.amount;
}

//--------------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------------
