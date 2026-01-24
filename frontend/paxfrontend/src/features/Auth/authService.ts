const KEYCLOAK_URL = "http://localhost:8080";
const REALM = "pax";
const CLIENT_ID = "pax-frontend";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

export function login() {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        scope: "openid profile email",
        redirect_uri: REDIRECT_URI,
    });

    window.location.href =
        `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth?${params.toString()}`;
}

export function logout() {
    localStorage.removeItem("access_token");
    window.location.reload();
}