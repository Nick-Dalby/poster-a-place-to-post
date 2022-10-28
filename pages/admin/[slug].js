import AuthCheck from '@components/AuthCheck'
import ImageUploader from '@components/ImageUploader'
import { auth } from '@lib/firebase'
import styles from '@styles/Admin.module.css'
import {
  deleteDoc,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
// import ImageUploader from '@components/ImageUploader';

import { useRouter } from 'next/router'
import { useState } from 'react'

import Link from 'next/link'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

const AdminPostEdit = (props) => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}
export default AdminPostEdit

function PostManager() {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  // @ts-ignore
  const postRef = doc(
    getFirestore(),
    'users',
    auth.currentUser.uid,
    'posts',
    slug
  )

  const [post] = useDocumentData(postRef)


  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link
              href={`/${post.username}/${post.slug}`}
              className="btn btn-blue"
            >
              Live view
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  const { isValid, isDirty } = formState

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    })
    reset({ content, published })

    toast.success('Post updated successfully!')
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>

        <ImageUploader />
        <textarea
          name="content"
          {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && (
          // @ts-ignore
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register('published')}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
