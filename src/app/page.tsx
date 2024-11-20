import Link from "next/link";



export default function Home() {
  console.log('++++++++++++app paga')
  return (
    <>
    First Home
    <Link href={'/list'}>List</Link>
    </>
  )
}
