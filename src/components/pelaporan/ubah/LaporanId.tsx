import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useAuth, { ProtectRoute } from '@/context/auth'
import { getLaporanDetail, getDetailList, updateLaporan } from '@/services'
import ErrorPage from 'next/error'
import { ChangeEvent } from 'react'
import * as React from 'react'
import {
    MapPin,
    Clipboard,
    CloudSun,
    ThermometerSun,
    Wind,
    Droplets,
    UserCheck,
    BarChart3,
    FileText,
    Check,
    Save,
    Info,
    ArrowLeft,
    Satellite,
    Briefcase,
    Activity,
    ExternalLink
} from 'lucide-react'
import Loader from '@/components/loader/Loader'

// Define interfaces for our data types
interface LaporanDetail {
    id_laporan_header: string
    id_daerah_patroli: string
    kategori_patroli: string
    tanggal_patroli: string
    id_regu_tim_patroli: any[]
    id_aktivitas_harian: any[]
    id_inventori_patroli: any[]
    satelit_hotspot: any[]
    laporanDarat: LaporanDarat[]
    observasiGroup: any[]
}

interface LaporanDarat {
    id_laporan_darat: string
    latitude: string
    longitude: string
    desa_kelurahan: string
    kecamatan: string
    kabupaten: string
    provinsi: string
    cuaca_pagi: string
    cuaca_siang: string
    cuaca_sore: string
    curah_hujan: string
    suhu: string
    kelembaban: string
    kecepatan_angin: string
    kondisi_lapangan: string
    potensi_karhutla: string
    FFMC_KKAS: string
    FWI_ICK: string
    DC_KK: string
    aktivitas_masyarakat: string
    aksebilitas: string[]
    dokumen: any[]
}

interface Option {
    id: string
    text: string
    checked?: boolean
}

interface FormValues {
    id: string
    registrationNumber: string
    oldRegistrationNumber: string
    name: string
    email: string
    oldEmail: string
    phoneNumber: string
    errorMessage: string
    notFound: boolean
    showAlert: boolean
    alertMessage: string
}

