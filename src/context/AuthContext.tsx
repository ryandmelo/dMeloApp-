import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../services/firebaseConfig'; 

// Define o formato dos dados do usuário no banco
type UserData = {
  name: string;
  email: string;
  isPremium: boolean;
};

interface AuthContextType {
  user: User | null;
  userData: UserData | null; // <-- NOVO: Guarda os dados completos (nome, etc)
  isAuthenticated: boolean;
  isPremium: boolean; // Mantemos para facilitar o uso na Loja
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>; // <-- ATUALIZADO: Recebe nome
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null); // <-- ESTADO DOS DADOS
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados do usuário (Nome + Premium) no Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        setUserData(null);
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
        setUserData(null);
      }
      
      setIsLoading(false); 
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // ATUALIZADO: Recebe 'name' e salva no Firestore
  const signUp = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Cria o documento do usuário com o Nome e Premium false
    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        isPremium: false,
        createdAt: new Date().toISOString()
    });
    
    // Atualiza o estado local imediatamente
    setUserData({ name, email, isPremium: false });
  };

  const signOut = async () => {
    await auth.signOut();
    setUserData(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchUserData(user.uid);
  };

  const isAuthenticated = !!user;
  // Deriva o isPremium do userData para manter compatibilidade com a tela da Loja
  const isPremium = userData?.isPremium || false;

  return (
    <AuthContext.Provider value={{ user, userData, isAuthenticated, isPremium, isLoading, signIn, signUp, signOut, refreshProfile }}>
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