# Instagram Video Downloader

A fully client-side Instagram Video Downloader web application built with React and Tailwind CSS. Download Instagram posts, reels, and stories in high quality directly from your browser - no backend required!

## ✨ Features

- 🎥 **High Quality Downloads** - Download videos in up to 1080p quality
- 🚀 **Client-Side Only** - No backend, no server, works entirely in the browser
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful interface with smooth animations
- 🔒 **Privacy First** - No data storage, no tracking, direct API calls
- ⚡ **Real-time Preview** - See video before downloading
- 🎯 **Quality Selection** - Choose your preferred video quality
- 📊 **Progress Tracking** - Real-time download progress
- ♿ **Accessible** - Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

### Frontend Only
- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - Beautiful notifications
- **Fetch API** - Direct API calls to RapidAPI
- **Lucide React** - Beautiful icons

### API Integration
- **RapidAPI** - Instagram downloader API
- **Direct API Calls** - No backend proxy needed
- **CORS Enabled** - Works directly from browser

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/instagram-downloader.git
   cd instagram-downloader/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - App: http://localhost:3000

That's it! No backend setup required.

## 📁 Project Structure

```
my-app/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── PreviewCard.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── QualitySelector.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── FAQs.jsx
│   │   └── Footer.jsx
│   ├── lib/               # Utility libraries
│   │   ├── apiClient.js   # Direct RapidAPI integration
│   │   └── downloadHelper.js
│   ├── App.js             # Main app component
│   └── index.js           # App entry point
└── README.md
```

## 🔧 How It Works

### Direct API Integration
The app makes direct calls to RapidAPI's Instagram downloader service:

```javascript
// Direct API call from frontend
const response = await fetch('https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/api/instagram', {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'your-api-key',
    'X-RapidAPI-Host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',
  },
  params: new URLSearchParams({ url: instagramUrl })
});
```

### Same-Tab Downloads
Downloads happen directly in the browser using blob URLs:

```javascript
// Create blob and trigger download
const blob = new Blob(chunks, { type: 'video/mp4' });
const blobUrl = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = blobUrl;
link.download = filename;
link.click();
```

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by:

1. **Colors**: Update the color scheme in `tailwind.config.js`
2. **Components**: Modify component styles in individual `.jsx` files
3. **Animations**: Adjust Framer Motion animations in components

### Adding New Features
1. **New Components**: Add to `src/components/`
2. **API Integration**: Modify `src/lib/apiClient.js`
3. **Utilities**: Add to `src/lib/`

## 🧪 Testing

### Running Tests
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- Unit tests for components
- API integration tests
- Download functionality tests

## 🚀 Deployment

### Static Hosting (Vercel/Netlify)
```bash
# Build the app
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
# Build and deploy to GitHub Pages
npm run build
# Deploy the build folder to your GitHub Pages
```

## 🔒 Security Features

- **Direct API Calls** - No backend vulnerabilities
- **Input Validation** - Client-side URL validation
- **Error Handling** - Comprehensive error states
- **No Data Storage** - Privacy-first approach
- **CORS Safe** - Works with modern browsers

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Legal Disclaimer

This tool is for personal use only. Please respect:
- Instagram's Terms of Service
- Copyright laws
- Creator rights
- Privacy regulations

**Important**: Always get permission before using downloaded content commercially.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@instadownloader.com

## 🙏 Acknowledgments

- [RapidAPI](https://rapidapi.com) for Instagram API
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://framer.com/motion/) for animations
- [React](https://reactjs.org) for the framework

---

**Made with ❤️ by the Instagram Downloader Team**