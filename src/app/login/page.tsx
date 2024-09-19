'use client'
import { useRouter } from 'next/navigation'
import { googleProvider } from '@/app/services';




const Login = () => {
    const router = useRouter()

    const login = googleProvider.useGoogleLogin({
        flow: 'implicit',
        scope: 'https://www.googleapis.com/auth/streetviewpublish',
        onSuccess: (tokenResponse) => {
            localStorage.setItem('google_token', tokenResponse.access_token)
            router.push('./list')
        },
    });
    
    return (
        <button onClick={()=>login()}>Authorize me</button>

    )
}

export default Login