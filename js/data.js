//--------------------------------------------------------------------------------
// CLASS
//--------------------------------------------------------------------------------

class DataManager {

  #data;

  constructor () { this.#data = {}; }
  
  //--------------------------------------
  
  get data () { return structuredClone(this.#data); }
  
  //--------------------------------------
  
  loadData (list) {
    let items = list.map((i) => Object.entries(i)).flat();
    
    this.#data = {};
    
    for (let item of items) {
      this.#data[item[0]] ??= {cost: [], value: []};
      
      this.#data[item[0]].cost.push(...item[1].cost);
      this.#data[item[0]].value.push(...item[1].value);
    }
  }

}

//--------------------------------------------------------------------------------
