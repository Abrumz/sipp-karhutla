import React, { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { getColorClass, ColorType } from '@/utils/colorUtils';

interface ChangeColorConfig {
    height: number;
    color: ColorType;
}

interface HeaderProps {
    color?: ColorType;
    rightLinks?: ReactNode;
    leftLinks?: ReactNode;
    brand?: ReactNode;
    fixed?: boolean;
    absolute?: boolean;
    changeColorOnScroll?: ChangeColorConfig;
}

const Header: React.FC<HeaderProps> = ({
    color = 'white',
    rightLinks,
    leftLinks,
    brand,
    fixed = false,
    absolute = false,
    changeColorOnScroll
}) => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [headerColor, setHeaderColor] = useState<ColorType>(color);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const headerColorChange = (): void => {
        const windowsScrollTop = window.scrollY;

        setIsScrolled(windowsScrollTop > 10);

        if (windowsScrollTop > 50) {
            setHeaderColor('white');
        } else {
            setHeaderColor(color);
        }
    };

    useEffect(() => {
        setHeaderColor(color);

        headerColorChange();
        window.addEventListener('scroll', headerColorChange);

        const measureHeaderHeight = () => {
            if (fixed) {
                const headerElement = document.querySelector('header');
                if (headerElement) {
                    const height = headerElement.offsetHeight;
                    setHeaderHeight(height);

                    document.documentElement.style.setProperty('--header-height', `${height}px`);
                    document.body.style.paddingTop = `${height}px`;
                    document.body.classList.add('has-fixed-header');
                }
            }
        };

        setTimeout(measureHeaderHeight, 0);

        return function cleanup() {
            window.removeEventListener('scroll', headerColorChange);

            if (fixed) {
                document.body.style.paddingTop = '0';
                document.body.classList.remove('has-fixed-header');
            }
        };
    }, [color, fixed, changeColorOnScroll]);

    // Add body lock when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const handleDrawerToggle = (): void => {
        setMobileOpen(!mobileOpen);
    };

    const currentColorClasses = getColorClass(headerColor);

    let appBarClasses = [
        'flex', 'flex-wrap', 'items-center', 'justify-between',
        'px-4', 'py-4', 'transition-all', 'duration-300',
    ];

    if (isScrolled) {
        appBarClasses.push('py-2', 'shadow-lg');
    } else if (headerColor !== 'transparent') {
        appBarClasses.push('shadow-md');
    }

    if (fixed) {
        appBarClasses.push('fixed', 'top-0', 'left-0', 'w-full', 'z-50');
    } else if (absolute) {
        appBarClasses.push('absolute', 'top-0', 'left-0', 'w-full', 'z-40');
    }

    appBarClasses = [...appBarClasses, ...currentColorClasses];

    const brandComponent = (
        <Link href="/">
            <span className="text-xl font-bold py-2 cursor-pointer hover:opacity-80 transition-opacity">
                {brand}
            </span>
        </Link>
    );

    return (
        <>
            <header className={appBarClasses.join(' ')} id="header">
                <div className="container mx-auto flex items-center justify-between">
                    {leftLinks !== undefined ? (
                        <div className="flex items-center">
                            {brandComponent}
                        </div>
                    ) : (
                        brandComponent
                    )}

                    <div className="flex-grow flex items-center justify-center">
                        {leftLinks !== undefined && (
                            <div className="hidden md:flex space-x-6 ml-8">
                                {leftLinks}
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {rightLinks}
                    </div>

                    <div className="md:hidden">
                        <button
                            className="p-2 rounded-md text-current hover:bg-black hover:bg-opacity-10 transition-colors"
                            aria-label={mobileOpen ? "close menu" : "open menu"}
                            onClick={handleDrawerToggle}
                        >
                            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Modal */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={handleDrawerToggle}
                >
                    {/* Mobile Menu Content */}
                    <div
                        className={`absolute top-0 left-0 h-full w-4/5 max-w-l bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <div className="text-lg font-bold">{brand}</div>
                            <button
                                onClick={handleDrawerToggle}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close menu"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="px-4">
                            <div className="py-2 border-b border-gray-100">
                                {leftLinks && (
                                    <div className="space-y-2 py-2">
                                        {leftLinks}
                                    </div>
                                )}
                            </div>

                            <div className="py-2">
                                {rightLinks && (
                                    <div className="space-y-2 py-2">
                                        {/* Clone rightLinks and add isMobile prop */}
                                        {React.isValidElement<{ isMobile?: boolean }>(rightLinks) && React.cloneElement(rightLinks, { isMobile: true })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {fixed && headerHeight > 0 && (
                <div
                    className="w-full"
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default Header;