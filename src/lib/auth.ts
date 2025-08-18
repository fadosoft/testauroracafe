
import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'aurora-cafe-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// Definiamo la struttura della nostra sessione
export interface SessionData {
  isLoggedIn: boolean;
  username: string;
}

// Funzione helper per ottenere la sessione
export function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
