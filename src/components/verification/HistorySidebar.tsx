import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiClock, HiTrash, HiMenu, HiX } from 'react-icons/hi';
import { SearchHistory, SearchHistoryItem } from './History';

interface HistoryProps {
    history: SearchHistoryItem[];
    setHistory: (history: SearchHistoryItem[]) => void;
}
export const HistorySidebar: React.FC<HistoryProps> = ({history, setHistory}) => {
    // const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isOpen, setIsOpen] = useState(!isMobile);

    useEffect(() => {
        loadHistory();

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadHistory = () => {
        setHistory(SearchHistory.getHistory());
    };

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear your search history?')) {
            SearchHistory.clearHistory();
            setHistory([]);
        }
    };

    const getDatasetColor = (dataset: string): string => {
        switch (dataset.toLowerCase()) {
            case 'factbench':
                return 'blue';
            case 'dbpedia':
                return 'gray';
            default:
                return 'red';
        }
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <HiClock className="w-5 h-5 text-gray-600" />
                        Search History
                    </h2>
                    {isMobile && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Back to Search Button */}
            <div className="p-4">
                <Link to="/">
                    <Button color="gray" className="w-full">
                        <div className="inline-flex items-center justify-center">
                            <HiArrowLeft className="w-4 h-4" />
                            <span className="ml-2">Back to Search</span>
                        </div>
                    </Button>
                </Link>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {history.length === 0 ? (
                    <div className="text-center py-8">
                        <HiClock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 text-sm">No search history yet</p>
                    </div>
                ) : (
                    history.map((item, index) => (
                        <Link
                            key={index}
                            to={`/results?search=${encodeURIComponent(item.searchTerm)}&dataset=${encodeURIComponent(item.dataset)}`}
                            className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="p-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                    {item.humanReadable || item.searchTerm}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Badge color={getDatasetColor(item.dataset)}>
                                        {item.dataset}
                                    </Badge>
                                    <span className="mx-2">•</span>
                                    <span>{SearchHistory.formatDate(item.timestamp)}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Clear History Button */}
            <div className="p-4 border-t bg-gray-50 mt-auto">
                <Button color="failure" onClick={clearHistory} className="w-full">
                    <div className="inline-flex items-center justify-center">
                        <HiTrash className="w-4 h-4" />
                        <span className="ml-2">Clear History</span>
                    </div>
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 group"
                    aria-label="Open sidebar"
                >
                    <div className="relative">
                        <HiMenu className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                        {history.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {history.length}
                            </span>
                        )}
                    </div>
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    w-64 bg-white border-r h-screen flex flex-col
                    fixed md:sticky top-0 z-40 shadow-xl md:shadow-none
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};