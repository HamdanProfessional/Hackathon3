import { create } from 'zustand';
import type { Message, Conversation, ChatContext } from '@/types';
import { api } from '@/lib/api';
import { useUserStore } from './userStore';

interface ChatStore {
  // State
  messages: Message[];
  conversationId: string | null;
  isStreaming: boolean;
  currentStreamingMessage: string;
  isLoading: boolean;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string, context?: ChatContext) => Promise<void>;
  startStreaming: (agentType?: string) => void;
  appendStreamingChunk: (chunk: string) => void;
  endStreaming: () => void;
  clearMessages: () => void;
  setConversationId: (id: string) => void;
  setMessages: (messages: Message[]) => void;

  // Persistence actions
  loadConversation: (conversationId?: string) => Promise<void>;
  loadLatestConversation: () => Promise<void>;
  createNewConversation: () => Promise<void>;
  deleteCurrentConversation: () => Promise<void>;
  initialize: () => Promise<void>;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  messages: [],
  conversationId: null,
  isStreaming: false,
  currentStreamingMessage: '',
  isLoading: false,

  // Add a message
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  // Send a message (with streaming support and persistence)
  sendMessage: async (content: string, context?: ChatContext) => {
    const { messages = [], conversationId = null } = get() || {};
    const user = useUserStore.getState().user;

    // Ensure we have a conversation (create one synchronously if needed)
    let currentConversationId = conversationId;
    if (!currentConversationId && user) {
      // Create a new conversation and wait for it before proceeding
      try {
        const result = await api.createConversation(user.id);
        if (result.success && result.data) {
          currentConversationId = result.data.conversation_id;
          set({ conversationId: currentConversationId });
        }
      } catch (err) {
        console.debug('Failed to create conversation:', err);
        // Generate a temporary local conversation ID
        currentConversationId = `temp-${Date.now()}`;
      }
    }

    // Add user message locally
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, userMessage] }));

    // Try to persist user message to backend (non-blocking)
    if (currentConversationId && !currentConversationId.startsWith('temp-')) {
      api.sendMessage(currentConversationId, 'user', content).catch((err) => {
        console.debug('Failed to persist user message:', err);
      });
    }

    // Start streaming
    set({ isStreaming: true, currentStreamingMessage: '' });

    try {
      // Call the chat API route which will handle streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationId: currentConversationId,
          context,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                accumulatedResponse += parsed.chunk;
                set({ currentStreamingMessage: accumulatedResponse });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add the complete assistant message locally
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: accumulatedResponse,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isStreaming: false,
        currentStreamingMessage: '',
      }));

      // Try to persist assistant message to backend (non-blocking)
      if (currentConversationId) {
        api.sendMessage(currentConversationId, 'assistant', accumulatedResponse).catch((err) => {
          console.debug('Failed to persist assistant message:', err);
        });
      }
    } catch (error) {
      set({
        isStreaming: false,
        currentStreamingMessage: '',
      });
      // Add error message
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'system',
        content: 'Failed to get a response. Please try again.',
        timestamp: new Date().toISOString(),
      };
      set((state) => ({ messages: [...state.messages, errorMessage] }));
    }
  },

  // Start streaming (manual control)
  startStreaming: (agentType?: string) => {
    set({ isStreaming: true, currentStreamingMessage: '' });
  },

  // Append streaming chunk
  appendStreamingChunk: (chunk: string) => {
    set((state) => ({
      currentStreamingMessage: state.currentStreamingMessage + chunk,
    }));
  },

  // End streaming and add the message
  endStreaming: () => {
    const { currentStreamingMessage, messages } = get();
    if (currentStreamingMessage) {
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: currentStreamingMessage,
        timestamp: new Date().toISOString(),
      };
      set({
        messages: [...messages, assistantMessage],
        isStreaming: false,
        currentStreamingMessage: '',
      });
    } else {
      set({ isStreaming: false, currentStreamingMessage: '' });
    }
  },

  // Clear all messages (creates a new conversation)
  clearMessages: () => {
    const { conversationId } = get();
    if (conversationId) {
      // Delete the current conversation from backend
      api.deleteConversation(conversationId).catch((err) => {
        console.error('Failed to delete conversation:', err);
      });
    }
    set({ messages: [], conversationId: null });
  },

  // Set conversation ID
  setConversationId: (id: string) => {
    set({ conversationId: id });
  },

  // Set messages (for loading from history)
  setMessages: (messages: Message[]) => {
    set({ messages });
  },

  // Load a specific conversation
  loadConversation: async (conversationId?: string) => {
    const user = useUserStore.getState().user;
    if (!user) return;

    const targetId = conversationId || get().conversationId;
    if (!targetId) {
      // No conversation to load, try loading latest
      await get().loadLatestConversation();
      return;
    }

    set({ isLoading: true });

    try {
      const result = await api.getConversation(targetId);
      if (result.success && result.data) {
        const loadedMessages: Message[] = result.data.messages.map((m) => ({
          id: m.message_id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }));

        set({
          messages: loadedMessages,
          conversationId: result.data.conversation_id,
        });
      } else {
        console.error('Failed to load conversation:', result.error);
        // Start fresh with empty conversation if not found
        set({ messages: [], conversationId: targetId });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Start fresh with empty conversation on any error
      set({ messages: [], conversationId: targetId });
    } finally {
      set({ isLoading: false });
    }
  },

  // Load the latest conversation for the user
  loadLatestConversation: async () => {
    const user = useUserStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      const result = await api.listConversations(user.id, 1, 0);
      if (result.success && result.data && result.data.conversations.length > 0) {
        const latest = result.data.conversations[0];
        await get().loadConversation(latest.conversation_id);
      } else {
        // No conversations found, start fresh
        set({ messages: [], conversationId: null });
      }
    } catch (error) {
      // Service unavailable or error - start fresh without error
      console.warn('Chat service unavailable or error, starting with empty conversation');
      set({ messages: [], conversationId: null });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new conversation
  createNewConversation: async () => {
    const user = useUserStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      const result = await api.createConversation(user.id);
      if (result.success && result.data) {
        set({
          messages: [],
          conversationId: result.data.conversation_id,
        });
      } else {
        console.error('Failed to create conversation:', result.error);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete current conversation
  deleteCurrentConversation: async () => {
    const { conversationId } = get();
    if (conversationId) {
      try {
        await api.deleteConversation(conversationId);
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
    set({ messages: [], conversationId: null });
  },

  // Initialize chat (load latest conversation or create new)
  initialize: async () => {
    const user = useUserStore.getState().user;
    if (!user) return;

    await get().loadLatestConversation();
  },
}));

// Selectors
export const selectMessages = (state: ChatStore) => state.messages;
export const selectIsStreaming = (state: ChatStore) => state.isStreaming;
export const selectCurrentStreamingMessage = (state: ChatStore) => state.currentStreamingMessage;
export const selectConversationId = (state: ChatStore) => state.conversationId;
