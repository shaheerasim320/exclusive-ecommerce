import React from 'react'

const TeamMemberCard = ({ member }) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[370px] mx-auto">
      {/* Image Section */}
      <div className="w-full aspect-[370/430] bg-[#F5F5F5] flex items-center justify-center">
        <img src={member.image} alt={member.name} className="max-h-[90%] object-contain" />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 px-4 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold">{member.name}</h3>
        <p className="text-sm sm:text-base text-gray-600">{member.role}</p>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-2">
          <a href={member.xLink} target="_blank" rel="noopener noreferrer">
            <img src="/images/x.svg" alt="x" className="invert w-5 h-5" />
          </a>
          <a href={member.instaLink} target="_blank" rel="noopener noreferrer">
            <img src="/images/insta.svg" alt="instagram" className="invert w-5 h-5" />
          </a>
          <a href={member.linkedinLink} target="_blank" rel="noopener noreferrer">
            <img src="/images/Icon-Linkedin.svg" alt="linkedin" className="invert w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default TeamMemberCard
