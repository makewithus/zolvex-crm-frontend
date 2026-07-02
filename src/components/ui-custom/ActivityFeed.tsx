export const ActivityFeed = ({ activities }: { activities: { id: string; user: string; action: string; time: string }[] }) => {
  return (
    <div className="space-y-4">
      {activities.map((item) => (
        <div key={item.id} className="flex items-start space-x-3 text-sm">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground uppercase">
            {item.user.charAt(0)}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm text-foreground">
              <span className="font-medium">{item.user}</span> {item.action}
            </p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
