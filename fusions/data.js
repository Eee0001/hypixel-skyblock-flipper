//--------------------------------------------------------------------------------
// COLLECTS FUSION DATA FROM https://wiki.hypixel.net/Attributes
//--------------------------------------------------------------------------------

// (Run in the console of the urls webpage then paste data into data.json)

const properties = {"0": "name", "1": "rarity", "2": "id", "3": "category", "4": "family", "6": "obtaining","10": "origin"};

const tableData = [];

for (let table of document.getElementsByClassName("wikitable sortable jquery-tablesorter")) {
    for (let i = 1; i < table.rows.length; i++){
        let row = table.rows[i];
        
        tableData.push({});
        
        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j];
            
            if (properties[j]) tableData.at(-1)[properties[j]] = cell.textContent.replaceAll("\"\t\"", "").toUpperCase().trim();
        
        }
    
    }

}

//--------------------------------------------------------------------------------
// FORMATS FUSION DATA PREVIOUSLY COLLECTED
//--------------------------------------------------------------------------------

const fusions = {}; // (Data that needs to be pasted into data.json)

for (let shard of tableData) {

    const id = "SHARD_" + shard.name.replaceAll(" ", "_");
    
    fusions[id] = {
        id: Number(shard.id), 
        rarity: shard.rarity,
        
        category: shard.category.split(", "),
        family: shard.family.split(", "),
    };
    
    const fusion = shard.obtaining.match(/(?<=Fusing ).+?(?=\.)/g)?.[0]
        .replaceAll(/, AND|, /g, "SHARD OR")
        .replace(/(AND)((?:(?!AND).)*?)(SHARDS)/g, "SHARD OR $2SHARD")
        .replaceAll("COMMON OR HIGHER", "COMMON OR UNCOMMON OR HIGHER")
        .replaceAll("UNCOMMON OR HIGHER", "UNCOMMON OR RARE OR higher")
        .replaceAll("RARE OR HIGHER", "RARE OR EPIC OR HIGHER")
        .replaceAll("EPIC OR HIGHER", "EPIC OR LEGENDARY")
        .split(" WITH ");
    
    const slots = [{}, {}];
    
    for (let i = 0; i < 2; i++) {
        let shardRegex1 = fusion ? [...fusion[i].matchAll(/(?<= OR | AND |^).*?(?= SHARD)/g)].flat() : null;
        let shardRegex2 = fusion ? [...fusion[i].matchAll(/(?<= OR | AND ).*?(?= SHARD)/g)].flat() : null;
        
        if (shardRegex1?.length === 1 && shardRegex2?.length === 1) {
            slots[i].shard = shardRegex2[0].length < shardRegex1[0].length ? shardRegex2 : shardRegex1;
        }
        else {
            slots[i].shard = shardRegex1?.length !== 0 ? shardRegex1 : undefined;
        }

        slots[i].shard = slots[i].shard?.map((name)=>{ return "SHARD_" + name.replaceAll(" ", "_"); }) ?? undefined;
        
        slots[i].category = fusion?.[i].match(/(?<= AND | OR |^).*?(?= CATEGORY)/g) ?? undefined;
        slots[i].family = fusion?.[i].match(/(?<= AND | OR |^).*?(?= FAMILY)/g) ?? undefined;
        slots[i].rarity = fusion?.[i].match(/COMMON|UNCOMMON|RARE|EPIC|LEGENDARY/g) ?? undefined;
    }
    
    if (Object.values(slots[0]).filter(p => p !== undefined).length > 0) fusions[id].fusion = slots;
    
    fusions[id].origin = shard.origin !== "—" ? shard.origin.split(", ") : undefined;
    fusions[id].origin = fusions[id].origin?.map((name)=>{ return "SHARD_" + name.replaceAll(" ", "_"); }) ?? undefined;

}

console.log(fusions);
