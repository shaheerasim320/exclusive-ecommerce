import React from 'react'
import { Link } from 'react-router-dom'
import TeamMemberCard from '../components/TeamMemberCard'
import StatsCard from '../components/StatsCard'

const About = () => {
    const members = [
        {
            name: "Tom Cruise",
            role: "Founder & Chairman",
            image: "/images/founder.png",
            xLink: "https://www.x.com/tom.cruise",
            instaLink: "https://www.instagram.com/tom.cruise",
            linkedinLink: "https://www.linkedin.com/tom.cruise"
        },
        {
            name: "Emma Watson",
            role: "Managing Director",
            image: "/images/md.png",
            xLink: "www.x.com/emma.watson",
            instaLink: "www.instagram.com/emma.watson",
            linkedinLink: "www.linkedin.com/emma.watson"
        },
        {
            name: "Will Smith",
            role: "Product Designer",
            image: "/images/pd.png",
            xLink: "www.x.com/will.smith",
            instaLink: "www.instagram.com/will.smith",
            linkedinLink: "www.linkedin.com/will.smith"
        }
    ]
    const stats = [
        {
            value: 10500,
            desc: "Sellers active our site",
            image: "/images/Icon-Sale.svg"
        },
        {
            value: 33000,
            desc: "Monthly Product Sale",
            image: "/images/Icon-Sale.svg"
        },
        {
            value: 45500,
            desc: "Customer active our site",
            image: "/images/Icon-Shopping bag.svg"
        },
        {
            value: 25000,
            desc: "Annual gross sale in our site",
            image: "/images/Icon-Moneybag.svg"
        }
    ]
    return (
        <div>
            <div>
                {/* Breadcrumbs */}
                <div className="nav w-[1156px] h-[21px] my-[34px] mx-auto">
                    <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="#" className="text-[14px]">About</Link>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Story */}
                <section className="our-story h-[609px]  flex gap-[56px] w-[1170px] mx-auto">
                    <div className="content w-[525px] h-[336px]  flex flex-col gap-[40px] my-[160px]">
                        <div className="heading">
                            <h1 className="text-[54px] font-semibold">Our Story</h1>
                        </div>
                        <div className="desc flex flex-col gap-[24px]">
                            <p className="para-1">Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
                            </p>
                            <p className="para-2">
                                Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.
                            </p>
                        </div>
                    </div>
                    <div className="image w-[705px] h-[609px]">
                        <img src="/images/portrait-two-african-females-holding-shopping-bags-while-reacting-something-their-smartphone 1.png" alt className="my-[24px]" />
                    </div>
                </section>
                {/* Story Ends Here*/}
                {/* Stats */}
                <section className="stats  w-[1170px] h-[230px] mx-auto my-[90px] flex gap-[30px] overflow-hidden">
                    {stats.map((stats, index) => (
                        <StatsCard key={index} stats={stats}/>
                    ))}
                </section>
                {/* Stats End Here */}
                {/* Team */}
                <section className="team w-[1170px] h-[564px] flex gap-[30px] mx-auto mb-[65px] overflow-hidden">
                    {members.map((member, index) => (
                        <TeamMemberCard key={index} member={member} />
                    ))}
                </section>
                {/* Team Ends Here */}
                {/* Faetures */}
                <section className="features w-[943px] h-[161px] mx-auto my-[70px] flex justify-evenly">
                    <div className="feature-1 w-[255px] h-[161px] flex flex-col gap-[18px]">
                        <div className="icon flex justify-center">
                            <img src="/images/Services.png" alt />
                        </div>
                        <div className="desc w-[255px] h-[57px]">
                            <h2 className="font-semibold text-[19px] text-center">FREE AND FAST DELIVERY</h2>
                            <p className="text-[14px] text-center">Free delivery for all orders over $140</p>
                        </div>
                    </div>
                    <div className="feature-2 w-[255px] h-[161px] flex flex-col gap-[18px]">
                        <div className="icon flex justify-center">
                            <img src="/images/Services-1.png" alt />
                        </div>
                        <div className="desc w-[255px] h-[57px]">
                            <h2 className="font-semibold text-[19px] text-center">24/7 CUSTOMER SERVICE</h2>
                            <p className="text-[14px] text-center">Friendly 24/7 customer support</p>
                        </div>
                    </div>
                    <div className="feature-3 w-[255px] h-[161px] flex flex-col gap-[18px]">
                        <div className="icon flex justify-center">
                            <img src="/images/Services-2.png" alt />
                        </div>
                        <div className="desc w-[255px] h-[57px]">
                            <h2 className="font-semibold text-[19px] text-center">MONEY BACK GUARANTEE</h2>
                            <p className="text-[14px] text-center">We reurn money within 30 days</p>
                        </div>
                    </div>
                </section>
                {/* Features End */}
            </div>

        </div>
    )
}

export default About
