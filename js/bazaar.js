//--------------------------------------------------------------------------------
// METHODS
//--------------------------------------------------------------------------------

async function getBazaarData () {
  let data = await fetchJSON("https://api.hypixel.net/v2/skyblock/bazaar");
  
  if (data) console.log(`${Date.now()} | Bazaar data fetched :)`);
  else console.log(`${Date.now()} | Bazaar data not fetched :(`);
  
  return data ?? {};
}

//--------------------------------------------------------------------------------
// CLASS
//--------------------------------------------------------------------------------

class BazaarManager {

  #ready; #data; #log;

  constructor () { 
    this.#ready = false;
    this.#data = {}; 
    
    this.#log = []; 
    
    this.onUpdate = null;
    
    getBazaarData().then(this.#init.bind(this));
  }
  
  //--------------------------------------
  
  get ready () { return this.#ready; }
  
  get data () { return structuredClone(this.#data); }
  
  //--------------------------------------
  
  #init (data) {
    this.#log.push(structuredClone(data));
    
    this.#data = {};
    
    for (let item of Object.values(data.products ?? {})) {
      let id = item.product_id.replace(/[^A-Za-z0-9:]/g, "");
      
      this.#data[id] ??= {cost: [], value: []};
      
      this.#data[id].cost.push({
        type: "BAZAARINSTABUY",
        amount: 1,
        time: 1,
        items: [{id:"COIN", amount: item.quick_status.buyPrice || Infinity}]
      },{
        type: "BAZAARBUYORDER",
        amount: 1,
        time: 604800 / item.quick_status.sellMovingWeek,
        items: [{id:"COIN", amount: item.quick_status.sellPrice || Infinity}]
      });
      
      this.#data[id].value.push({
        type: "BAZAARINSTASELL",
        amount: 1,
        time: 1,
        items: [{id:"COIN", amount: item.quick_status.sellPrice || -Infinity}]
      },{
        type: "BAZAARSELLORDER",
        amount: 1,
        time: 604800 / item.quick_status.buyMovingWeek,
        items: [{id:"COIN", amount: item.quick_status.buyPrice || -Infinity}]
      });
    }
    
    this.#ready = true;
    this.onUpdate?.();
    
    this.#loop();
  }
  
  //--------------------------------------
  
  #loop () {}

}

//--------------------------------------------------------------------------------
