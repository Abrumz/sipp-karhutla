import React from 'react';
import { PatroliData } from '@/interfaces';

interface InfoWindowContentProps {
    patroli?: PatroliData;
    isLoggedin?: boolean;
    apiV2URL: string;
    onClose?: () => void;
}

const kategoriColors = {
    "Mandiri": {
        background: "var(--bs-primary)",
        textColor: "white",
        light: "#cfe2ff"
    },
    "Rutin": {
        background: "var(--bs-warning)",
        textColor: "black",
        light: "#fff3cd"
    },
    "Terpadu": {
        background: "var(--bs-success)",
        textColor: "white",
        light: "#d1e7dd"
    },
    "Pemadaman": {
        background: "var(--bs-danger)",
        textColor: "white",
        light: "#f8d7da"
    }
};

const getKategoriColor = (kategori: string) => {
    if (!kategori) return kategoriColors.Mandiri;

    if (kategori.includes("Mandiri")) return kategoriColors.Mandiri;
    if (kategori.includes("Rutin")) return kategoriColors.Rutin;
    if (kategori.includes("Terpadu")) return kategoriColors.Terpadu;
    if (kategori.includes("Pemadaman")) return kategoriColors.Pemadaman;

    return {
        background: "#757575",
        textColor: "white",
        light: "#F5F5F5"
    };
};

