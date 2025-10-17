import { Card } from "@/components/ui/card";
import { Clock, Target, Flame } from "lucide-react";

interface SessionStatsProps {
  sessionsCompleted: number;
  totalMinutes: number;
  currentStreak: number;
}

const SessionStats = ({
  sessionsCompleted,
  totalMinutes,
  currentStreak,
}: SessionStatsProps) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const stats = [
    {
      icon: Target,
      label: "Sessions",
      value: sessionsCompleted,
      color: "text-primary",
    },
    {
      icon: Clock,
      label: "Total Time",
      value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      color: "text-secondary",
    },
    {
      icon: Flame,
      label: "Streak",
      value: currentStreak,
      color: "text-accent",
    },
  ];

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-all hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className="font-medium">{stat.label}</span>
              </div>
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SessionStats;
