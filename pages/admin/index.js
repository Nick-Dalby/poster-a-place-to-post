import AuthCheck from '@components/AuthCheck'
import MetaTags from '@components/Metatags'
import PostFeed from '@components/PostFeed'
import { UserContext } from '@lib/context'
import { auth } from '@lib/firebase'
import styles from '@styles/Admin.module.css'
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import kebabCase from 'lodash.kebabcase'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import toast from 'react-hot-toast'

const AdminPostsPage = () => {
  return (
    <main>
      <MetaTags />
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}
export default AdminPostsPage

function PostList() {
  const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
  const postQuery = query(ref, orderBy('createdAt'))

  const [querySnapshot] = useCollection(postQuery)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await setDoc(ref, data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}
