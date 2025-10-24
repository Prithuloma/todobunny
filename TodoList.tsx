import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: "priority" | "normal" | "fun";
}

const FloatingHeart = ({ id }: { id: string }) => {
  return (
    <div
      key={id}
      className="fixed pointer-events-none text-4xl animate-float-up z-50"
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: "50%",
      }}
    >
      💖
    </div>
  );
};

export const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState<Task["category"]>("normal");
  const [hearts, setHearts] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        category,
      };
      setTasks([task, ...tasks]);
      setNewTask("");
      toast({
        title: "✨ Task added!",
        description: "You're doing amazing!",
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id && !task.completed) {
          // Show floating heart
          const heartId = `heart-${Date.now()}`;
          setHearts((prev) => [...prev, heartId]);
          setTimeout(() => {
            setHearts((prev) => prev.filter((h) => h !== heartId));
          }, 2000);

          toast({
            title: "🎉 Completed!",
            description: "You're such a star! Keep going!",
          });
        }
        return task.id === id ? { ...task, completed: !task.completed } : task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "🗑️ Task removed",
      description: "All clean!",
    });
  };

  const categoryColors = {
    priority: "bg-accent/30 border-accent hover:bg-accent/40",
    normal: "bg-secondary/50 border-secondary hover:bg-secondary/60",
    fun: "bg-primary/20 border-primary/30 hover:bg-primary/30",
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts */}
      {hearts.map((heartId) => (
        <FloatingHeart key={heartId} id={heartId} />
      ))}

      {/* Decorative sparkles */}
      <div className="absolute top-10 left-10 text-4xl animate-sparkle opacity-60">✨</div>
      <div className="absolute top-20 right-20 text-3xl animate-sparkle opacity-60" style={{ animationDelay: "0.5s" }}>
        ⭐
      </div>
      <div className="absolute bottom-20 left-20 text-3xl animate-sparkle opacity-60" style={{ animationDelay: "1s" }}>
        💫
      </div>
      <div className="absolute bottom-10 right-10 text-4xl animate-sparkle opacity-60" style={{ animationDelay: "1.5s" }}>
        ✨
      </div>

      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm shadow-2xl border-2 border-primary/20 animate-fade-in">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-pacifico text-primary flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8" />
              To-Do
              <Sparkles className="w-8 h-8" />
            </h1>
            <p className="text-muted-foreground text-sm">Organize your kingdom, one task at a time 👑</p>
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="What magical task shall we add? ✨"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="flex-1 bg-input border-2 border-primary/20 focus:border-primary rounded-full px-6 placeholder:text-muted-foreground/60"
              />
              <Button
                onClick={addTask}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
                size="icon"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Category Selection */}
            <div className="flex gap-2 justify-center">
              {(["priority", "normal", "fun"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat === "priority" && "⭐ Priority"}
                  {cat === "normal" && "✅ Normal"}
                  {cat === "fun" && "🎀 Fun"}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-2xl mb-2">🌸</p>
                <p>No tasks yet! Add something magical above ✨</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`${categoryColors[task.category]} border-2 rounded-2xl p-4 transition-all duration-300 animate-bounce-in ${
                    task.completed ? "opacity-60" : "hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={`flex-1 text-foreground font-medium ${
                        task.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                    <Button
                      onClick={() => deleteTask(task.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="pt-4 border-t-2 border-primary/20 text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              {completedCount} of {tasks.length} tasks completed
            </p>
            {completedCount === tasks.length && tasks.length > 0 && (
              <p className="text-primary font-medium text-sm animate-bounce-in">
                🎉 Amazing work! You completed everything! 🎉
              </p>
            )}
          </div>
        </div>
      </Card>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </div>
  );
};
