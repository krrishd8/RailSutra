export type Role = 'CONTROLLER' | 'PLANNER' | 'MAINTENANCE' | 'EXECUTIVE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  zone: string;
}

export const DEMO_USERS: Record<Role, UserProfile> = {
  CONTROLLER: {
    id: 'usr_controller',
    name: 'Rajesh Sharma',
    email: 'controller@railsutra.in',
    role: 'CONTROLLER',
    title: 'Chief Operations Controller',
    zone: 'Northern Railway (NR)',
  },
  PLANNER: {
    id: 'usr_planner',
    name: 'Priya Verma',
    email: 'planner@railsutra.in',
    role: 'PLANNER',
    title: 'Network Capacity Planner',
    zone: 'Eastern Railway (ER)',
  },
  MAINTENANCE: {
    id: 'usr_maintenance',
    name: 'Amit Patel',
    email: 'maintenance@railsutra.in',
    role: 'MAINTENANCE',
    title: 'Senior Track & Infrastructure Engineer',
    zone: 'North Central Railway (NCR)',
  },
  EXECUTIVE: {
    id: 'usr_executive',
    name: 'Vikramaditya Singh',
    email: 'executive@railsutra.in',
    role: 'EXECUTIVE',
    title: 'Executive Director (Operations)',
    zone: 'Railway Board',
  },
};
