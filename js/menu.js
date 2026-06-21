//--------------------------------------------------------------------------------
// CLASS
//--------------------------------------------------------------------------------

class Menu {

  #elements; #ids; #dataKeys; #previousData;

  constructor () {
    this.#ids = [
      "menu", "toggle-menu-btn", "WeightActive", "WeightValue", "WeightList",
      "WeightReset", "FlipperCalculate"
    ];

    this.#elements = {};

    for (let id of this.#ids) {
      this.#elements[id] = document.getElementById(id);
    }

    this.#dataKeys = {
      WeightActive: { target: "weights", property: "activeWeight" },
      WeightValue: { target: "weights", property: "activeValue" },
    };

    this.#previousData = {};
  }

  //--------------------------------------

  #getDataTargets (app) {
    return {
      weights: app.weights
    };
  }

  //--------------------------------------

  initEvents (app) {
    for (let [id, dataKey] of Object.entries(this.#dataKeys)) {
      const element = this.#elements[id];
      
      element.onchange = (e) => {
        const dataTargets = this.#getDataTargets(app);

        const dataTarget = dataTargets[dataKey.target];
        if (!dataTarget) return; 

        if (element.type === "number") {
          dataTarget[dataKey.property] = element.valueAsNumber;
        }

        if (element.type === "select-one") {
          dataTarget[dataKey.property] = element.value;
        }

        if (element.type === "checkbox") {
          dataTarget[dataKey.property] = element.checked;
        }
      }
    }

    this.#elements["toggle-menu-btn"].onclick = ()=>{ 
      this.#elements["menu"].classList.toggle("hidden"); 
    };
    
    for (let weight of app.weights.ids) {
      this.#elements["WeightActive"].innerHTML += `<option value="${weight}">${weight}</option>`;
    }
    
    this.#elements["WeightList"].onclick = ()=>{
      app.weights.viewList();
    };
    
    this.#elements["WeightReset"].onclick = ()=>{
      app.weights.initValues(); app.flipper.weights = app.weights.values;
    };
  }

  //--------------------------------------

  refresh (app) {
    if (document.activeElement !== document.body) return;

    const dataTargets = this.#getDataTargets(app);

    for (let [id, dataKey] of Object.entries(this.#dataKeys)) {
      const dataTarget = dataTargets[dataKey.target];
      if (!dataTarget) continue;
      
      const data = dataTarget[dataKey.property];

      if (this.#previousData[id] !== data) {
        if (this.#elements[id].type === "checkbox") {
          this.#elements[id].checked = this.#previousData[id] = data;
        }
        else {
          this.#elements[id].value = this.#previousData[id] = data;
        }
      }
      
    }
  }
  
}

//--------------------------------------------------------------------------------
// EXPORTS
//--------------------------------------------------------------------------------

const menu = new Menu();

//--------------------------------------------------------------------------------
