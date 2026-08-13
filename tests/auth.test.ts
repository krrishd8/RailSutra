import { describe, it, expect } from 'vitest';
import { DEMO_USERS, Role } from '../src/modules/auth/auth.types';

describe('RailSutra Auth & Role System', () => {
  it('should contain all required demo role presets', () => {
    const roles: Role[] = ['CONTROLLER', 'PLANNER', 'MAINTENANCE', 'EXECUTIVE'];
    roles.forEach((role) => {
      expect(DEMO_USERS[role]).toBeDefined();
      expect(DEMO_USERS[role].role).toBe(role);
      expect(DEMO_USERS[role].email).toContain('@railsutra.in');
    });
  });
});
