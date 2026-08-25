/**
 * Background Service Worker
 * Menangani komunikasi antar komponen
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'dataExtracted') {
        // Simpan data yang diekstrak untuk diakses popup
        chrome.storage.local.set({
            lastExtractedData: request.data,
            lastExtractedTime: new Date().toISOString()
        });
    }
});
