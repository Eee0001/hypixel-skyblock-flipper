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
    
    const page = new DOMParser().parseFromString(result);
    
    const urls = page.querySelectorAll("bdi > a").map(element => element.href).filter(url => url.includes("Recipe_"));
}

//--------------------------------------------------------------------------------
// COLLECTS FORGING RECIPE DATA
//--------------------------------------------------------------------------------

{
    const response = await fetch("https://wiki.hypixel.net/index.php?title=Special:WhatLinksHere/Template:Forge_Item&limit=5000&namespace=10");
    const result = await response.text();
    
    const page = new DOMParser().parseFromString(result);
    
    const urls = page.querySelectorAll("bdi > a").map(element => element.href).filter(url => url.includes("Recipe_"));
}

//--------------------------------------------------------------------------------
console.log(origins);
//--------------------------------------------------------------------------------
