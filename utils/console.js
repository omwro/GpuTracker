// Make your typical windows ping sound
function windowsSound() {
    console.log("\x07");
}

// Log result in de console
export function logResult(storeName, productName, bool) {
    if (bool) {
        windowsSound()
        console.log("\x1b[32m",`(${storeName}) ${productName} = IN STOCK!`)
    } else {
        console.log("\x1b[31m",`(${storeName}) ${productName} = out of stock`)
    }
}