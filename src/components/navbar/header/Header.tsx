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
    brand?: string;
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

                {mobileOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                            onClick={handleDrawerToggle}
                        ></div>
                        <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <span className="text-lg font-bold">{brand}</span>
                                    <button
                                        onClick={handleDrawerToggle}
                                        className="p-2 rounded-full hover:bg-gray-100"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {leftLinks && (
                                        <div className="space-y-4 border-b pb-4">
                                            {leftLinks}
                                        </div>
                                    )}

                                    {rightLinks && (
                                        <div className="space-y-4">
                                            {rightLinks}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {fixed && headerHeight > 0 && (
                <div
                    // style={{ height: `${headerHeight}px` }}
                    className="w-full"
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default Header;