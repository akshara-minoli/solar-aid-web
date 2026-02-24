import React from 'react';

const SolarVideoSection = () => {
    const videos = [
        {
            id: "xKxrkht7CpY",
            title: "How do solar panels work?",
            description: "A deep dive into the science of photovoltaics and how sunlight becomes electricity.",
            category: "Science"
        },
        {
            id: "2mX2XvGatXk",
            title: "Why Solar Energy?",
            description: "Exploring the environmental and financial benefits of switching to clean power.",
            category: "Benefits"
        },
        {
            id: "YIeDE1cMkKQ",
            title: "Beginner's Guide to Home Solar",
            description: "Everything you need to know before putting panels on your roof.",
            category: "Guide"
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 bg-slate-900 text-white overflow-hidden" id="videos">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 rounded-full font-bold text-sm tracking-wide uppercase border border-orange-500/30">
                        Watch & Learn
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                        See Solar in <span className="text-orange-500">Action</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Master the basics of solar technology through our curated video collection.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {videos.map((video, index) => (
                        <div key={index} className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-video w-full relative">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.id}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-8">
                                <span className="text-orange-500 font-black text-xs uppercase tracking-widest block mb-2">{video.category}</span>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors">{video.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 font-bold mb-6 italic">"Empowering our community through knowledge."</p>
                    <div className="flex justify-center gap-4">
                        <div className="w-12 h-1.5 bg-orange-500 rounded-full" />
                        <div className="w-4 h-1.5 bg-white/20 rounded-full" />
                        <div className="w-4 h-1.5 bg-white/20 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolarVideoSection;
