import puppeteer from 'puppeteer';
import open from 'open';

import {main as alternate} from './stores/alternate.js';

// export const proxyIP = "51.15.21.34:9834"

(async () => {
    //// proxy's from https://hidemy.name/en/proxy-list/?country=NL#list
    let launchOptions = {
        headless: false,
        args: [/*, `--proxy-server=${proxyIP}`*/]
    };
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 720});

    try {
        while (1) {
            await alternate(page)
        }
    } catch (e) {
        console.log(e)
    } finally {
        // Close browser when application is done
        await browser.close()
    }
})();

//// Your wishlist of products
// const products = [
//     /*{
//         "name": "USB",
//         "store": "Alternate",
//         "url": "https://www.alternate.nl/SanDisk/Blade-16-GB-usb-stick/html/product/147756?"
//     },*/ {
//         "name": "Speaker",
//         "store": "Azerty",
//         "url": "https://azerty.nl/product/jabra/576495/speak-510-ms-speakerphone-draagbaar"
//     },{
//         "name": "MSI RTX 3060 TI €549",
//         "store": "Alternate",
//         "url": "https://www.alternate.nl/MSI/GeForce-RTX-3060-Ti-VENTUS-2X-OC-grafische-kaart/html/product/1698708?"
//     }, {
//         "name": "MSI RTX 3060 TI €619",
//         "store": "Azerty",
//         "url": "https://azerty.nl/product/msi/4413520/geforce-rtx-3060-ti-ventus-3x-oc-videokaart-8-gb-gddr6"
//     }, /*{
//         "name": "KFA2 RTX 1660 TI €1468,48",
//         "store": "Amazon",
//         "url": "https://www.amazon.nl/KFA2-Nvidia-GeForce-PCI-Express-grafische/dp/B08QRNY8JR/ref=sr_1_2?__mk_nl_NL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=rtx+3060+ti&qid=1613317223&sr=8-2"
//     },*/ {
//         "name": "MSI RTX 1650 TI €209",
//         "store": "Megekko",
//         "url": "https://www.megekko.nl/product/1963/297540/Nvidia-Videokaarten/MSI-GeForce-RTX-3060-Ti-VENTUS-2X-OCV1-Videokaart?s_o=3"
//     }
// ];

//// The queries for the stores
// const stores = {
//     "Alternate": {
//         "name": "Alternate",
//         "query": [".stockStatus"],
//         "stockmsg": ["Direct leverbaar", "Levertijd"],
//         "checkoutable": true
//         // "addToCart": ".button.accept-32",
//         // "checkoutUrl": "https://www.alternate.nl/html/checkout/order.html",
//     },
//     "Azerty": {
//         "name": "Azerty",
//         "query": [".stockchecked:first-child", ".stockchecked:nth-child(2)"],
//         "stockmsg": 0,
//         "checkoutable": false
//         // "addToCart": ".block_pdp .green_button"
//     },
//     "Amazon": {
//         "name": "Amazon",
//         "query": ["#availability span"],
//         "stockmsg": ["Op voorraad.", "Nog slechts"],
//         "checkoutable": false
//     },
//     "Megekko": {
//         "name": "Megekko",
//         "query": [".product_detail .subtitle"],
//         "stockmsg": ["Uit eigen voorraad leverbaar."],
//         "checkoutable": false
//     }
// }

// (async () => {
//     try {
//         //// proxy's from https://hidemy.name/en/proxy-list/?country=NL#list
//         let launchOptions = {
//             headless: false,
//             args: ['--start-maximized', `--proxy-server=${proxyIP}`]
//         };
//         const browser = await puppeteer.launch(launchOptions);
//         const page = await browser.newPage();
//         await page.setViewport({width: 1920, height: 1080});
//
//         for (let i = 0; i < products.length; i++) {
//             const product = products[i]
//             const store = stores[product.store]
//             await page.goto(product.url);
//             const stockStatus = await getProductStockStatus(page, store)
//             logResult(product, stockStatus)
//             // if (stockStatus) {
//             //     i = 100 // stop the loop
//             //     if (store['checkoutable']) {
//             //         if (store['name'] === "Alternate") {
//             //             await alternate.goToCheckout(page, shippingInfo)
//             //         } else if (store['name'] === "Azerty") {
//             //             await azerty.goToCheckout(page, shippingInfo)
//             //         }
//             //     }
//             // }
//
//             if (i === products.length - 1) i = -1; // loop the whole list again from start
//             // await delay(1000); // delay for 1sec. can be disabled in case it is release time
//         }
//         //// Close browser when application is done
//         // await browser.close();
//     } catch (e) {
//         console.log(e)
//     }
// })();

// Get the product statuses
// async function getProductStockStatus(page, store) {
//     for (let query of store['query']) {
//         let text = await page.evaluate((query) => Array.from(document.querySelectorAll(query), element => element.textContent), query);
//         if (Array.isArray(store['stockmsg'])) {
//             text = text.toString().trim();
//             for (const msg of store['stockmsg']) {
//                 if (text.startsWith(msg)) return true;
//             }
//         } else if (store['stockmsg'] === 0) {
//             let qty = parseInt(text.toString().replace(/\D/g, ''));
//             if (qty > 0) return true
//         }
//     }
//     return false
// }

