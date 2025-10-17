import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Music, Volume2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const musicPresets = [
  {
    name: "Lo-Fi Study Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    emoji: "🎧",
  },
  {
    name: "Rain Sounds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    emoji: "🌧️",
  },
  {
    name: "Cafe Ambience",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    emoji: "☕",
  },
  {
    name: "White Noise",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    emoji: "🌊",
  },
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [customUrl, setCustomUrl] = useState("");
  const [currentTrack, setCurrentTrack] = useState(musicPresets[0]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const loadTrack = (track: typeof musicPresets[0] | { name: string; url: string; emoji: string }) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.url;
      audioRef.current.load();
    } else {
      audioRef.current = new Audio(track.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume[0] / 100;
    }
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume[0] / 100;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        toast.success(`Playing: ${currentTrack.name}`);
      }
    } catch (error) {
      toast.error("Failed to play audio. Please try another track.");
      console.error("Audio playback error:", error);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const handleCustomUrl = () => {
    if (!customUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    loadTrack({
      name: "Custom Track",
      url: customUrl,
      emoji: "🎵",
    });

    toast.success("Custom track loaded!");
    setShowCustomInput(false);
    setCustomUrl("");
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Music className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Focus Music</h3>
        </div>

        {/* Current Track Display */}
        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            className="text-6xl"
          >
            {currentTrack.emoji}
          </motion.div>
          <div className="text-center px-4">
            <div className="font-medium">{currentTrack.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {isPlaying ? "Now Playing" : "Paused"}
            </div>
          </div>
        </div>

        {/* Music Presets */}
        <div className="grid grid-cols-2 gap-2">
          {musicPresets.map((preset, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={currentTrack.name === preset.name ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => loadTrack(preset)}
              >
                <span className="mr-2">{preset.emoji}</span>
                <span className="text-xs truncate">{preset.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Custom URL Input */}
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Input
              type="url"
              placeholder="Paste audio URL (.mp3, .ogg)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomUrl()}
            />
            <Button onClick={handleCustomUrl} size="sm" className="w-full">
              Load Custom Track
            </Button>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          {showCustomInput ? "Hide" : "Add Custom URL"}
        </Button>

        {/* Play Controls */}
        <div className="flex flex-col items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={togglePlay}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause Music
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Play Music
                </>
              )}
            </Button>
          </motion.div>

          {/* Volume Control */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              <span>Volume: {volume[0]}%</span>
            </div>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Music Info */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg">
          💡 Tip: Play ambient music to enhance focus and productivity
        </div>
      </motion.div>
    </Card>
  );
};

export default MusicPlayer;
