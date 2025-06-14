import { useState } from "react";
import { CheckCircle2, Circle, Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Task = Tables<"tasks">;

interface DailyTasksProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

export const DailyTasks = ({ tasks, onTaskComplete }: DailyTasksProps) => {
  const [completingTasks, setCompletingTasks] = useState<string[]>([]);

  const handleTaskComplete = async (taskId: string) => {
    setCompletingTasks((prev) => [...prev, taskId]);
    setTimeout(() => {
      onTaskComplete(taskId);
      setCompletingTasks((prev) => prev.filter((id) => id !== taskId));
    }, 800);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Salud: "bg-green-100 text-green-800",
      Productividad: "bg-blue-100 text-blue-800",
      Aprendizaje: "bg-purple-100 text-purple-800",
      Bienestar: "bg-pink-100 text-pink-800",
      Ejercicio: "bg-red-100 text-red-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  if (tasks.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Trophy className="w-6 h-6 text-game-accent" />
            Misiones Diarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay tareas disponibles
            </h3>
            <p className="text-gray-500">
              Crea algunas tareas de ejemplo para comenzar tu aventura
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Trophy className="w-6 h-6 text-game-accent" />
          Misiones Diarias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        !task.completed && handleTaskComplete(task.id)
                      }
                      disabled={
                        task.completed || completingTasks.includes(task.id)
                      }
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle
                          className={`w-6 h-6 ${
                            completingTasks.includes(task.id)
                              ? "text-purple-600 animate-pulse"
                              : "text-gray-400 hover:text-purple-600"
                          }`}
                        />
                      )}
                    </Button>
                    <div>
                      <h3
                        className={`font-semibold ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-sm ${
                            task.completed ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-9">
                    <Badge className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-game-xp">
                      <Star className="w-4 h-4" />
                      {task.xp_reward} XP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
