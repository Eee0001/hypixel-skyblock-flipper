//--------------------------------------------------------------------------------
// COLLECTS RECIPE DATA FROM https://wiki.hypixel.net/index.php?title=Special:WhatLinksHere/Category:DataRecipeTree&limit=5000
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const recipeData = {};

const listData = [...document.getElementById("mw-whatlinkshere-list").children]
    .map((element)=>{ return element.getElementsByTagName("a")[0].href.split("/").at(-1); })
    .filter((id)=>{ return id.toUpperCase === id; });

for (let id of listData) {
    if (recipeData[id]) continue;
    
    await fetch("https://wiki.hypixel.net/Template:Recipe_Tree/" + id)
        .then((response)=>{ return response.text(); })
        .then((result)=>{
        
            let page = new DOMParser().parseFromString(result, "text/html");
            
            let tables = page.body.getElementsByClassName("wikitable");
            if (tables.length < 2) return;
            
            let table = tables[0];
            
            id = id.replaceAll("ENCHANTED_BOOK_", "ENCHANTMENT_");
            
            recipeData[id] = [];
            
            for (let i = 1; i < table.rows.length; i++) {
                if (table.rows[i].cells[0].textContent === "Stranded") continue;
            
                let recipe = { amount: 0, items: [] };
                
                recipe.amount = Number(table.getElementsByClassName("color-green")[0].textContent);
                
                let valid = true;
                
                for (let point of table.getElementsByTagName("ul")[0]) {
                
                    recipe.items.push({
                        amount: Number(point.textContent.split(" ")[0]),
                        item: [...point.children].at(-1).textContent
                    });
                    
                    valid = recipe.at(-1) > 0;
                
                }
                
                recipeData[id].push(recipe);
            
            }
        
        });
        
        console.log(Object.keys(recipeData).length + " Recipes Fetched");
        
}
