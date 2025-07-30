import React from 'react';

const StatsCard = ({ stats }) => {
  function valueCalculator() {
    let value = stats.value;
    const valuelength = value.toString().length;

    if (valuelength > 4 && valuelength <= 6) {
      value = value / 1000 + 'k';
    } else if (valuelength > 6 && valuelength <= 8) {
      value = value / 100000 + 'm';
    } else if (valuelength > 8) {
      value = value / 100000000 + 't';
    }

    return value;
  }

  return (
    <div className="w-full max-w-[270px] p-4 bg-white hover:bg-[#DB4444] text-black hover:text-white transition-colors duration-300 group rounded-md shadow-sm mx-auto">
      <div className="flex flex-col items-center gap-4">
        {/* Icon Container */}
        <div className="w-20 h-20 rounded-full border-[9px] bg-black group-hover:bg-white flex items-center justify-center">
          <img src={stats.image} alt="stats icon" className="w-8 h-8 group-hover:invert" />
        </div>

        {/* Value and Description */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">{valueCalculator()}</h2>
          <p className="text-sm sm:text-base">{stats.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
