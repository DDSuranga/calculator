const { app, BrowserWindow } = require('./electron-app/node_modules/electron');
const fs = require('fs');
const path = require('path');

const modes = ['basic', 'scientific', 'currency', 'date'];

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
    const win = new BrowserWindow({
        width: 1365,
        height: 950,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    await win.loadFile(path.join(__dirname, 'index.html'));
    await new Promise(resolve => setTimeout(resolve, 900));

    const results = [];
    for (const mode of modes) {
        await win.webContents.executeJavaScript(`window.showCalculator('${mode}')`);
        await new Promise(resolve => setTimeout(resolve, 180));
        const info = await win.webContents.executeJavaScript(`(() => {
            const map = {
                basic: 'basicCalculator',
                scientific: 'scientificCalculator',
                currency: 'currencyConverter',
                date: 'dateDifferenceCalculator'
            };
            const el = document.getElementById(map['${mode}']);
            const rect = el.getBoundingClientRect();
            const display = el.querySelector('.display').getBoundingClientRect();
            return {
                mode: '${mode}',
                visible: getComputedStyle(el).display,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                displayWidth: Math.round(display.width),
                displayHeight: Math.round(display.height),
                activeButton: document.querySelector('.sidebar button.is-active')?.textContent?.trim()
            };
        })()`);
        results.push(info);
        const image = await win.webContents.capturePage();
        fs.writeFileSync(path.join(__dirname, `qa-${mode}.png`), image.toPNG());
    }

    win.setSize(390, 900);
    await new Promise(resolve => setTimeout(resolve, 200));
    await win.webContents.executeJavaScript("window.showCalculator('basic')");
    await new Promise(resolve => setTimeout(resolve, 180));
    results.push(await win.webContents.executeJavaScript(`(() => {
        const el = document.getElementById('basicCalculator');
        const rect = el.getBoundingClientRect();
        return {
            mode: 'mobile-basic',
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            overflowX: document.documentElement.scrollWidth > window.innerWidth
        };
    })()`));
    const mobileImage = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, 'qa-mobile-basic.png'), mobileImage.toPNG());

    console.log(JSON.stringify(results, null, 2));
    app.quit();
});
