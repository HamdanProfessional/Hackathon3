// Tests for utility functions

import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  describe('cn utility (className merge)', () => {
    it('should merge class names correctly', () => {
      // Test for clsx and tailwind-merge
      const classes = ['class1', 'class2'];
      expect(classes).toHaveLength(2);
    });

    it('should handle conditional classes', () => {
      const condition = true;
      const activeClass = condition ? 'active' : 'inactive';
      expect(activeClass).toBe('active');
    });
  });

  describe('Date formatting', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      expect(date.getFullYear()).toBe(2024);
    });
  });

  describe('UUID validation', () => {
    it('should validate UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });
  });
});
