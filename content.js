/**
 * Content Script - Membaca data dari halaman Performa Toko Shopee
 */

function extractPerformanceData() {
    try {
        const data = {
            isValidPage: false,
            pageType: 'unknown',
            metrics: {},
            timestamp: new Date().toISOString()
        };

        // Deteksi apakah kita di halaman performa
        const performanceTitle = document.querySelector('[data-testid="page-title"]') || 
                                  document.querySelector('h1');
        
        if (performanceTitle && performanceTitle.textContent.includes('Performa')) {
            data.isValidPage = true;
            data.pageType = 'performance';
        }

        // Jika belum valid, coba cari teks "Performa" atau "Statistik"
        if (!data.isValidPage) {
            const pageText = document.body.innerText;
            if (pageText.includes('Performa') || pageText.includes('Pengunjung') || pageText.includes('Penjualan')) {
                data.isValidPage = true;
                data.pageType = 'performance';
            }
        }

        if (!data.isValidPage) {
            return data;
        }

        // Extract metrik - cari semua elemen yang mungkin berisi angka/metrik
        const metricElements = document.querySelectorAll('[data-testid*="metric"], [class*="metric"], [class*="stat"]');
        
        metricElements.forEach(el => {
            const label = el.getAttribute('data-label') || el.querySelector('[class*="label"]')?.textContent || '';
            const value = el.getAttribute('data-value') || el.querySelector('[class*="value"]')?.textContent || 
                         el.textContent?.match(/\d+[\d,.]*/)?.[0] || '';
            
            if (label && value) {
                data.metrics[label.trim()] = value.trim();
            }
        });

        // Cari angka di halaman dengan pola umum
        const allText = document.body.innerText;
        const patterns = {
            pengunjung: /pengunjung[:\s]+(\d+(?:[.,]\d+)?[kmb%]*)/gi,
            penjualan: /penjualan[:\s]+(\d+(?:[.,]\d+)?[kmb%]*)/gi,
            conversion: /konversi[:\s]+(\d+(?:[.,]\d+)?[kmb%]*)/gi,
            ctr: /ctr[:\s]+(\d+(?:[.,]\d+)?[kmb%]*)/gi,
            roas: /roas[:\s]+(\d+(?:[.,]\d+)?[kmb%]*)/gi,
        };

        Object.entries(patterns).forEach(([key, pattern]) => {
            const match = allText.match(pattern);
            if (match) {
                data.metrics[key] = match[0].split(/[:\s]+/)[1];
            }
        });

        // Jika tidak ada metrik, ambil semua angka dengan konteks
        if (Object.keys(data.metrics).length === 0) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                if (text.match(/\d+/) && text.length < 200) {
                    textNodes.push(text);
                }
            }

            // Ambil text yang berisi angka
            textNodes.slice(0, 20).forEach((text, idx) => {
                data.metrics[`info_${idx}`] = text;
            });
        }

        return data;
    } catch (error) {
        console.error('Error extracting data:', error);
        return {
            isValidPage: false,
            error: error.message
        };
    }
}

// Listen for messages dari popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getData') {
        const data = extractPerformanceData();
        sendResponse(data);
    }
});

// Kirim data ke popup saat content script dimuat
window.addEventListener('load', () => {
    const data = extractPerformanceData();
    chrome.runtime.sendMessage({
        action: 'dataExtracted',
        data: data
    }).catch(() => {
        // Silent catch - popup mungkin belum terbuka
    });
});
