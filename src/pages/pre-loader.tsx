// pages/splash-demo.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Perbaikan: Menggunakan nilai tetap alih-alih random untuk menghindari perbedaan server/client
const fireParticleData = [
    { size: 15, yOffset: -55, delay: 0.1 },
    { size: 18, yOffset: -58, delay: 0.2 },
    { size: 14, yOffset: -60, delay: 0.3 },
    { size: 20, yOffset: -52, delay: 0.4 },
    { size: 16, yOffset: -57, delay: 0.5 },
    { size: 19, yOffset: -59, delay: 0.6 },
    { size: 17, yOffset: -54, delay: 0.7 },
    { size: 15, yOffset: -56, delay: 0.8 },
    { size: 18, yOffset: -58, delay: 0.9 },
    { size: 14, yOffset: -53, delay: 1.0 },
    { size: 16, yOffset: -55, delay: 1.1 },
    { size: 19, yOffset: -57, delay: 1.2 },
    { size: 17, yOffset: -59, delay: 1.3 },
    { size: 15, yOffset: -54, delay: 1.4 },
    { size: 18, yOffset: -56, delay: 1.5 }
];

// Perbaikan: Background particles dengan posisi tetap
const backgroundParticlesData = Array(30).fill(null).map((_, i) => ({
    x: (i % 6) * 20 - 50,
    y: Math.floor(i / 6) * 20,
    opacity: 0.3 + (i % 5) * 0.1,
    scale: 0.3 + (i % 5) * 0.1
}));

// Komponen untuk satu partikel api dengan nilai tetap
const FireParticle: React.FC<{
    angle: number;
    size: number;
    yOffset: number;
    delay: number;
}> = ({ angle, size, yOffset, delay }) => {
    return (
        <motion.div
            initial={{
                y: 0,
                opacity: 0.3,
                scale: 0.5
            }}
            animate={{
                y: [-2, -8, -2],
                opacity: [0.5, 0.8, 0.5],
                scale: [0.8, 1.2, 0.8]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
            className="absolute"
            style={{
                width: `${size}px`,
                height: `${size * 1.5}px`,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: `radial-gradient(circle, rgba(255,106,0,0.9) 0%, rgba(255,166,0,0.7) 60%, rgba(255,200,0,0) 100%)`,
                transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                transformOrigin: "center bottom",
                filter: "blur(3px)",
                zIndex: -1
            }}
        />
    );
};

// Komponen untuk seluruh animasi api
const FireAnimation: React.FC = () => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute inset-0 w-full h-full"
            style={{ transformOrigin: "center center" }}
        >
            {fireParticleData.map((data, i) => (
                <FireParticle
                    key={i}
                    angle={(i / fireParticleData.length) * 360}
                    size={data.size}
                    yOffset={data.yOffset}
                    delay={data.delay}
                />
            ))}
        </motion.div>
    );
};

