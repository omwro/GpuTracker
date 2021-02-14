const puppeteer = require('puppeteer');
const open = require('open');

const shippingInfo = {
    "email": "EMAIL@GMAIL.COM",
    "firstname": "FIRSTNAME",
    "lastname": "LASTNAME",
    "street": "STREET",
    "housenumber": "123",
    "zipcode": "1234AB",
    "city": "CITY",
    "phone": "0612345678",
    "bank": "INGBNL2A"
}

//// The queries for the stores
const stores = {
    "Alternate": {
        "name": "Alternate",
        "query": [".stockStatus"],
        "stockmsg": ["Direct leverbaar", "Levertijd"],
        "addToCart": ".button.accept-32",
        "checkoutUrl": "https://www.alternate.nl/html/checkout/order.html",
    },
    "Azerty": {
        "name": "Azerty",
        "query": [".stockchecked:first-child", ".stockchecked:nth-child(2)"],
        "stockmsg": 0
    },
    "Amazon": {
        "name": "Amazon",
        "query": ["#availability span"],
        "stockmsg": ["Op voorraad.", "Nog slechts"]
    },
    "Megekko": {
        "name": "Megekko",
        "query": [".product_detail .subtitle"],
        "stockmsg": ["Uit eigen voorraad leverbaar."]
    }
}

const products = [
    {
        "name": "USB",
        "store": "Alternate",
        "url": "https://www.alternate.nl/SanDisk/Blade-16-GB-usb-stick/html/product/147756?"
    }, {
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
        args: ['--start-maximized', '--proxy-server=37.120.239.151:3128']
    };
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080});


    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        const store = stores[product.store]
        await page.goto(product.url);
        const stockStatus = await getProductStockStatus(page, store)
        logResult(product, stockStatus)
        if (stockStatus) {
            i = 100
            await page.$eval(store['addToCart'], form => form.click());
            await page.waitForNavigation();
            await page.goto(store['checkoutUrl']);
            await fillInCheckout(page, store)
            // await page.waitForNavigation();
            // await page.$eval(store['goToCheckout'], form => form.click());
        }

        if (i === products.length - 1) i = -1;
        await delay(1000);
    }
    //// Close browser when application is done
    // await browser.close();
})();

async function getProductStockStatus(page, store) {
    for (let query of store['query']) {
        let text = await page.evaluate((query) => Array.from(document.querySelectorAll(query), element => element.textContent), query);
        if (Array.isArray(store['stockmsg'])) {
            text = text.toString().trim();
            for (const msg of store['stockmsg']) {
                if (text.startsWith(msg)) return true;
            }
        } else if (store['stockmsg'] === 0) {
            let qty = parseInt(text.toString().replace(/\D/g, ''));
            if (qty > 0) return true
        }
    }
    return false
}

async function fillInCheckout(page, store) {
    if (store.name === "Alternate") {
        await page.type("#firstname", shippingInfo['firstname'])
        await page.type("#surname", shippingInfo['lastname'])
        await page.type("#street", shippingInfo['street'] + " " + shippingInfo['housenumber'])
        await page.type("#zip", shippingInfo['zipcode'])
        await page.type("#city", shippingInfo['city'])
        await page.type("#phone", shippingInfo['phone'])
        await page.type("#email", shippingInfo['email'])
        await page.select('select#paymetIssuerIngIdeal', shippingInfo['bank'])
        await page.evaluate(() => {document.querySelector("#terms").click();});
    }

}

function logResult(product, bool) {
    if (bool) {
        windowsSound()
        console.log("\x1b[32m", product.store, "/", product.name, "=", "IN STOCK!")

        //// Open in your active Chrome Browser
        // open(product.url);
    } else {
        console.log("\x1b[31m", product.store, "/", product.name, "=", "out of stock")
    }
}

function addToCart(page, store) {
    page.$eval(store['addToCart'], form => form.click());
}

function goToCart(page, store) {
    page.goto(store['cartUrl'], {waitUntil: 'networkidle0'});
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

function windowsSound() {
    console.log("\007");
}
