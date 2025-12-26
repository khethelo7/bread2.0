import { supabase } from "@/integrations/supabase/client";
import { log } from "console";

// ntfy.sh logger for error notifications
const NTFY_TOPIC = 'bread-admin-logs';
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

type LogLevel = 'error' | 'warn' | 'info';

interface LogOptions {
  level: LogLevel;
  title: string;
  message: string;
  tags?: string[];
}

const priorityMap: Record<LogLevel, string> = {
  error: '5',
  warn: '4',
  info: '3',
};

const tagMap: Record<LogLevel, string> = {
  error: 'rotating_light',
  warn: 'warning',
  info: 'information_source',
};

async function logToSupabase(
  level: 'error' | 'warn' | 'info',
  title: string,
  message: string,
  source?: string,
  metadata?: Record<string, any>
) {
  try {
    await supabase.from('error_logs').insert({
      level,
      title,
      message,
      source,
      metadata,
    });
  } catch {
    // swallowing errors to avoid infinite loops
  }
}

export const logger = {
  async send({ level, title, message, tags = [] }: LogOptions): Promise<void> {
    try {
      await fetch(NTFY_URL, {
        method: 'POST',
        headers: {
          'Title': `[${level.toUpperCase()}] ${title}`,
          'Priority': priorityMap[level],
          'Tags': [tagMap[level], ...tags].join(','),
        },
        body: message,
      });
    } catch (e) {
      console.error('Logger failed:', e);
    }
  },

  error(title: string, message: string, tags?: string[]) {
    logToSupabase('error', title, message, 'client');
    return this.send({ level: 'error', title, message, tags });
  },

  warn(title: string, message: string, tags?: string[]) {
    logToSupabase('warn', title, message, 'client');
    return this.send({ level: 'warn', title, message, tags });
  },

  info(title: string, message: string, tags?: string[]) {
    logToSupabase('info', title, message, 'client');
    return this.send({ level: 'info', title, message, tags });
  },
};
