'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Wand2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { Exercise } from '@/types';

interface AssignmentGeneratorProps {
  onAssignmentCreated?: (exercise: Exercise) => void;
}

export default function AssignmentGenerator({ onAssignmentCreated }: AssignmentGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the assignment');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.generateTeacherAssignment(
        prompt,
        difficulty,
        topic || undefined,
        undefined // moduleId
      );

      if (response.success && response.data) {
        setGeneratedExercise(response.data.exercise);
        setSuccess('Assignment generated successfully!');
      } else {
        setError(response.error || 'Failed to generate assignment');
      }
    } catch (err) {
      setError('Network error: Failed to generate assignment');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAssignToClass = async () => {
    if (!generatedExercise) return;

    setIsAssigning(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock student IDs - in production, get from class roster
      const studentIds = ['1', '2', '3', '4', '5', '6', '7'];

      const response = await api.saveTeacherAssignment(
        generatedExercise.id,
        studentIds,
        `Custom assignment: ${prompt.slice(0, 50)}...`
      );

      if (response.success || response.data) {
        setSuccess(`Assignment assigned to ${studentIds.length} students!`);
        onAssignmentCreated?.(generatedExercise);
      } else {
        setError(response.error || 'Failed to assign exercise');
      }
    } catch (err) {
      setError('Network error: Failed to assign exercise');
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setTopic('');
    setGeneratedExercise(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-nebula-purple">
            <Wand2 className="h-5 w-5 text-cosmic-purple" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">AI Assignment Generator</h3>
            <p className="text-sm text-muted-foreground">Create custom exercises with AI</p>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-4 space-y-2">
          <label className="text-sm font-medium text-foreground">
            Describe the assignment you want to create
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create an exercise where students calculate the factorial of a number using recursion..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Topic (Optional) */}
        <div className="mb-4 space-y-2">
          <label className="text-sm font-medium text-foreground">
            Topic (Optional)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Recursion, Functions, Loops..."
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isGenerating}
          />
        </div>

        {/* Difficulty Selector */}
        <div className="mb-6 space-y-3">
          <label className="text-sm font-medium text-foreground">
            Difficulty Level
          </label>
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                disabled={isGenerating}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cosmic-purple to-nebula-blue px-6 py-3 font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Assignment
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-success/50 bg-success/10 p-4">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
          <div className="flex-1">
            <p className="text-sm font-medium text-success">Success</p>
            <p className="text-sm text-success/80">{success}</p>
          </div>
        </div>
      )}

      {/* Generated Exercise Preview */}
      {generatedExercise && (
        <div className="glass rounded-xl p-6 shadow-elevated space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-foreground">{generatedExercise.title}</h4>
              <div className="mt-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  generatedExercise.difficulty === 'beginner'
                    ? 'bg-green-500/20 text-green-400'
                    : generatedExercise.difficulty === 'intermediate'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {generatedExercise.difficulty}
                </span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                  {generatedExercise.points} points
                </span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Start Over
            </button>
          </div>

          <div className="rounded-lg bg-black/20 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">Description:</p>
            <p className="text-sm text-muted-foreground">{generatedExercise.description}</p>
          </div>

          <div className="rounded-lg bg-black/20 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">Instructions:</p>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
              {generatedExercise.instructions}
            </pre>
          </div>

          <div className="rounded-lg bg-black/20 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">Starter Code:</p>
            <pre className="overflow-x-auto text-sm text-code-green font-mono">
              {generatedExercise.starter_code}
            </pre>
          </div>

          <button
            onClick={handleAssignToClass}
            disabled={isAssigning}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-success to-emerald-600 px-6 py-3 font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Assign to Class
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
