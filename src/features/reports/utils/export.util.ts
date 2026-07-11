import { apiClient } from '@/lib/axios';

export const downloadReport = async (domain: string, format: 'csv' | 'pdf', filters?: Record<string, any>) => {
  try {
    const params = { ...filters, format };
    const response = await apiClient.get(`/reports/export/${domain}`, {
      params,
      responseType: 'blob', // Important for handling binary data (PDF/CSV)
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set the filename based on headers or fallback
    const contentDisposition = response.headers['content-disposition'];
    let filename = `${domain}_report.${format}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
