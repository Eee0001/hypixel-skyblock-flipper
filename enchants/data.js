//--------------------------------------------------------------------------------
// COLLECTS ENCHANTMENT DATA FROM https://wiki.hypixel.net/Enchantments
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const tables = document.getElementsByClassName("wikitable sortable jquery-tablesorter");

const urls = [];

for (let table of tables) {

    for (let i = 1; i < table.rows.length; i++){
        let row = table.rows[i];
        
        urls.push(row.cells[0].firstElementChild.href);
        
    }

}

//--------------------------------------------------------------------------------
// COLLECTS ENCHANTMENT DATA 
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const successfullRequests = {};



const enchantments = [];

for (let url of urls) {

    

}
