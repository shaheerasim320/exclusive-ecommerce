import React from 'react'

const TeamMemberCard = ({member}) => {
  return (
    <div>
      <div className="member w-[370px] h-[564px] flex flex-col gap-[32px]">
                        <div className="image w-[370px] h-[430px] bg-[#F5F5F5]">
                            <img src={member.image} alt className="my-[39px] mx-auto" />
                        </div>
                        <div className="desc w-[210px] h-[102px] flex flex-col gap-[5px]">
                            <div className="name-title">
                                <div className="name"><h3 className="text-[32px]">{member.name}</h3></div>
                                <div className="designation text-[16px]"><p>{member.role}</p></div>
                            </div>
                            <div className="social-icons flex items-center w-[104px] h-[24px] gap-[19px]">
                                <a href={member.xLink}><img src="/images/x.svg" alt="x" className="invert h-[20px] w-[20px]" /></a>
                                <a href={member.instaLink}><img src="/images/insta.svg" alt="instagram" className="invert h-[20px] w-[20px]" /></a>
                                <a href={member.linkedinLink}><img src="/images/Icon-Linkedin.svg" alt="linkedin" className="invert h-[20px] w-[20px]" /></a>
                            </div>
                        </div>
                    </div>
    </div>
  )
}

export default TeamMemberCard
