/**
 * Popup Script - Logic untuk popup panel
 */

class ShopeeAnalyzer {
    constructor() {
        this.data = null;
        this.analysis = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnalysis();
    }

    setupEventListeners() {
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Analyze button
        document.getElementById('analyze-btn').addEventListener('click', () => this.loadAnalysis());
    }

    async loadAnalysis() {
        this.showLoading();
        
        try {
            // Minta data dari content script
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            chrome.tabs.sendMessage(tab.id, { action: 'getData' }, (response) => {
                if (chrome.runtime.lastError) {
                    this.showError();
                    return;
                }

                if (!response || !response.isValidPage) {
                    this.showError();
                    return;
                }

                this.data = response;
                this.analysis = this.analyzeData(response);
                this.render();
            });
        } catch (error) {
            console.error('Error:', error);
            this.showError();
        }
    }

    analyzeData(data) {
        // Parse metrics
        const metrics = this.parseMetrics(data.metrics);

        // Analisis dasar
        const analysis = {
            status: 'normal',
            statusEmoji: '🟡',
            statusColor: '#ffc107',
            summary: 'Data sedang dianalisis...',
            details: {},
            problems: [],
            actions: []
        };

        // Logika analisis
        if (!metrics || Object.keys(metrics).length === 0) {
            analysis.status = 'unknown';
            analysis.statusEmoji = '❓';
            analysis.summary = 'Tidak bisa membaca data. Pastikan Anda di halaman Performa Toko.';
            return analysis;
        }

        // Analisis berdasarkan metrik yang tersedia
        const visitor = metrics.pengunjung || metrics.visitors || 0;
        const sales = metrics.penjualan || metrics.sales || 0;
        const conversion = metrics.conversion || metrics.konversi || 0;
        const trend = metrics.trend || 'stable';

        // Determine status
        if (visitor > 0 && sales > 0 && conversion > 3) {
            analysis.status = 'good';
            analysis.statusEmoji = '🟢';
            analysis.statusColor = '#28a745';
            analysis.summary = `Toko sedang performa bagus! ${visitor}+ pengunjung dan ${sales}+ order.`;
        } else if (visitor > 0 && sales === 0) {
            analysis.status = 'problem';
            analysis.statusEmoji = '🔴';
            analysis.statusColor = '#dc3545';
            analysis.summary = 'Banyak pengunjung tapi sedikit penjualan. Ada masalah dengan conversion!';
            analysis.problems.push('Conversion rate sangat rendah');
            analysis.problems.push('Kemungkinan: harga terlalu tinggi, foto kurang menarik, atau penawaran kurang jelas');
        } else if (visitor > 0) {
            analysis.status = 'warning';
            analysis.statusEmoji = '🟡';
            analysis.statusColor = '#ffc107';
            analysis.summary = 'Situasi sedang berfluktuasi. Perlu dicek lebih detail.';
        } else {
            analysis.status = 'low';
            analysis.statusEmoji = '📉';
            analysis.statusColor = '#6c757d';
            analysis.summary = 'Pengunjung masih sangat sedikit. Perlu perhatian khusus.';
            analysis.problems.push('Traffic sangat rendah');
        }

        // Generate rekomendasi
        analysis.actions = this.generateRecommendations(metrics, analysis.status);
        analysis.details = metrics;

        return analysis;
    }

