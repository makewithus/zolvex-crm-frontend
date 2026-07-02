export const FormGroup = ({ 
  label, 
  htmlFor, 
  error, 
  helpText, 
  required, 
  children 
}: { 
  label: string; 
  htmlFor?: string; 
  error?: string; 
  helpText?: string; 
  required?: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-destructive font-medium mt-1" role="alert">{error}</span>}
      {helpText && !error && <span className="text-xs text-muted-foreground mt-1">{helpText}</span>}
    </div>
  );
};
