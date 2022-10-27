import PostFeed from '@components/PostFeed'
import UserProfile from '@components/UserProfile'
import { getUserWithUsername, postToJSON } from '@lib/firebase'
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
} from 'firebase/firestore'

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()

    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
  }

  return {
    props: { user, posts },
  }
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}
export default UserProfilePage
