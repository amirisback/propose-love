let currentData = {
    hero: {}, timeline: {events: []}, gallery: {images: []}, reasons: {items: []}, proposal: {}
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [heroRes, timelineRes, galleryRes, reasonsRes, proposalRes] = await Promise.all([
            fetch('/apps/data/hero.json'),
            fetch('/apps/data/timeline.json'),
            fetch('/apps/data/gallery.json'),
            fetch('/apps/data/reasons.json'),
            fetch('/apps/data/proposal.json')
        ]);
        
        currentData = {
            hero: await heroRes.json(),
            timeline: await timelineRes.json(),
            gallery: await galleryRes.json(),
            reasons: await reasonsRes.json(),
            proposal: await proposalRes.json()
        };
        
        // Populate Hero
        document.getElementById('hero-title').value = currentData.hero.title;
        document.getElementById('hero-subtitle').value = currentData.hero.subtitle;
        document.getElementById('hero-description').value = currentData.hero.description;
        document.getElementById('hero-footerText').value = currentData.hero.footerText || 'Made with ❤️ by Amir for Septian';

        // Populate Timeline Array
        document.getElementById('timeline-title').value = currentData.timeline.title;
        document.getElementById('timeline-subtitle').value = currentData.timeline.subtitle;
        renderTimeline();

        // Populate Gallery Array
        document.getElementById('gallery-title').value = currentData.gallery.title;
        document.getElementById('gallery-subtitle').value = currentData.gallery.subtitle;
        renderGallery();

        // Populate Reasons Array
        document.getElementById('reasons-title').value = currentData.reasons.title;
        renderReasons();

        // Populate Proposal
        document.getElementById('proposal-targetName').value = currentData.proposal.targetName;
        document.getElementById('proposal-message').value = currentData.proposal.message;
        document.getElementById('proposal-question').value = currentData.proposal.question;

    } catch (e) {
        showStatus('Error loading data. Are you running from server.js?', 'error');
    }
});

// --- TIMELINE LOGIC ---
function renderTimeline() {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';
    currentData.timeline.events.forEach((event, index) => {
        container.insertAdjacentHTML('beforeend', `
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg relative timeline-item" data-index="${index}">
                <button type="button" onclick="deleteTimeline(${index})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm">🗑️ Hapus</button>
                <div class="grid gap-3 pr-10">
                    <div><label class="text-xs text-gray-500">Judul Event</label><input type="text" value="${event.title}" class="timeline-item-title w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div><label class="text-xs text-gray-500">Tanggal</label><input type="text" value="${event.date}" class="timeline-item-date w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div><label class="text-xs text-gray-500">Deskripsi</label><textarea class="timeline-item-desc w-full border border-gray-300 rounded p-2 text-sm" rows="2" required>${event.description}</textarea></div>
                </div>
            </div>
        `);
    });
}
document.getElementById('add-timeline-btn').addEventListener('click', () => {
    scrapeArrays();
    currentData.timeline.events.push({title: '', date: '', description: ''});
    renderTimeline();
});
window.deleteTimeline = function(index) {
    if(confirm('Hapus event ini?')) {
        scrapeArrays();
        currentData.timeline.events.splice(index, 1);
        renderTimeline();
    }
};

// --- GALLERY LOGIC ---
function renderGallery() {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';
    currentData.gallery.images.forEach((img, index) => {
        container.insertAdjacentHTML('beforeend', `
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg relative gallery-item" data-index="${index}">
                <button type="button" onclick="deleteGallery(${index})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm">🗑️ Hapus</button>
                <div class="grid gap-3 pr-10">
                    <div><label class="text-xs text-gray-500">URL Gambar</label><input type="text" value="${img.src}" class="gallery-item-src w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div><label class="text-xs text-gray-500">Alt Text</label><input type="text" value="${img.alt}" class="gallery-item-alt w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div><label class="text-xs text-gray-500">Caption (Teks di Foto)</label><input type="text" value="${img.caption}" class="gallery-item-caption w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div class="flex items-center"><input type="checkbox" class="gallery-item-wide mr-2" ${img.wide ? 'checked' : ''}><label class="text-sm text-gray-700">Foto Lebar (2 Kolom)</label></div>
                </div>
                ${img.src ? `<div class="mt-3"><img src="${img.src}" class="h-24 w-auto object-cover rounded shadow-sm border"></div>` : ''}
            </div>
        `);
    });
}
document.getElementById('add-gallery-btn').addEventListener('click', () => {
    scrapeArrays();
    currentData.gallery.images.push({src: '', alt: 'Memory', caption: '', wide: false});
    renderGallery();
});
window.deleteGallery = function(index) {
    if(confirm('Hapus foto ini?')) {
        scrapeArrays();
        currentData.gallery.images.splice(index, 1);
        renderGallery();
    }
};

