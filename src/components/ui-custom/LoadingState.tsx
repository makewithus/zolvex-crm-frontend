export const LoadingState = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
      <p className="text-sm animate-pulse">{text}</p>
    </div>
  );
};
