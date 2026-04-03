//--------------------------------------------------------------------------------
// COLLECTS FUSION DATA FROM https://wiki.hypixel.net/Attributes
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const tableList = ["Common_", "Uncommon_", "Rare_", "Epic_", "Legendary_"];

const properties = {
    "0": "name", 
    "1": "rarity", 
    "2": "id", 
    "3": "category", 
    "4": "family", 
    "6": "obtaining",
    "10": "origin"
};

const tableData = [];

for (let id of tableList) {
    let table = document.getElementById(id).firstElementChild;
    
    for (let i = 1; i < table.rows.length; i++){
        let row = table.rows[i];
        
        tableData.push({});
        
        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j];
            
            let property = properties[j];
            
            if (property) tableData.at(-1)[property] = cell.textContent
                .replaceAll("\"\t\"", "")
                .trim();
        
        }
    
    }

}

//--------------------------------------------------------------------------------
// FORMATS FUSION DATA
//--------------------------------------------------------------------------------

const data = {};

for (let shard of tableData) {

    const id = "SHARD_" + shard.name.toUpperCase().replaceAll(" ", "_");
    
    data[id] = {};
    
    data[id].name = shard.name;
    
    data[id].rarity = shard.rarity;
    
    data[id].id = Number(shard.id);
    
    data[id].category = shard.category.split(", ");
    data[id].family = shard.family.split(", ");
    
    const fusion = shard.obtaining.match(/(?<=Fusing ).+?(?=\.)/g)?.[0]
        .replaceAll("\"\t\"", "")
        .replaceAll(", ", "Shard or ")
        .replaceAll("Shards", "Shard")
        .replaceAll("Common", "COMMON")
        .replaceAll("Uncommon", "UNCOMMON")
        .replaceAll("Rare", "RARE")
        .replaceAll("Epic", "EPIC")
        .replaceAll("Legendary", "LEGENDARY")
        .replaceAll("COMMON or higher", "COMMON or UNCOMMON or higher")
        .replaceAll("UNCOMMON or higher", "UNCOMMON or RARE or higher")
        .replaceAll("RARE or higher", "RARE or EPIC or higher")
        .replaceAll("EPIC or higher", "EPIC or LEGENDARY")
        .split(" with ");
        
    const slots = [{}, {}];
    
    for (let i = 0; i < 2; i++) {
        slots[i].shard = fusion?.[i].match(/(<= or |^).*?(?= Shard)/g) ?? undefined;
        
        slots[i].shard = slots[i].shard?.map((name)=>{ return "SHARD_" + name.toUpperCase().replaceAll(" ", "_"); }) ?? undefined;
        
        slots[i].category = fusion?.[i].match(/(?<= and | or |^).*?(?= Category)/g) ?? undefined;
        slots[i].family = fusion?.[i].match(/(?<= and | or |^).*?(?= Family)/g) ?? undefined;
        slots[i].rarity = fusion?.[i].match(/COMMON|UNCOMMON|RARE|EPIC|LEGENDARY/g) ?? undefined;
    }
    
    if (Object.values(slots[0]).filter(p => p !== undefined).length > 0) data[id].fusion = slots;
    
    data[id].origin = shard.origin !== "—" ? shard.origin.split(", ") : undefined;
    
    data[id].origin = data[id].origin?.map((name)=>{ return "SHARD_" + name.toUpperCase().replaceAll(" ", "_"); }) ?? undefined;

}

console.log(data);
