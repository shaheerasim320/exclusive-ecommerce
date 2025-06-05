const FeatureCard = ({feature}) => {
    return (
        <div className="font-inter">
            <div className="feature flex flex-col gap-5">
                <div className="icon flex justify-center">
                    <img src={feature.image} alt="service" />
                </div>
                <div className="desc">
                    <h2 className="font-semibold text-[19px] text-center">{feature.title}</h2>
                    <p className="text-[12px] text-center">{feature.desc}</p>
                </div>
            </div>
        </div>
    )
}

export default FeatureCard
