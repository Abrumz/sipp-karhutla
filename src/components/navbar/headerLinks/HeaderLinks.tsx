import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import useAuth from '@/context/auth';

interface CustomDropdownProps {
    buttonText: string;
    children: React.ReactNode;
    darkMode?: boolean;
    headerColor?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ buttonText, children, darkMode = false, headerColor = 'white' }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen]);

    // Determine text color based on header color
    const textColorClass = headerColor === 'white' || headerColor === 'transparent'
        ? "text-gray-800 hover:text-gray-600"
        : "text-black hover:text-gray-200";

    return (
        <div className="relative group" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-2 focus:outline-none group flex items-center ${textColorClass}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {buttonText}
                <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <div
                    className={`
                        absolute z-10 w-48 py-2 mt-1 bg-white rounded-md shadow-lg 
                        ring-1 ring-black ring-opacity-5 focus:outline-none
                        transition-all duration-200 transform origin-top-right
                        scale-100 opacity-100
                    `}
                    role="menu"
                    aria-orientation="vertical"
                >
                    {children}
                </div>
            )}
        </div>
    );
};

// Mobile Dropdown component for better mobile experience
const MobileDropdown: React.FC<{ buttonText: string; children: React.ReactNode }> = ({ buttonText, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-800 hover:bg-gray-100 transition-colors"
            >
                <span>{buttonText}</span>
                <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="w-full bg-gray-50 overflow-hidden transition-all duration-200 max-h-96"
                    style={{
                        animation: 'slideDown 0.2s ease-out forwards'
                    }}
                >
                    {children}
                </div>
            )}

            <style jsx>{`
                @keyframes slideDown {
                    from { max-height: 0; opacity: 0; }
                    to { max-height: 500px; opacity: 1; }
                }
            `}</style>
        </div>
    );
};

interface AuthenticatedMenuProps {
    logout: () => void;
    darkMode?: boolean;
    headerColor?: string;
    isMobile?: boolean;
}

