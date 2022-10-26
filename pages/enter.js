import { auth, firestore, googleAuthProvider } from '@lib/firebase'
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth'
import Image from 'next/image'

const EnterPage = () => {
  const user = null
  const username = null

  // sign-in with google button
  function SignInButton() {
    const signInWithGoogle = async () => {
      await signInWithPopup(auth, googleAuthProvider)
    }
    return (
      <button className="btn-google" onClick={signInWithGoogle}>
        <Image src={'/google.png'} alt="" width={30} height={30} />
        Sign in with Google
      </button>
    )
  }

  // sign-out button
  function SignOutButton() {
    return <button className="" onClick={() => signOut()}>Sign Out</button>
  }

  // username form
  function UsernameForm() {}

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}
export default EnterPage
