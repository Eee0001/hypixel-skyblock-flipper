//--------------------------------------------------------------------------------
// METHODS
//--------------------------------------------------------------------------------

async function getRecipeData () {
  let data = await fetchJSON("/data/recipes.json");
  
  if (data) console.log(`${Date.now()} | Recipe data fetched :)`);
  else console.log(`${Date.now()} | Recipe data not fetched :(`);
  
  return data ?? {};
}

//--------------------------------------------------------------------------------
// CLASS
//--------------------------------------------------------------------------------

class RecipeManager {

  #ready; #data; 

  constructor () { 
    this.#ready = false; 
    this.#data = {};
    
    this.onUpdate = null;
    
    getRecipeData().then(this.#init.bind(this));
  }
  
  //--------------------------------------
  
  get ready () { return this.#ready; }
  
  get data () { return structuredClone(this.#data); }
  
  //--------------------------------------
  
  #init (data) {
    this.#data = data; 
    
    this.#ready = true; 
    this.onUpdate?.();
  }

}

//--------------------------------------------------------------------------------
