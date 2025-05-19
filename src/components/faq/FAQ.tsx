import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Loader from '@/components/loader/Loader';
import useAuth, { ProtectRoute } from '@/context/auth';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Info } from 'lucide-react';
import { faqData } from './FAQData';

const FAQ: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [date, setDate] = useState(moment());
    const [expanded, setExpanded] = useState('panel1');
    const [openSubItems, setOpenSubItems] = useState<Record<string, boolean>>({});

    // Toggle the main accordion
    const handleChange = (panel: string) => {
        setExpanded(expanded === panel ? '' : panel);
    };

    // Toggle sub-items
    const toggleSubItem = (id: string) => {
        setOpenSubItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout >
            <div className="bg-gray-50 min-h-screen pb-8">
                {/* Header Section */}
                <div className="relative py-10 px-4 mb-8 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-lg shadow-lg">
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white opacity-5 rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white opacity-5 rounded-full"></div>

                    <div className="relative flex flex-col items-center justify-center text-center z-10">
                        <div className="inline-flex items-center justify-center p-2 rounded-full bg-white bg-opacity-10 mb-4">
                            <HelpCircle className="text-white w-10 h-10" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Pertanyaan yang Sering Diajukan
                        </h1>
                        <p className="text-blue-100 text-lg max-w-2xl">
                            Panduan untuk mengatasi masalah umum pada Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        {/* Main Accordion */}
                        {faqData.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <div
                                    className={`transition-all duration-300 ${expanded === item.id
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                                        : 'bg-white text-gray-800 hover:bg-blue-50'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChange(item.id)}
                                        className="w-full flex items-center justify-between text-left p-5 focus:outline-none"
                                        aria-expanded={expanded === item.id}
                                        aria-controls={`${item.id}-content`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`${expanded === item.id ? 'text-white' : 'text-blue-600'} mr-4 flex-shrink-0`}>
                                                {item.icon}
                                            </div>
                                            <h2 className="text-xl font-bold">{item.question}</h2>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 transition-transform duration-300">
                                            {expanded === item.id ? (
                                                <ChevronUp className="h-6 w-6" />
                                            ) : (
                                                <ChevronDown className="h-6 w-6" />
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Accordion Content */}
                                {expanded === item.id && (
                                    <div
                                        id={`${item.id}-content`}
                                        className="p-5 animate-fadeIn"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {item.answers.map((answer, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 group"
                                                >
                                                    <button
                                                        onClick={() => toggleSubItem(`${item.id}-${idx}`)}
                                                        className={`w-full p-4 flex items-center justify-between text-left transition-colors duration-200
                                                            ${openSubItems[`${item.id}-${idx}`] ? 'bg-blue-50' : 'bg-white'} 
                                                            group-hover:bg-blue-50`}
                                                        aria-expanded={openSubItems[`${item.id}-${idx}`]}
                                                        aria-controls={`${item.id}-${idx}-content`}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-2 mr-3 text-white flex-shrink-0 shadow-l">
                                                                {answer.icon}
                                                            </div>
                                                            <span className="font-medium text-gray-800">{answer.question}</span>
                                                        </div>
                                                        <span className="text-blue-600 transition-transform duration-300 ml-2 flex-shrink-0">
                                                            {openSubItems[`${item.id}-${idx}`] ? (
                                                                <ChevronUp className="h-5 w-5" />
                                                            ) : (
                                                                <ChevronDown className="h-5 w-5" />
                                                            )}
                                                        </span>
                                                    </button>

                                                    {/* Sub-Accordion Content */}
                                                    {openSubItems[`${item.id}-${idx}`] && (
                                                        <div
                                                            id={`${item.id}-${idx}-content`}
                                                            className="animate-slideDown overflow-hidden"
                                                        >
                                                            <div className="p-4 text-left border-t border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                                                                <div className="pl-4 border-l-2 border-blue-400">
                                                                    <div dangerouslySetInnerHTML={{ __html: answer.answer }} className="text-gray-700 prose" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Footer Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    <div className="flex items-center mb-6 md:mb-0">
                                        <div className="h-14 w-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mr-5 shadow-md">
                                            <HelpCircle className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Ada Pertanyaan Lain?</h3>
                                            <p className="text-gray-600 mt-1">Tim kami siap membantu Anda menyelesaikan masalah</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <a
                                            href="mailto:karhutla.ipb@apps.ipb.ac.id"
                                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                                        >
                                            <Mail className="h-5 w-5 mr-2" />
                                            Email Kami
                                        </a>

                                        <a
                                            href="#"
                                            className="bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg shadow-l hover:bg-blue-50 transition-all duration-200 flex items-center"
                                        >
                                            <Info className="h-5 w-5 mr-2" />
                                            Bantuan
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
};

export default ProtectRoute(FAQ);