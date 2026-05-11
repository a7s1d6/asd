import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const path = `users/${user.uid}`;
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const isDevEmail = user.email === 'wwmmww716@gmail.com';
          
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === 'admin' || isDevEmail);
          } else {
            // Create user doc if it doesn't exist
            await setDoc(userDocRef, {
              displayName: user.displayName,
              email: user.email,
              role: isDevEmail ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            });
            setIsAdmin(isDevEmail);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path, auth);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
