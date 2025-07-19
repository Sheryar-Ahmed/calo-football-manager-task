import React from "react";
import { RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import SplashScreen from "./components/SplashScreen";
import { router } from "./routes";

function App() {
    const { isLoading } = useAuth(); // assuming you return this from AuthContext

    if (isLoading) {
        return <SplashScreen />;
    }

    return <RouterProvider router={router} />;
}

export default App;
