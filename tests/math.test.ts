import { describe, it, expect } from 'vitest';
import { calculateVcRatio, getVcStatus, calculateNetworkHealth } from '../src/shared/utils/math';

describe('RailSutra Math & Intelligence Utilities', () => {
  it('should calculate V/C ratio correctly', () => {
    expect(calculateVcRatio(70, 100)).toBe(0.7);
    expect(calculateVcRatio(95, 100)).toBe(0.95);
    expect(calculateVcRatio(0, 50)).toBe(0);
  });

  it('should categorize V/C status correctly', () => {
    expect(getVcStatus(0.5)).toBe('NORMAL');
    expect(getVcStatus(0.75)).toBe('WARNING');
    expect(getVcStatus(0.95)).toBe('CRITICAL');
  });

  it('should calculate Network Health Index within 0-100 bounds', () => {
    expect(calculateNetworkHealth(0, 100, 0, 10)).toBe(100);
    expect(calculateNetworkHealth(10, 100, 2, 10)).toBe(88);
    expect(calculateNetworkHealth(50, 100, 5, 10)).toBe(60);
  });
});
