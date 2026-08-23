import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, User, Target, Calendar, FileText } from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';

export const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isFetching } = useGlobalSearch(debouncedQuery);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const hasResults = results && (
    results.customers.length > 0 ||
    results.leads.length > 0 ||
    results.bookings.length > 0 ||
    results.invoices.length > 0
  );

  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    <div className="hidden md:flex items-center relative mr-2" ref={containerRef}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <input 
        id="global-search-input"
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search CRM (Ctrl+K)..." 
        className="h-8 w-64 rounded-md border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all"
        autoComplete="off"
        spellCheck="false"
      />
      {isFetching && (
        <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 animate-spin" />
      )}

      {showDropdown && (
        <div className="absolute top-10 left-0 w-80 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden z-50 flex flex-col max-h-[70vh]">
          {!isFetching && !hasResults ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="overflow-y-auto p-2 space-y-3">
              
              {results?.customers.length ? (
                <div>
                  <h4 className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Customers</h4>
                  {results.customers.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => handleSelect(`/customers/${c.id}`)}
                      className="flex flex-col px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-purple-500" />
                        <span className="text-sm font-medium text-slate-900 truncate">{c.name || 'Unknown'}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 pl-5.5 ml-1.5">{c.phone}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {results?.leads.length ? (
                <div>
                  <h4 className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Leads</h4>
                  {results.leads.map(l => (
                    <div 
                      key={l.id} 
                      onClick={() => handleSelect(`/leads/${l.id}`)}
                      className="flex flex-col px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Target className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-900 truncate">{l.name || 'Unknown'}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{l.status}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 pl-5.5 ml-1.5">{l.phone}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {results?.bookings.length ? (
                <div>
                  <h4 className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Bookings</h4>
                  {results.bookings.map(b => (
                    <div 
                      key={b.id} 
                      onClick={() => handleSelect(`/bookings/${b.id}`)}
                      className="flex flex-col px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-900 truncate">{b.booking_id}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{b.status}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 pl-5.5 ml-1.5">{b.customer_name}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {results?.invoices.length ? (
                <div>
                  <h4 className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Invoices</h4>
                  {results.invoices.map(i => (
                    <div 
                      key={i.id} 
                      onClick={() => handleSelect(`/invoices/${i.id}`)}
                      className="flex flex-col px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-900 truncate">{i.invoice_number}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{i.status}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 pl-5.5 ml-1.5">{i.customer_name}</span>
                    </div>
                  ))}
                </div>
              ) : null}

            </div>
          )}
        </div>
      )}
    </div>
  );
};
