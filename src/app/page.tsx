import Link from "next/link";



export default function Home() {
  console.log('++++++++++++app paga')
  return (
    <>
      首页
      <Link href={'/upload'}>upload</Link>
      <Link href={'/list'}>List</Link>
    </>
  )
}
