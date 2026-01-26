'use client';

import { useState } from 'react';
import { Wand2, Sparkles, Loader2, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

const modules = [
  { id: 'python-basics', name: 'Python Basics', icon: 'Py' },
  { id: 'control-flow', name: 'Control Flow', icon: 'CF' },
  { id: 'functions', name: 'Functions', icon: 'Fn' },
  { id: 'data-structures', name: 'Data Structures', icon: 'DS' },
  { id: 'file-operations', name: 'File Operations', icon: 'FO' },
  { id: 'error-handling', name: 'Error Handling', icon: 'EH' },
  { id: 'oop', name: 'Object-Oriented Programming', icon: 'OOP' },
  { id: 'advanced-python', name: 'Advanced Python', icon: 'Adv' },
];

const difficulties = [
  { value: 'beginner', label: 'Beginner', color: 'bg-success/20 text-success border-success/30' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-warning/20 text-warning border-warning/30' },
  { value: 'advanced', label: 'Advanced', color: 'bg-destructive/20 text-destructive border-destructive/30' },
];

interface ExerciseGeneratorProps {
  studentId?: string;
  studentName?: string;
  onGenerated?: (exerciseId: string) => void;
}

export default function ExerciseGenerator({ studentId, studentName, onGenerated }: ExerciseGeneratorProps) {
  const [selectedModule, setSelectedModule] = useState('python-basics');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; exerciseId?: string; message?: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      // Generate exercise
      const genResponse = await api.generateExerciseForStudent(
        studentId || 'mock-student-id',
        selectedModule,
        selectedDifficulty,
        customTopic || undefined
      );

      if (genResponse.success && genResponse.data) {
        // Assign exercise to student
        const assignResponse = await api.assignExerciseToStudent(
          studentId || 'mock-student-id',
          genResponse.data.exercise.id || 'generated-exercise-id',
          `Custom exercise: ${selectedModule} - ${selectedDifficulty}`
        );

        if (assignResponse.success) {
          setResult({
            success: true,
            exerciseId: genResponse.data.exercise.id,
            message: `Exercise generated and assigned to ${studentName || 'student'}!`,
          });
          if (onGenerated && genResponse.data.exercise.id) {
            onGenerated(genResponse.data.exercise.id);
          }
        } else {
          setResult({
            success: false,
            message: assignResponse.error || 'Failed to assign exercise',
          });
        }
      } else {
        setResult({
          success: false,
          message: genResponse.error || 'Failed to generate exercise',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-cosmic-purple/30 bg-card/80 backdrop-blur-sm shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg icon-nebula-purple">
            <Wand2 className="h-4 w-4 text-cosmic-purple" />
          </div>
          Generate Custom Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Module Selection */}
        <div className="space-y-2">
          <Label htmlFor="module" className="text-foreground font-medium">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Module
            </span>
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                  selectedModule === module.id
                    ? 'border-cosmic-purple bg-cosmic-purple/20 text-cosmic-purple'
                    : 'border-border bg-muted/50 text-muted-foreground hover:border-cosmic-purple/50'
                }`}
              >
                <span className="text-lg">{module.icon}</span>
                <span className="block mt-1">{module.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-foreground font-medium">
            Difficulty Level
          </Label>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value as any)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedDifficulty === diff.value
                    ? diff.color + ' border-current'
                    : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Topic (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-foreground font-medium">
            Custom Topic <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <input
            id="topic"
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="e.g., For loops with lists"
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-cosmic-purple focus:outline-none focus:ring-2 focus:ring-cosmic-purple/20"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedModule}
          variant="cosmic"
          className="w-full"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Exercise
            </span>
          )}
        </Button>

        {/* Result Message */}
        {result && (
          <div
            className={`rounded-lg p-3 text-sm ${
              result.success
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-destructive/20 text-destructive border border-destructive/30'
            }`}
          >
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
