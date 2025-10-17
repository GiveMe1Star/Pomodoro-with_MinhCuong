import { useState, useEffect } from "react";
import PomodoroTimer from "@/components/PomodoroTimer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import MotivationalQuote from "@/components/MotivationalQuote";
import SessionStats from "@/components/SessionStats";
import MusicPlayer from "@/components/MusicPlayer";
import UserMenu from "@/components/UserMenu";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Index = () => {
  const [theme, setTheme] = useState("pastel");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("studyTheme") || "pastel";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      checkAndUpdateStreak(data);
    }
  };

  const checkAndUpdateStreak = async (currentProfile: any) => {
    if (!currentProfile) return;

    const today = new Date().toISOString().split("T")[0];
    const lastActive = currentProfile.last_active;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newStreak = currentProfile.current_streak;
      if (lastActive === yesterdayStr) {
        // Continue streak
        newStreak += 1;
      } else {
        // Reset streak
        newStreak = 0;
      }

      await supabase
        .from("profiles")
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, currentProfile.longest_streak),
          last_active: today,
        })
        .eq("id", currentProfile.id);

      fetchProfile();
    }
  };

  const applyTheme = (themeName: string) => {
    document.documentElement.className = "";
    if (themeName !== "pastel") {
      document.documentElement.classList.add(`theme-${themeName}`);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("studyTheme", newTheme);
    applyTheme(newTheme);
  };

  const handleSessionComplete = async (minutes: number) => {
    if (!profile) return;

    // Update profile stats
    await supabase
      .from("profiles")
      .update({
        total_sessions: profile.total_sessions + 1,
        total_minutes: profile.total_minutes + minutes,
        current_streak: profile.current_streak + 1,
        longest_streak: Math.max(
          profile.current_streak + 1,
          profile.longest_streak
        ),
        last_active: new Date().toISOString().split("T")[0],
      })
      .eq("id", profile.id);

    // Log session
    await supabase.from("sessions").insert({
      user_id: profile.id,
      duration_minutes: minutes,
      session_type: "focus",
    });

    // Update daily stats
    const today = new Date().toISOString().split("T")[0];
    const { data: existingStat } = await supabase
      .from("daily_stats")
      .select("*")
      .eq("user_id", profile.id)
      .eq("date", today)
      .single();

    if (existingStat) {
      await supabase
        .from("daily_stats")
        .update({
          sessions_count: existingStat.sessions_count + 1,
          total_minutes: existingStat.total_minutes + minutes,
        })
        .eq("id", existingStat.id);
    } else {
      await supabase.from("daily_stats").insert({
        user_id: profile.id,
        date: today,
        sessions_count: 1,
        total_minutes: minutes,
      });
    }

    // Refresh profile
    fetchProfile();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 transition-all duration-500">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Study with Minh Cuong
              </h1>
            </motion.div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Stats & Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <MotivationalQuote />
              {profile && (
                <SessionStats
                  sessionsCompleted={profile.total_sessions || 0}
                  totalMinutes={profile.total_minutes || 0}
                  currentStreak={profile.current_streak || 0}
                />
              )}
            </motion.div>

            {/* Center Column - Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <PomodoroTimer onSessionComplete={handleSessionComplete} />
            </motion.div>

            {/* Right Column - Music Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MusicPlayer />
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Focus on what matters. Build better habits. ✨
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
