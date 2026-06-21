//--------------------------------------------------------------------------------
// CLASS
//--------------------------------------------------------------------------------

class Weights {

  #defaults; #values; #activeWeight; #activeValue;

  constructor () {
    this.#activeWeight = "";
    this.#activeValue = 0;
    
    this.#defaults = {
      BINGOPOINT: Infinity,
      BIT: Infinity,
      CHOCOLATE: Infinity,
      COIN: 1,
      COPPER: Infinity,
      EVENTSILVER: Infinity,
      FORESTWHISPER: Infinity,
      FOSSILDUST: Infinity,
      GEMSTONEPOWDER: Infinity,
      GLACITEPOWDER: Infinity,
      MITHRILPOWDER: Infinity,
      MOTE: Infinity,
      NORTHSTAR: Infinity,
      PELT: Infinity,
      SKYBLOCKGEM: Infinity,
      TIME: 0,
    };
    
    this.initValues(); 
    
    this.onUpdate = null;
  }
  
  //--------------------------------------
  
  get ids () { return Object.keys(this.#defaults) }
  
  get activeWeight () { return this.#activeWeight; }
  
  set activeWeight (id) { 
    this.#activeWeight = id; 
    this.#activeValue = this.#values[id];
  }
  
  get activeValue () { return this.#activeValue; }
  
  set activeValue (value) { 
    this.#activeValue = value; 
    this.#values[this.#activeWeight] = value;
    
    this.onUpdate?.();
  }
  
  get values () { return this.#values; }
  
  //--------------------------------------
  
  viewList () {
    let dialog = document.createElement("dialog");
    dialog.closedBy = "any";
    dialog.onclose = dialog.remove;
    
    let entries = Object.entries(this.#values);
    
    let strings = entries.map(([id, value]) => `${id} : ${value}`);
    
    dialog.innerText = strings.join("\n");
    
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  
  //--------------------------------------
  
  initValues () {
    this.#values = structuredClone(this.#defaults);
    this.#activeWeight = "COIN";
    this.#activeValue = this.#values[this.#activeWeight];
  }

}

//--------------------------------------------------------------------------------
