import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, BrainCircuit, BarChart3 } from "lucide-react";

const stats = [
  {
    title: "Topics Covered",
    value: "24",
    icon: BookOpen,
    change: "+2 this week",
  },
  {
    title: "Hours Studied",
    value: "18.5",
    icon: Clock,
    change: "+5% from last week",
  },
  {
    title: "Socratic Attempts",
    value: "74",
    icon: BrainCircuit,
    change: "vs 19 Full Answers",
  },
  {
    title: "Weekly Streak",
    value: "6 days",
    icon: BarChart3,
    change: "Keep it up!",
  },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
