import App from '@/components/Layout_content'
import { auth } from "@/auth"


const LayoutContent: React.FC<{children:React.ReactNode}> = async({children}) => {
  const session = await auth()
  const user = session?.user
  console.log('session',session)
  return (
    <App user={user}>
      {children}
    </App>
  )
}

export default LayoutContent