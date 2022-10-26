import { auth, googleAuthProvider } from '@lib/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import Image from 'next/image'
import { useContext } from 'react'
import { UserContext } from '@lib/context'
import { useState, useEffect, useCallback } from 'react'
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore'
import debounce from 'lodash.debounce'

const EnterPage = () => {
  const { user, username } = useContext(UserContext)

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
    return (
      <button className="" onClick={() => signOut(auth)}>
        Sign Out
      </button>
    )
  }

  // username form
  function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    const onSubmit = async (e) => {
      e.preventDefault()

      // Create refs for both documents
      const userDoc = doc(getFirestore(), 'users', user.uid)
      const usernameDoc = doc(getFirestore(), 'usernames', formValue)

      // Commit both docs together as a batch write.
      const batch = writeBatch(getFirestore())
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      })
      batch.set(usernameDoc, { uid: user.uid })

      await batch.commit()
    }

    const onChange = (e) => {
      // make form input match correct format
      const val = e.target.value.toLowerCase()
      const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

      // Only set form value if length is < 3 OR it passes regex
      if (val.length < 3) {
        setFormValue(val)
        setLoading(false)
        setIsValid(false)
      }
      if (re.test(val)) {
        setFormValue(val)
        setLoading(true)
        setIsValid(false)
      }
    }
    useEffect(() => {
      checkUsername(formValue)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValue])

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
      () => debounce(async (username) => {
        if (username.length >= 3) {
          const ref = doc(getFirestore(), 'usernames', username)
          const snap = await getDoc(ref)
          console.log('Firestore read executed!', snap.exists())
          setIsValid(!snap.exists())
          setLoading(false)
        }
      }, 500),
      []
    )

    return (
      !username && (
        <section>
          <h3>Choose Username</h3>
          <form onSubmit={onSubmit}>
            <input
              name="username"
              placeholder="username"
              value={formValue}
              onChange={onChange}
            />

            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />
            <button type="submit" className="btn-green" disabled={!isValid}>
              Choose
            </button>

            <h3>Debugging:</h3>
            <div>Username: {formValue}</div>
            <br />
            <div>Loading: {loading.toString()}</div>
            <br />
            <div>Username valid: {isValid.toString()}</div>
            <br />
          </form>
        </section>
      )
    )
  }

  function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>
    } else {
      return <p></p>
    }
  }
}
export default EnterPage
