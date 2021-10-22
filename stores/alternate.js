import {logResult} from "../utils/console.js";
import {shippingInfo} from "../secrets/secrets.js";
import {products} from "../products/alternate.js";

export async function main(page) {
    for (const p of products) {
        await page.goto(p);
        const productName = await getProductName(page)
        const stockStatus = await getProductStockStatus(page)
        logResult("Alternate", productName, stockStatus)
        // if (stockStatus) {
        //     i = 100 // stop the loop
        //     await goToCheckout(page)
        // }
        await delay(1000); // delay for 1sec. can be disabled in case it is release time
    }
    return;
}

// Get the product name
async function getProductName(page) {
    const query = "#product-top .product-name";
    const text = await page.evaluate((query) => Array.from(document.querySelectorAll(query), element => element.textContent), query)
    return text[1]
}

// Get the product statuses
async function getProductStockStatus(page) {
    const query = "#add-to-cart-form b";
    const stockmsg = ["Direct leverbaar", "Levertijd"];

    let text = await page.evaluate((query) => Array.from(document.querySelectorAll(query), element => element.textContent), query);
    text = text.toString().trim();
    for (const msg of stockmsg) {
        if (text.startsWith(msg)) return true;
    }
    return false
}

// Delay time in milliseconds
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function goToCheckout(page) {
    await page.setDefaultNavigationTimeout(5000);
    await page.click(".details-cart-button");
    await page.waitForNavigation({waitUntil: ['networkidle0', 'load', 'networkidle2', 'domcontentloaded']});
    await page.evaluate(() => {
        document.querySelector("#add-to-cart .btn-primary").click()
    })
    await page.waitForNavigation({waitUntil: ['networkidle0', 'load', 'networkidle2', 'domcontentloaded']});
    await page.click("#tocheckoutform .btn-primary")
    await page.waitForNavigation({waitUntil: ['networkidle0', 'load', 'networkidle2', 'domcontentloaded']});
    await page.goto("https://www.alternate.nl/checkout-1-invoice-address.xhtml");
    await fillInCheckout(page)
}

// Fill in the checkout form of the stores
async function fillInCheckout(page) {
    await page.select('#invoice-address-form select', shippingInfo['gender'])
    await page.type("#invoice-address-form\\:firstname", shippingInfo['firstname'])
    await page.type("#invoice-address-form\\:surname", shippingInfo['lastname'])
    await page.type("#invoice-address-form\\:street", shippingInfo['street'] + " " + shippingInfo['housenumber'])
    await page.type("#invoice-address-form\\:zip", shippingInfo['zipcode'])
    await page.type("#invoice-address-form\\:city", shippingInfo['city'])
    await page.type("#invoice-address-form\\:phone-number", shippingInfo['phone'])
    await page.type("#invoice-address-form\\:email", shippingInfo['email'])
    await page.evaluate(() => {
        document.querySelector("#invoice-address-form .btn-primary").click();
    });

    await page.waitForNavigation();
    await page.evaluate(() => {
        document.querySelector(".btn-primary").click();
    });
    await page.waitForNavigation();
    await page.evaluate(() => {
        document.querySelector(".btn-primary").click();
    });
    await page.waitForNavigation();

    await page.evaluate(() => {
        document.querySelector("#payments-form .custom-checkbox:first-child input").click();
    });
}
