// import 'server-only'
"use server"

import { auth, signOut as _signOut } from '@/auth'
import { revalidateTag } from 'next/cache';
import { promises as fs } from 'fs';

// gapi.client.streetviewpublish

// export const googleProvider = new GoogleOAuthProvider({
//     clientId: "288084532212-7c4fdc25h74val15gnshb4cvag7esk5h.apps.googleusercontent.com",
//     onScriptLoadError: () => console.log('onScriptLoadError'),
//     onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
// });
type ResError = {
    error: {
        code: Response['status']
        message: string
        status: Response['statusText']
    }
}
type ApiResutl<T, E> = {
    ok: true;
    status?: Response["status"];
    statusText?: Response["statusText"];
    result: T;
} | {
    ok: false;
    status?: Response["status"];
    statusText?: Response["statusText"];
    result: E;
};

const fetchGoogleApi = async <T>(url: string, options?: RequestInit) => {
    const session = await auth()
    const res = await fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            "Authorization": `Bearer ${session?.accessToken}`,
        },
    })

    const { ok, status, statusText } = res

    // 检查 content-type 是否为 JSON
    let result;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        result = await res.json();
    } else {
        result = null; // 或者根据需要处理非 JSON 响应
    }

    return {
        ok,
        status,
        statusText,
        result
    } as ApiResutl<T, ResError>
}

export const getPhoto = async (photoId: string) => {
    return await fetchGoogleApi<gapi.client.streetviewpublish.Photo>(`https://streetviewpublish.googleapis.com/v1/photo/${photoId}?view=BASIC`)
}

export const getPhotoList = async () => {
    return await fetchGoogleApi<gapi.client.streetviewpublish.ListPhotosResponse>("https://streetviewpublish.googleapis.com/v1/photos?view=BASIC", { next: { tags: ['list'] } })
}


export const uploadPhoto = async (path: string) => {
    const refRst = await fetchGoogleApi<gapi.client.streetviewpublish.UploadRef>('https://streetviewpublish.googleapis.com/v1/photo:startUpload', {
        method: "POST"
    })
    if (refRst.ok && refRst.result.uploadUrl) {
        const editedPhotoBuffer = await fs.readFile(path);

        const arrayBuffer = Buffer.from(editedPhotoBuffer);
        const rst = await fetchGoogleApi<unknown>(refRst.result.uploadUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "image/jpeg",
                "X-Goog-Upload-Protocol": "raw",
                "X-Goog-Upload-Content-Length": `${arrayBuffer.byteLength}`,
            },
            body: arrayBuffer
        })
        if (rst?.ok) {
            // 删除本地图片
            await fs.unlink(path); // 删除指定路径的本地图片
            await fs.unlink(`${path}_original`) //删除备份
            return refRst
        } else {
            // 类型难题
            return rst
        }
    }
    return refRst
}

export const createPhoto = async (photo: gapi.client.streetviewpublish.Photo) => {
    const rst = await fetchGoogleApi<gapi.client.streetviewpublish.Photo>('https://streetviewpublish.googleapis.com/v1/photo', {
        method: "POST",
        body: JSON.stringify(photo)
    })
    if(rst.ok) {
        revalidateTag('list')

    }
    return rst
}

export const deletePhoto = async (photoId: string, revalidate: boolean = false) => {
    const rst = await fetchGoogleApi(`https://streetviewpublish.googleapis.com/v1/photo/${photoId}`, {
        method: 'DELETE'
    })
    if (rst.ok && revalidate) {
        revalidateTag('list')
    }
    return rst
}

export const signOut = async () => await _signOut()

