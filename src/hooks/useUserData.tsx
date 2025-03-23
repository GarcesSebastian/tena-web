"use client";

import { Form } from "@/types/Form";
import { State } from "@/types/States";
import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
    forms: Form[];
    states: State;
}

const UserDataContext = createContext<{
    user: User;
    setUser: (data: User) => void;
} | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User>({
        forms: [],
        states: {
            isNav: false,
        },
    });

    const setUser = (data: User) => {
        setUserState(data);
    };

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = (): { user: User; setUser: (data: User) => void } => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData debe estar dentro de un UserDataProvider");
    }
    return context;
};