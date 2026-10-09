import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  FileCode2, 
  BookOpen,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { KODE_GS_CODE, INDEX_HTML_CODE } from '../data/gasTemplates';

interface GasExportModalProps {
  onClose: () => void;
}

export const GasExportModal: React.FC<GasExportModalProps> = ({ onClose }) => {
  const [activeFile, setActiveFile] = useState<'kodegs' | 'indexhtml'>('kodegs');
  const [copied, setCopied] = useState(false);

  const kodeGsContent = KODE_GS_CODE.trim();
  const indexHtmlContent = INDEX_HTML_CODE.trim();

  const currentContent = activeFile === 'kodegs' ? kodeGsContent : indexHtmlContent;
  const currentFileName = activeFile === 'kodegs' ? 'Kode.gs' : 'Index.html';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-orange-400 shadow-2xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-blue-950">
                  Kode.gs &amp; Index.html (Google Apps Script Komplit)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  100% Siap Deploy
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Salin atau unduh kode lengkap ini untuk dipasang di script.google.com dengan database Google Sheets &amp; 10 Label F4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab File Selector & Actions */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setActiveFile('kodegs')}
              className={`px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeFile === 'kodegs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Kode.gs (Backend &amp; Sheets)</span>
            </button>
            <button
              onClick={() => setActiveFile('indexhtml')}
              className={`px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeFile === 'indexhtml'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Index.html (Web App &amp; Label F4)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : `Salin ${currentFileName}`}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas {currentFileName}</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="px-6 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Langkah Pasang di Google Spreadsheet:</strong> Buka Spreadsheet &gt; <strong>Ekstensi</strong> &gt; <strong>Apps Script</strong> &gt; Tempel <code>Kode.gs</code> &amp; Buat <code>Index.html</code> &gt; Klik <strong>Terapkan (Deploy)</strong> sebagai Aplikasi Web.
            </span>
          </div>
          <a
            href="https://script.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-blue-700 font-bold hover:underline shrink-0 text-xs"
          >
            <span>Buka Apps Script</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Code Viewport with Monospace */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>
            Kode komplit mencakup: Otentikasi Login (admin / admin123), Database 6 Sheet, Manajemen Multi-Sekolah, dan Cetak 10 Label F4 (Folio 215x330mm).
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
