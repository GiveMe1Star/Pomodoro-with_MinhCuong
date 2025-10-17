import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, Clock, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Fetch last 14 days of stats
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const { data: statsData } = await supabase
        .from("daily_stats")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", fourteenDaysAgo.toISOString().split("T")[0])
        .order("date", { ascending: true });

      setDailyStats(statsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = dailyStats.map((stat) => ({
    date: new Date(stat.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    minutes: stat.total_minutes,
    sessions: stat.sessions_count,
  }));

  const avgFocusTime = dailyStats.length > 0
    ? Math.round(dailyStats.reduce((acc, stat) => acc + stat.total_minutes, 0) / dailyStats.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Timer
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Analytics
            </h1>
            <div className="w-24" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{profile?.total_sessions || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold">
                    {Math.floor((profile?.total_minutes || 0) / 60)}h{" "}
                    {(profile?.total_minutes || 0) % 60}m
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{profile?.current_streak || 0} days</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-2xl font-bold">{profile?.longest_streak || 0} days</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">14-Day Focus Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Average Focus Time</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">{avgFocusTime}</span>
                <span className="text-muted-foreground">minutes/day</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on the last 14 days
              </p>
            </Card>

            <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">This Week</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessions:</span>
                  <span className="font-semibold">
                    {dailyStats.slice(-7).reduce((acc, stat) => acc + stat.sessions_count, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span className="font-semibold">
                    {Math.floor(
                      dailyStats.slice(-7).reduce((acc, stat) => acc + stat.total_minutes, 0) / 60
                    )}
                    h
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
