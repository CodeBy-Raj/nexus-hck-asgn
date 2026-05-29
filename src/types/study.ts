
import { Timestamp } from 'firebase/firestore';

export type UserRole = 'OWNER' | 'MODERATOR' | 'STUDENT';

export interface User {
  id: string;
  displayName: string;
  avatar?: string;
  email: string;
  status: 'online' | 'away' | 'offline' | 'focusing';
}

export type MessageType = 'user' | 'system';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: Timestamp;
  type: MessageType;
  metadata?: any;
}

export interface StudyRoom {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: string[];
  inviteCode: string;
  category: string;
  activeSessionId?: string | null;
  imageUrl?: string;
  isActive: boolean;
  sharedNotes?: string;
}

export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PomodoroPhase = 'FOCUS' | 'BREAK';

export interface StudySession {
  id: string;
  roomId: string;
  initiatorId: string;
  goal: string;
  startTime: Timestamp;
  durationMinutes: number;
  status: SessionStatus;
  participants: Record<string, Timestamp>;
  isPomodoro?: boolean;
  pomodoroPhase?: PomodoroPhase;
  completedIntervals?: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Timestamp;
}
