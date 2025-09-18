import { StatsGrid } from "@/components/dashboard/stats-grid";
import { StudyTrendsChart } from "@/components/dashboard/study-trends-chart";
import { SubjectDistributionChart } from "@/components/dashboard/subject-distribution-chart";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline">Progress Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <StatsGrid />
        <Separator />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
                <StudyTrendsChart />
            </div>
            <div className="lg:col-span-3">
                <SubjectDistributionChart />
            </div>
        </div>
      </main>
    </div>
  );
}
