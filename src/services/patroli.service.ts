import { SimaduAPI, apiV2URL } from '@/api';
import {
    APIResponse,
    PatrolData,
    PatroliResponse,
    PatroliServiceResponse,
    PatrolListData
} from '@/interfaces';
import Moment from 'moment';

const isWithinIndonesia = (lat: any, lng: any): boolean => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (isNaN(numLat) || isNaN(numLng)) {
        return false;
    }
    const top = 6.0;
    const bottom = -11.0;
    const left = 95.0;
    const right = 141.0;
    return numLat <= top && numLat >= bottom && numLng >= left && numLng <= right;
};

export const getPatroli = async (
    date: string
): Promise<PatroliServiceResponse> => {
    const patroliSpots: PatrolData[] = [];
    const patroliTerpadu: PatrolListData[] = [];
    const patroliMandiri: PatrolListData[] = [];
    const patroliRutin: PatrolListData[] = [];
    const pemadaman: PatrolListData[] = [];
    const spotsOutsideIndonesia: any[] = [];
    const counter = {
        mandiri: 0,
        rutin: 0,
        terpadu: 0,
        padam: 0
    };

    try {
        const res: APIResponse<[[PatroliResponse]]> = await SimaduAPI.get(
            `/list?tanggal_patroli=${date}`
        );
        const patroliData = res.data;

        patroliData.forEach((item) => {
            item.forEach((patroli) => {
                if (patroli.laporanDarat[0]) {
                    const latitude = patroli.laporanDarat[0].latitude;
                    const longitude = patroli.laporanDarat[0].longitude;
                    const data: PatrolData = {
                        latitude,
                        longitude,
                        marker: '',
                        patroli: patroli,
                        id: patroli.id_laporan_header
                    };

                    const baseMarkerUrl = 'https://maps.google.com/mapfiles/ms/icons/';
                    if (patroli.kategori_patroli.includes('Mandiri')) {
                        data.marker = `${baseMarkerUrl}blue-dot.png`;
                        counter.mandiri += 1;
                    } else if (patroli.kategori_patroli.includes('Rutin')) {
                        data.marker = `${baseMarkerUrl}pink-dot.png`;
                        counter.rutin += 1;
                    } else if (patroli.kategori_patroli.includes('Terpadu')) {
                        data.marker = `${baseMarkerUrl}green-dot.png`;
                        counter.terpadu += 1;
                    } else if (patroli.kategori_patroli.includes('Pemadaman')) {
                        data.marker = `${baseMarkerUrl}red-dot.png`;
                        counter.padam += 1;
                    }
                    patroliSpots.push(data);

                    const data2: PatrolListData & { latitude: any, longitude: any } = {
                        reportLink: `${apiV2URL}/karhutla/download/${patroli.id_laporan_header}`,
                        patrolRegion: patroli.id_daerah_patroli.nama_daerah_patroli,
                        operationRegion: patroli.id_daerah_patroli.nama_daops,
                        patrolDate: Moment(patroli.tanggal_patroli).format('DD-MM-YYYY'),
                        patroli: {
                            ...patroli,
                            id: patroli.id_laporan_header,
                            type: patroli.kategori_patroli
                        },
                        latitude: latitude || 'N/A',
                        longitude: longitude || 'N/A',
                    };

                    console.log('Patroli Data:', data2);

                    if (patroli.my_daops) {
                        if (patroli.kategori_patroli.includes('Terpadu'))
                            patroliTerpadu.push(data2);
                        else if (patroli.kategori_patroli.includes('Mandiri'))
                            patroliMandiri.push(data2);
                        else if (patroli.kategori_patroli.includes('Rutin'))
                            patroliRutin.push(data2);
                        else if (patroli.kategori_patroli.includes('Pemadaman'))
                            pemadaman.push(data2);
                    }
                }
            });
        });

        patroliSpots.forEach((spot) => {
            if (!isWithinIndonesia(spot.latitude, spot.longitude)) {
                const rawPatrolData = spot.patroli;
                if (rawPatrolData) {
                    const formattedRow = {
                        patrolDate: Moment(rawPatrolData.tanggal_patroli).format('DD-MM-YYYY') || 'N/A',
                        operationRegion: rawPatrolData.id_daerah_patroli?.nama_daops || 'N/A',
                        patrolRegion: rawPatrolData.id_daerah_patroli?.nama_daerah_patroli || 'N/A',
                        desaKelurahan: rawPatrolData.laporanDarat?.[0]?.desa_kelurahan || 'N/A',
                        latitude: spot.latitude || 'N/A',
                        longitude: spot.longitude || 'N/A',
                        reportLink: `${apiV2URL}/karhutla/download/${rawPatrolData.id_laporan_header}` || '#',
                        patroli: rawPatrolData
                    };
                    spotsOutsideIndonesia.push(formattedRow);
                }
            }
        });

        return {
            patroliSpots,
            counter,
            patroliTerpadu,
            patroliMandiri,
            patroliRutin,
            pemadaman,
            spotsOutsideIndonesia
        };

    } catch (error) {
        return {
            patroliSpots,
            counter,
            patroliTerpadu,
            patroliMandiri,
            patroliRutin,
            pemadaman,
            spotsOutsideIndonesia
        };
    }
};
