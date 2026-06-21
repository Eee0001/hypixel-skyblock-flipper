//--------------------------------------------------------------------------------
// METHODS
//--------------------------------------------------------------------------------

async function fetchJSON (url) {
  try {
    console.log(`${Date.now()} | Fetching ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) return;
    
    const json = await response.json();
    
    return json;
  }
  catch {
    console.log(`${Date.now()} | ERROR ${url}`);
  }
}

//--------------------------------------------------------------------------------
