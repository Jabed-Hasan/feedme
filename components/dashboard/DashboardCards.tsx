"use client";

import { Card, CardContent } from "@/components/ui/card";

interface CardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, description, icon, className }: CardProps) {
  return (
    <Card className={`rounded-lg shadow-sm overflow-hidden ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold">{value}</h3>
            {description && (
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
} 