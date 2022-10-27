import Link from "next/link"

const PostFeed = ({ posts }) => {
  return (
    posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin}/>) : ''
  )
}

function PostItem({post, admin = false}) {
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount /100 + 1).toFixed(0)

  return (
    <div className="card">
      <Link href={`/${post.username}`} >
        <strong>By @ {post.username}</strong>
      </Link>
     
      <Link href={`/${post.username}/${post.slug}`} >
        {post.title}
      </Link>

    <footer>
    <span>{wordCount} words. {minutesToRead} min read</span>
    <span>❤️ {post.heartCount} Hearts</span>
    </footer>
    </div>
  )
}


export default PostFeed
