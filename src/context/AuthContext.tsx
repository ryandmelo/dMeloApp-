import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../services/firebaseConfig'; 

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean; 
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>; // FUNÇÃO recarregar status premium
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false); // <-- ESTADO PREMIUM
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsPremium(data.isPremium || false); // Lê se é premium
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.log("Erro ao buscar perfil:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setIsPremium(false);
      }
      
      setIsLoading(false); 
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Ao criar conta, cria também o documento no Firestore com premium false
    await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        isPremium: false,
        createdAt: new Date().toISOString()
    });
  };

  const signOut = async () => {
    await auth.signOut();
    setIsPremium(false);
  };

  // Função para forçar a atualização (usada após a "compra")
  const refreshProfile = async () => {
    if (user) await fetchUserData(user.uid);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isPremium, isLoading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};