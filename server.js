const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'apps', 'data', 'content.json');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    if (req.method === 'POST' && req.url === '/api/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Validate JSON
                JSON.parse(body);
                
                // Save to file
                fs.writeFile(DATA_FILE, body, (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Failed to write file' }));
                        return;
                    }

                    // Auto-commit to GitHub
                    console.log('File saved. Triggering git commit...');
                    const gitCmd = `git add apps/data/content.json && git commit -m "Update content via CMS" && git push`;
                    exec(gitCmd, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Git error: ${error.message}`);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                success: true, 
                                message: 'Saved successfully, but failed to push to GitHub. You might need to push manually.' 
                            }));
                            return;
                        }
                        
                        console.log(`Git stdout: ${stdout}`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Saved and pushed to GitHub!' }));
                    });
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Serve Static Files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    // Strip query strings
    filePath = filePath.split('?')[0];
    filePath = path.join(__dirname, filePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`CMS running at http://localhost:${PORT}/cms.html`);
});