const AuthenticatedMenu: React.FC<AuthenticatedMenuProps> = ({
    logout,
    darkMode = false,
    headerColor = 'white',
    isMobile = false
}) => {
    const { user } = useAuth();

    const data_pengguna_menu = [0, 1, 2];
    const hak_akses_menu = [0, 1, 2];
    const penugasan_menu = [0, 1, 2, 3, 4, 5, 6, 7];
    const wilayah_menu = [0, 1, 2, 3, 4, 5, 6, 7];

    const showPenggunaMenu = user && data_pengguna_menu.includes(user.roleLevel);
    const showAksesMenu = user && hak_akses_menu.includes(user.roleLevel);
    const showPenugasanMenu = user && penugasan_menu.includes(user.roleLevel);
    const showWilayahMenu = user && wilayah_menu.includes(user.roleLevel);

    const showUserManagementDropdown = showPenggunaMenu || showAksesMenu || showPenugasanMenu || showWilayahMenu;

    const textColorClass = headerColor === 'white' || headerColor === 'transparent'
        ? "text-gray-800 hover:text-gray-600"
        : "text-black hover:text-gray-200";

    // Mobile menu rendering
    if (isMobile) {
        return (
            <div className="flex flex-col w-full">
                <Link href="/" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors border-b border-gray-100">
                    Beranda
                </Link>

                <Link href="/patroli" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors border-b border-gray-100">
                    Kegiatan
                </Link>

                <MobileDropdown buttonText="Pelaporan">
                    <div className="py-1 border-b border-gray-100" role="none">
                        <Link href="/pelaporan/laporan-ringkasan" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                            Laporan Ringkasan
                        </Link>
                        <Link href="/pelaporan/rentang-tanggal" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                            Rentang Tanggal
                        </Link>
                        <Link href="/pelaporan/surat-tugas" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                            Surat Tugas
                        </Link>
                    </div>
                </MobileDropdown>

                {showUserManagementDropdown && (
                    <MobileDropdown buttonText="Manajemen Pengguna">
                        <div className="py-1" role="none">
                            {showPenggunaMenu && (
                                <Link href="/pengguna" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                                    Data Pengguna
                                </Link>
                            )}
                            {showAksesMenu && (
                                <Link href="/pengguna/hak-akses" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                                    Hak Akses
                                </Link>
                            )}
                            {showPenugasanMenu && (
                                <Link href="/penugasan" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                                    Penugasan
                                </Link>
                            )}
                            {showWilayahMenu && (
                                <Link href="/wilayah" className="block pl-8 pr-4 py-3 text-gray-700 hover:bg-gray-100" role="menuitem">
                                    Wilayah Kerja
                                </Link>
                            )}
                        </div>
                    </MobileDropdown>
                )}

                <Link href="/hotspot" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors">
                    Hotspot
                </Link>

                <Link
                    href="https://sipongi.menlhk.go.id/sipp-karhutla/api_v2/analisis/map/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c2VyIjoiNzQiLCJpbnN0YW5zaSI6Ii0iLCJuYW1hIjoiTXVoYW1tYWQgRmFraHJpIiwiZW1haWwiOiJzaXBwLWthcmh1dGxhQGdtYWlsLmNvbSIsIm5vX3JlZ2lzdHJhc2kiOiIzMjcxMDYxMTExMDAwMDEwMTAxMDEwIiwiaW5pdGlhbCI6MTY4MDU3NzUzMiwiZXhwaXJlZCI6MTY4MDU5NTUzMn0.yhC7Awezgm4V99WbU0pZeQRbkilAHHjXThXSjpcdr1Y"
                    className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Analisis
                </Link>

                <Link href="/about" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors">
                    Tentang Sistem
                </Link>

                <Link href="/faq" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors">
                    FAQ
                </Link>

                <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link href="/profile" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors">
                        Profil
                    </Link>
                    <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // Desktop menu rendering
    return (
        <div className="flex items-center space-x-1 overflow-x-auto md:overflow-visible md:space-x-2 whitespace-nowrap">
            <Link href="/" className={`px-3 py-2 ${textColorClass}`}>
                Beranda
            </Link>

            <Link href="/patroli" className={`px-3 py-2 ${textColorClass}`}>
                Kegiatan
            </Link>

            <CustomDropdown buttonText="Pelaporan" headerColor={headerColor}>
                <div className="py-1" role="none">
                    <Link href="/pelaporan/laporan-ringkasan" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                        Laporan Ringkasan
                    </Link>
                    <Link href="/pelaporan/rentang-tanggal" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                        Rentang Tanggal
                    </Link>
                    <Link href="/pelaporan/surat-tugas" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                        Surat Tugas
                    </Link>
                </div>
            </CustomDropdown>

            {showUserManagementDropdown && (
                <CustomDropdown buttonText="Manajemen Pengguna" headerColor={headerColor}>
                    <div className="py-1" role="none">
                        {showPenggunaMenu && (
                            <Link href="/pengguna" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                                Data Pengguna
                            </Link>
                        )}

                        {showAksesMenu && (
                            <Link href="/pengguna/hak-akses" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                                Hak Akses
                            </Link>
                        )}

                        {showPenugasanMenu && (
                            <Link href="/penugasan" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                                Penugasan
                            </Link>
                        )}

                        {showWilayahMenu && (
                            <Link href="/wilayah" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                                Wilayah Kerja
                            </Link>
                        )}
                    </div>
                </CustomDropdown>
            )}

            <Link href="/hotspot" className={`px-3 py-2 ${textColorClass}`}>
                Hotspot
            </Link>

            <Link
                href="https://sipongi.menlhk.go.id/sipp-karhutla/api_v2/analisis/map/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c2VyIjoiNzQiLCJpbnN0YW5zaSI6Ii0iLCJuYW1hIjoiTXVoYW1tYWQgRmFraHJpIiwiZW1haWwiOiJzaXBwLWthcmh1dGxhQGdtYWlsLmNvbSIsIm5vX3JlZ2lzdHJhc2kiOiIzMjcxMDYxMTExMDAwMDEwMTAxMDEwIiwiaW5pdGlhbCI6MTY4MDU3NzUzMiwiZXhwaXJlZCI6MTY4MDU5NTUzMn0.yhC7Awezgm4V99WbU0pZeQRbkilAHHjXThXSjpcdr1Y"
                className={`px-3 py-2 ${textColorClass}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Analisis
            </Link>

            <Link href="/about" className={`hidden md:block px-3 py-2 ${textColorClass}`}>
                Tentang Sistem
            </Link>

            <Link href="/faq" className={`hidden md:block px-3 py-2 ${textColorClass}`}>
                FAQ
            </Link>

            <CustomDropdown buttonText="Akun" headerColor={headerColor}>
                <div className="py-1" role="none">
                    <Link href="/profile" className="block px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                        Profil
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <Link href="/about" className="block md:hidden px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                        Tentang Sistem
                    </Link>
                    <Link href="/faq" className="block md:hidden px-4 py-2 text-l text-gray-700 hover:bg-gray-100" role="menuitem">
                        FAQ
                    </Link>
                    <hr className="my-1 border-gray-200 md:hidden" />
                    <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-l text-red-600 hover:bg-gray-100"
                        role="menuitem"
                    >
                        Logout
                    </button>
                </div>
            </CustomDropdown>
        </div>
    );
};

const UnauthenticatedMenu: React.FC<{ darkMode?: boolean; headerColor?: string; isMobile?: boolean }> = ({
    darkMode = false,
    headerColor = 'white',
    isMobile = false
}) => {
    const textColorClass = headerColor === 'white' || headerColor === 'transparent'
        ? "text-gray-800 hover:text-gray-600"
        : "text-black hover:text-gray-200";

    if (isMobile) {
        return (
            <div className="mt-auto border-t border-gray-200 py-2">
                <Link href="/login" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center">
            <Link href="/login" className={`px-3 py-2 ${textColorClass} flex items-center`}>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login
            </Link>
        </div>
    );
};

interface HeaderLinksProps {
    darkMode?: boolean;
    headerColor?: string;
    isMobile?: boolean;
}

const HeaderLinks: React.FC<HeaderLinksProps> = ({ darkMode = false, headerColor = 'primary', isMobile = false }) => {
    const { isAuthenticated, logout } = useAuth();

    return isAuthenticated ? (
        <AuthenticatedMenu logout={logout} headerColor={headerColor} isMobile={isMobile} />
    ) : (
        <UnauthenticatedMenu headerColor={headerColor} isMobile={isMobile} />
    );
};

export default HeaderLinks;