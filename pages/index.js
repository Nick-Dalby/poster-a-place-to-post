import Link from 'next/link'
import Loader from '../components/Loader'

export default function Home() {
  return (
    <div>
      <Loader show />
      <h1>hi!</h1>
      <Link
        href={{
          pathname: '/[username]',
          query: { username: 'nico' },
        }}
      >
        click this
      </Link>
    </div>
  )
}
