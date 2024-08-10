import axios from 'axios';
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

    /*const login = async (username: string, password: string) => {
        try {
            console.log("Login sent!")
            const response = await fetch('https://vps.thut.tech/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Username: username, Password: password })
            });

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
    };*/
    const login = async (username: string, password: string) => {
        try {
            console.log("Login sent!");
            const response = await axios.post('https://vps.thut.tech/login', {
                Username: username,
                Password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Assuming the access_token is in response.data
            setAuthToken(response.data.access_token);
            // alert('Login successful!');
        } catch (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(`Login failed: ${error.response.data.message}`);
            } else if (error.request) {
                // The request was made but no response was received
                alert('No response received. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('An error occurred. Please try again.' + error.message);
            }
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
