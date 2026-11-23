import { createContext } from 'react';
import type { User } from 'firebase/auth';

/**
 * The signed-in Firebase user, or an empty object when nobody is signed in.
 * Callers check `user.uid` to tell the two apart.
 */
export type UserContextValue = Partial<User>;

const UserContext = createContext<UserContextValue>({});

export default UserContext;
