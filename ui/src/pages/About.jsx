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
      xLink: "https://www.x.com/emma.watson",
      instaLink: "https://www.instagram.com/emma.watson",
      linkedinLink: "https://www.linkedin.com/emma.watson"
    },
    {
      name: "Will Smith",
      role: "Product Designer",
      image: "/images/pd.png",
      xLink: "https://www.x.com/will.smith",
      instaLink: "https://www.instagram.com/will.smith",
      linkedinLink: "https://www.linkedin.com/will.smith"
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
    <div className="px-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto my-6">
        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
        <span className="mx-2 text-sm text-[#605f5f]">/</span>
        <span className="text-sm">About</span>
      </div>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 my-10">
        <div className="lg:w-1/2 flex flex-col gap-10 justify-center">
          <h1 className="text-3xl lg:text-5xl font-semibold">Our Story</h1>
          <div className="flex flex-col gap-6 text-sm text-gray-700">
            <p>
              Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data, and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 million customers across the region.
            </p>
            <p>
              Exclusive has more than 1 Million products to offer, growing very fast. Exclusive offers a diverse assortment in categories ranging from consumer.
            </p>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img src="/images/portrait-two-african-females-holding-shopping-bags-while-reacting-something-their-smartphone 1.png" alt="Our Story" className="w-full rounded-lg" />
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto my-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stats={stat} />
        ))}
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto my-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto my-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/images/Services.png" alt="Delivery" className="h-16" />
          <div>
            <h2 className="font-semibold text-lg">FREE AND FAST DELIVERY</h2>
            <p className="text-sm text-gray-700">Free delivery for all orders over $140</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <img src="/images/Services-1.png" alt="Customer Service" className="h-16" />
          <div>
            <h2 className="font-semibold text-lg">24/7 CUSTOMER SERVICE</h2>
            <p className="text-sm text-gray-700">Friendly 24/7 customer support</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <img src="/images/Services-2.png" alt="Money Back" className="h-16" />
          <div>
            <h2 className="font-semibold text-lg">MONEY BACK GUARANTEE</h2>
            <p className="text-sm text-gray-700">We return money within 30 days</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
