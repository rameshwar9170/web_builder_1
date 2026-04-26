import React from 'react';
import { Link } from 'react-router-dom';
import { FiCreditCard, FiStar, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const CreateSelection = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Start Your <span className="text-primary-600">Digital Identity.</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Choose the path that fits your brand. Whether you need a functional business toolkit or an experimental high-end experience.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Standard Card Path */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-[32px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col h-full ring-1 ring-gray-900/5">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 mb-8">
                            <FiCreditCard size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Standard Card</h2>
                        <p className="text-gray-500 mb-8 flex-1 text-lg">
                            The perfect toolkit for professionals. Includes multi-industry templates, services, products, and full customization.
                        </p>

                        <div className="space-y-4 mb-8">
                            {['10+ Industry Templates', 'Real-time Analytics', 'VCard Download', 'Mobile Optimized'].map(benefit => (
                                <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                    <FiCheckCircle className="text-green-500" /> {benefit}
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/admin/cards/create-standard"
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all group"
                        >
                            Create Professional Card
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Premium Experience Path */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-[32px] blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col h-full ring-1 ring-gray-900/5">
                        <div className="absolute top-8 right-8">
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-yellow-200">
                                Best Choice
                            </span>
                        </div>
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-8">
                            <FiStar size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Premium Experience</h2>
                        <p className="text-gray-500 mb-8 flex-1 text-lg">
                            Ultra-modern, experimental layouts designed to WOW. Glassmorphism, Neo-Noir, and Minimalist paths.
                        </p>

                        <div className="space-y-4 mb-8">
                            {['Experimental Layouts', 'Custom Micro-interactions', 'Luxury Sidebars', 'Verified Badges'].map(benefit => (
                                <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                    <FiCheckCircle className="text-primary-600" /> {benefit}
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/admin/cards/create-premium"
                            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 group"
                        >
                            Launch High-End Experience
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-20 text-center">
                <p className="text-sm text-gray-400 font-medium">Trusted by 10,000+ professionals worldwide.</p>
            </div>
        </div>
    );
};

export default CreateSelection;
