import React from 'react'
import Navbar from '../Component/Navbar'

const About = () => {
  const chargingSteps = [
    {
      step: 1,
      title: "Plug In",
      description: "Connect to your charging port.",
      image: "🔌"
    },
    {
      step: 2,
      title: "Tap to Start Your Charge",
      description: "By EVgo app, RFID or credit card.",
      image: "📱"
    },
    {
      step: 3,
      title: "Charge Up and Go",
      description: "Your next destination awaits.",
      image: "⚡"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">


          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-16">
              Fast Charge Your EV in 3 Easy Steps
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
              {chargingSteps.map((item) => (
                <div key={item.step} className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                      {item.step}
                    </div>
                    <div className="text-6xl mb-4">{item.image}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-lg">{item.description}</p>
                </div>
              ))}
            </div>
          </div>


          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              What Affects Charging Speed?
            </h2>


            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 mb-12 border border-gray-700">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Your vehicle</h3>
                  <p className="text-gray-300 mb-4">
                    There are a lot of variables that affect each vehicle's charging speed. When a battery
                    is more depleted, the charging speed is typically faster. However, batteries don't like
                    to charge quickly when they're too hot or too cold, so charging may be slower in
                    extreme temperatures.
                  </p>
                  <p className="text-gray-300">
                    Different vehicle manufacturers design different batteries. And because the battery is
                    usually the single most expensive "thing" inside a vehicle, it's in everyone's best
                    interest to maximize the battery's longevity, health, and safety. As a result, when a
                    vehicle charges, the vehicle decides the power it draws from the charger in a way that
                    maximizes longevity.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-gray-700/50 rounded-xl p-8 border-2 border-gray-600">
                    <div className="text-8xl mb-4 text-center">🚗</div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                      <p className="text-amber-400 font-semibold text-center">
                        "These are my limits and capabilities for voltage and current."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 mb-12 border border-gray-700">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center order-2 md:order-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30 flex flex-col items-center">
                      <div className="text-5xl mb-3">❤️</div>
                      <p className="text-blue-300 text-sm text-center">Battery Health</p>
                    </div>
                    <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30 flex flex-col items-center">
                      <div className="text-5xl mb-3">🔋</div>
                      <p className="text-green-300 text-sm text-center">Battery Level</p>
                    </div>
                    <div className="bg-orange-900/30 rounded-xl p-6 border border-orange-500/30 flex flex-col items-center">
                      <div className="text-5xl mb-3">🌡️</div>
                      <p className="text-orange-300 text-sm text-center">Temperature</p>
                    </div>
                    <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/30 flex flex-col items-center">
                      <div className="text-5xl mb-3">🛣️</div>
                      <p className="text-purple-300 text-sm text-center">Driving Style</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-3xl font-bold text-white mb-6">The charging system</h3>
                  <p className="text-gray-300">
                    Different electric vehicles have different capacities for charging speeds; charging
                    stations also have different capacities, and the maximum rate of your charging
                    session is determined by whichever is lower, the capability of the car or the charger.
                    For example, a 50 kW capable EV would not charge any faster at a 350 kW station.
                    Also, it is worth noting that higher capable vehicles can charge at lower capable
                    stations, they are just limited to what the station can provide.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-700">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Outside temperature</h3>
                  <p className="text-gray-300">
                    Electric vehicle batteries don't like to be too hot or too cold. The charging of a battery
                    generates heat (check your mobile phone when its charging), and the battery
                    management system will protect a battery from overheating, so when the battery
                    gets too hot the battery management system will slow down charging (and if the
                    ambient temperature is high or you've been driving your EV for a long time then this
                    can happen more quickly). Conversely, the colder it gets the slower a battery charges.
                    Newer EVs have a way to pre-condition the battery so that it is at the right temperature
                    for charging before you arrive at a station. The other good news is that as you charge
                    your battery the car's heater can warm up the battery which can increase charging
                    speeds.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-orange-900/30 to-blue-900/30 rounded-xl p-8 border border-gray-600">
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="text-6xl mb-3">☀️</div>
                        <p className="text-orange-300 font-semibold">Too Hot</p>
                      </div>
                      <div className="text-6xl">🔋</div>
                      <div className="text-center">
                        <div className="text-6xl mb-3">❄️</div>
                        <p className="text-blue-300 font-semibold">Too Cold</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-center mt-6 text-sm">
                      Extreme temperatures affect charging speed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Charging?</h2>
            <p className="text-lg max-w-3xl mx-auto mb-6">
              Find the nearest charging station and experience fast, reliable EV charging with our network.
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
              Find Charging Stations
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default About
