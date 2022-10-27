import Image from "next/image"

const UserProfile = ({user}) => {
  return (
    <div className="box-center">

        <Image src={user.photoURL} alt="avatar" className="card-img-center" width={100} height={100}/>
 
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  )
}
export default UserProfile