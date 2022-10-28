import { UserContext } from '@lib/context'
import { auth } from '@lib/firebase'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'

const Navbar = () => {
  const { user, username } = useContext(UserContext)

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  }

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
              <button onClick={signOutNow}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <Image
                  className="avatar"
                  src={user?.photoURL || '/avatar.png'}
                  width={50}
                  height={50}
                  alt=""
                />
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
