import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import QuillEditor from './QuillEditor';

const SLUG = 'homepage_text'; // Specific slug for Instagram downloader homepage content

const ContentManagement = () => {
	const [content, setContent] = useState('');
	const [editorKey, setEditorKey] = useState(0); // To force re-render on reset
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState(null);
	const [error, setError] = useState(null);

	const loadContent = useCallback(async () => {
		try {
			const { data, error } = await supabase
				.from('website_content')
				.select('*')
				.eq('slug', SLUG)
				.single();

			if (error && error.code !== 'PGRST116') {
				console.warn('Error loading content from Supabase:', error);
				return;
			}

			if (data && data.content) {
				setContent(data.content);
				setEditorKey(prev => prev + 1); // Force editor to re-initialize with new content
			}
		} catch (error) {
			console.warn('Error loading content:', error);
		}
	}, []);

	useEffect(() => {
		loadContent();
	}, [loadContent]);

	const handleSave = async (newContent) => {
		setSaving(true);
		setError(null);
		setSuccess(null);

		try {
			// Check if row with this slug exists
			const { data: existingData } = await supabase
				.from('website_content')
				.select('*')
				.eq('slug', SLUG)
				.single();

			let result;
			if (existingData) {
				// Update existing row
				result = await supabase
					.from('website_content')
					.update({
						content: newContent,
						updated_at: new Date().toISOString()
					})
					.eq('slug', SLUG);
			} else {
				// Insert new row
				result = await supabase
					.from('website_content')
					.insert([{
						slug: SLUG,
						content: newContent
					}]);
			}

			if (result.error) throw result.error;

			setContent(newContent);
			setSuccess('Content saved successfully to Supabase!');

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);

		} catch (error) {
			setError('Error saving content: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
					<p className="text-gray-600">Create and manage content that will be displayed above the FAQ section on your website.</p>
				</div>
				<button
					onClick={loadContent}
					className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors h-fit"
				>
					Reset to Saved
				</button>
			</div>

			{success && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					{success}
				</div>
			)}

			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="main-container">
				{/* Using key to force re-render when content is reloaded from server */}
				<QuillEditor
					key={editorKey}
					initialContent={content}
					onSave={handleSave}
					isSaving={saving}
				/>
			</div>
		</div>
	);
};

export default ContentManagement;
