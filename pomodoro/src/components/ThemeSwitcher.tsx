import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: "pastel", name: "Pastel", color: "hsl(340, 82%, 67%)" },
  { id: "dark", name: "Dark", color: "hsl(217, 91%, 60%)" },
  { id: "ocean", name: "Ocean", color: "hsl(180, 70%, 45%)" },
  { id: "forest", name: "Forest", color: "hsl(140, 50%, 45%)" },
  { id: "minimal", name: "Minimal", color: "hsl(0, 0%, 20%)" },
];

const ThemeSwitcher = ({ currentTheme, onThemeChange }: ThemeSwitcherProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-border"
              style={{ backgroundColor: theme.color }}
            />
            <span className={currentTheme === theme.id ? "font-semibold" : ""}>
              {theme.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
