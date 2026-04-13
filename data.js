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
    
    // Might want to unfliter this at a later date if missing recipes are noticed in the second format (N)
    const urls = page.querySelectorAll("bdi > a").map(element => element.href).filter(url => url.includes("Recipe/"));
    
    for (url of urls) {
    
        let response2 = await fetch("https://wiki.hypixel.net/index.php?title=" + url.split("/").at(-1) + "&action=raw");
        let result2 = await response2.text();
        
        // Maybe do the recipe split a bit later
        let textData = result2.split("|stranded")[0].replace(/^(?!\|(?:in|out)).*(?:\n|)/gm, "").trim().toUpperCase().split(/(?<=\|out.*)\n/gm);
        
        
    
    }
}

//--------------------------------------------------------------------------------
// COLLECTS FORGING RECIPE DATA
//--------------------------------------------------------------------------------

{
    const response = await fetch("https://wiki.hypixel.net/index.php?title=Special:WhatLinksHere/Template:Forge_Item&limit=5000&namespace=10");
    const result = await response.text();
    
    const page = new DOMParser().parseFromString(result);
    
    // Might want to unfliter this at a later date if missing recipes are noticed in the second format (Y)
    const urls = page.querySelectorAll("bdi > a").map(element => element.href).filter(url => url.includes("Recipe/"));
    
    for (url of urls) {
    
        let response2 = await fetch("https://wiki.hypixel.net/index.php?title=" + url.split("/").at(-1) + "&action=raw");
        let result2 = await response2.text();
        
        // Maybe do the recipe split a bit later
        let textData = result2.split("|stranded")[0].replace(/^(?!\|(?:in|out|duration)).*(?:\n|)/gm, "").trim().toUpperCase().split(/(?<=\|out.*)\n/gm);;
    }
}

//--------------------------------------------------------------------------------
console.log(origins);
//--------------------------------------------------------------------------------
