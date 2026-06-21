//--------------------------------------------------------------------------------
// INIT
//--------------------------------------------------------------------------------

const app = { weights: new Weights(), flipper: new Flipper(), update};

let recipeManager = new RecipeManager();
let bazaarManager = new BazaarManager();

let dataManager = new DataManager();

function update () {
  if (!recipeManager.ready || !bazaarManager.ready) return;
  
  app.flipper.weights = app.weights.values;
  
  dataManager.loadData([recipeManager.data, bazaarManager.data]);
  app.flipper.calculateFlips(dataManager.data);
}

menu.initEvents(app);

recipeManager.onUpdate = bazaarManager.onUpdate = app.weights.onUpdate = app.update;

//--------------------------------------------------------------------------------
// LOOP
//--------------------------------------------------------------------------------

function loop () {
  menu.refresh(app); requestAnimationFrame(loop);
}

document.body.onload = () => { requestAnimationFrame(loop); };