interface CardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const FormCard: React.FC<CardProps> = ({ title, icon, children }) => {
    return (
        <div className="border border-gray-200 rounded-xl p-6 my-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-2">{icon}</span>
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

const CheckboxGroup: React.FC<{
    title: string;
    options: Option[];
    onChange: (index: number) => void;
}> = ({ title, options, onChange }) => {
    return (
        <div className="border border-gray-200 rounded-xl p-4 my-4 bg-gray-50">
            <h3 className="text-gray-700 font-medium mb-4">{title}</h3>
            <div className="space-y-2">
                {options.map((option, index) => (
                    <div key={index} className="flex items-start text-left">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                id={`option-${title}-${index}`}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={option.checked || false}
                                onChange={() => onChange(index)}
                            />
                        </div>
                        <label
                            htmlFor={`option-${title}-${index}`}
                            className="ml-3 block text-sm text-gray-700"
                        >
                            {option.text}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

function UbahLaporanId() {
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()
    const { laporanId } = router.query
    const [laporan_id, setLaporanId] = useState('')
    const [laporan_darat_id, setLaporanDaratId] = useState('')
    const [tanggal_laporan, setTanggalLaporan] = useState('')
    const [daerah_patroli, setDaerah] = useState('')
    const [regu, setRegu] = useState<any[]>([])
    const [workType, setWorkType] = useState('')
    const [workTypeList, setWorkTypeList] = useState<Option[]>([])
    const [daily_activity, setDailyActivity] = useState<Option[]>([])
    const [satelite, setSatelite] = useState<Option[]>([])
    const [inventory, setInventory] = useState<Option[]>([])
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [desa, setDesa] = useState('')
    const [kecamatan, setKecamatan] = useState('')
    const [kabupaten, setKabupaten] = useState('')
    const [provinsi, setProvinsi] = useState('')
    const [aksesibilitas, setAksesibilitas] = useState<Option[]>([])
    const [cuaca, setCuaca] = useState('')
    const [cuaca_pagi, setCuacaPagi] = useState('')
    const [cuaca_siang, setCuacaSiang] = useState('')
    const [cuaca_sore, setCuacaSore] = useState('')
    const [curah_hujan, setCurahHujan] = useState('')
    const [suhu, setSuhu] = useState('')
    const [kelembaban, setKelembaban] = useState('')
    const [kecepatan_angin, setKecepatanAngin] = useState('')
    const [ffmc, setFfmc] = useState('')
    const [fwi, setFwi] = useState('')
    const [dc, setDc] = useState('')

    const [cuacaList, setCuacaList] = useState<Option[]>([])
    const [kondisiKarhutla, setKondisiKarhutla] = useState('')
    const [kondisiKarhutlaList, setKondisiKarhutlaList] = useState<Option[]>([])
    const [potensiKarhutla, setPotensiKarhutla] = useState('')
    const [potensiKarhutlaList, setPotensiKarhutlaList] = useState<Option[]>([])
    const [aktivitasMasyarakat, setAktivitas] = useState('')
    const [aktivitasMasyarakatList, setAktivitasList] = useState<Option[]>([])
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState<any>([])
    const [dataObservasi, setObservasi] = useState<any[]>([])
    const [observasiNull, setObservasiNull] = useState(true)
    const [nomor_sk, setSK] = useState('')
    const [update_condition, setupdate] = useState(false)
    const update_role = [0, 6]
    const [values, setValues] = useState<FormValues>({
        id: '',
        registrationNumber: '',
        oldRegistrationNumber: '',
        name: '',
        email: '',
        oldEmail: '',
        phoneNumber: '',
        errorMessage: '',
        notFound: false,
        showAlert: false,
        alertMessage: ''
    })
    const [alertSuccess, setAlertSuccess] = useState(true)
    const [activeTab, setActiveTab] = useState('1')

    const handleChange = (prop: string) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleChangeTab = (newValue: string) => {
        setActiveTab(newValue)
    }

    const handleWorkTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setWorkType(event.target.value)
    }

    const handleCuacaChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCuaca(event.target.value)
    }

    const handleCuacaPagiChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCuacaPagi(event.target.value)
    }

    const handleCuacaSiangChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCuacaSiang(event.target.value)
    }

    const handleCuacaSoreChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCuacaSore(event.target.value)
    }

    const handleKondisiKarhutlaChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setKondisiKarhutla(event.target.value)
    }

    const handlePotensiKarhutlaChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setPotensiKarhutla(event.target.value)
    }

