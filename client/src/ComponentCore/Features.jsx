import React from 'react'
import Navbar from '../Component/Navbar'

const Features = () => {
  const chargingTypes = [
    {
      title: "Level 1 Charging Stations",
      specs: {
        powerSupply: "Standard household outlets (120V AC)",
        chargingSpeed: "4-5 mph (6-8 km/h)",
        installation: "No extra hardware required, just a charging cable",
        areaOfUse: "Generally suitable for home use"
      },
      advantages: [
        "Most common and easily accessible charging method",
        "Low installation cost",
        "Portable and flexible use"
      ],
      disadvantages: [
        "Charging time is quite long",
        "Not suitable for long journeys"
      ],
      icon: "🔌",
      color: "blue"
    },
    {
      title: "Level 2 Charging Stations",
      specs: {
        powerSupply: "Dedicated charging stations or high voltage outlets (240V AC)",
        chargingSpeed: "25-30 mph (40-48 km/h)",
        installation: "Requires professional installation",
        areaOfUse: "Found in homes, businesses and public areas"
      },
      advantages: [
        "Provides faster charging",
        "Widely available and compatible with many EV models",
        "Can be used both at home and in public areas"
      ],
      disadvantages: [
        "Installation cost is higher than Level 1",
        "Requires professional installation"
      ],
      icon: "⚡",
      color: "green"
    },
    {
      title: "DC Fast Charging Stations (Level 3)",
      specs: {
        powerSupply: "Direct current (DC)",
        chargingSpeed: "60-80 miles/20-30 minutes (96-128 km/20-30 minutes)",
        installation: "Requires high-power electrical infrastructure",
        areaOfUse: "Found at commercial charging stations and highway medians"
      },
      advantages: [
        "Fastest charging method available",
        "Ideal for long journeys and fast charging needs",
        "Provides wide range"
      ],
      disadvantages: [
        "Installation costs are very high",
        "Generally not suitable for home use",
        "Requires compatibility between charger and vehicle"
      ],
      icon: "⚡️",
      color: "red"
    },
    {
      title: "Wireless Charging Stations",
      specs: {
        powerSupply: "Inductive charging technology",
        chargingSpeed: "Similar speed as Level 2",
        installation: "Requires special equipment under vehicle and in parking lot",
        areaOfUse: "Can be found in homes, businesses and some public areas"
      },
      advantages: [
        "Eliminates cable clutter",
        "Extremely easy to use",
        "Expected to become more common in the future"
      ],
      disadvantages: [
        "Installation costs are high",
        "Limited number of vehicles and stations currently compatible"
      ],
      icon: "📡",
      color: "purple"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Electric Vehicle Charging Stations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Types and Features
            </p>
            <div className="mt-6 text-gray-300 max-w-4xl mx-auto text-left md:text-center">
              <p className="mb-4">
                Electric vehicles (EVs) are becoming more and more popular and this increases the importance of electric vehicle charging stations.
                Charging stations allow EV owners to charge their vehicles safely and efficiently.
              </p>
              <p>
                In this article, we will explore the different types of EV charging stations and the features of each.
              </p>
            </div>
          </div>


          <div className="space-y-12">
            {chargingTypes.map((type, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-t-4 border-${type.color}-500 hover:shadow-xl transition-shadow duration-300`}
              >

                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6 md:px-8">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{type.icon}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{type.title}</h2>
                  </div>
                </div>

                <div className="p-6 md:p-8">

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      Specifications
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                        <p className="text-sm font-semibold text-blue-300 mb-1">Power Supply</p>
                        <p className="text-gray-300">{type.specs.powerSupply}</p>
                      </div>
                      <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                        <p className="text-sm font-semibold text-green-300 mb-1">Charging Speed</p>
                        <p className="text-gray-300">{type.specs.chargingSpeed}</p>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                        <p className="text-sm font-semibold text-purple-300 mb-1">Installation</p>
                        <p className="text-gray-300">{type.specs.installation}</p>
                      </div>
                      <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                        <p className="text-sm font-semibold text-orange-300 mb-1">Area of Use</p>
                        <p className="text-gray-300">{type.specs.areaOfUse}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">

                        Advantages
                      </h3>
                      <ul className="space-y-2">
                        {type.advantages.map((advantage, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">●</span>
                            <span className="text-gray-300">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">

                        Disadvantages
                      </h3>
                      <ul className="space-y-2">
                        {type.disadvantages.map((disadvantage, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">●</span>
                            <span className="text-gray-300">{disadvantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">MPPP  - Your Charging Partner</h2>
            <p className="text-lg max-w-3xl mx-auto mb-6">
              As MPPP , we aim to meet the needs of electric vehicle users and support sustainable transportation
              by providing high quality and reliable charging solutions.
            </p>
            <p className="text-blue-100">
              Stay tuned to our blog for more information about electric vehicles and charging technologies!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Features;