//--------------------------------------------------------------------------------
// COLLECTS RECIPE DATA FROM https://wiki.hypixel.net/index.php?title=Special:WhatLinksHere/Category:DataRecipeTree&limit=5000
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const successfullRequests = {};

const recipes = {};
    
const ids = [...document.getElementById("mw-whatlinkshere-list").children].map((el)=>{
    return el.children[0].children[0].href.split("/").at(-1);
}).filter((str)=>{ return str.toUpperCase() === str; });

// (If rate limit hit run the following code in the same webpage console after waiting a bit)

let error = false;

for (let id of ids) {

    if (successfullRequests[id]) continue; 
    if (rateLimitHit) break;
    
    console.log(Object.keys(recipes).length + " Recipes Fetched");
    
    await fetch("https://wiki.hypixel.net/Template:Recipe_Tree/" + id)
        .then((response)=>{ 
            if (response.status === 200) successfullRequests[id] = true; 
            if (response.status !== 200) error = true;
            return response.text(); 
        })
        .then((result)=>{
        
            let parser = new DOMParser();
            let container = parser.parseFromString(result, "text/html");
            
            let tables = container.body.getElementsByClassName("wikitable");
            if (tables.length < 2) return;
            
            let table = tables[0];
            
            id = id.replaceAll("ENCHANTED_BOOK_", "ENCHANTMENT_");
            
            recipes[id] = [];
            
            for (let i = 1; i < table.rows.length; i++) {
                if (table.rows[i].cells[0].textContent === "Stranded") continue;
                
                let element = table.rows[i].cells[1].children[0];
            
                let recipe = { result: 0, items: [] };
                
                recipe.result = Number(element.children[0].textContent.split(" ")[0]);
                
                let list = element.children[1];
                
                let validRecipe = true;
                
                for (let point of list.children) {
                    recipe.items.push({
                        amount: Number(point.textContent.split(" ")[0]),
                        item: [...point.children].at(-1).textContent
                    });
                    
                    if (recipe.at(-1) < 1) validRecipe = false;
                }
                
                recipes[id].push(recipe);
            
            }
        
        });

}
