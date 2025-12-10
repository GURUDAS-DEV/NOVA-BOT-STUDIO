import { create } from "zustand";

interface AuthState {
    loading : boolean;
    isLoggedIn: boolean;
    username: string | null;
    email: string | null;
    lastUpdatedAt: Date;
    refreshUser: () => Promise<void>;
    setAuthData: (data: Partial<Omit<AuthState, "refreshUser" | "setAuthData">>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    loading : true,
    isLoggedIn: false,
    username: null,
    email: null,
    lastUpdatedAt: new Date(0),

    refreshUser : async () => {
        try{
            set({ loading: true });
            const response = await fetch("/api/auth/validateToken", {
                credentials: "include", 
            });

            const data = await response.json();

            if(response.ok){
                set({
                    isLoggedIn : true,
                    username : data.username,
                    email : data.email,
                    lastUpdatedAt : new Date(),
                })
            }
            else{
                set({
                    isLoggedIn : false,
                    username : "",
                    email : "",
                    lastUpdatedAt : new Date(0),
                });
            }
        }
        catch (error){
            console.error("Failed to refresh user data:", error);
        }
        finally{
            set({ loading: false });
        }
    },

    setAuthData: (data) => set(data),
}));

