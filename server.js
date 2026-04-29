const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

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
                // Parse the merged payload
                const payload = JSON.parse(body);
                
                // Save to multiple files
                const savePromises = [
                    fs.promises.writeFile(path.join(__dirname, 'apps/data/hero.json'), JSON.stringify(payload.hero, null, 2)),
                    fs.promises.writeFile(path.join(__dirname, 'apps/data/timeline.json'), JSON.stringify(payload.timeline, null, 2)),
                    fs.promises.writeFile(path.join(__dirname, 'apps/data/gallery.json'), JSON.stringify(payload.gallery, null, 2)),
                    fs.promises.writeFile(path.join(__dirname, 'apps/data/reasons.json'), JSON.stringify(payload.reasons, null, 2)),
                    fs.promises.writeFile(path.join(__dirname, 'apps/data/proposal.json'), JSON.stringify(payload.proposal, null, 2))
                ];

                Promise.all(savePromises)
                    .then(() => {
                        // Auto-commit to GitHub
                        console.log('Semua file berhasil disimpan. Memicu proses git commit...');
                        const gitCmd = `git add apps/data/*.json && git commit -m "Update konten via CMS" && git push`;
                        exec(gitCmd, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Git error: ${error.message}`);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ 
                                    success: true, 
                                    message: 'Disimpan berhasil, namun gagal push ke GitHub secara otomatis.' 
                                }));
                                return;
                            }
                            
                            console.log(`Git stdout: ${stdout}`);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, message: 'Berhasil disimpan dan di-push ke GitHub!' }));
                        });
                    })
                    .catch(err => {
                        console.error("Failed to write to some files", err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Failed to write ke file JSON' }));
                    });

            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON format' }));
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
    console.log(`Server berjalan di http://localhost:${PORT}/`);
    console.log(`CMS berjalan di http://localhost:${PORT}/cms.html`);
});
