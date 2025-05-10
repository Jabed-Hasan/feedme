"use client";

import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartConfig
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import React from "react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Hook to check if we're on a mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}

// Ensure components only render client-side
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  return isMounted;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, className, children }: ChartCardProps) {
  return (
    <Card className={`shadow-sm overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="pb-6">{children}</CardContent>
    </Card>
  );
}

// Define generic data type for charts
interface ChartDataItem {
  [key: string]: string | number;
}

// Bar Chart Component
interface BarChartProps {
  data: ChartDataItem[];
  xKey: string;
  yKeys: string[];
  height?: number;
  config?: ChartConfig;
}

export function DashboardBarChart({ data, xKey, yKeys, height = 300 }: BarChartProps) {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Ensure we have non-zero width for ResponsiveContainer
  useEffect(() => {
    if (isMounted) {
      setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      
      const handleResize = () => {
        setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMounted]);

  // Ensure data is valid with non-NaN values
  const validData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      const newItem = { ...item };
      // Ensure all yKeys have valid numbers or set to 0
      yKeys.forEach(key => {
        if (key in newItem && (newItem[key] === undefined || isNaN(Number(newItem[key])))) {
          newItem[key] = 0;
        }
      });
      // Ensure xKey is a string
      if (xKey in newItem) {
        newItem[xKey] = String(newItem[xKey]);
      }
      return newItem;
    });
  }, [data, xKey, yKeys]);

  return (
    <div style={{ width: '100%', height: height || 300 }}>
      {containerWidth > 0 && (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <BarChart 
            data={validData} 
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 15 : 30, 
              left: isMobile ? 15 : 20, 
              bottom: isMobile ? 60 : 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xKey} 
              fontSize={isMobile ? 10 : 12} 
              tickLine={false} 
              axisLine={false}
              height={isMobile ? 60 : 30}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              interval={isMobile ? 0 : "preserveStartEnd"}
            />
            <YAxis 
              fontSize={isMobile ? 10 : 12} 
              tickLine={false} 
              axisLine={false}
              width={isMobile ? 35 : 40} 
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-semibold">{label}</div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout={isMobile ? "vertical" : "horizontal"}
              align="center"
              verticalAlign="bottom" 
              wrapperStyle={{ paddingTop: isMobile ? 15 : 0 }}
            />
            {yKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={COLORS[index % COLORS.length]} 
                barSize={isMobile ? 15 : 20}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Line Chart Component
interface LineChartProps {
  data: ChartDataItem[];
  xKey: string;
  yKeys: string[];
  height?: number;
  config?: ChartConfig;
}

export function DashboardLineChart({ data, xKey, yKeys, height = 300 }: LineChartProps) {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [containerWidth, setContainerWidth] = useState(0);

  // Ensure we have non-zero width for ResponsiveContainer
  useEffect(() => {
    if (isMounted) {
      setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      
      const handleResize = () => {
        setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMounted]);

  // Ensure data is valid with non-NaN values
  const validData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      const newItem = { ...item };
      // Ensure all yKeys have valid numbers or set to 0
      yKeys.forEach(key => {
        if (key in newItem && (newItem[key] === undefined || isNaN(Number(newItem[key])))) {
          newItem[key] = 0;
        }
      });
      // Ensure xKey is a string
      if (xKey in newItem) {
        newItem[xKey] = String(newItem[xKey]);
      }
      return newItem;
    });
  }, [data, xKey, yKeys]);

  return (
    <div style={{ width: '100%', height: height || 300 }}>
      {containerWidth > 0 && (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <LineChart 
            data={validData} 
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 15 : 30, 
              left: isMobile ? 15 : 20, 
              bottom: isMobile ? 60 : 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xKey} 
              fontSize={isMobile ? 10 : 12} 
              tickLine={false} 
              axisLine={false}
              height={isMobile ? 60 : 30}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              interval={isMobile ? 0 : "preserveStartEnd"}
            />
            <YAxis 
              fontSize={isMobile ? 10 : 12} 
              tickLine={false} 
              axisLine={false}
              width={isMobile ? 35 : 40} 
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-semibold">{label}</div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout={isMobile ? "vertical" : "horizontal"}
              align="center"
              verticalAlign="bottom" 
              wrapperStyle={{ paddingTop: isMobile ? 15 : 0 }}
            />
            {yKeys.map((key, index) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={COLORS[index % COLORS.length]} 
                activeDot={{ r: isMobile ? 4 : 8 }} 
                strokeWidth={isMobile ? 1.5 : 2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Area Chart Component
interface AreaChartProps {
  data: ChartDataItem[];
  xKey: string;
  yKeys: string[];
  height?: number;
  config: ChartConfig;
}

export function DashboardAreaChart({ data, xKey, yKeys, config }: AreaChartProps) {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Ensure we have non-zero width for ResponsiveContainer
  useEffect(() => {
    if (isMounted) {
      setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      
      const handleResize = () => {
        setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMounted]);

  // Ensure data is valid with non-NaN values
  const validData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      const newItem = { ...item };
      // Ensure all yKeys have valid numbers or set to 0
      yKeys.forEach(key => {
        if (key in newItem && (newItem[key] === undefined || isNaN(Number(newItem[key])))) {
          newItem[key] = 0;
        }
      });
      // Ensure xKey is a string
      if (xKey in newItem) {
        newItem[xKey] = String(newItem[xKey]);
      }
      return newItem;
    });
  }, [data, xKey, yKeys]);

  return (
    <div style={{ width: '100%', height: 350 }}>
      {containerWidth > 0 && (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <AreaChart
            data={validData}
            margin={{ 
              top: isMobile ? 10 : 20, 
              right: isMobile ? 10 : 30, 
              left: isMobile ? 10 : 20, 
              bottom: isMobile ? 50 : 10 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xKey} 
              fontSize={isMobile ? 10 : 12} 
              tickLine={false} 
              axisLine={false}
              height={isMobile ? 50 : 30}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              interval={isMobile ? 0 : "preserveStartEnd"}
              tickFormatter={isMobile ? (value) => value.toString().slice(0, 3) : undefined}
            />
            <YAxis 
              fontSize={isMobile ? 10 : 12} 
              tickLine={false} 
              axisLine={false}
              width={isMobile ? 35 : 40} 
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-semibold">{label}</div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {yKeys.map((key, index) => {
              // Handle the label from config which might be a ReactNode
              const configLabel = config?.[key]?.label;
              // Create a string display name regardless of the config label type
              const displayName: string = 
                typeof configLabel === "string" 
                  ? configLabel 
                  : String(key);
                
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config?.[key]?.color || COLORS[index % COLORS.length]}
                  fill={config?.[key]?.color || COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                  name={displayName}
                  isAnimationActive={false}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Pie Chart Component
interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export function DashboardPieChart({ data, height = 300 }: PieChartProps) {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [containerWidth, setContainerWidth] = useState(0);

  // Ensure we have non-zero width for ResponsiveContainer
  useEffect(() => {
    if (isMounted) {
      setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      
      const handleResize = () => {
        setContainerWidth(window.innerWidth > 0 ? window.innerWidth : 300);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMounted]);

  // Ensure data is valid with non-NaN values
  const validData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      return {
        name: item.name || "Unknown",
        value: isNaN(Number(item.value)) ? 0 : Number(item.value)
      };
    });
  }, [data]);

  return (
    <div style={{ width: '100%', height: height || 300 }}>
      {containerWidth > 0 && (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <PieChart margin={{ 
            top: isMobile ? 5 : 10, 
            right: isMobile ? 5 : 10, 
            bottom: isMobile ? 20 : 10, 
            left: isMobile ? 5 : 10 
          }}>
            <Pie
              data={validData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isMobile ? '60%' : '80%'}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={false}
              label={({ name, percent }) => {
                if (isMobile) {
                  return `${(percent * 100).toFixed(0)}%`;
                }
                return `${name}: ${(percent * 100).toFixed(0)}%`;
              }}
            >
              {validData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-semibold">{payload[0].name}</div>
                      <div className="text-sm">Value: {payload[0].value}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout={isMobile ? "vertical" : "horizontal"}
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: isMobile ? 30 : 20 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 