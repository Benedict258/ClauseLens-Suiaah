// ClauseLens Popup Script
const BASE_URL = "https://ais-dev-wndzybiqm3ibh34ikg4x5u-337842956729.europe-west1.run.app";

document.addEventListener('DOMContentLoaded', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    if (!currentTab || !currentTab.url.startsWith('http')) return;

    const url = new URL(currentTab.url);
    const domain = url.hostname;

    // Load existing data from storage
    chrome.storage.local.get([domain], (result) => {
        if (result[domain]) {
            displayResult(result[domain]);
        } else {
            // Trigger initial analysis if not found
            triggerAnalysis(currentTab.url, domain);
        }
    });

    document.getElementById('analyzeBtn').addEventListener('click', () => {
        triggerAnalysis(currentTab.url, domain);
    });

    document.getElementById('dashboardBtn').addEventListener('click', () => {
        const dashboardUrl = `${BASE_URL}/?url=${encodeURIComponent(currentTab.url)}`;
        chrome.tabs.create({ url: dashboardUrl });
    });
});

async function triggerAnalysis(url, domain) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    loading.style.display = 'block';
    content.style.display = 'none';

    try {
        const response = await fetch(`${BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        
        // Save to storage
        chrome.storage.local.set({ [domain]: data });
        displayResult(data);
    } catch (e) {
        console.error(e);
        document.getElementById('summaryText').textContent = "Failed to analyze this site. Please check your connection.";
    } finally {
        loading.style.display = 'none';
        content.style.display = 'block';
    }
}

function displayResult(data) {
    document.getElementById('result').style.display = 'block';
    document.getElementById('scoreValue').textContent = data.risk_score;
    document.getElementById('summaryText').textContent = data.summary;
    
    // Severity styling
    const severityText = document.getElementById('severityText');
    const statusDot = document.getElementById('statusDot');
    
    severityText.className = 'severity';
    statusDot.className = 'status-dot';
    
    if (data.risk_score <= 3) {
        severityText.textContent = 'Safe';
        severityText.classList.add('low');
        statusDot.classList.add('dot-green');
    } else if (data.risk_score <= 7) {
        severityText.textContent = 'Caution';
        severityText.classList.add('medium');
        statusDot.classList.add('dot-yellow');
    } else {
        severityText.textContent = 'Risky';
        severityText.classList.add('high');
        statusDot.classList.add('dot-red');
    }

    // Risks
    const list = document.getElementById('riskList');
    list.innerHTML = '';
    (data.risks || []).slice(0, 3).forEach(risk => {
        const div = document.createElement('div');
        div.className = `risk-item ${risk.severity}`;
        div.innerHTML = `
            <div class="risk-title">${risk.title}</div>
            <div class="risk-desc">${risk.description}</div>
        `;
        list.appendChild(div);
    });
}
