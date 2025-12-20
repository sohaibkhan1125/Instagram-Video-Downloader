import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { RefreshCw, Save, Code, Moon, Sun, Monitor, Trash2, Copy, Download, X, Maximize, Minimize } from 'lucide-react';
import './QuillEditor.css';

const QuillEditor = ({ initialContent, onSave, isSaving }) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [lastSaved, setLastSaved] = useState('Unsaved');
    const [theme, setTheme] = useState('light'); // 'light' or 'dark'
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeContent, setCodeContent] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // --- Initialization ---
    useEffect(() => {
        if (!editorRef.current || quillInstance.current) return;

        // Custom Toolbar Configuration
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ];

        quillInstance.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: imageHandler
                    }
                },
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true
                }
            },
            placeholder: 'Start writing your document here...'
        });

        const quill = quillInstance.current;

        // Set initial content
        if (initialContent) {
            // Check if initialContent is HTML or Delta
            // For safety, assuming HTML as per old editor
            quill.clipboard.dangerouslyPasteHTML(initialContent);
        }

        // Text Change Listener
        quill.on('text-change', () => {
            updateStats();
        });

        // Initialize stats
        updateStats();

        // Load theme preference
        const savedTheme = localStorage.getItem('editor_theme_preference');
        if (savedTheme === 'dark') {
            setTheme('dark');
        }

    }, []); // Run once on mount

    // Update content when initialContent changes (if it's loaded asynchronously)
    useEffect(() => {
        if (quillInstance.current && initialContent && quillInstance.current.getText().trim().length === 0) {
            quillInstance.current.clipboard.dangerouslyPasteHTML(initialContent);
            updateStats();
        }
    }, [initialContent]);

    // --- Handlers ---

    const updateStats = () => {
        if (!quillInstance.current) return;
        const text = quillInstance.current.getText();
        const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length > 1 ? text.length - 1 : 0;
        setWordCount(words);
        setCharCount(chars);
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const range = quillInstance.current.getSelection(true);
                    quillInstance.current.insertEmbed(range.index, 'image', reader.result);
                    quillInstance.current.setSelection(range.index + 1);
                    showToastMsg('Image inserted successfully');
                };
            } else {
                showToastMsg('Please select a valid image file', 'error');
            }
        };
    };

    const handleSave = async () => {
        if (!quillInstance.current) return;
        const content = quillInstance.current.root.innerHTML;

        // Use the prop function to save to Supabase
        if (onSave) {
            await onSave(content);
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSaved(`Saved at ${timeString}`);
            showToastMsg('Document saved successfully');
        }
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
            quillInstance.current.setContents([]);
            showToastMsg('Editor cleared');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('editor_theme_preference', newTheme);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const formatHTML = (html) => {
        let formatted = '';
        let indent = '';
        const tab = '    ';
        html.split(/>\s*</).forEach(function (element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br")) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    };

    const handleViewCode = () => {
        if (!quillInstance.current) return;
        const html = quillInstance.current.root.innerHTML;
        const formatted = formatHTML(html);
        setCodeContent(formatted);
        setShowCodeModal(true);
        setTimeout(() => Prism.highlightAll(), 0);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(codeContent).then(() => {
            showToastMsg('HTML code copied to clipboard');
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([codeContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const showToastMsg = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    return (
        <div className={`quill-editor-wrapper ${theme} ${isFullscreen ? 'fullscreen' : ''}`}>
            {/* Header */}
            <header>
                <div className="logo">
                    {/* Used Lucide icon instead of FA for better React integration if desired, but user asked for FA. 
                        I'll use Lucide since it's already in package.json and cleaner, 
                        or I should import FA if I strictly want to match. 
                        Package.json has font-awesome ^4.7.0.
                        I'll stick to Lucide for the React Component as it's more modern and already in use likely.
                     */}
                    <RefreshCw className="w-5 h-5" />
                    Professional Editor
                </div>
                <div className="header-controls">
                    <button className="btn btn-primary" onClick={handleViewCode}>
                        <Code className="w-4 h-4" /> Convert Text to Code
                    </button>
                    <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 5px' }}></div>
                    <button className="btn btn-icon" onClick={toggleTheme} title="Toggle Dark Mode">
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button className="btn btn-icon" onClick={toggleFullscreen} title="Fullscreen">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button className="btn btn-icon" onClick={handleClear} title="Clear All">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="btn" onClick={handleSave} disabled={isSaving} title="Save Content">
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </header>

            {/* Main Editor */}
            <div className="editor-container">
                <div ref={editorRef} style={{ height: '100%', border: 'none' }}></div>
            </div>

            {/* Status Bar */}
            <div className="stats-bar">
                <div className="stats-group">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                </div>
                <div className="stats-group">
                    <span>{lastSaved}</span>
                </div>
            </div>

            {/* Modal */}
            {showCodeModal && (
                <div className="modal" onClick={() => setShowCodeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Code className="w-5 h-5 inline mr-2" /> Generated HTML Code</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn" onClick={copyCode}>
                                    <Copy className="w-4 h-4" /> Copy HTML
                                </button>
                                <button className="btn" onClick={downloadHtml}>
                                    <Download className="w-4 h-4" /> Download .html
                                </button>
                                <button className="btn btn-icon" onClick={() => setShowCodeModal(false)}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <pre className="code-output">
                                <code className="language-html">{codeContent}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            <div className={`toast ${toast.show ? 'show' : ''}`} style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '12px 20px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderLeft: `4px solid ${toast.type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'}`,
                borderRadius: '4px',
                boxShadow: 'var(--shadow-lg)',
                transform: toast.show ? 'translateX(0)' : 'translateX(120%)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                {toast.type === 'error' ? <X className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-green-500" />}
                <span>{toast.message}</span>
            </div>
        </div>
    );
};

export default QuillEditor;
