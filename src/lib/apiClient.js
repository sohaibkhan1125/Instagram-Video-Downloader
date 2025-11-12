class InstagramDownloader {
  constructor() {
    this.apiKey = '90f18d95c0msh12900f8ecdc4a4bp1d499ejsn6903806411b3';
    this.apiHost = 'snap-video3.p.rapidapi.com';
    this.baseURL = 'https://snap-video3.p.rapidapi.com';
  }

  /**
   * Validate Instagram/TikTok URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Whether URL is valid Instagram/TikTok post/reel
   */
  validateInstagramUrl(url) {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/;
    const tiktokRegex = /^https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_.-]+\/video\/\d+\/?/;
    return instagramRegex.test(url) || tiktokRegex.test(url);
  }

  /**
   * Extract Instagram/TikTok post/reel ID from URL
   * @param {string} url - Instagram/TikTok URL
   * @returns {string|null} Post/reel ID or null if invalid
   */
  extractInstagramId(url) {
    // Instagram pattern
    const instagramMatch = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (instagramMatch) return instagramMatch[2];
    
    // TikTok pattern
    const tiktokMatch = url.match(/\/video\/(\d+)/);
    if (tiktokMatch) return tiktokMatch[1];
    
    return null;
  }

  /**
   * Extract username from Instagram/TikTok URL
   * @param {string} url - Instagram/TikTok URL
   * @returns {string|null} Username or null if not found
   */
  extractUsernameFromUrl(url) {
    // Instagram pattern
    const instagramMatch = url.match(/instagram\.com\/([^\/]+)\/(p|reel|tv)\//);
    if (instagramMatch) return instagramMatch[1];
    
    // TikTok pattern
    const tiktokMatch = url.match(/tiktok\.com\/@([^\/]+)\/video\//);
    if (tiktokMatch) return tiktokMatch[1];
    
    return null;
  }

  /**
   * Fetch Instagram/TikTok video metadata and download URLs from new RapidAPI
   * @param {string} url - Instagram/TikTok post/reel URL
   * @returns {Promise<Object>} Video metadata and download options
   */
  async fetchInstagramVideo(url) {
    try {
      if (!this.validateInstagramUrl(url)) {
        throw new Error('Invalid Instagram/TikTok URL format');
      }

      console.log('Fetching video data for:', url);
      return await this.fetchFromNewAPI(url);

    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message.includes('Invalid Instagram URL')) {
        throw new Error('Please enter a valid Instagram or TikTok URL');
      } else if (error.message.includes('HTTP error! status: 403')) {
        throw new Error('This post is private or restricted. Only public posts can be downloaded.');
      } else if (error.message.includes('HTTP error! status: 404')) {
        throw new Error('Post not found. The video may have been deleted or the URL is incorrect.');
      } else if (error.message.includes('HTTP error! status: 429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to API. Please check your internet connection.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to fetch data. Please check your internet connection and try again.');
      } else {
        throw new Error(`Failed to fetch video: ${error.message}`);
      }
    }
  }

  /**
   * Fetch from new RapidAPI endpoint
   */
  async fetchFromNewAPI(url) {
    const apiUrl = `https://${this.apiHost}/download`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors',
      credentials: 'omit',
      body: new URLSearchParams({ url: url })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return this.parseNewAPIResponse(data, url);
  }

  /**
   * Parse new API response format
   */
  parseNewAPIResponse(data, url) {
    console.log('New API Response:', data);

    // Extract username from URL if not in response
    const extractedUsername = this.extractUsernameFromUrl(url);

    // Transform the response to our expected format
    const result = {
      id: this.extractInstagramId(url),
      username: extractedUsername || 'unknown',
      caption: data.title || '',
      thumbnail: data.thumbnail || '',
      duration: this.parseDuration(data.duration),
      url: data.url,
      source: data.source,
      qualities: []
    };

    // Process medias array from new API response
    if (data.medias && Array.isArray(data.medias)) {
      data.medias.forEach((media, index) => {
        if (media.url && media.quality) {
          result.qualities.push({
            label: this.formatQualityLabel(media.quality),
            mime: this.getMimeType(media.extension),
            size: media.size || this.estimateFileSize(media.url),
            url: media.url,
            extension: media.extension,
            quality: media.quality,
            videoAvailable: media.videoAvailable,
            audioAvailable: media.audioAvailable
          });
        }
      });
    }

    if (result.qualities.length === 0) {
      console.error('No valid media URLs found. Response structure:', JSON.stringify(data, null, 2));
      throw new Error('No media URLs found in response. Please check if the post contains downloadable content.');
    }

    console.log(`Successfully fetched data for ${result.username}: ${result.qualities.length} quality options`);
    return result;
  }

  /**
   * Format quality label from API response
   * @param {string} quality - Quality string from API
   * @returns {string} Formatted quality label
   */
  formatQualityLabel(quality) {
    const qualityMap = {
      'hd': '720p HD',
      'full hd': '1080p Full HD',
      '128kbps': 'Audio (MP3)',
      'medium': '480p',
      'low': '360p'
    };
    return qualityMap[quality.toLowerCase()] || quality;
  }

  /**
   * Get MIME type from file extension
   * @param {string} extension - File extension
   * @returns {string} MIME type
   */
  getMimeType(extension) {
    const mimeMap = {
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'webm': 'video/webm',
      'avi': 'video/avi'
    };
    return mimeMap[extension.toLowerCase()] || 'video/mp4';
  }

  /**
   * Parse duration from API response
   * @param {string} duration - Duration string (e.g., "00:44")
   * @returns {number} Duration in seconds
   */
  parseDuration(duration) {
    if (!duration) return 0;
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  }

  /**
   * Get quality label based on index and total count
   * @param {number} index - Quality index
   * @param {number} total - Total quality count
   * @returns {string} Quality label
   */
  getQualityLabel(index, total) {
    if (total === 1) return '720p';
    if (total === 2) return index === 0 ? '480p' : '720p';
    if (total === 3) {
      const labels = ['480p', '720p', '1080p'];
      return labels[index] || '720p';
    }
    return `${(index + 1) * 240}p`;
  }

  /**
   * Estimate file size based on URL (rough estimation)
   * @param {string} url - Video URL
   * @returns {number} Estimated file size in bytes
   */
  estimateFileSize(url) {
    const baseSize = 5 * 1024 * 1024; // 5MB base
    const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25 multiplier
    return Math.floor(baseSize * randomFactor);
  }

  /**
   * Download video/audio directly in the same tab
   * @param {string} mediaUrl - Direct media URL
   * @param {string} filename - Desired filename
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<void>}
   */
  async downloadVideo(mediaUrl, filename, onProgress) {
    try {
      // Check if URL is from TikTok/Instagram (likely CORS-restricted)
      const isCorsRestricted = mediaUrl.includes('tiktokcdn.com') || 
                               mediaUrl.includes('tokcdn.com') || 
                               mediaUrl.includes('instagram.com') ||
                               mediaUrl.includes('fbcdn.net');
      
      if (isCorsRestricted) {
        // For CORS-restricted URLs, use direct download approach
        this.directDownload(mediaUrl, filename, onProgress);
        return;
      }
      
      // For other URLs, try fetch first
      try {
        const response = await fetch(mediaUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (response.ok) {
          const contentLength = response.headers.get('content-length');
          const total = parseInt(contentLength, 10);
          let loaded = 0;

          const reader = response.body.getReader();
          const chunks = [];

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            if (total > 0 && onProgress) {
              const percent = Math.round((loaded / total) * 100);
              onProgress(percent);
            }
          }

          // Create blob from chunks
          const blob = new Blob(chunks, { type: response.headers.get('content-type') || 'video/mp4' });
          
          // Create download link and trigger download
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up blob URL after a delay
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
          
          if (onProgress) onProgress(100);
          return;
        }
      } catch (fetchError) {
        console.warn('Fetch method failed, using direct download:', fetchError.message);
        this.directDownload(mediaUrl, filename, onProgress);
        return;
      }

    } catch (error) {
      console.error('Download error:', error);
      // Fallback: Open URL in new tab
      window.open(mediaUrl, '_blank');
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Direct download method for CORS-restricted URLs
   * @param {string} mediaUrl - Direct media URL
   * @param {string} filename - Desired filename
   * @param {Function} onProgress - Progress callback
   */
  directDownload(mediaUrl, filename, onProgress) {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = filename;
    link.target = '_blank';
    link.style.display = 'none';
    
    // Add to DOM temporarily
    document.body.appendChild(link);
    
    // Set up progress tracking
    if (onProgress) {
      onProgress(10); // Initial progress
      
      // Simulate progress since we can't track direct downloads
      const progressInterval = setInterval(() => {
        const currentProgress = Math.min(90, Math.random() * 20 + 70);
        onProgress(currentProgress);
      }, 500);
      
      // Complete after a delay
      setTimeout(() => {
        clearInterval(progressInterval);
        onProgress(100);
        
        // Clean up link
        setTimeout(() => {
          document.body.removeChild(link);
        }, 1000);
      }, 2000);
    } else {
      // Clean up link after a delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 3000);
    }
    
    // Trigger download
    link.click();
  }
}

export default new InstagramDownloader();
