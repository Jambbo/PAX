import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        console.log(code);
        if (!code) return;

        const codeVerifier = localStorage.getItem("pkce_code_verifier");

        if (!codeVerifier) {
            console.error("Missing PKCE code_verifier");
            return;
        }

        fetch("http://localhost:8080/realms/pax/protocol/openid-connect/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: "pax-frontend",
                code,
                redirect_uri: "http://localhost:3000/auth/callback",
                code_verifier: codeVerifier,
            }),
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("access_token", data.access_token);
                localStorage.removeItem("pkce_code_verifier")
                navigate("/");
            });
    }, [navigate]);

    return <div>Signing you in…</div>;
};
