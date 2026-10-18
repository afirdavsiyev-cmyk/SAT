import React, { useState } from 'react';
import { BOOKS_LIBRARY, BookItem } from '../../data/booksData';
import { BookOpen, Download, X } from 'lucide-react';

export const SatBooksLibraryView: React.FC = () => {
  const [selectedBookModal, setSelectedBookModal] = useState<BookItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">SAT Math Digital Library</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Official textbooks, College Board question banks, and masterclass prep manuals.</p>
        </div>
        <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
          {BOOKS_LIBRARY.length} Textbooks Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BOOKS_LIBRARY.map((book) => {
          const encodedUrl = encodeURI(book.fileUrl);
          return (
            <div
              key={book.id}
              className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-400 dark:hover:border-emerald-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                    book.category === 'Practice'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/60'
                      : book.category === 'Strategy'
                      ? 'text-teal-700 bg-teal-50 border-teal-200 dark:text-teal-400 dark:bg-teal-950/50 dark:border-teal-800/60'
                      : 'text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/60'
                  }`}>
                    {book.category}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{book.tag}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">{book.author}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                {/* In-App Reading Button */}
                <button
                  onClick={() => setSelectedBookModal(book)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read in App</span>
                </button>

                {/* Download / Open New Tab Button */}
                <a
                  href={encodedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full py-2 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/40 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Download / New Tab</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frosted Glass In-App PDF Reader Modal */}
      {selectedBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-emerald-500/20 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{selectedBookModal.title}</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">Author: {selectedBookModal.author}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={encodeURI(selectedBookModal.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={() => setSelectedBookModal(null)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body iframe */}
            <div className="flex-1 p-2 sm:p-4 bg-slate-100 dark:bg-slate-950">
              <iframe
                src={encodeURI(selectedBookModal.fileUrl)}
                title={selectedBookModal.title}
                className="w-full h-[70vh] rounded-2xl border border-slate-300 dark:border-slate-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatBooksLibraryView;
