import { message } from 'antd';
import { GoogleOAuthProvider } from 'google-oauth-gsi';

// gapi.client.streetviewpublish

export const googleProvider = new GoogleOAuthProvider({
    clientId: "288084532212-7c4fdc25h74val15gnshb4cvag7esk5h.apps.googleusercontent.com",
    onScriptLoadError: () => console.log('onScriptLoadError'),
    onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
});

const fetchGoogleApi = async <T>(url: string, options?: RequestInit) => {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options?.headers,
                "Authorization": `Bearer ${localStorage.getItem('google_token')}`,
            },
        })
        if (!res.ok) {
            const err: {error:gapi.client.streetviewpublish.Status} = await res.json()
            // window.history.pushState(null,'','/login')
            message.error(err.error.message)
        }
        const rst: T = await res.json()
        return rst
    } catch (err) {
        console.log('err', err)
    }

}

export const getPhoto = async (photoId: string) => {
    return await fetchGoogleApi<gapi.client.streetviewpublish.Photo>(`https://streetviewpublish.googleapis.com/v1/photo/${photoId}?view=BASIC`)
}

export const getPhotoList = async () => {
    return await fetchGoogleApi<gapi.client.streetviewpublish.ListPhotosResponse>("https://streetviewpublish.googleapis.com/v1/photos?view=BASIC")
}

export const uploadPhoto = async (body: File) => {
    const startRef = await fetchGoogleApi<gapi.client.streetviewpublish.UploadRef>('https://streetviewpublish.googleapis.com/v1/photo:startUpload', {
        method: "POST"
    })
    if (startRef?.uploadUrl) {

        const arrayBuffer = await body.arrayBuffer();
        await fetchGoogleApi(startRef.uploadUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "image/jpeg",
                "X-Goog-Upload-Protocol": "raw",
                "X-Goog-Upload-Content-Length": `${arrayBuffer.byteLength}`,
            },
            body: arrayBuffer
        })
        return startRef
    }
}

export const createPhoto = async (photo: gapi.client.streetviewpublish.Photo) => {
    return await fetchGoogleApi<gapi.client.streetviewpublish.Photo>('https://streetviewpublish.googleapis.com/v1/photo', {
        method: "POST",
        body: JSON.stringify(photo)
    })
}

const a = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Mock.mock('@name')");
      } else {
        reject("sdsa");
      }
    }, 1000);
  });

