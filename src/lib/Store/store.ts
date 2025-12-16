import { create } from "zustand";
// import dotenv from "dotenv";
// dotenv.config();

interface AuthState {
    loading : boolean;
    isLoggedIn: boolean;
    username: string | null;
    email: string | null;
    userId : string | null;
    lastUpdatedAt: Date;
    refreshUser: () => Promise<void>;
    setAuthData: (data: Partial<Omit<AuthState, "refreshUser" | "setAuthData">>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    loading : true,
    isLoggedIn: false,
    username: null,
    email: null,
    userId : null,
    lastUpdatedAt: new Date(0),

    refreshUser : async () => {
        try{
            set({ loading: true });
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/validateToken`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if(response.ok){
                set({
                    isLoggedIn : true,
                    username : data.username,
                    email : data.email,
                    lastUpdatedAt : new Date(),
                    userId : data.userId,
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
            console.log("User data refreshed:", data);
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

