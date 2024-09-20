import { GoogleOAuthProvider } from 'google-oauth-gsi';

// gapi.client.streetviewpublish

export const googleProvider = new GoogleOAuthProvider({
    clientId: "288084532212-7c4fdc25h74val15gnshb4cvag7esk5h.apps.googleusercontent.com",
    onScriptLoadError: () => console.log('onScriptLoadError'),
    onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
});

const fetchGoogleApi = async (url: string) => {
    try {
        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('google_token')}`,
            },
        })
        const rst = await res.json()
        if (res.status === 401) {
            window.history.replaceState(null,'','/login')
        }
        return rst
    } catch (err) {
        console.log('err',err)
    }

}

export const getPhoto = async (photoId: string) => {
    const photo = await fetchGoogleApi(`https://streetviewpublish.googleapis.com/v1/photo/${photoId}?view=BASIC`) as gapi.client.streetviewpublish.Photo
    return photo
}

export const getPhotoList = async () => {
    return await fetchGoogleApi("https://streetviewpublish.googleapis.com/v1/photos?view=BASIC") as gapi.client.streetviewpublish.ListPhotosResponse
} 

