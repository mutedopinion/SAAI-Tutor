"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const chartData = [
  { month: "January", socratic: 186, fullAnswer: 80 },
  { month: "February", socratic: 305, fullAnswer: 200 },
  { month: "March", socratic: 237, fullAnswer: 120 },
  { month: "April", socratic: 73, fullAnswer: 190 },
  { month: "May", socratic: 209, fullAnswer: 130 },
  { month: "June", socratic: 214, fullAnswer: 140 },
];

const chartConfig = {
  socratic: {
    label: "Socratic Attempts",
    color: "hsl(var(--chart-1))",
  },
  fullAnswer: {
    label: "Full Answers",
    color: "hsl(var(--chart-2))",
  },
};

export function StudyTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Trends</CardTitle>
        <CardDescription>Socratic Attempts vs. Full Answers Unlocked</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="socratic"
              type="monotone"
              stroke="var(--color-socratic)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="fullAnswer"
              type="monotone"
              stroke="var(--color-fullAnswer)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
