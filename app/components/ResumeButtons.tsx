'use client';

import { useState } from 'react';

export default function ResumeButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'da'>('en');

  const resumeUrls = {
    en: '/resume-en.pdf',
    da: '/resume-da.pdf',
  };

  const openModal = (lang: 'en' | 'da') => {
    setLanguage(lang);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Resume Buttons */}
      <div className="flex gap-3 justify-center items-center flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => openModal('en')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            View Resume (EN)
          </button>
          <button
            onClick={() => openModal('da')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            View Resume (DA)
          </button>
        </div>
        <div className="flex gap-2">
          <a
            href={resumeUrls.en}
            download="Bertram_Bregnhoj_Resume_EN.pdf"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 rounded-lg font-medium transition-colors text-sm"
          >
            Download (EN)
          </a>
          <a
            href={resumeUrls.da}
            download="Bertram_Bregnhoj_Resume_DA.pdf"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 rounded-lg font-medium transition-colors text-sm"
          >
            Download (DA)
          </a>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('da')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    language === 'da'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Dansk
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl font-bold px-3"
              >
                ×
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={resumeUrls[language]}
                className="w-full h-full"
                title="Resume"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <a
                href={resumeUrls[language]}
                download={`Bertram_Bregnhoj_Resume_${language.toUpperCase()}.pdf`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Download
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-slate-500 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
