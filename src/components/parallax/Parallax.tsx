import React, { useEffect, useState, ReactNode } from 'react';

interface ParallaxProps {
    filter?: boolean;
    className?: string;
    children?: ReactNode;
    style?: React.CSSProperties;
    image: string;
    small?: boolean;
    responsive?: boolean;
}

const Parallax: React.FC<ParallaxProps> = ({
    filter = false,
    className = '',
    children,
    style = {},
    image,
    small = false,
    responsive = false
}) => {
    const [transform, setTransform] = useState('translate3d(0,0px,0)');

    const resetTransform = (): void => {
        const windowScrollTop = window.pageYOffset / 3;
        setTransform(`translate3d(0,${windowScrollTop}px,0)`);
    };

    useEffect(() => {
        if (window.innerWidth >= 768) {
            window.addEventListener('scroll', resetTransform);
        }

        return function cleanup() {
            if (window.innerWidth >= 768) {
                window.removeEventListener('scroll', resetTransform);
            }
        };
    }, []);

    const parallaxClasses = `
    bg-cover bg-center bg-no-repeat relative
    ${filter ? 'before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:opacity-40 before:z-0' : ''}
    ${small ? 'h-[380px]' : 'h-[660px]'}
    ${responsive ? 'md:h-[660px] min-h-[320px]' : ''}
    ${className}
  `;

    return (
        <div
            className={parallaxClasses.trim()}
            style={{
                ...style,
                backgroundImage: `url(${image})`,
                transform: transform
            }}
        >
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
};

export default Parallax;