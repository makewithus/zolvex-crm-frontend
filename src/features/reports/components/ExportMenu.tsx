import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { downloadReport } from '../utils/export.util';

export const ExportMenu = ({ domain, filters }: { domain: string; filters?: Record<string, any> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setLoadingFormat(format);
    try {
      await downloadReport(domain, format, filters);
      setIsOpen(false);
    } catch (err) {
      alert(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setLoadingFormat(null);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-slate-200 rounded hover:bg-gray-50 focus:outline-none focus:border-slate-400 focus:ring-0 shadow-none transition-colors"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded shadow-none outline-none">
            <div className="py-1">
              <button
                onClick={() => handleExport('csv')}
                disabled={loadingFormat !== null}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                {loadingFormat === 'csv' ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : <FileSpreadsheet className="w-4 h-4 text-slate-600" />}
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={loadingFormat !== null}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                {loadingFormat === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : <FileText className="w-4 h-4 text-slate-600" />}
                Export as PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