const InfoWindowContent: React.FC<InfoWindowContentProps> = ({ patroli, isLoggedin, apiV2URL, onClose }) => {
    if (!patroli) {
        return <h3>No Content</h3>;
    }

    // Mendukung struktur data lama dan baru
    const kategoriPatroli = patroli.kategori_patroli || patroli.kategori || "Mandiri";
    const daerahPatroli = patroli.id_daerah_patroli?.nama_daerah_patroli || patroli.daerah || "";
    const latitude = (patroli.laporanDarat && patroli.laporanDarat[0]?.latitude) || patroli.latitude || patroli.lat || "";
    const longitude = (patroli.laporanDarat && patroli.laporanDarat[0]?.longitude) || patroli.longitude || patroli.lon || "";
    const idLaporanHeader = patroli.id_laporan_header || patroli.id || "";

    const reportLink = `${apiV2URL}/karhutla/download/${idLaporanHeader}`;
    const fotoLink = `${apiV2URL}/karhutla/foto?id=${idLaporanHeader}`;

    const kategoriColor = getKategoriColor(kategoriPatroli);

    // Fallback untuk struktur data sederhana
    if (!patroli.id_daerah_patroli && !patroli.regu_patroli) {
        return (
            <div className="font-sans w-full max-w-[280px] p-0 m-0 rounded-lg overflow-hidden shadow-md bg-white text-l">
                <div
                    className="flex items-center justify-between p-3"
                    style={{
                        background: kategoriColor.background,
                        color: kategoriColor.textColor
                    }}
                >
                    <div className="flex-1">
                        <h3 className="m-0 mb-1 text-base font-semibold leading-tight break-words">
                            {daerahPatroli}
                        </h3>
                        <div className="text-l opacity-90 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span className="text-l leading-tight break-words">
                                Lat: {latitude} | Lng: {longitude}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-white">
                    <div className="grid gap-2.5">
                        <InfoRow
                            label="Kategori"
                            value={
                                <span
                                    className="inline-block px-1.5 py-0.5 rounded text-l font-semibold"
                                    style={{
                                        background: kategoriColor.light,
                                        color: kategoriColor.background
                                    }}
                                >
                                    {kategoriPatroli}
                                </span>
                            }
                        />

                        <InfoRow
                            label="Kode"
                            value={
                                <span className="block text-l leading-tight break-words">
                                    #{patroli.kode || ""}
                                </span>
                            }
                        />

                        <InfoRow
                            label="Daops"
                            value={
                                <span className="block text-l leading-tight break-words">
                                    {patroli.daops || ""}
                                </span>
                            }
                        />

                        <InfoRow
                            label="Ketua Regu"
                            value={
                                <div className="text-l leading-tight">
                                    <div className="break-words">{patroli.ketua || ""}</div>
                                </div>
                            }
                        />
                    </div>

                    {isLoggedin && (
                        <div className="mt-3 flex gap-2 justify-end">
                            <ActionButton
                                href={`${apiV2URL}/patroli/${patroli.id || ""}`}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                }
                                text="Detail"
                                bgColorClass="bg-gray-100"
                                textColorClass="text-black-700"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Struktur data yang lebih lengkap
    return (
        <div className="font-sans w-full max-w-[280px] p-0 m-0 rounded-lg overflow-hidden shadow-md bg-white text-l">
            <div
                className="flex items-center justify-between p-3"
                style={{
                    background: kategoriColor.background,
                    color: kategoriColor.textColor
                }}
            >
                <div className="flex-1">
                    <h3 className="m-0 mb-1 text-base font-semibold leading-tight break-words">
                        {daerahPatroli}
                    </h3>
                    <div className="text-l opacity-90 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="text-l leading-tight break-words">
                            Lat: {latitude} | Lng: {longitude}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-white">
                <div className="grid gap-2.5">
                    <InfoRow
                        label="Kategori"
                        value={
                            <span
                                className="inline-block px-1.5 py-0.5 rounded text-l font-semibold"
                                style={{
                                    background: kategoriColor.light,
                                    color: kategoriColor.background
                                }}
                            >
                                {kategoriPatroli}
                            </span>
                        }
                    />

                    {patroli.regu_patroli?.daerah?.nama_daops && (
                        <InfoRow
                            label="Regu/Tim"
                            value={
                                <span className="block text-l leading-tight break-words">
                                    {patroli.regu_patroli.daerah.nama_daops}
                                </span>
                            }
                        />
                    )}

                    {patroli.regu_patroli?.ketua?.nama && (
                        <InfoRow
                            label="Ketua Regu"
                            value={
                                <div className="text-l leading-tight">
                                    <div className="break-words">{patroli.regu_patroli.ketua.nama}</div>
                                    {patroli.regu_patroli.ketua.email && (
                                        <div className="text-[11px] text-black-600 mt-0.5 break-all">
                                            {patroli.regu_patroli.ketua.email}
                                        </div>
                                    )}
                                </div>
                            }
                        />
                    )}

                    {patroli.id_daerah_patroli?.tipe_wilayah && patroli.id_daerah_patroli?.nama_wilayah && (
                        <InfoRow
                            label="Wilayah"
                            value={
                                <span className="block text-l leading-tight break-words">
                                    {`${patroli.id_daerah_patroli.tipe_wilayah} ${patroli.id_daerah_patroli.nama_wilayah}`}
                                </span>
                            }
                        />
                    )}

                    {isLoggedin && patroli.kategori_patroli === 'Pemadaman' && patroli.status_padam && (
                        <InfoRow
                            label="Status"
                            value={
                                <span
                                    className={`inline-block px-1.5 py-0.5 rounded text-l ${patroli.status_padam === 'Selesai'
                                        ? 'bg-green-50 text-green-800'
                                        : 'bg-orange-50 text-orange-800'
                                        }`}
                                >
                                    {patroli.status_padam}
                                </span>
                            }
                        />
                    )}
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                    {patroli.kategori_patroli === 'Pemadaman' && (
                        <ActionButton
                            href={fotoLink}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            }
                            text="Lihat Foto"
                            bgColorClass="bg-light"
                            textColorClass="text-background"
                            bgColor={kategoriColor.light}
                            textColor={kategoriColor.background}
                        />
                    )}

                    {((isLoggedin && patroli.kategori_patroli === 'Pemadaman') ||
                        (isLoggedin && patroli.my_daops && patroli.kategori_patroli !== 'Pemadaman')) && (
                            <ActionButton
                                href={reportLink}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                }
                                text="Unduh Laporan"
                                bgColorClass="bg-gray-100"
                                textColorClass="text-black-700"
                            />
                        )}
                </div>
            </div>
        </div>
    );
};

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <div className="flex items-start">
        <div className="w-[70px] text-l text-black-600 font-medium flex-shrink-0 pt-0.5">
            {label}
        </div>
        <div className="w-3 text-center text-black-400 flex-shrink-0 pt-0.5">:</div>
        <div className="flex-1 min-w-0 max-w-[calc(100%-82px)]">
            {value}
        </div>
    </div>
);

interface ActionButtonProps {
    href: string;
    icon: React.ReactNode;
    text: string;
    bgColorClass: string;
    textColorClass: string;
    bgColor?: string;
    textColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    href,
    icon,
    text,
    bgColorClass,
    textColorClass,
    bgColor,
    textColor
}) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded ${bgColorClass} ${textColorClass} no-underline text-l font-medium transition-colors hover:bg-opacity-90 min-w-[100px] text-center`}
            style={{
                backgroundColor: bgColor || (bgColorClass.includes('[') ? bgColorClass.match(/\[(.*?)\]/)?.[1] : ''),
                color: textColor || (textColorClass.includes('[') ? textColorClass.match(/\[(.*?)\]/)?.[1] : '')
            }}
        >
            {icon}
            {text}
        </a>
    );
};

export default InfoWindowContent;