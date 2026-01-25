import { useState, FormEvent, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';

interface VoiceState {
  isSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  hasPermission: boolean | null;
}

// Icons
const MicIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4 0v.01" />
  </svg>
);

const MicOffIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1V5a1 1 0 011-1H15a1 1 0 011-1V9a1 1 0 01-1-1m0 0V5a2 2 0 012-2h2a2 2 0 012 2v6a1 1 0 01-1 1m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v6a1 1 0 01-1 1m0 0h6" />
  </svg>
);

const SendIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const StopIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6" />
  </svg>
);

const SpeakerIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828 9.9a5 5 0 010-7.072m0 0a5 5 0 010 7.072m-7.072 0a5 5 0 010-7.072m0 7.072a5 5 0 007.072 0" />
  </svg>
);

const SpeakerOffIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1H7a1 1 0 011-1v4a1 1 0 011 1h.586M15 7a3 3 0 11-6 0m6 0v6m-6 0a3 3 0 016 0m6 0a2 2 0 012 2" />
  </svg>
);

export default function ChatInput() {
  const [input, setInput] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const { sendMessage, isStreaming, messages } = useChatStore();
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Voice state
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isSupported: false,
    isListening: false,
    isSpeaking: false,
    hasPermission: null,
  });

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    setVoiceState(prev => ({
      ...prev,
      isSupported: !!SpeechRecognition && !!SpeechSynthesis,
    }));

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognition.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
    }

    synthesisRef.current = SpeechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Start voice input
  const startListening = async () => {
    if (!voiceState.isSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    // Check permission
    if (voiceState.hasPermission === false) {
      alert('Microphone access denied. Please enable it in your browser settings.');
      return;
    }

    try {
      await recognitionRef.current.start();
      setVoiceState(prev => ({ ...prev, isListening: true, hasPermission: true }));
    } catch (error: any) {
      if (error.name === 'not-allowed') {
        setVoiceState(prev => ({ ...prev, hasPermission: false }));
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      } else {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  // Stop voice input
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceState(prev => ({ ...prev, isListening: false }));
    }
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Speak the last assistant message
  const speakLastMessage = () => {
    if (!voiceState.isSupported || !synthesisRef.current) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // Find the last assistant message
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage) {
      return;
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event: any) => {
      console.error('Speech synthesis error:', event);
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };

    synthesisRef.current.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      const message = input;
      setInput('');
      setVoiceMode(false);
      await sendMessage(message);
    }
  };

  const handleQuickPrompt = (prompt: string) => () => {
    setInput(prompt);
    // Focus the input after setting the prompt
    setTimeout(() => {
      (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus();
    }, 100);
  };

  const isInputEmpty = !input.trim();

  return (
    <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm px-4 py-4">
      {/* Voice Control Bar */}
      {voiceMode && (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-muted/50 border border-border/50 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Voice Mode Active</span>
            {voiceState.isListening && (
              <span className="flex items-center gap-1.5 text-destructive animate-pulse">
                <span className="flex h-2 w-2 animate-ping rounded-full bg-destructive"></span>
                Listening...
              </span>
            )}
            {voiceState.isSpeaking && (
              <span className="flex items-center gap-1.5 text-cosmic-purple animate-pulse">
                <span className="flex h-2 w-2 animate-ping rounded-full bg-cosmic-purple"></span>
              Speaking...
              </span>
            )}
          </div>
          <Button
            onClick={() => setVoiceMode(false)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
        </div>
      )}

      {/* Voice Controls */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Voice Input Toggle */}
          {voiceState.isSupported && (
            <Button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isStreaming}
              variant={voiceState.isListening ? "destructive" : voiceMode ? "default" : "outline"}
              size="icon"
              className={`h-10 w-10 ${voiceState.isListening ? 'animate-pulse' : ''}`}
              title={voiceState.isListening ? 'Stop listening' : 'Start voice input'}
            >
              {voiceState.isListening ? <StopIcon /> : voiceMode ? <MicIcon /> : <MicOffIcon />}
            </Button>
          )}

          {/* Speak Last Response */}
          {voiceMode && voiceState.isSupported && messages.length > 0 && (
            <Button
              type="button"
              onClick={voiceState.isSpeaking ? stopSpeaking : speakLastMessage}
              disabled={isStreaming || !messages.some(m => m.role === 'assistant')}
              variant={voiceState.isSpeaking ? "destructive" : "outline"}
              size="icon"
              className="h-10 w-10"
              title={voiceState.isSpeaking ? 'Stop speaking' : 'Read last response aloud'}
            >
              {voiceState.isSpeaking ? <StopIcon /> : <SpeakerIcon />}
            </Button>
          )}

          {/* Enable Voice Mode Button */}
          {!voiceMode && voiceState.isSupported && (
            <Button
              type="button"
              onClick={() => setVoiceMode(true)}
              variant="outline"
              size="sm"
              className="border-cosmic-purple/30 hover:border-cosmic-purple/60 text-foreground hover:text-cosmic-purple"
            >
              <MicIcon />
              <span className="ml-2">Voice Mode</span>
            </Button>
          )}
        </div>

        {/* Status Indicators */}
        {voiceMode && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {voiceState.isListening && (
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                <span>Listening...</span>
              </span>
            )}
            {voiceState.isSpeaking && (
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-cosmic-purple animate-pulse" />
                <span>Speaking...</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Text Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              voiceMode && voiceState.isListening
                ? 'Listening...'
                : 'Ask about Python concepts, debug code, or get help...'
            }
            disabled={isStreaming}
            className={`w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-cosmic-purple focus:outline-none focus:ring-2 focus:ring-cosmic-purple/20 disabled:bg-muted/30 disabled:cursor-not-allowed transition-all ${
              voiceState.isListening ? 'border-destructive/50' : 'border-border/50'
            }`}
          />
          {voiceState.isListening && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex gap-0.5">
                <span className="flex h-1 w-0.5 bg-destructive animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="flex h-1 w-0.5 bg-destructive animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="flex h-1 w-0.5 bg-destructive animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={isInputEmpty || isStreaming}
          size="icon"
          className="h-10 w-10 gradient-nebula border-0 text-white hover-glow disabled:opacity-50"
        >
          <SendIcon />
        </Button>
      </form>

      {/* Quick Prompts */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>Try asking:</span>
        <button
          type="button"
          onClick={handleQuickPrompt('What is a variable in Python?')}
          className="rounded-full bg-muted/50 border border-border/50 px-3 py-1.5 hover:bg-muted/80 hover:border-cosmic-purple/30 transition-all"
          disabled={isStreaming}
        >
          What is a variable?
        </button>
        <button
          type="button"
          onClick={handleQuickPrompt('How do I write a for loop in Python?')}
          className="rounded-full bg-muted/50 border border-border/50 px-3 py-1.5 hover:bg-muted/80 hover:border-cosmic-purple/30 transition-all"
          disabled={isStreaming}
        >
          For loops
        </button>
        <button
          type="button"
          onClick={handleQuickPrompt('Explain functions in Python with examples')}
          className="rounded-full bg-muted/50 border border-border/50 px-3 py-1.5 hover:bg-muted/80 hover:border-cosmic-purple/30 transition-all"
          disabled={isStreaming}
        >
          Functions
        </button>
        <button
          type="button"
          onClick={handleQuickPrompt("Debug this error: NameError: name 'x' is not defined")}
          className="rounded-full bg-muted/50 border border-border/50 px-3 py-1.5 hover:bg-muted/80 hover:border-cosmic-purple/30 transition-all"
          disabled={isStreaming}
        >
          Debug Error
        </button>
      </div>
    </div>
  );
}
