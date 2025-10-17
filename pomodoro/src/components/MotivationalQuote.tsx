import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey",
  },
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 border-2 shadow-lg">
      <div className="flex flex-col space-y-4">
        <Quote className="h-8 w-8 text-primary/60" />
        <blockquote className="text-lg font-medium leading-relaxed">
          "{quote.text}"
        </blockquote>
        <cite className="text-sm text-muted-foreground not-italic">
          — {quote.author}
        </cite>
      </div>
    </Card>
  );
};

export default MotivationalQuote;
