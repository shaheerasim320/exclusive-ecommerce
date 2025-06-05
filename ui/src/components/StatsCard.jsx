import React from 'react'

const StatsCard = ({stats}) => {
    function valueCalculator(){
        let value=stats.value
        let divisor=0
        const valuelength=(stats.value).toString().length
        if(valuelength>4 && valuelength<=6){
            divisor=1000
            value=value/divisor+"k"
        }else if(valuelength>6 && valuelength<=8){
            divisor=100000
            value=value/divisor+"m"
        }else{
            divisor=100000000
            value=value/divisor+"t"
        }
        return value
    }
    return (
        <div>
            {/* Stats Card */}
            <div className="stats-card w-[270px] h-[230px] py-[2px]  hover:text-white hover:bg-[#DB4444] group">
                <div className="content w-[205px] h-[170px]  my-[30px] mx-auto flex flex-col items-center gap-[15px]">
                    <div className="icon w-[80px] h-[80px] rounded-full border-[9px] bg-black group-hover:bg-white">
                        <img src={stats.image} alt="stats" className="my-[9px] mx-auto group-hover:invert" />
                    </div>
                    <div className="desc flex flex-col items-center">
                        <div className="value">
                            <h2 className="text-[32px] font-bold">{valueCalculator()}</h2>
                        </div>
                        <div className="value-desc">
                            <p className="text-[16px]">{stats.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Stats Card Ends*/}
        </div>
    )
}

export default StatsCard