// --- REASONS LOGIC ---
function renderReasons() {
    const container = document.getElementById('reasons-container');
    container.innerHTML = '';
    currentData.reasons.items.forEach((item, index) => {
        container.insertAdjacentHTML('beforeend', `
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg relative reasons-item" data-index="${index}">
                <button type="button" onclick="deleteReason(${index})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm">🗑️ Hapus</button>
                <div class="grid gap-3 pr-10">
                    <div><label class="text-xs text-gray-500">Ikon/Emoji</label><input type="text" value="${item.icon}" class="reasons-item-icon w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div><label class="text-xs text-gray-500">Judul</label><input type="text" value="${item.title}" class="reasons-item-title w-full border border-gray-300 rounded p-2 text-sm" required></div>
                    <div><label class="text-xs text-gray-500">Deskripsi</label><textarea class="reasons-item-desc w-full border border-gray-300 rounded p-2 text-sm" rows="2" required>${item.description}</textarea></div>
                </div>
            </div>
        `);
    });
}
document.getElementById('add-reasons-btn').addEventListener('click', () => {
    scrapeArrays();
    currentData.reasons.items.push({icon: '✨', title: '', description: ''});
    renderReasons();
});
window.deleteReason = function(index) {
    if(confirm('Hapus alasan ini?')) {
        scrapeArrays();
        currentData.reasons.items.splice(index, 1);
        renderReasons();
    }
};

// --- SCRAPE & SAVE LOGIC ---
function scrapeArrays() {
    // Scrape Timeline
    const tItems = document.querySelectorAll('.timeline-item');
    currentData.timeline.events = Array.from(tItems).map(el => ({
        title: el.querySelector('.timeline-item-title').value,
        date: el.querySelector('.timeline-item-date').value,
        description: el.querySelector('.timeline-item-desc').value
    }));

    // Scrape Gallery
    const gItems = document.querySelectorAll('.gallery-item');
    currentData.gallery.images = Array.from(gItems).map(el => ({
        src: el.querySelector('.gallery-item-src').value,
        alt: el.querySelector('.gallery-item-alt').value,
        caption: el.querySelector('.gallery-item-caption').value,
        wide: el.querySelector('.gallery-item-wide').checked
    }));

    // Scrape Reasons
    const rItems = document.querySelectorAll('.reasons-item');
    currentData.reasons.items = Array.from(rItems).map(el => ({
        icon: el.querySelector('.reasons-item-icon').value,
        title: el.querySelector('.reasons-item-title').value,
        description: el.querySelector('.reasons-item-desc').value
    }));
}

document.getElementById('cms-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = 'Menyimpan...';

    try {
        scrapeArrays();

        const newData = {
            hero: {
                ...currentData.hero,
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value,
                description: document.getElementById('hero-description').value,
                footerText: document.getElementById('hero-footerText').value,
            },
            timeline: {
                title: document.getElementById('timeline-title').value,
                subtitle: document.getElementById('timeline-subtitle').value,
                events: currentData.timeline.events
            },
            gallery: {
                title: document.getElementById('gallery-title').value,
                subtitle: document.getElementById('gallery-subtitle').value,
                images: currentData.gallery.images
            },
            reasons: {
                title: document.getElementById('reasons-title').value,
                items: currentData.reasons.items
            },
            proposal: {
                ...currentData.proposal,
                targetName: document.getElementById('proposal-targetName').value,
                message: document.getElementById('proposal-message').value,
                question: document.getElementById('proposal-question').value,
            }
        };

        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData, null, 2)
        });

        const result = await response.json();
        
        if (result.success) {
            showStatus(result.message, 'success');
        } else {
            showStatus(result.error || 'Gagal menyimpan', 'error');
        }
    } catch (err) {
        showStatus('Terjadi kesalahan saat menyimpan data.', 'error');
        console.error(err);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Simpan Data & Push ke GitHub';
    }
});

function showStatus(message, type) {
    const el = document.getElementById('status-message');
    el.textContent = message;
    el.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
    
    if (type === 'success') {
        el.classList.add('bg-green-100', 'text-green-800');
    } else {
        el.classList.add('bg-red-100', 'text-red-800');
    }
    
    setTimeout(() => {
        el.classList.add('hidden');
    }, 5000);
}
