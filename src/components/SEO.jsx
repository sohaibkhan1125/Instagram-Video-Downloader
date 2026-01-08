import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = "Instagram Video Downloader - Download Reels & Stories",
    description = "Fast and free Instagram Video Downloader. Download Instagram reels, videos, and stories in high quality (1080p). No registration required.",
    canonical = "https://instadownloader.com", // Replace with your actual domain
    ogType = "website",
    ogImage = "/logo512.png", // Path to your preview image
}) => {
    const siteName = "InstaDownloader";
    const fullTitle = `${title} | ${siteName}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={canonical} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Additional SEO tags */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
        </Helmet>
    );
};

export default SEO;
