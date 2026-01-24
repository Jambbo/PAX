import { useEffect, useState } from "react";

export function useAuth() {
    const [authenticated, setAuthenticated] = useState(
        Boolean(localStorage.getItem("access_token"))
    );

    useEffect(() => {
        const handler = () =>
            setAuthenticated(Boolean(localStorage.getItem("access_token")));

        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    return { authenticated };
}