export default function SplashDemo() {
    // Perbaikan: Gunakan useEffect untuk memastikan kode hanya berjalan di client
    const [counter, setCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Tandai bahwa komponen sudah di-mount di client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Efek hanya dijalankan ketika komponen sudah di-mount di client
    useEffect(() => {
        if (!isMounted) return;

        // Simulasi waktu loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        const interval = setInterval(() => {
            setCounter(prevCounter => {
                if (prevCounter < 100) {
                    return prevCounter + 1;
                }
                clearInterval(interval);
                return 100;
            });
        }, 30);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [isMounted]);

    const restartLoader = () => {
        setCounter(0);
        setIsLoading(true);
    };

    // Perbaikan: Render konten sederhana di server, konten lengkap hanya di client
    return (
        <>
            <Head>
                <title>Splash Screen Demo | SIPP Karhutla</title>
                <meta name="description" content="Demo animasi splash screen untuk SIPP Karhutla" />
            </Head>

            {!isMounted ? (
                // Tampilan sederhana saat server-side rendering
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-blue-800 via-blue-900 to-indigo-900">
                    <div className="w-full max-w-md text-center">
                        <div className="mb-8 relative">
                            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                {/* Logo sederhana tanpa animasi untuk SSR */}
                                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">SIPP Kathutla</div>
                        <div className="text-l text-blue-100 mb-8">
                            Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan
                        </div>
                        <div className="w-full max-w-l mx-auto bg-blue-900/50 rounded-full h-3 mb-4"></div>
                        <div className="text-blue-200 text-l font-medium">Memuat data...</div>
                    </div>
                </div>
            ) : isLoading ? (
                // Tampilan dengan animasi lengkap hanya di client
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-blue-800 via-blue-900 to-indigo-900">
                    {/* Particle background */}
                    <div className="absolute inset-0 overflow-hidden">
                        {backgroundParticlesData.map((particle, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: `${particle.x}%`,
                                    y: `${particle.y}%`,
                                    opacity: particle.opacity,
                                    scale: particle.scale
                                }}
                                animate={{
                                    y: [null, "-100%"],
                                    opacity: [null, 0]
                                }}
                                transition={{
                                    duration: 15 + i % 5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                            />
                        ))}
                    </div>

                    <div className="w-full max-w-md text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 relative"
                        >
                            <div className="relative w-40 h-40 mx-auto">
                                {/* Fire animation around logo */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FireAnimation />
                                </div>

                                {/* Glowing effect behind logo */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.5, 0.8, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 rounded-full bg-orange-500 blur-xl opacity-30"
                                    style={{ transform: 'scale(0.7)' }}
                                />

                                {/* Logo container with 3D rotation */}
                                <motion.div
                                    animate={{
                                        rotateY: [0, 360],
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ perspective: '1000px' }}
                                >
                                    {/* Shadow under logo */}
                                    <motion.div
                                        animate={{
                                            opacity: [0.4, 0.7, 0.4]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -bottom-4 w-24 h-4 bg-black rounded-full filter blur-md opacity-30"
                                    />

                                    {/* Logo image with shine effect */}
                                    <div className="relative">
                                        <Image
                                            src="/favicon.ico"
                                            alt="Logo Sistem Patroli"
                                            width={100}
                                            height={100}
                                            className="object-contain drop-shadow-2xl"
                                        />

                                        {/* Shine effect */}
                                        <motion.div
                                            animate={{
                                                opacity: [0, 0.8, 0],
                                                left: ["-100%", "100%"]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 3,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-0 w-full h-full overflow-hidden"
                                        >
                                            <div className="absolute top-0 -left-3/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 opacity-30" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg"
                        >
                            SIPP Karhutla
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-l md:text-base text-blue-100 mb-8"
                        >
                            Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan
                        </motion.p>

                        {/* Progress bar container */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="w-full max-w-l mx-auto bg-blue-900/50 rounded-full h-3 mb-4 overflow-hidden backdrop-blur-l border border-blue-700/30"
                        >
                            {/* Progress indicator */}
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${counter}%` }}
                                transition={{ duration: 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 rounded-full relative"
                            >
                                {/* Shine effect on progress bar */}
                                <motion.div
                                    animate={{
                                        opacity: [0, 0.8, 0],
                                        left: ["-100%", "100%"]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 0.5,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 w-full h-full overflow-hidden"
                                >
                                    <div className="absolute top-0 -left-3/4 w-1/4 h-full bg-gradient-to-r from-transparent via-white to-transparent transform skew-x-12 opacity-40" />
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-blue-200 text-l font-medium"
                        >
                            Memuat data... {counter}%
                        </motion.p>

                        {/* Copyright text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                            className="text-blue-300/50 text-l absolute bottom-4 left-0 right-0 text-center"
                        >
                            © 2025 SIPP Karhutla. All rights reserved.
                        </motion.p>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Splash Screen Selesai</h1>

                    <p className="text-gray-600 mb-8 text-center max-w-md">
                        Animasi splash screen telah selesai. Anda dapat melihat kembali animasi dengan menekan tombol di bawah ini.
                    </p>

                    <button
                        onClick={restartLoader}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Putar Ulang Animasi
                    </button>
                </div>
            )}
        </>
    );
}