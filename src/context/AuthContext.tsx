import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../services/firebaseConfig'; 

// 1. Interface atualizada (mantida igual, o tipo é o mesmo)
interface AuthContextType {
  user: User | null; // O objeto User do Firebase
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. NOVO: isAuthenticated agora é um estado gerenciado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listener do Firebase para gerenciar o estado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); 
      
      // 2. CORREÇÃO: Atualizamos isAuthenticated no mesmo local onde o user é checado
      setIsAuthenticated(!!firebaseUser); 
      
      setIsLoading(false); 
    });

    return unsubscribe;
  }, []); // A dependência vazia é correta para o listener

  // --- FUNÇÕES DE AUTENTICAÇÃO ---

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await auth.signOut();
  };

  // 3. REMOVIDO: A constante derivada foi substituída pelo estado 'isAuthenticated'

  // 4. O valor do provedor agora usa o estado 'isAuthenticated'
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signUp, signOut }}>
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