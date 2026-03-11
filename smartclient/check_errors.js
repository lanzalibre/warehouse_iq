import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple static file server (strips query strings)
const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.gif': 'image/gif'
    };
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

async function checkJSErrors() {
    const PORT = 9999;
    const URL = `http://localhost:${PORT}/container_selection.html`;

    // Start server
    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`Server started on port ${PORT}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    const warnings = [];

    // Capture console messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            errors.push(text);
        } else if (type === 'warning') {
            warnings.push(text);
        }
    });

    // Capture page errors
    page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
    });

    // Capture failed requests
    page.on('requestfailed', request => {
        errors.push(`Failed Request: ${request.url()} - ${request.failure().errorText}`);
    });

    console.log(`\nNavigating to: ${URL}\n`);

    try {
        await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait a bit for any async operations
        await page.waitForTimeout(3000);

        console.log('=== JavaScript Errors ===');
        if (errors.length === 0) {
            console.log('✓ No JavaScript errors found');
        } else {
            errors.forEach((err, i) => {
                console.log(`${i + 1}. ${err}`);
            });
        }

        console.log('\n=== Warnings ===');
        if (warnings.length === 0) {
            console.log('✓ No warnings');
        } else {
            warnings.slice(0, 20).forEach((warn, i) => {
                console.log(`${i + 1}. ${warn}`);
            });
            if (warnings.length > 20) {
                console.log(`... and ${warnings.length - 20} more warnings`);
            }
        }

        // Check if SmartClient loaded
        const scLoaded = await page.evaluate(() => {
            return typeof isc !== 'undefined' && typeof isc.ListGrid !== 'undefined';
        });
        console.log(`\n=== SmartClient Status ===`);
        console.log(`SmartClient loaded: ${scLoaded ? '✓ Yes' : '✗ No'}`);

        // Check if DataSource loaded data
        const dataLoaded = await page.evaluate(() => {
            if (typeof containerList === 'undefined') return 'ListGrid not found';
            const rows = containerList.getTotalRows();
            return `ListGrid rows: ${rows}`;
        });
        console.log(`Data status: ${dataLoaded}`);

    } catch (e) {
        console.log(`Error during page load: ${e.message}`);
    }

    await browser.close();
    server.close();
}

checkJSErrors().catch(console.error);
