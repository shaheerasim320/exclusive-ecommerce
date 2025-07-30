import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Aside from '../components/Aside'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } })
    }
  }, [user])
  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="bread-crumb flex items-center mb-2 sm:mb-0">
          <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
          <span className="mx-2 text-sm text-[#605f5f]">/</span>
          <Link to="/manage-my-account" className="text-[#605f5f] text-sm hover:text-black">My Account</Link>
          <span className="mx-2 text-sm text-[#605f5f]">/</span>
          <Link to="/my-profile" className="text-sm">My Profile</Link>
        </div>
        <div className="welcome h-auto text-sm">
          <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
        </div>
      </div>
      {/* Breadcrumbs Ends Here*/}

      <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">
        {/* <Aside setActive="my-profile" /> */}

        <div className="flex-1 bg-white shadow-md rounded-lg p-6 md:p-10">
          <h5 className="text-xl text-[#DB4444] font-semibold mb-6">My Profile</h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-xs text-gray-600 block mb-1">Full Name</span>
              <div className="text-base">{user?.fullName}</div>
            </div>
            <div>
              <span className="text-xs text-gray-600 block mb-1">Email</span>
              <div className="text-base">{user?.email}</div>
            </div>
            <div>
              <span className="text-xs text-gray-600 block mb-1">Mobile</span>
              <div className="text-base">
                {user?.phoneNumber ? `+${user.phoneNumber}` : "Not Provided"}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 block mb-1">Gender</span>
              <div className="text-base">{user?.gender || "Not Specified"}</div>
            </div>

            {/* Conditionally show Password if it exists */}
            {user?.password && (
              <div>
                <span className="text-xs text-gray-600 block mb-1">Password</span>
                <div className="text-base font-medium">***********</div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/edit-profile">
              <button className="bg-[#DB4444] hover:bg-[#E07575] text-white font-medium px-6 py-3 rounded-md transition">
                EDIT PROFILE
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
