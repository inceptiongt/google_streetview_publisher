import { GoogleOAuthProvider } from 'google-oauth-gsi';

export const googleProvider = new GoogleOAuthProvider({
    clientId: "288084532212-7c4fdc25h74val15gnshb4cvag7esk5h.apps.googleusercontent.com",
    onScriptLoadError: () => console.log('onScriptLoadError'),
    onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
});

export const fetchGoogleApi = async (url: string) => {
    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('google_token')}`,
        },
    })
    const data = await res.json()
    return data
}