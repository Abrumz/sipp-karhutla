// components/faq/faqData.tsx
import React from 'react';
import {
    AlertCircle,
    CheckCircle,
    Info,
    Map,
    File,
    Calendar,
    Database,
    Upload,
    Wifi
} from 'lucide-react';

export const faqData = [
    {
        id: 'panel1',
        question: 'Gagal Upload Surat Tugas',
        icon: <AlertCircle className="h-6 w-6" />,
        answers: [
            {
                question: 'Cek Penulisan Jabatan',
                answer: `
                    <div class="font-bold my-2">Penulisan yang sering keliru:</div>
                    - Ketua Tim<br/>
                    - Anggota Tim<br/>
                    - Polisi<br/>
                    - Tentara<br/>
                    
                    <div class="font-bold my-2">Penulisan yang benar:</div>
                    - Ketua<br/>
                    - Anggota<br/>
                    - Polri<br/>
                    - TNI<br/>
                    - MPA<br/>
                `,
                icon: <CheckCircle className="h-5 w-5" />
            },
            {
                question: 'Cek Reg, Email dan nomor Handphone',
                answer: 'Untuk TNI, Polri, dan MPA kolom reg, email serta no HP dituliskan nama sesuai dengan kolom nama tanpa spasi.',
                icon: <Info className="h-5 w-5" />
            },
            {
                question: 'Cek Daerah Operasi',
                answer: 'Daerah Operasi diisikan dengan kodefikasi',
                icon: <Map className="h-5 w-5" />
            },
            {
                question: 'Cek Nomor SK',
                answer: 'Nomor SK pada semua baris harus sama',
                icon: <File className="h-5 w-5" />
            },
            {
                question: 'Cek Format Tanggal pada Surat Tugas',
                answer: 'Format tanggal yang benar adalah text',
                icon: <Calendar className="h-5 w-5" />
            },
            {
                question: 'Cek Daerah Patroli, Kecamatan, Kabupaten, Provinsi',
                answer: 'Penulisan nama daerah harus sesuai dengan di basis data. Jika nama daerah belum ada dalam basis data maka nama daerah harus ditambahkan oleh admin',
                icon: <Map className="h-5 w-5" />
            },
            {
                question: 'Error Baris tidak dapat diproses',
                answer: 'Hapus baris kosong di bawah tabel yang terisi atau copy tabel ke file Excel baru',
                icon: <Database className="h-5 w-5" />
            },
            {
                question: 'Format file yang diunggah',
                answer: 'Format file yang diunggah harus memiliki format .XLSX',
                icon: <Upload className="h-5 w-5" />
            },
            {
                question: 'Network Error',
                answer: 'Kendala sinyal, silahkan unggah kembali surat tugas pada kondisi sinyal yang bagus.',
                icon: <Wifi className="h-5 w-5" />
            }
        ]
    }
];