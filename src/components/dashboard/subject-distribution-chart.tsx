"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { subject: "Math", hours: 8, fill: "var(--color-math)" },
  { subject: "Science", hours: 6, fill: "var(--color-science)" },
  { subject: "History", hours: 2, fill: "var(--color-history)" },
  { subject: "Language", hours: 2.5, fill: "var(--color-language)" },
];

const chartConfig = {
  hours: {
    label: "Hours",
  },
  math: {
    label: "Math",
    color: "hsl(var(--chart-1))",
  },
  science: {
    label: "Science",
    color: "hsl(var(--chart-2))",
  },
  history: {
    label: "History",
    color: "hsl(var(--chart-3))",
  },
  language: {
    label: "Language",
    color: "hsl(var(--chart-4))",
  },
};

export function SubjectDistributionChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Subject Distribution</CardTitle>
        <CardDescription>Distribution of hours studied by subject.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="hours" nameKey="subject" innerRadius={60} />
            <ChartLegend content={<ChartLegendContent nameKey="subject" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Science is your most studied subject this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total hours studied for the last 30 days.
        </div>
      </CardFooter>
    </Card>
  );
}
