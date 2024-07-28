import { body } from 'ionicons/icons';
import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextProps {
    authToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://vps.thut.tech/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Username: username, Password: password })
            });

            console.log(body)

            const data = await response.json();

            if (response.ok) {
                setAuthToken(data.access_token);
                //alert('Login successful!');
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            alert('An error occurred. Please try again.' + error);
        }
    };

    const logout = () => {
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
