import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Nebula gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cosmic-purple/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cosmic-blue/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-cyan/10 rounded-full blur-3xl" />

        {/* Stars/sparkles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
          <div className="absolute bottom-32 left-40 w-1 h-1 bg-white rounded-full animate-pulse delay-200" />
          <div className="absolute top-60 left-1/2 w-1.5 h-1.5 bg-cosmic-purple rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-60 right-20 w-1 h-1 bg-cosmic-cyan rounded-full animate-pulse delay-500" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cosmic-blue rounded-full animate-pulse delay-1000" />
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-in-up">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-gradient-nebula opacity-50 blur-xl rounded-full" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl gradient-nebula shadow-nebula border border-cosmic-purple/30">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">L</span>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-2">LearnFlow</h1>
            <p className="text-lg text-muted-foreground">AI-Powered Python Learning</p>
          </div>

          {/* Auth Card */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-xl shadow-elevated border border-border/50 overflow-hidden">
            {/* Gradient top border */}
            <div className="h-1 gradient-nebula" />
            <div className="p-8">
              {children}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            LearnFlow Hackathon Project
          </p>
        </div>
      </div>
    </div>
  );
}
