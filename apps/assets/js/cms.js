let currentData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/apps/data/content.json');
        currentData = await response.json();
        
        // Populate Hero
        document.getElementById('hero-title').value = currentData.hero.title;
        document.getElementById('hero-subtitle').value = currentData.hero.subtitle;
        document.getElementById('hero-description').value = currentData.hero.description;

        // Populate Proposal
        document.getElementById('proposal-targetName').value = currentData.proposal.targetName;
        document.getElementById('proposal-message').value = currentData.proposal.message;
        document.getElementById('proposal-question').value = currentData.proposal.question;

        // Populate Raw JSON (Everything else)
        const advancedData = {
            timeline: currentData.timeline,
            gallery: currentData.gallery,
            reasons: currentData.reasons
        };
        document.getElementById('raw-json').value = JSON.stringify(advancedData, null, 2);

    } catch (e) {
        showStatus('Error loading data. Are you running from server.js?', 'error');
    }
});

document.getElementById('cms-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = 'Menyimpan...';

    try {
        // Parse advanced JSON
        const advancedData = JSON.parse(document.getElementById('raw-json').value);

        // Merge with form fields
        const newData = {
            hero: {
                ...currentData.hero,
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value,
                description: document.getElementById('hero-description').value,
            },
            timeline: advancedData.timeline,
            gallery: advancedData.gallery,
            reasons: advancedData.reasons,
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
        showStatus('Format JSON di Advanced Section tidak valid! Periksa kembali kurung, koma, dan tanda kutip ganda.', 'error');
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
