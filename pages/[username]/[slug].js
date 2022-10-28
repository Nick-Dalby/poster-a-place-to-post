import styles from '@styles/Post.module.css'

import AuthCheck from '@components/AuthCheck'
import HeartButton from '@components/HeartButton'
import PostContent from '@components/PostContent'
import { getUserWithUsername, postToJSON } from '@lib/firebase'
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
} from 'firebase/firestore'
import Link from 'next/link'
import { useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug)

    post = postToJSON(await getDoc(postRef))

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 100,
  }
}

export async function getStaticPaths() {
  const q = query(collectionGroup(getFirestore(), 'posts'), limit(20))
  const snapshot = await getDocs(q)

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug },
    }
  })

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  }
}

const Post = (props) => {
  const postRef = doc(getFirestore(), props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>

        <AuthCheck fallback={
          <Link href='/enter'>
            <button>❤️ Sign up</button>
          </Link>
        }>
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}
export default Post
