import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the API client
jest.mock('../lib/apiClient', () => ({
  validateInstagramUrl: jest.fn(),
  fetchInstagramVideo: jest.fn(),
  downloadVideo: jest.fn(),
}));

// Mock the download helper
jest.mock('../lib/downloadHelper', () => ({
  generateFilename: jest.fn(),
  formatFileSize: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main app components', () => {
    render(<App />);
    
    // Check if main components are rendered
    expect(screen.getByText('InstaDownloader')).toBeInTheDocument();
    expect(screen.getByText('Download Instagram')).toBeInTheDocument();
    expect(screen.getByText('Videos & Reels')).toBeInTheDocument();
  });

  test('renders URL input form', () => {
    render(<App />);
    
    const urlInput = screen.getByPlaceholderText('Paste Instagram post or reel URL here');
    const fetchButton = screen.getByText('Fetch Preview');
    
    expect(urlInput).toBeInTheDocument();
    expect(fetchButton).toBeInTheDocument();
  });

  test('shows loading state when fetching', async () => {
    const { validateInstagramUrl, fetchInstagramVideo } = require('../lib/apiClient');
    
    validateInstagramUrl.mockReturnValue(true);
    fetchInstagramVideo.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<App />);
    
    const urlInput = screen.getByPlaceholderText('Paste Instagram post or reel URL here');
    const fetchButton = screen.getByText('Fetch Preview');
    
    fireEvent.change(urlInput, { target: { value: 'https://instagram.com/p/test' } });
    fireEvent.click(fetchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Fetching Preview...')).toBeInTheDocument();
    });
  });

  test('shows error for invalid URL', async () => {
    const { validateInstagramUrl } = require('../lib/apiClient');
    
    validateInstagramUrl.mockReturnValue(false);
    
    render(<App />);
    
    const urlInput = screen.getByPlaceholderText('Paste Instagram post or reel URL here');
    const fetchButton = screen.getByText('Fetch Preview');
    
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.click(fetchButton);
    
    // Error should be shown via toast notification
    await waitFor(() => {
      expect(validateInstagramUrl).toHaveBeenCalledWith('invalid-url');
    });
  });

  test('displays video preview after successful fetch', async () => {
    const { validateInstagramUrl, fetchInstagramVideo } = require('../lib/apiClient');
    const { generateFilename } = require('../lib/downloadHelper');
    
    const mockVideoData = {
      id: 'test123',
      username: 'testuser',
      caption: 'Test caption',
      thumbnail: 'https://example.com/thumb.jpg',
      duration: 30,
      qualities: [
        {
          label: '720p',
          mime: 'video/mp4',
          size: 5000000,
          url: 'https://example.com/video.mp4'
        }
      ]
    };
    
    validateInstagramUrl.mockReturnValue(true);
    fetchInstagramVideo.mockResolvedValue(mockVideoData);
    generateFilename.mockReturnValue('instagram_testuser_test123_720p_2024-01-01.mp4');
    
    render(<App />);
    
    const urlInput = screen.getByPlaceholderText('Paste Instagram post or reel URL here');
    const fetchButton = screen.getByText('Fetch Preview');
    
    fireEvent.change(urlInput, { target: { value: 'https://instagram.com/p/test' } });
    fireEvent.click(fetchButton);
    
    await waitFor(() => {
      expect(screen.getByText('@testuser')).toBeInTheDocument();
      expect(screen.getByText('Test caption')).toBeInTheDocument();
    });
  });
});
