import React from 'react';
import Link from 'next/link';
import useAuth from '@/context/auth';

// Definisi konstanta yang sama dengan _app.tsx
const PROTECTED_ROUTES: Record<string, number[]> = {
    '/wilayah/posko': [0, 1, 2, 3, 4, 5],
    '/wilayah/daops': [0, 1, 2, 3, 4, 5],
    '/wilayah/korwil': [0, 1, 2, 3, 4, 5],
    '/wilayah/balai': [0, 1, 2, 3, 4, 5],
    '/wilayah': [0, 1, 2, 3, 4, 5, 6, 7]
};

interface NavBtnGroupProps {
    page: string;
}

const NavBtnGroup: React.FC<NavBtnGroupProps> = ({ page }) => {
    // Mengambil user dari auth context
    const { user, isAuthenticated } = useAuth();
    const roleLevel = user?.roleLevel;

    const navItems = [
        { key: 'balai', label: 'BALAI', href: '/wilayah/balai' },
        { key: 'korwil', label: 'KORWIL', href: '/wilayah/korwil' },
        { key: 'daops', label: 'DAERAH OPERASI', href: '/wilayah/daops' },
        { key: 'posko', label: 'POSKO', href: '/wilayah/posko' },
        { key: 'wilayah', label: 'WILAYAH', href: '/wilayah' }
    ];

    // Jika user belum ter-load atau tidak authenticated, tampilkan loading atau semua items
    if (!isAuthenticated || roleLevel === undefined) {
        return (
            <div className="w-full overflow-x-auto">
                <div className="flex border-b border-gray-200">
                    {navItems.map((item) => (
                        <Link href={item.href} key={item.key} passHref>
                            <div
                                className={`py-3 px-4 text-center font-medium cursor-pointer hover:bg-blue-50 transition-colors ${page === item.key
                                    ? 'text-blue-500 border-b-2 border-blue-500 bg-white'
                                    : 'text-blue-400 bg-white'
                                    }`}
                                style={{ minWidth: '120px' }}
                            >
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // Filter navItems berdasarkan role user
    const filteredNavItems = navItems.filter(item => {
        const allowedRoles = PROTECTED_ROUTES[item.href] || [];
        return allowedRoles.includes(roleLevel);
    });

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex border-b border-gray-200">
                {filteredNavItems.map((item) => (
                    <Link href={item.href} key={item.key} passHref>
                        <div
                            className={`py-3 px-4 text-center font-medium cursor-pointer hover:bg-blue-50 transition-colors ${page === item.key
                                ? 'text-blue-500 border-b-2 border-blue-500 bg-white'
                                : 'text-blue-400 bg-white'
                                }`}
                            style={{ minWidth: '120px' }}
                        >
                            {item.label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NavBtnGroup;