import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logoManggalaAgni from '@/assets/img/logo-manggala.png';
import logoIPB from '@/assets/img/logo-ipb.png';
import logoKLHK from '@/assets/img/logo-klhk2.png';
import logoLPDP from '@/assets/img/logo-lpdp.png';
import logoITTO from '@/assets/img/itto_logo_web_light_sm.gif';

interface FooterProps {
    whiteFont?: boolean;
}

const Footer: React.FC<FooterProps> = ({ whiteFont = false }) => {
    const partners = [
        { name: 'IPB University', logo: logoIPB, altText: 'Logo IPB' },
        { name: 'KLHK', logo: logoKLHK, altText: 'Logo KLHK' },
        { name: 'Manggala Agni', logo: logoManggalaAgni, altText: 'Logo Manggala Agni' },
        { name: 'LPDP', logo: logoLPDP, altText: 'Logo LPDP' },
        { name: 'ITTO', logo: logoITTO, altText: 'Logo ITTO' },
    ];

    // For mobile carousel
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Auto carousel for mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            const interval = setInterval(() => {
                setCurrentIndex(prevIndex =>
                    prevIndex === partners.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [partners.length]);

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        handleSwipe();
    };

    const handleSwipe = () => {
        const difference = touchStartX.current - touchEndX.current;
        if (difference > 50) {
            // Swipe left
            setCurrentIndex(prevIndex =>
                prevIndex === partners.length - 1 ? 0 : prevIndex + 1
            );
        } else if (difference < -50) {
            // Swipe right
            setCurrentIndex(prevIndex =>
                prevIndex === 0 ? partners.length - 1 : prevIndex - 1
            );
        }
    };

    return (
        <footer
            className={`py-6 md:py-8 ${whiteFont
                ? 'bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white'
                : 'bg-white text-black-700'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center">
                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h3 className={`text-lg font-semibold ${whiteFont ? 'text-white' : 'text-black-800'}`}>Kerjasama</h3>
                        <div className="h-0.5 w-20 mx-auto mt-2 bg-blue-500"></div>
                    </div>

                    <div
                        className="md:hidden w-full overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <button
                                onClick={() => setCurrentIndex(prevIndex => prevIndex === 0 ? partners.length - 1 : prevIndex - 1)}
                                className={`p-1 rounded-full ${whiteFont ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'} mr-4`}
                                aria-label="Previous partner"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className={`p-4 rounded-lg ${whiteFont ? 'bg-white/10 backdrop-blur-l' : 'bg-gray-50'} shadow-md w-40 h-28 flex items-center justify-center transition-all duration-300`}>
                                <Image
                                    src={partners[currentIndex].logo}
                                    alt={partners[currentIndex].altText}
                                    width={80}
                                    height={60}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => setCurrentIndex(prevIndex => prevIndex === partners.length - 1 ? 0 : prevIndex + 1)}
                                className={`p-1 rounded-full ${whiteFont ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'} ml-4`}
                                aria-label="Next partner"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex justify-center space-x-2 mb-4">
                            {partners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === index
                                        ? whiteFont ? 'bg-white' : 'bg-blue-600'
                                        : whiteFont ? 'bg-blue-700' : 'bg-gray-300'
                                        }`}
                                    aria-label={`Go to partner ${index + 1}`}
                                />
                            ))}
                        </div>

                        <p className="text-center text-l mb-6">
                            {partners[currentIndex].name}
                        </p>
                    </div>

                    <div className="hidden md:grid grid-cols-5 gap-4 justify-items-center items-center">
                        {partners.map((partner, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${whiteFont ? 'bg-white/10 backdrop-blur-l hover:bg-white/20' : 'bg-gray-50 hover:bg-gray-100'
                                    } shadow-l hover:shadow-md transition-all duration-300 flex items-center justify-center h-28 w-36`}
                            >
                                <Image
                                    src={partner.logo}
                                    alt={partner.altText}
                                    width={80}
                                    height={60}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <details className="mt-8 w-full max-w-3xl">
                        <summary className={`flex items-center justify-center cursor-pointer ${whiteFont ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'
                            } text-l font-medium`}>
                            <span>Informasi Kolaborasi</span>
                            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>

                        <div className={`mt-3 text-l ${whiteFont ? 'text-blue-100' : 'text-black-600'}`}>
                            <p className="text-center md:text-justify">
                                Sistem ini dikembangkan sejak tahun 2020 oleh Departemen Ilmu Komputer FMIPA IPB (saat ini menjadi Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB), bekerja sama dengan Balai Pengendalian Perubahan Iklim dan Kebakaran Hutan dan Lahan (PPIKHL) Wilayah Sumatra dan Kalimatan, dan Direktorat Pengendalian Kebakaran Hutan dan Lahan, Kementerian Lingkungan Hidup dan Kehutanan (saat ini menjadi Kementerian Kehutanan), didanai oleh Lembaga Pengelola Dana Pendidikan (LPDP), Kementerian Keuangan Republik Indonesia dan International Tropical Timber Organization (ITTO).

                            </p>
                        </div>
                    </details>

                    <div className={`mt-6 pt-4 border-t ${whiteFont ? 'border-white/10' : 'border-gray-200'} w-full`}>
                        <div className="flex flex-col items-center">
                            <p className={`text-l ${whiteFont ? 'text-white/80' : 'text-black-600'}`}>
                                © {new Date().getFullYear()} SIPP Karhutla
                            </p>
                            <p className={`text-l mt-1 ${whiteFont ? 'text-blue-100' : 'text-black-600'} text-center`}>
                                Sekolah Sains Data, Matematika dan Informatika (SSMI) IPB<br />
                                Jl. Meranti Wing 20 Level V, Bogor, Indonesia 16680<br />
                                E-mail: <a href="mailto:karhutla.ipb@apps.ipb.ac.id" className={`${whiteFont ? 'text-blue-200 hover:text-white' : 'text-blue-700 hover:text-blue-900'} underline transition-colors`}>karhutla.ipb@apps.ipb.ac.id</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