    const handleFfcmChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFfmc(event.target.value)
    }

    const handleFwiChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFwi(event.target.value)
    }

    const handleDcChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDc(event.target.value)
    }

    const handleAktivitasKarhutlaChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setAktivitas(event.target.value)
    }

    const HandleInputChange = (type: string) => (event: ChangeEvent<HTMLInputElement>) => {
        switch (type) {
            case 'latitude':
                setLatitude(event.target.value)
                break
            case 'longitude':
                setLongitude(event.target.value)
                break
            case 'desa':
                setDesa(event.target.value)
                break
            case 'kecamatan':
                setKecamatan(event.target.value)
                break
            case 'kabupaten':
                setKabupaten(event.target.value)
                break
            case 'provinsi':
                setProvinsi(event.target.value)
                break
            case 'curah_hujan':
                setCurahHujan(event.target.value)
                break
            case 'suhu':
                setSuhu(event.target.value)
                break
            case 'kelembaban':
                setKelembaban(event.target.value)
                break
            case 'kecepatan_angin':
                setKecepatanAngin(event.target.value)
                break
        }
    }

    function changeCheck(type: string, index: number) {
        const newArray: Option[] = []

        let arrayLast: Option[] = []

        switch (type) {
            case 'satelite_hotspot':
                arrayLast = satelite
                break
            case 'inventory':
                arrayLast = inventory
                break
            case 'activity':
                arrayLast = daily_activity
                break
            case 'aksesibilitas':
                arrayLast = aksesibilitas
        }

        for (const dd in arrayLast) {
            if (parseInt(dd) === index) {
                const checked = !arrayLast[dd].checked
                newArray.push({
                    ...arrayLast[dd],
                    checked: checked
                })
            } else {
                newArray.push({
                    ...arrayLast[dd],
                    checked: arrayLast[dd].checked
                })
            }
        }

        return newArray
    }

    function checkObservasi(atribut: string, value: any) {
        switch (atribut) {
            case 'Nama Pengujian':
                if (value !== null) {
                    for (const key in list['NamaPengujian']) {
                        if (value.toString() === list['NamaPengujian'][key].id)
                            return list['NamaPengujian'][key].text
                    }
                }
                break
            case 'Nilai Pengujian':
                if (value !== null) {
                    for (const key in list['NilaiPengujian']) {
                        if (value.toString() === list['NilaiPengujian'][key].id)
                            return list['NilaiPengujian'][key].text
                    }
                }
                break
            case 'Hasil Pengujian':
                if (value !== null) {
                    for (const key in list['HasilPengujian']) {
                        if (value.toString() === list['HasilPengujian'][key].id)
                            return list['HasilPengujian'][key].text
                    }
                }
                break
            case 'Pengujian Gambut':
                if (value !== null) {
                    for (const key in list['PengujianGambut']) {
                        if (
                            value.toString() === list['PengujianGambut'][key].id
                        )
                            return list['PengujianGambut'][key].text
                    }
                }
                break
            case 'Kondisi Sumber Air':
                if (value !== null) {
                    for (const key in list['SumberAir']) {
                        if (value.toString() === list['SumberAir'][key].id)
                            return list['SumberAir'][key].text
                    }
                }
                break
            case 'Vegetasi':
                if (value !== null) {
                    const vname = []
                    for (const n in value) {
                        for (const key in list['Vegetasi']) {
                            if (value[n] === list['Vegetasi'][key].id) {
                                vname.push(list['Vegetasi'][key].text)
                            }
                        }
                    }
                    if (vname) return vname.join(', ')
                }
                break
            case 'Kategori Kondisi Vegetasi':
                if (value !== null) {
                    for (const key in list['KondisiVegetasi']) {
                        if (
                            value.toString() === list['KondisiVegetasi'][key].id
                        )
                            return list['KondisiVegetasi'][key].text
                    }
                }
                break
            case 'Aktivitas Masyarakat':
                if (value !== null) {
                    for (const key in list['AktivitasNarasumber']) {
                        if (
                            value.toString() ===
                            list['AktivitasNarasumber'][key].id
                        )
                            return list['AktivitasNarasumber'][key].text
                    }
                    for (const key in list['AktivitasMasyarakat2']) {
                        if (
                            value.toString() ===
                            list['AktivitasMasyarakat2'][key].id
                        )
                            return list['AktivitasMasyarakat2'][key].text
                    }
                }
                break
            case 'Pekerjaan':
                if (value !== null) {
                    for (const key in list['Pekerjaan']) {
                        if (value.toString() === list['Pekerjaan'][key].id)
                            return list['Pekerjaan'][key].text
                    }
                }
                break
            case 'Potensi Desa':
                if (value !== null) {
                    for (const key in list['PotensiDesa']) {
                        if (value.toString() === list['PotensiDesa'][key].id)
                            return list['PotensiDesa'][key].text
                    }
                }
                break
            case 'Media':
                if (value !== null) {
                    for (const key in list['Media']) {
                        if (value.toString() === list['Media'][key].id)
                            return list['Media'][key].text
                    }
                }
                break
            case 'Jenis Tanah':
                if (value !== null) {
                    for (const key in list['Tanah']) {
                        if (value.toString() === list['Tanah'][key].id)
                            return list['Tanah'][key].text
                    }
                }
                break
            case 'Kondisi Tanah':
                if (value !== null) {
                    for (const key in list['KondisiKarhutla']) {
                        if (
                            value.toString() === list['KondisiKarhutla'][key].id
                        )
                            return list['KondisiKarhutla'][key].text
                    }
                }
                break
            case 'Perubahan Area Bekas Kebakaran':
                if (value !== null) {
                    for (const key in list['PerubahanArea']) {
                        if (value.toString() === list['PerubahanArea'][key].id)
                            return list['PerubahanArea'][key].text
                    }
                }
                break
            case 'Jenis Instansi':
                if (value !== null) {
                    for (const key in list['JenisInstansi']) {
                        if (value.toString() === list['JenisInstansi'][key].id)
                            return list['JenisInstansi'][key].text
                    }
                }
                break
            case 'Tipe Kebakaran':
                if (value !== null) {
                    for (const key in list['TipeKebakaran']) {
                        if (value.toString() === list['TipeKebakaran'][key].id)
                            return list['TipeKebakaran'][key].text
                    }
                }
                break
            case 'Status Lahan':
                if (value !== null) {
                    for (const key in list['StatusLahan']) {
                        if (value.toString() === list['StatusLahan'][key].id)
                            return list['StatusLahan'][key].text
                    }
                }
                break
            case 'Pemilik Lahan':
                if (value !== null) {
                    for (const key in list['PemilikLahan']) {
                        if (value.toString() === list['PemilikLahan'][key].id)
                            return list['PemilikLahan'][key].text
                    }
                }
                break
            case 'Hasil Pemadaman':
                if (value !== null) {
                    for (const key in list['HasilPemadaman']) {
                        if (value.toString() === list['HasilPemadaman'][key].id)
                            return list['HasilPemadaman'][key].text
                    }
                }
                break
            case 'Penyebab Karhutla':
                if (value !== null) {
                    for (const key in list['PenyebabKarhutla']) {
                        if (
                            value.toString() ===
                            list['PenyebabKarhutla'][key].id
                        )
                            return list['PenyebabKarhutla'][key].text
                    }
                }
                break
            case 'Jenis Bahan Bakar':
                if (value !== null) {
                    for (const key in list['JenisBahanBakar']) {
                        if (
                            value.toString() === list['JenisBahanBakar'][key].id
                        )
                            return list['JenisBahanBakar'][key].text
                    }
                }
                break
            case 'Aktivitas Penanggung Jawab':
                if (value !== null) {
                    for (const key in list['AktivitasNarasumber']) {
                        if (
                            value.toString() ===
                            list['AktivitasNarasumber'][key].id
                        )
                            return list['AktivitasNarasumber'][key].text
                    }
                }
                break
            case 'Perubahan Area Pasca Terbakar':
                if (value !== null) {
                    for (const key in list['PerubahanArea']) {
                        if (value.toString() === list['PerubahanArea'][key].id)
                            return list['PerubahanArea'][key].text
                    }
                }
                break
            default:
                return value
        }
    }

    const handleClickCheckbox = async (type: string, index: number) => {
        const result = await changeCheck(type, index)
        console.log(result)
        switch (type) {
            case 'satelite_hotspot':
                setSatelite(result)
                break
            case 'inventory':
                setInventory(result)
                break
            case 'activity':
                setDailyActivity(result)
                break
            case 'aksesibilitas':
                setAksesibilitas(result)
        }
    }

    const handleFormSubmit = async () => {
        setLoading(true)
        const newDaily: string[] = []
        const newSatelite: string[] = []
        const newInventory: string[] = []
        const newAksebilitas: string[] = []

        if (daily_activity) {
            for (const dd in daily_activity) {
                if (daily_activity[dd].checked === true)
                    newDaily.push(daily_activity[dd].id)
            }
        }

        if (inventory) {
            for (const dd in inventory) {
                if (inventory[dd].checked) newInventory.push(inventory[dd].id)
            }
        }

        if (satelite) {
            for (const dd in satelite) {
                if (satelite[dd].checked) newSatelite.push(satelite[dd].id)
            }
        }

        if (aksesibilitas) {
            for (const dd in aksesibilitas) {
                if (aksesibilitas[dd].checked)
                    newAksebilitas.push(aksesibilitas[dd].id)
            }
        }

        const formLaporan = {
            id_laporan_header: laporan_id,
            id_daerah_patroli: daerah_patroli,
            id_aktivitas_harian: newDaily,
            id_regu_tim_patroli: regu,
            id_inventori_patroli: newInventory,
            kategori_patroli: workType,
            satelit_hotspot: newSatelite,
            tanggal_patroli: tanggal_laporan,
            laporanDarat: [
                {
                    id_laporan_darat: laporan_darat_id,
                    latitude: latitude,
                    longitude: longitude,
                    desa_kelurahan: desa,
                    kecamatan: kecamatan,
                    kabupaten: kabupaten,
                    provinsi: provinsi,
                    cuaca_pagi: cuaca_pagi,
                    cuaca_siang: cuaca_siang,
                    cuaca_sore: cuaca_sore,
                    curah_hujan: curah_hujan,
                    suhu: suhu,
                    kelembaban: kelembaban,
                    kecepatan_angin: kecepatan_angin,
                    kondisi_lapangan: kondisiKarhutla,
                    potensi_karhutla: potensiKarhutla,
                    FFMC_KKAS: ffmc,
                    FWI_ICK: fwi,
                    DC_KK: dc,
                    aktivitas_masyarakat: aktivitasMasyarakat,
                    aksebilitas: newAksebilitas,
                    dokumen: []
                }
            ],
            observasiGroup: [],
            dokumen: []
        }

        console.log(formLaporan)

        const result = await updateLaporan(formLaporan)
        if (result.success) {
            setValues({
                ...values,
                showAlert: true,
                alertMessage: result.message as string
            })
            window.scrollTo(0, 0)
            setAlertSuccess(true)
        } else {
            setValues({
                ...values,
                showAlert: true,
                alertMessage: result.message as string
            })
            setAlertSuccess(false)
            window.scrollTo(0, 0)
        }
        setLoading(false)
    }

    useEffect(() => {
        const getLaporanData = async () => {
            if (laporanId) {
                const detailList = await getDetailList()
                const result = await getLaporanDetail(laporanId as string)
                console.log(result)
                if (result.success && detailList.success) {
                    setSK(result.no_sk.no_sk)
                    setList(detailList.data)
                    setWorkType(result.data[0].kategori_patroli)
                    setLaporanId(result.data[0].id_laporan_header)
                    setTanggalLaporan(result.data[0].tanggal_patroli)
                    setDaerah(result.data[0].id_daerah_patroli)
                    setRegu(result.data[0].id_regu_tim_patroli)
                    if (result.data[0].observasiGroup[0]) {
                        setObservasi(result.data[0].observasiGroup)
                        setObservasiNull(false)
                    }

                    if (update_role.includes(user.roleLevel)) {
                        setupdate(true)
                    }

                    if (result.data[0].laporanDarat[0]) {
                        setLaporanDaratId(
                            result.data[0].laporanDarat[0].id_laporan_darat
                        )
                        setLatitude(result.data[0].laporanDarat[0].latitude)
                        setLongitude(result.data[0].laporanDarat[0].longitude)
                        setDesa(result.data[0].laporanDarat[0].desa_kelurahan)
                        setKecamatan(result.data[0].laporanDarat[0].kecamatan)
                        setKabupaten(result.data[0].laporanDarat[0].kabupaten)
                        setProvinsi(result.data[0].laporanDarat[0].provinsi)
                        setCuacaPagi(result.data[0].laporanDarat[0].cuaca_pagi)
                        setCuacaSiang(
                            result.data[0].laporanDarat[0].cuaca_siang
                        )
                        setCuacaSore(result.data[0].laporanDarat[0].cuaca_sore)
                        setCurahHujan(
                            result.data[0].laporanDarat[0].curah_hujan
                        )
                        setSuhu(result.data[0].laporanDarat[0].suhu)
                        setKelembaban(result.data[0].laporanDarat[0].kelembaban)
                        setKecepatanAngin(
                            result.data[0].laporanDarat[0].kecepatan_angin
                        )
                        setKondisiKarhutla(
                            result.data[0].laporanDarat[0].kondisi_lapangan
                        )
                        setPotensiKarhutla(
                            result.data[0].laporanDarat[0].potensi_karhutla
                        )
                        setAktivitas(
                            result.data[0].laporanDarat[0].aktivitas_masyarakat
                        )
                        setFfmc(result.data[0].laporanDarat[0].FFMC_KKAS)
                        setFwi(result.data[0].laporanDarat[0].FWI_ICK)
                        setDc(result.data[0].laporanDarat[0].DC_KK)
                    }

                    let checked = false
                    const newAksebilitas = detailList.data.Aksebilitas
                    for (const dd in newAksebilitas) {
                        checked = false
                        if (result.data[0].laporanDarat[0]) {
                            newAksebilitas[dd] = {
                                ...newAksebilitas[dd],
                                checked: result.data[0].laporanDarat[0].aksebilitas.includes(
                                    newAksebilitas[dd].id
                                )
                            }
                        }
                    }
                    setAksesibilitas(newAksebilitas)

                    setWorkTypeList(detailList.data.KategoriPatroli)
                    setCuacaList(detailList.data.Cuaca)
                    setKondisiKarhutlaList(detailList.data.KondisiKarhutla)
                    setPotensiKarhutlaList(detailList.data.PotensiKarhutla)
                    setAktivitasList(detailList.data.AktivitasMasyarakat)

                    const newSatelite = detailList.data.Satelit
                    for (const dd in newSatelite) {
                        checked = false
                        if (
                            result.data[0].satelit_hotspot.includes(
                                newSatelite[dd].id
                            )
                        ) {
                            checked = true
                        }
                        newSatelite[dd] = {
                            ...newSatelite[dd],
                            checked: checked
                        }
                    }
                    setSatelite(newSatelite)

                    const newInventory = detailList.data.Inventori
                    for (const dd in newInventory) {
                        checked = false
                        newInventory[dd] = {
                            ...newInventory[dd],
                            checked: result.data[0].id_inventori_patroli.includes(
                                newInventory[dd].id
                            )
                        }
                    }
                    setInventory(newInventory)

                    const newDaily = detailList.data.AktivitasHarian
                    for (const dd in newDaily) {
                        checked = false
                        newDaily[dd] = {
                            ...newDaily[dd],
                            checked: result.data[0].id_aktivitas_harian.includes(
                                newDaily[dd].id
                            )
                        }
                    }
                    setDailyActivity(newDaily)
                } else {
                    // Set notFound to true if data not found
                    setValues({
                        ...values,
                        notFound: true
                    })
                }
            }
        }

        if (isAuthenticated) getLaporanData()
    }, [isAuthenticated, laporanId])

    const renderField = (label: string, value: string, onChange: any, type = "text") => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150 ease-in-out"
                value={value}
                onChange={onChange}
            />
        </div>
    );

    const renderSelect = (label: string, value: string, onChange: any, options: Option[]) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150 ease-in-out"
                value={value}
                onChange={onChange}
            >
                <option value="">Pilih {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.id}>
                        {option.text}
                    </option>
                ))}
            </select>
        </div>
    );

    return !isAuthenticated ? (
        <Loader />
    ) : values.notFound ? (
        <ErrorPage statusCode={404} />
    ) : (
        <div className="bg-gray-50 min-h-screen">
            {/* Header Section with Gradient Background */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-3 py-1 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 mb-4 transition duration-150 ease-in-out"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Kembali
                    </button>
                    <h1 className="text-3xl font-bold">Ubah Data Laporan</h1>
                    <p className="text-lg text-blue-100 mt-2">{nomor_sk}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Alert Section */}
                {values.showAlert && (
                    <div className={`mb-8 p-4 rounded-lg shadow-sm ${alertSuccess ? 'bg-green-50 border-l-4 border-green-500 text-green-800' : 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {alertSuccess ? (
                                    <Check className="h-6 w-6 mr-3 text-green-500" />
                                ) : (
                                    <Info className="h-6 w-6 mr-3 text-yellow-500" />
                                )}
                                <p className="text-lg">{values.alertMessage}</p>
                            </div>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() => {
                                    setValues({
                                        ...values,
                                        alertMessage: '',
                                        showAlert: false
                                    })
                                }}
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6 px-6">
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === '1'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => handleChangeTab('1')}
                            >
                                <div className="flex items-center">
                                    <Clipboard className="h-4 w-4 mr-2" />
                                    Data Umum
                                </div>
                            </button>
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === '2'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => handleChangeTab('2')}
                            >
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Data Darat
                                </div>
                            </button>
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === '3'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => handleChangeTab('3')}
                            >
                                <div className="flex items-center">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Observasi
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Data Umum Tab */}
                        {activeTab === '1' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <FormCard title="Informasi Umum" icon={<Clipboard size={20} />}>
                                        {renderSelect("Kategori Penugasan", workType, handleWorkTypeChange, workTypeList)}

                                        <div className="mt-8">
                                            <CheckboxGroup
                                                title="Satelit Hotspot"
                                                options={satelite}
                                                onChange={(index) => handleClickCheckbox('satelite_hotspot', index)}
                                            />
                                        </div>

                                        <div className="mt-8">
                                            <CheckboxGroup
                                                title="Inventory Patroli"
                                                options={inventory}
                                                onChange={(index) => handleClickCheckbox('inventory', index)}
                                            />
                                        </div>
                                    </FormCard>
                                </div>

                                <div>
                                    <FormCard title="Aktivitas Patroli" icon={<Activity size={20} />}>
                                        <CheckboxGroup
                                            title="Aktivitas Harian"
                                            options={daily_activity}
                                            onChange={(index) => handleClickCheckbox('activity', index)}
                                        />
                                    </FormCard>
                                </div>
                            </div>
                        )}

                        {/* Data Darat Tab */}
                        {activeTab === '2' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <FormCard title="Lokasi Patroli" icon={<MapPin size={20} />}>
                                        <div className="grid grid-cols-2 gap-4">
                                            {renderField("Latitude", latitude, HandleInputChange('latitude'))}
                                            {renderField("Longitude", longitude, HandleInputChange('longitude'))}
                                        </div>

                                        {renderField("Desa/Kelurahan", desa, HandleInputChange('desa'))}
                                        {renderField("Kecamatan", kecamatan, HandleInputChange('kecamatan'))}
                                        {renderField("Kabupaten/Kota", kabupaten, HandleInputChange('kabupaten'))}
                                        {renderField("Provinsi", provinsi, HandleInputChange('provinsi'))}
                                    </FormCard>

                                    <FormCard title="Data Kondisi" icon={<FileText size={20} />}>
                                        {renderSelect("Kondisi Lapangan", kondisiKarhutla, handleKondisiKarhutlaChange, kondisiKarhutlaList)}
                                        {renderSelect("Potensi Karhutla", potensiKarhutla, handlePotensiKarhutlaChange, potensiKarhutlaList)}
                                        {renderSelect("FFCM KKAS", ffmc, handleFfcmChange, potensiKarhutlaList)}
                                        {renderSelect("FWI ICK", fwi, handleFwiChange, potensiKarhutlaList)}
                                        {renderSelect("DC KK", dc, handleDcChange, potensiKarhutlaList)}
                                        {renderSelect("Aktivitas Masyarakat", aktivitasMasyarakat, handleAktivitasKarhutlaChange, aktivitasMasyarakatList)}
                                    </FormCard>
                                </div>

                                <div>
                                    <FormCard title="Kondisi Cuaca" icon={<CloudSun size={20} />}>
                                        <div className="grid grid-cols-3 gap-4">
                                            {renderSelect("Cuaca Pagi", cuaca_pagi, handleCuacaPagiChange, cuacaList)}
                                            {renderSelect("Cuaca Siang", cuaca_siang, handleCuacaSiangChange, cuacaList)}
                                            {renderSelect("Cuaca Sore", cuaca_sore, handleCuacaSoreChange, cuacaList)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {renderField("Curah Hujan (mm)", curah_hujan, HandleInputChange('curah_hujan'), "number")}
                                            {renderField("Suhu (Celcius)", suhu, HandleInputChange('suhu'), "number")}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {renderField("Kelembaban (%)", kelembaban, HandleInputChange('kelembaban'), "number")}
                                            {renderField("Kecepatan Angin (Km/jam)", kecepatan_angin, HandleInputChange('kecepatan_angin'), "number")}
                                        </div>
                                    </FormCard>

                                    <FormCard title="Aksesibilitas" icon={<ExternalLink size={20} />}>
                                        <CheckboxGroup
                                            title="Pilih Aksesibilitas"
                                            options={aksesibilitas}
                                            onChange={(index) => handleClickCheckbox('aksesibilitas', index)}
                                        />
                                    </FormCard>
                                </div>
                            </div>
                        )}

                        {/* Observasi Tab */}
                        {activeTab === '3' && (
                            <div>
                                {observasiNull ? (
                                    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-200 rounded-xl">
                                        <FileText size={64} className="text-gray-300 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak ada data Observasi</h3>
                                        <p className="text-gray-500">Data observasi untuk laporan ini belum tersedia.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {dataObservasi.map((option, index) => (
                                            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                                                <div className="bg-blue-50 p-4 border-b border-gray-200">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin size={16} className="text-blue-600" />
                                                            <span className="font-medium text-gray-700">Latitude:</span>
                                                            <span className="text-gray-800">{option.latitude}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin size={16} className="text-blue-600" />
                                                            <span className="font-medium text-gray-700">Longitude:</span>
                                                            <span className="text-gray-800">{option.longitude}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    {option.observasi.map((option1: { nama: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; atribut: any[]; dokumen: any[] }, index1: React.Key | null | undefined) => (
                                                        <div key={index1} className="mb-6 last:mb-0">
                                                            <h4 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">
                                                                {option1.nama}
                                                            </h4>

                                                            <table className="w-full text-sm">
                                                                <tbody>
                                                                    {option1.atribut.map((option2, index2) => (
                                                                        <tr key={index2} className="border-b border-gray-100 last:border-0">
                                                                            <td className="py-2 font-medium text-gray-700">{option2.nama_atribut}</td>
                                                                            <td className="py-2 px-2 text-gray-500">:</td>
                                                                            <td className="py-2 text-gray-800">
                                                                                {checkObservasi(
                                                                                    option2.nama_atribut,
                                                                                    option2.value
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>

                                                            {option1.dokumen.map((optionImage, indexImage) => (
                                                                <div key={indexImage} className="mt-4">
                                                                    <img
                                                                        className="w-full rounded-lg border border-gray-200 shadow-sm"
                                                                        src={`data:image/jpeg;base64,${optionImage.value}`}
                                                                        alt="Dokumentasi laporan"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                {update_condition && (
                    <div className="flex justify-center mb-12">
                        <button
                            type="button"
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                            onClick={handleFormSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Info Panel */}
                <div className="bg-white rounded-xl shadow-sm p-6 text-gray-800">
                    <div className="flex items-start gap-3">
                        <Info size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Informasi Penggunaan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Formulir ini digunakan untuk mengubah data laporan. Pastikan Anda mengisi semua bagian yang diperlukan untuk memastikan data yang akurat.
                                Anda dapat beralih antar tab untuk mengisi berbagai bagian dari laporan. Setelah selesai melakukan perubahan, klik tombol "Simpan Perubahan" untuk menyimpan data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UbahLaporanId;