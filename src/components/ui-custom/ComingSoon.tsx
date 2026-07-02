import { PageContainer } from './PageContainer';
import { PageHeader } from './PageHeader';
import { Card, CardContent } from '../ui/card';
import { Construction } from 'lucide-react';

export const ComingSoon = ({ title, description }: { title: string, description?: string }) => {
  return (
    <PageContainer>
      <PageHeader title={title} description={description || "This module is currently under development."} />
      <Card className="mt-8 border-dashed shadow-none bg-secondary/20">
        <CardContent className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <Construction className="h-8 w-8 text-muted-foreground opacity-60" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Under Construction</h2>
          <p className="text-muted-foreground max-w-[500px]">
            The {title} module is scheduled for development in an upcoming phase. Please check back later.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
