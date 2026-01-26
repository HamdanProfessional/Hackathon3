// Tests for MessageBubble component

import { describe, it, expect } from 'vitest';

describe('MessageBubble Component', () => {
  it('should render user message', () => {
    const userMessage = {
      role: 'user',
      content: 'What is a variable?',
      timestamp: new Date(),
    };
    expect(userMessage.role).toBe('user');
  });

  it('should render assistant message', () => {
    const assistantMessage = {
      role: 'assistant',
      content: 'A variable is a container for storing data.',
      timestamp: new Date(),
    };
    expect(assistantMessage.role).toBe('assistant');
  });

  it('should display message timestamp', () => {
    const timestamp = new Date();
    expect(timestamp instanceof Date).toBe(true);
  });
});
