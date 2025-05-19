import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import useAuth from '@/context/auth';
import {
    uploadPenugasan,
    getAllProvinsi,
    getAllKabupaten,
    checkSkNumber
} from '@/services';
import Link from 'next/link';

type AlertElementProps = {
    text: string[]
}

const toTitleCase = (phrase: string) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const AlertElement = (props: AlertElementProps) => {
    return (
        <>
            {props.text.map((str, index) => (
                <p key={index}>{str}</p>
            ))}
        </>
    );
}

interface SearchableSelectProps {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    dependsOn?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    id,
    label,
    options,
    value,
    onChange,
    disabled = false,
    required = false,
    placeholder = "Pilih...",
    dependsOn = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isDisabled = disabled || dependsOn;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const selectedOption = options.find(option => option.value === value);

    return (
        <div ref={wrapperRef} className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            <div
                className={`w-full border border-gray-300 rounded-md bg-white ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => {
                    if (!isDisabled) {
                        setIsOpen(!isOpen);
                        if (!isOpen) setSearchTerm('');
                    }
                }}
            >
                <div className="flex items-center px-3 py-2">
                    <span className={`block truncate flex-grow ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <span className="pointer-events-none flex items-center ml-2">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
                >
                    <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>

                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {filteredOptions.length === 0 ? (
                            <div className="py-2 px-4 text-gray-500">
                                Tidak ada hasil
                            </div>
                        ) : (
                            <ul>
                                {filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        className={`cursor-pointer select-none py-2 px-4 hover:bg-blue-50 ${value === option.value ? "bg-blue-100" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(option.value);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`block truncate ${value === option.value ? "font-medium" : "font-normal"}`}>
                                                {option.label}
                                            </span>
                                            {value === option.value && (
                                                <span className="text-blue-600 ml-2">
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {required && <input type="hidden" name={id} required />}
        </div>
    );
};

const workTypes = [
    {
        value: 'mandiri',
        label: 'Mandiri'
    },
    {
        value: 'rutin',
        label: 'Rutin'
    },
    {
        value: 'terpadu',
        label: 'Terpadu'
    }
];

interface BerkasPenugasanProps { }

const BerkasPenugasan: React.FC<BerkasPenugasanProps> = () => {
    const { isAuthenticated } = useAuth();
    const [workFile, setWorkFile] = useState<File | null>(null);
    const [workType, setWorkType] = useState('');
    const [provinceList, setProvinceList] = useState<any[]>([]);
    const [province, setProvince] = useState('');
    const [kabupatenList, setKabupatenList] = useState<any[]>([]);
    const [kabupaten, setKabupaten] = useState('');
    const [alertMessage, setAlertMessage] = useState<string[]>([]);
    const [show, setShow] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(true);
    const [alertCheck, setAlertCheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [skNumber, setSkNumber] = useState('');

    const provinceOptions = provinceList.map(province => ({
        value: province.kode_wilayah,
        label: toTitleCase(province.nama_wilayah)
    }));

    const kabupatenOptions = kabupatenList.map(kab => ({
        value: kab.kode_wilayah,
        label: toTitleCase(kab.nama_wilayah)
    }));

    const finalProvinceOptions = workType === 'terpadu'
        ? [{ value: '0', label: 'Semua' }, ...provinceOptions]
        : provinceOptions;

    const finalKabupatenOptions = workType === 'terpadu'
        ? [{ value: '0', label: 'Semua' }, ...kabupatenOptions]
        : kabupatenOptions;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllProvinsi();
            setProvinceList(data);
        }
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setWorkFile(event.target.files[0]);
    }

    const handleSkChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSkNumber(event.target.value);
    }

    const handleWorkTypeChange = (value: string) => {
        setWorkType(value);
    }

    const handleProvinceChange = async (value: string) => {
        const data = await getAllKabupaten(value);
        setKabupatenList(data);
        setProvince(value);
    }

    const handleKabutenChange = (value: string) => {
        setKabupaten(value);
    }

    const handleClick = async () => {
        setLoading(true);
        const result = await uploadPenugasan(
            workFile as File,
            workType,
            skNumber,
            province,
            kabupaten
        );
        setLoading(false);

        if (!result.success) setAlertSuccess(false);
        else {
            setAlertSuccess(true);
            setWorkFile(null);
            setWorkType('');
            setShowCheck(false);
        }
        setAlertMessage(result.message as string[]);
        setShow(true);
    }

    const handleClickCheck = async () => {
        if (skNumber !== '') {
            const result = await checkSkNumber(skNumber);
            if (!result.success) setAlertSuccess(false);
            else {
                setAlertSuccess(true);
                setWorkFile(null);
                setWorkType('');
                setShow(false);
                setAlertCheck(true);
            }
            setAlertMessage(result.message as string[]);
            setWorkFile(null);
            setWorkType('');
            setShow(false);
            setShowCheck(true);
        }
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Upload Berkas Excel Penugasan</h1>
                    <p className="text-lg opacity-90">
                        Isi formulir di bawah untuk mengunggah dokumen penugasan baru
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {show && (
                    <div className={`mb-6 p-4 rounded-md ${alertSuccess ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'} flex justify-between items-start`}>
                        <div>
                            <AlertElement text={alertMessage} />
                        </div>
                        <button
                            onClick={() => setShow(false)}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                )}

                {showCheck && !show && (
                    <div className={`mb-6 p-4 rounded-md ${alertSuccess ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'} flex justify-between items-start`}>
                        <div>
                            {alertMessage}
                        </div>
                        <button
                            onClick={() => setShowCheck(false)}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Gunakan File EXCEL dengan format yang dapat diunduh{' '}
                                    <Link href="/sipp-karhutla/file/contoh_template.xlsx" className="text-blue-600 hover:text-blue-800 font-medium">
                                        disini
                                    </Link>
                                    <br /><br />
                                    Pastikan SEMUA kolom TERISI dan format penulisan telah sesuai.
                                    <br /><br />
                                    Ketentuan Pengisian Template File Excel Surat Tugas Aplikasi Patroli Karhutla dapat diunduh{' '}
                                    <Link href="/sipp-karhutla/file/Ketentuan Pengisian Template File Excel Surat Tugas Aplikasi Patroli Karhutla-update 9April22.pdf" className="text-blue-600 hover:text-blue-800 font-medium">
                                        disini
                                    </Link>
                                </p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Untuk Penamaan Wilayah Patroli dapat dilihat pada{' '}
                                    <Link href="/sipp-karhutla/wilayah" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Daftar Wilayah
                                    </Link>
                                    <br /><br />
                                    Dan pastikan nama wilayah sama dengan nama yang ada pada daftar wilayah tersebut.
                                </p>
                            </div>
                        </div>

                        <form className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-grow">
                                    <label htmlFor="sk-number" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor ST
                                    </label>
                                    <input
                                        type="text"
                                        id="sk-number"
                                        name="skNumber"
                                        onChange={handleSkChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="md:w-1/4 flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleClickCheck}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                    >
                                        Cek
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                                    Berkas Excel
                                </label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    name="file"
                                    onChange={handleFileChange}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!alertCheck && 'opacity-50 cursor-not-allowed'}`}
                                    disabled={!alertCheck}
                                    required
                                />
                            </div>

                            <div>
                                <SearchableSelect
                                    id="work-type"
                                    label="Kategori Penugasan"
                                    options={workTypes}
                                    value={workType}
                                    onChange={handleWorkTypeChange}
                                    placeholder="Pilih kategori"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SearchableSelect
                                    id="province"
                                    label="Provinsi"
                                    options={finalProvinceOptions}
                                    value={province}
                                    onChange={handleProvinceChange}
                                    disabled={!alertCheck}
                                    placeholder="Pilih provinsi"
                                    required
                                />

                                <SearchableSelect
                                    id="kabupaten"
                                    label="Kabupaten"
                                    options={finalKabupatenOptions}
                                    value={kabupaten}
                                    onChange={handleKabutenChange}
                                    disabled={!alertCheck}
                                    dependsOn={!province}
                                    placeholder="Pilih kabupaten"
                                    required
                                />
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center justify-center space-x-2 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <span>Upload</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Petunjuk Pengisian</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Untuk mengunggah file penugasan, ikuti langkah-langkah berikut:
                            </p>
                            <ol className="mt-2 text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Masukkan nomor surat tugas dan klik <b>Cek</b> untuk validasi</li>
                                <li>Pilih file Excel yang berisi data penugasan</li>
                                <li>Pilih kategori penugasan (Mandiri/Rutin/Terpadu)</li>
                                <li>Pilih provinsi dan kabupaten tempat penugasan</li>
                                <li>Klik tombol <b>Upload</b> untuk mengunggah</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BerkasPenugasan;