    parseMetrics(metricsObj) {
        const parsed = {};

        Object.entries(metricsObj).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            
            // Normalize key names
            if (lowerKey.includes('pengunjung') || lowerKey.includes('visitor')) {
                parsed.pengunjung = this.parseNumber(value);
            } else if (lowerKey.includes('penjualan') || lowerKey.includes('sales') || lowerKey.includes('order')) {
                parsed.penjualan = this.parseNumber(value);
            } else if (lowerKey.includes('konversi') || lowerKey.includes('conversion')) {
                parsed.conversion = this.parseNumber(value);
            } else if (lowerKey.includes('ctr')) {
                parsed.ctr = this.parseNumber(value);
            } else if (lowerKey.includes('roas')) {
                parsed.roas = this.parseNumber(value);
            } else if (lowerKey.includes('naik') || lowerKey.includes('turun') || lowerKey.includes('trend')) {
                parsed.trend = value;
            } else {
                // Simpan metrik lainnya
                parsed[key] = value;
            }
        });

        return parsed;
    }

    parseNumber(value) {
        if (typeof value === 'number') return value;
        
        const str = String(value).toLowerCase();
        const num = parseFloat(str.replace(/[^\d.,]/g, '').replace(/[.,]/, '.'));
        
        if (str.includes('k')) return num * 1000;
        if (str.includes('m')) return num * 1000000;
        if (str.includes('b')) return num * 1000000000;
        
        return isNaN(num) ? 0 : num;
    }

    generateRecommendations(metrics, status) {
        const actions = [];

        if (status === 'problem') {
            actions.push('🔍 Cek foto produk - apakah cukup menarik?');
            actions.push('💰 Review harga - bandingkan dengan kompetitor');
            actions.push('📝 Cek deskripsi - apakah jelas dan menarik?');
            actions.push('⏸️ JANGAN naikkan budget iklan dulu!');
        } else if (status === 'warning') {
            actions.push('📊 Monitor tren lebih lanjut');
            actions.push('🔄 Jangan buru-buru ubah strategi');
            actions.push('📈 Tunggu data yang lebih lengkap sebelum ambil keputusan');
        } else if (status === 'low') {
            actions.push('📢 Tingkatkan visibility produk');
            actions.push('🎯 Optimalkan keyword iklan');
            actions.push('💡 Cek kompetisi keyword yang digunakan');
        } else if (status === 'good') {
            actions.push('✅ Pertahankan strategi saat ini');
            actions.push('📈 Monitor performa terus-menerus');
            actions.push('💪 Pertimbangkan scaling budget secara gradual');
        }

        return actions;
    }

    switchMode(mode) {
        // Update button state
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update panel
        document.querySelectorAll('.mode-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(mode).classList.add('active');
    }

    render() {
        const { analysis } = this;

        // Status
        const statusHTML = `
            <div class="status-indicator">${analysis.statusEmoji}</div>
            <strong>${analysis.summary}</strong>
        `;
        document.getElementById('status-text').innerHTML = statusHTML;

        // Mode: Overview (BACA)
        const overviewHTML = Object.entries(analysis.details)
            .map(([key, value]) => `
                <div class="metric-item">
                    <span class="metric-label">${this.formatLabel(key)}</span>
                    <span class="metric-value">${value}</span>
                </div>
            `).join('');
        document.getElementById('overview-content').innerHTML = overviewHTML || '<p>Tidak ada data terdeteksi</p>';

        // Mode: Analysis (ANALISA)
        const analysisHTML = `
            <p><strong>Status:</strong> ${analysis.status.toUpperCase()}</p>
            <p>${analysis.summary}</p>
            ${analysis.problems.length > 0 ? `
                <h4 style="margin-top: 12px; margin-bottom: 8px; font-size: 12px;">Masalah Terdeteksi:</h4>
                ${analysis.problems.map(p => `<div class="alert danger">${p}</div>`).join('')}
            ` : '<p style="color: #666;">Tidak ada masalah terdeteksi ✓</p>'}
        `;
        document.getElementById('analysis-content').innerHTML = analysisHTML;

        // Mode: Problem (MASALAH)
        const problemHTML = analysis.problems.length > 0 
            ? analysis.problems.map(p => `<div class="alert danger">${p}</div>`).join('')
            : '<p style="color: #666;">Toko Anda terlihat baik-baik saja! ✓</p>';
        document.getElementById('problem-content').innerHTML = problemHTML;

        // Mode: Action (TINDAKAN)
        const actionHTML = analysis.actions
            .map(action => `<div class="recommendation">${action}</div>`)
            .join('');
        document.getElementById('action-content').innerHTML = actionHTML;

        // Hide loading, show result
        this.showResult();
    }

    formatLabel(key) {
        const labels = {
            pengunjung: '👥 Pengunjung',
            penjualan: '💰 Penjualan',
            conversion: '🎯 Conversion',
            ctr: '📊 CTR',
            roas: '💹 ROAS',
            trend: '📈 Trend'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('analysis-result').classList.add('hidden');
        document.getElementById('error-message').classList.add('hidden');
    }

    showResult() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('analysis-result').classList.remove('hidden');
        document.getElementById('error-message').classList.add('hidden');
    }

    showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('analysis-result').classList.add('hidden');
        document.getElementById('error-message').classList.remove('hidden');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ShopeeAnalyzer();
});
