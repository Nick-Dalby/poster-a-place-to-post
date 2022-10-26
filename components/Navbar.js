import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  const user = true
  const username = true

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">Feed</button>
          </Link>
        </li>
        {/* user signed in with username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <Image className='avatar' src={user?.photoURL}  alt=''/>
              </Link>
            </li>
          </>
        )}

        {/* user not signed-in OR hasn't created a username */}
        {!username && (
          <>
            <li>
              <Link href="/enter">
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
export default Navbar
