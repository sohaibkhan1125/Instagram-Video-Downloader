/**
 * Download helper for same-tab downloads with progress tracking
 */

class DownloadHelper {
  constructor() {
    this.downloadQueue = new Map();
  }

  /**
   * Format file size in human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate filename from Instagram metadata
   * @param {string} username - Instagram username
   * @param {string} postId - Instagram post ID
   * @param {string} quality - Video quality
   * @returns {string} Generated filename
   */
  generateFilename(username, postId, quality = '') {
    const timestamp = new Date().toISOString().split('T')[0];
    const qualitySuffix = quality ? `_${quality}` : '';
    return `instagram_${username}_${postId}${qualitySuffix}_${timestamp}.mp4`;
  }

  /**
   * Check if browser supports programmatic downloads
   * @returns {boolean} Whether downloads are supported
   */
  isDownloadSupported() {
    return typeof document.createElement('a').download !== 'undefined';
  }

  /**
   * Get mobile download instructions
   * @returns {string} Mobile-specific instructions
   */
  getMobileInstructions() {
    return `
      For mobile devices:
      1. Long press the download link
      2. Select "Download" or "Save to Files"
      3. Choose your preferred location
    `;
  }

  /**
   * Show fallback instructions when programmatic download fails
   * @param {string} filename - Filename to suggest
   */
  showFallbackInstructions(filename) {
    const fallbackMessage = `
      Your browser blocked the automatic download. 
      Please right-click the link below and select "Save link as..." to download ${filename}
    `;
    
    alert(fallbackMessage);
  }
}

export default new DownloadHelper();
