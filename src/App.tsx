import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          classNames: {
            toast: 'font-sans text-[13px] rounded border border-slate-200 shadow-none bg-white text-slate-900',
            success: '!bg-slate-950 !text-white !border-slate-900',
            error: '!bg-red-50 !text-red-700 !border-red-100',
            info: '!bg-slate-50 !text-slate-700 !border-slate-100',
          }
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
