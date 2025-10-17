import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PomodoroTimerProps {
  onSessionComplete: (minutes: number) => void;
}

const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const playNotificationSound = () => {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotificationSound();

    if (!isBreak) {
      onSessionComplete(focusMinutes);
      toast.success("🎉 Focus session complete!", {
        description: `Great work! You've completed ${focusMinutes} minutes of focused study. Time for a break!`,
        duration: 5000,
      });
      setIsBreak(true);
      setTimeLeft(breakMinutes * 60);
    } else {
      toast.success("✨ Break time over!", {
        description: "Feeling refreshed? Ready to focus again?",
        duration: 5000,
      });
      setIsBreak(false);
      setTimeLeft(focusMinutes * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      toast.info(isBreak ? "Break time started" : "Focus mode activated!", {
        description: isBreak ? "Relax and recharge" : "Let's get things done!",
      });
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(focusMinutes * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
    toast.info("Timer reset");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100
    : ((focusMinutes * 60 - timeLeft) / (focusMinutes * 60)) * 100;

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="p-8 backdrop-blur-lg bg-card/80 border-2 shadow-xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Timer Circle */}
        <div className="relative w-80 h-80">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
              className="opacity-30"
            />
            {/* Progress circle */}
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer Display */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            <div className="text-6xl font-bold text-timer-text">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg text-muted-foreground mt-2">
              {isBreak ? "Break Time 🌟" : "Focus Time 🎯"}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={toggleTimer}
              className="w-32 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </>
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </motion.div>
        </div>

        {/* Settings */}
        <div className="w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            Timer Settings
          </Button>

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Focus Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={focusMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 25;
                    setFocusMinutes(val);
                    if (!isBreak && !isActive) setTimeLeft(val * 60);
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 5;
                    setBreakMinutes(val);
                    if (isBreak && !isActive) setTimeLeft(val * 60);
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default PomodoroTimer;
