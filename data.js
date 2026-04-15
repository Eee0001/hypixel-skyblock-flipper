//--------------------------------------------------------------------------------
// COLLECTS ORIGINS FROM https://wiki.hypixel.net/Main_Page
//--------------------------------------------------------------------------------

const origins = {};

//--------------------------------------------------------------------------------
// COLLECTS CRAFTING RECIPE DATA
//--------------------------------------------------------------------------------

{
    const response = await fetch("https://wiki.hypixel.net/index.php?title=Special:WhatLinksHere/Template:Craft_Item&limit=5000&namespace=10");
    const result = await response.text();
    
    const page = new DOMParser().parseFromString(result, "text/html");
    
    // Might want to unfliter this at a later date if missing recipes are noticed in the second format
    const urls = [...page.querySelectorAll("bdi > a")].map(element => element.href).filter(url => url.includes("Recipe/"));
    
    for (let url of urls) {
    
        let response2 = await fetch("https://wiki.hypixel.net/index.php?title=" + url.split("/").slice(3).join("/") + "&action=raw");
        let result2 = await response2.text();
        
        let textData = result2.split("|stranded")[0].replace(/^(?!\|(?:in|out)).*(?:\n|)/gm, "").trim()
            .replace(/(?:!sb,,coin.*:&.)(.*)(?: Coin)(?:.*)/gm, "COINS,$1") // Format coins
            .replace(/{{(.*)}}/gm, match => match.replace(/{|\|lore|}/g, "").replace(/\||\//g, "_").toUpperCase()) // Format items
            .split(/(?<=\|out.*)\n/gm);
        
        for (let text of textData) {
        
            let recipe = {type: "craft", time: 0, amount: 0, items: {}};

            // Handle recipe item inputs
            (text.match(/^\|in.*/gm)?.map(input => input.split("=")[1].trim().split(",")) ?? []).forEach(([id, amount]) => {
                recipe.items[id] = (recipe.items[id] ?? 0) + (Number(amount) || 1);
            });
            recipe.items = Object.entries(recipe.items).map(([id, amount]) => ({id, amount}));
            
            // Handle recipe item output
            let output = text.match(/^\|out.*/gm)?.[0].split("=")[1].trim();
            
            if (output) {
                let [id, amount] = output.split(",");
            
                recipe.amount = Number(amount) || 1;
                
                origins[id] ??= [];
                
                origins[id].push(recipe);
            }
            
            console.log(Object.values(origins).flat().length + " Recipes Fetched");
        
        }
    
    }
    
    console.log("All crafting recipes have been fetched and added to origins data object.");
    
}

//--------------------------------------------------------------------------------
// COLLECTS FORGING RECIPE DATA
//--------------------------------------------------------------------------------

{
    const response = await fetch("https://wiki.hypixel.net/index.php?title=Special:WhatLinksHere/Template:Forge_Item&limit=5000&namespace=10");
    const result = await response.text();
    
    const page = new DOMParser().parseFromString(result, "text/html");
    
    // Might want to unfliter this at a later date if missing recipes are noticed in the second format
    const urls = [...page.querySelectorAll("bdi > a")].map(element => element.href).filter(url => url.includes("Recipe/"));
    
    for (let url of urls) {
    
        let response2 = await fetch("https://wiki.hypixel.net/index.php?title=" + url.split("/").slice(3).join("/") + "&action=raw");
        let result2 = await response2.text();
        
        let textData = result2.split("|stranded")[0].replace(/^(?!\|(?:in|out|duration)).*(?:\n|)/gm, "").trim()
            .replace(/(?:!sb,,coin.*:&.)(.*)(?: Coin)(?:.*)/gm, "COINS,$1") // Format coins
            .replace(/{{(.*)}}/gm, match => match.replace(/{|\|lore|}/g, "").replace(/\||\//g, "_").toUpperCase()) // Format items
            .split(/(?<=\|out.*)\n/gm);
        
        for (let text of textData) {
        
            let recipe = {type: "forge", time: 0, amount: 0, items: {}};
            
            // Handle recipe duration
            (text.match(/^\|duration.*/gm)?.[0].split("=")[1].trim() ?? "")
                .replace(/(\d+)(?= day)/g, (match, time) => { recipe.time += Number(time) * 86400; })
                .replace(/(\d+)(?= hour)/g, (match, time) => { recipe.time += Number(time) * 3600; })
                .replace(/(\d+)(?= minute)/g, (match, time) => { recipe.time += Number(time) * 60; })
                .replace(/(\d+)(?= second)/g, (match, time) => { recipe.time += Number(time) * 1; });

            // Handle recipe item inputs
            (text.match(/^\|in.*/gm)?.map(input => input.split("=")[1].trim().split(",")) ?? []).forEach(([id, amount]) => {
                recipe.items[id] = (recipe.items[id] ?? 0) + (Number(amount) || 1);
            });
            recipe.items = Object.entries(recipe.items).map(([id, amount]) => ({id, amount}));
            
            // Handle recipe item output
            let output = text.match(/^\|out.*/gm)?.[0].split("=")[1].trim();
            
            if (output) {
                let [id, amount] = output.split(",");
            
                recipe.amount = Number(amount) || 1;
                
                origins[id] ??= [];
                
                origins[id].push(recipe);
            }
            
            console.log(Object.values(origins).flat().length + " Recipes Fetched");
        
        }
        
    }
    
    console.log("All forging recipes have been fetched and added to origins data object.");
    
}

//--------------------------------------------------------------------------------
console.log(origins);
//--------------------------------------------------------------------------------
