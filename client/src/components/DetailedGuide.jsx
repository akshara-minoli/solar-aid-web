import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DetailedGuide = () => {
    const [activeTab, setActiveTab] = useState('household');

    const householdContent = [
        {
            question: "What is solar?",
            answer: "Solar power is clean energy from the sun. Panels on your roof catch sunlight and turn it into electricity to power your lights, fans, and TV without any fuel or noise.",
            image: "/src/assets/photo/hero_solar.png"
        },
        {
            question: "How much does it cost?",
            answer: "The cost depends on how many lights and appliances you want to run. We help you calculate exactly what you need so you don't overspend.",
            image: "/src/assets/photo/savings_chart.png"
        },
        {
            question: "Is my house suitable?",
            answer: "Most houses with a clear view of the sky are perfect! We look for roofs that get plenty of sunlight during the day and are strong enough to hold the panels.",
            image: "/src/assets/photo/roof_suitability.png"
        },
        {
            question: "Who will install it?",
            answer: "Our network of certified local technicians will handle everything safely and professionally. They are trained to respect your home and community.",
            image: "/src/assets/photo/installers.png"
        }
    ];

    const studentContent = [
        {
            title: "How solar panels work",
            desc: "Solar panels are made of silicon cells. When sunlight hits these cells, it knocks electrons loose, creating a flow of electricity called Direct Current (DC).",
            image: "/src/assets/photo/lesson_thumb.png"
        },
        {
            title: "Environmental benefits",
            desc: "Solar energy is 100% renewable. By using the sun, we reduce the need for coal and oil, which keeps our air clean and protects our forests.",
            image: "/src/assets/photo/hero_solar.png"
        },
        {
            title: "Carbon reduction",
            desc: "A typical home solar system can reduce carbon emissions by over 1 tonne per year—that's like planting 50 trees every single year!",
            image: "/src/assets/photo/installers.png"
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 bg-white" id="guide">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Information for <span className="text-orange-500">Everyone</span></h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Whether you're looking to power your home or study the science of energy, we have the answers for you.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-16">
                    <div className="bg-slate-100 p-2 rounded-[2rem] flex gap-2 w-full max-w-2xl shadow-inner">
                        <button
                            onClick={() => setActiveTab('household')}
                            className={`flex-1 py-4 px-6 rounded-[1.5rem] font-bold text-lg transition-all duration-300 ${activeTab === 'household' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Rural Households
                        </button>
                        <button
                            onClick={() => setActiveTab('student')}
                            className={`flex-1 py-4 px-6 rounded-[1.5rem] font-bold text-lg transition-all duration-300 ${activeTab === 'student' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Learners & Students
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-slide-up">
                    {activeTab === 'household' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {householdContent.map((item, index) => (
                                <div key={index} className="bg-slate-50 rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col md:flex-row">
                                    <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                                        <img src={item.image} alt={item.question} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                    <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-4">{item.question}</h4>
                                        <p className="text-gray-600 leading-relaxed font-medium">{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                            {/* Call to action for more questions */}
                            <div className="md:col-span-2 bg-gradient-to-r from-orange-500 to-orange-400 p-10 rounded-[2.5rem] text-center text-white mt-8">
                                <h3 className="text-3xl font-bold mb-4">Have more questions?</h3>
                                <p className="text-xl mb-8 opacity-90">Log in to chat with our local experts and get a personalized plan for your home.</p>
                                <Link to="/login" className="inline-block px-10 py-4 bg-white text-orange-500 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                                    Log In to Ask Anything
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {studentContent.map((item, index) => (
                                <div key={index} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                                    <div className="rounded-[2rem] overflow-hidden mb-8 h-48">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h4>
                                    <p className="text-gray-600 leading-relaxed font-medium mb-8 flex-1">{item.desc}</p>
                                    <Link to="/signin" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                        Learn Technical Details <span>→</span>
                                    </Link>
                                </div>
                            ))}
                            {/* Special Science Card */}
                            <div className="lg:col-span-3 bg-slate-900 rounded-[3rem] p-12 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left text-white mt-8">
                                <div className="lg:w-2/3 space-y-6">
                                    <h3 className="text-3xl md:text-4xl font-bold">Deep Dive into Renewable Energy</h3>
                                    <p className="text-xl text-slate-400">Unlock interactive calculators for electricity consumption, carbon footprint, and complex wiring diagrams.</p>
                                </div>
                                <div className="lg:w-1/3 flex justify-center lg:justify-end w-full">
                                    <Link to="/signin" className="w-full lg:w-auto px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 text-center">
                                        Start Learning
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DetailedGuide;
