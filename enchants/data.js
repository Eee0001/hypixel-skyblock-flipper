//--------------------------------------------------------------------------------
// COLLECTS ENCHANTMENT DATA FROM https://wiki.hypixel.net/Enchantments
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const enchantmentData = {};

const tableData = [...document.getElementsByClassName("wikitable sortable jquery-tablesorter")]
    .map((table)=>{ return [...table.rows].slice(1); })
    .flat()
    .map((row)=>{ return row.cells[0].children[0].href; });
    
for (let url of tableData) {
    
    await fetch(url)
        .then((response)=>{ return response.text(); })
        .then((result)=>{
        
            let page = new DOMParser().parseFromString(result, "text/html");
            
            const id = [...page.getElementsByTagName("td")]
                .filter((element)=>{ return element.textContent.includes("Internal ID"); })[0].nextElementSibling.textContent.trim();
                
            const max = Number(page.body.textContent.match(/(?<=can be combined up to level ).+?(?= using)/g)?.[0]);
            
            if (!max) return;
            
            for (let i = 2; i <= max; i++) {
            
                enchantmentData["ENCHANTMENT_" + id + "_" + i] = { 
                    amount: 1, 
                    items: [
                        {
                            amount: 2,
                            item: "ENCHANTMENT_" + id + "_" + (i - 1)
                        }
                    ] 
                };
            
            }
        
        });
        
        console.log(Object.keys(enchantmentData).length + " Enchantments Fetched");

}
