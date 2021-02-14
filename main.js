const puppeteer = require('puppeteer');
const open = require('open');

//// The queries for the stores
const stores = {
    "Alternate": {
        "query": [".stockStatus"],
        "stockmsg": ["Direct leverbaar", "Levertijd"],
        "addToCartBtn": ""
    },
    "Azerty": {
        "query": [".stockchecked:first-child", ".stockchecked:nth-child(2)"],
        "stockmsg": 0
    },
    "Amazon": {
        "query": ["#availability span"],
        "stockmsg": ["Op voorraad.", "Nog slechts"]
    },
    "Megekko": {
        "query": [".product_detail .subtitle"],
        "stockmsg": ["Uit eigen voorraad leverbaar."]
    }
}

const products = [
    {
        "name": "USB",
        "store": "Alternate",
        "url": "https://www.alternate.nl/SanDisk/Blade-16-GB-usb-stick/html/product/147756?"
    },{
        "name": "MSI RTX 3060 TI €549",
        "store": "Alternate",
        "url": "https://www.alternate.nl/MSI/GeForce-RTX-3060-Ti-VENTUS-2X-OC-grafische-kaart/html/product/1698708?"
    }, {
        "name": "MSI RTX 3060 TI €619",
        "store": "Azerty",
        "url": "https://azerty.nl/product/msi/4413520/geforce-rtx-3060-ti-ventus-3x-oc-videokaart-8-gb-gddr6"
    }, {
        "name": "KFA2 RTX 1660 TI €1468,48",
        "store": "Amazon",
        "url": "https://www.amazon.nl/KFA2-Nvidia-GeForce-PCI-Express-grafische/dp/B08QRNY8JR/ref=sr_1_2?__mk_nl_NL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=rtx+3060+ti&qid=1613317223&sr=8-2"
    }, {
        "name": "MSI RTX 1650 TI €209",
        "store": "Megekko",
        "url": "https://www.megekko.nl/product/1963/297540/Nvidia-Videokaarten/MSI-GeForce-RTX-3060-Ti-VENTUS-2X-OCV1-Videokaart?s_o=3"
    }
];

(async () => {
    //// proxy's from https://hidemy.name/en/proxy-list/?country=NL#list
    let launchOptions = {
        headless: false,
        args: ['--proxy-server=37.120.239.151:3128']
    };
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    for (let i = 0; i < products.length; i++) {
        await page.goto(products[i].url);
        const store = stores[products[i].store]

        for (let query of store['query']) {
            let text = await page.evaluate((query) => Array.from(document.querySelectorAll(query), element => element.textContent), query);
            if (Array.isArray(store['stockmsg'])) {
                text = text.toString().trim();
                let isInStock = false
                for (const msg of store['stockmsg']) {
                    if (text.startsWith(msg)) isInStock = true;
                }
                onResult(products[i], isInStock);
                if (isInStock) i = 100
            } else if (store['stockmsg'] === 0) {
                let qty = parseInt(text.toString().replace(/\D/g, ''));
                if (qty > 0) {
                    onResult(products[i], true);
                    i = 100
                }
                else onResult(products[i], false);
            } else onResult(products[i], false);
        }

        if (i === products.length - 1) i = -1;
        await delay(1000);
    }
    //// Close browser when application is done
    // await browser.close();
})();

function onResult(product, bool) {
    if (bool) {
        windowsSound()
        console.log("\x1b[32m", product.store, "/", product.name, "=", "IN STOCK!")

        //// Open in your active Chrome Browser
        // open(product.url);
    } else {
        console.log("\x1b[31m", product.store, "/", product.name, "=", "out of stock")
    }
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

function windowsSound() {
    console.log("\007");
}
