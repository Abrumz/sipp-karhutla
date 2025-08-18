import React, { useState, useEffect, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { SuratTugasTeamMemberData, UserData } from '@/interfaces';
import { getAllUsersPersonil, getAllKelurahan2, modifySk } from '@/services';
import { X, Plus } from 'lucide-react';
import { debounce } from '@mui/material';
import Swal from 'sweetalert2';

interface EditPenugasanProps {
    member: SuratTugasTeamMemberData;
    skNumber: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface EmailOption {
    value: string;
    label: string;
}

interface KelurahanOption {
    value: string;
    label: string;
    data: {
        id: string;
        nama: string;
        kode: string;
        tipe: string;
    };
}

const CustomSingleValue = (props: any) => (
    <components.SingleValue {...props}>
        {props.data.value}
    </components.SingleValue>
);

const EditPenugasan: React.FC<EditPenugasanProps> = ({ member, skNumber, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<SuratTugasTeamMemberData>({
        ...member,
        isActive: true
    });
    const [groupMembersData, setGroupMembersData] = useState<SuratTugasTeamMemberData[]>(
        (member.groupMembers || []).map((gm: any) => ({
            ...gm,
            isActive: true
        }))
    );
    const [mainEmailOption, setMainEmailOption] = useState<EmailOption | null>(null);
    const [groupEmailOptions, setGroupEmailOptions] = useState<(EmailOption | null)[]>(
        (member.groupMembers || []).map((gm: { email: any; name: any; }) =>
            gm.email ? { value: gm.email, label: `${gm.name} (${gm.email})` } : null
        )
    );
    const [selectedKelurahan, setSelectedKelurahan] = useState<KelurahanOption | null>(null);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [currentMemberPage, setCurrentMemberPage] = useState<number>(1);

    const combinedMembers = [formData, ...groupMembersData];
    const totalRows = combinedMembers.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentMemberPage - 1) * rowsPerPage;
    const membersToRender = combinedMembers.slice(startIndex, startIndex + rowsPerPage);

    const roleOptions = [
        { value: "4", label: "Ketua" },
        { value: "5", label: "Anggota" },
        { value: "6", label: "TNI" },
        { value: "7", label: "Polri" },
        { value: "8", label: "MPA" },
        { value: "10", label: "Pemda" },
        { value: "11", label: "Swasta" },
        { value: "12", label: "Masyarakat" }
    ];

    const selectStyles = {
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
        control: (base: any) => ({ ...base, minHeight: '38px', height: '38px', fontSize: '0.875rem' }),
        valueContainer: (base: any) => ({ ...base, padding: '0 8px', height: '38px' }),
    };

    const kelurahanSelectStyles = { ...selectStyles };

    const loadUserOptions = useCallback(
        debounce((inputValue: string, callback: (options: (EmailOption & { data: UserData })[]) => void) => {
            if (inputValue.trim().length < 2) {
                callback([]);
                return;
            }
            getAllUsersPersonil(inputValue.trim())
                .then(users => {
                    const options = users.map(user => ({
                        value: user.email,
                        label: `${user.name} (${user.email})`,
                        data: user
                    }));
                    callback(options);
                }).catch(() => callback([]));
        }, 300),
        []
    );

    const promiseOptions = useCallback(
        debounce((inputValue: string, callback: (options: KelurahanOption[]) => void) => {
            if (inputValue.trim().length < 3) {
                callback([]);
                return;
            }
            getAllKelurahan2(1, 1000, inputValue.trim())
                .then(data => {
                    const filteredData = data.filter((item: any) => item.tipe === "Kelurahan/Desa");
                    const options: KelurahanOption[] = filteredData.map((item: any) => ({
                        value: item.id,
                        label: `${item.kode} - ${item.nama}`,
                        data: { id: item.id, nama: item.nama, kode: item.kode, tipe: item.tipe }
                    }));
                    callback(options);
                }).catch(() => callback([]));
        }, 300),
        []
    );

    useEffect(() => {
        setIsVisible(true);
        setFormData({ ...member, isActive: true });
        if (member.email) {
            setMainEmailOption({ value: member.email, label: `${member.name} (${member.email})` });
        }
        setGroupMembersData((member.groupMembers || []).map((gm: any) => ({ ...gm, isActive: true })));
        setGroupEmailOptions(
            (member.groupMembers || []).map((gm: any) =>
                gm.email ? { value: gm.email, label: `${gm.name} (${gm.email})` } : null
            )
        );
        if (member.posko && member.kode_wilayah) {
            setSelectedKelurahan({
                value: member.id_daerah_patroli,
                label: `${member.kode_wilayah} - ${member.posko}`,
                data: { id: member.id_daerah_patroli, kode: member.kode_wilayah, nama: member.posko, tipe: 'Kelurahan/Desa' }
            });
        } else {
            setSelectedKelurahan(null);
        }
    }, [member]);

    useEffect(() => {
        if (currentMemberPage > totalPages && totalPages > 0) {
            setCurrentMemberPage(totalPages);
        } else if (currentMemberPage === 0 && totalPages > 0) {
            setCurrentMemberPage(1);
        }
    }, [totalPages, currentMemberPage]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainEmailSelect = (option: (EmailOption & { data: UserData }) | null) => {
        setMainEmailOption(option);
        const user = option ? option.data : null;
        setFormData(prev => ({
            ...prev,
            email: user?.email || '',
            name: user?.name || '',
            registrationNumber: user?.registrationNumber || '',
            phoneNumber: user?.phoneNumber?.toString() || ''
        }));
    };

    const handleGroupEmailSelect = (option: (EmailOption & { data: UserData }) | null, groupIndex: number) => {
        const updatedMembers = [...groupMembersData];
        const user = option ? option.data : null;
        updatedMembers[groupIndex] = {
            ...updatedMembers[groupIndex],
            email: user?.email || '',
            name: user?.name || '',
            registrationNumber: user?.registrationNumber || '',
            phoneNumber: user?.phoneNumber?.toString() || ''
        };
        setGroupMembersData(updatedMembers);
        const updatedGroupEmailOptions = [...groupEmailOptions];
        updatedGroupEmailOptions[groupIndex] = option as EmailOption | null;
        setGroupEmailOptions(updatedGroupEmailOptions);
    };

    const handleGroupMemberFieldChange = (groupIndex: number, field: string, value: any) => {
        const updated = [...groupMembersData];
        updated[groupIndex] = { ...updated[groupIndex], [field]: value };
        setGroupMembersData(updated);
    };

    const handleAddMember = () => {
        const newMember: SuratTugasTeamMemberData = {
            id: `new_${Date.now()}`, r_surat_tugas_id: member.r_surat_tugas_id, r_role_id: "5", isActive: true,
            id_daerah_patroli: '', id_daops: '', no_registrasi: '', name: '', email: '', phoneNumber: '',
            registrationNumber: '', startDate: '', endDate: '', daops: '', posko: '', kode_wilayah: '',
            groupMembers: [], organization: ''
        };
        setGroupMembersData(prev => [...prev, newMember]);
    };

    const handleKelurahanSelect = (option: KelurahanOption | null) => {
        setSelectedKelurahan(option);
        setFormData(prev => ({
            ...prev,
            posko: option?.data.nama || '',
            kode_wilayah: option?.data.kode || '',
            id_daerah_patroli: option?.data.id || '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const isNewPosko = formData.kode_wilayah !== member.kode_wilayah?.replace(/\./g, '');
        const apiCalls = [];
        const mainMemberPayload = {
            id_regu_tim_patroli: formData.id, tanggal_awal: formData.startDate?.replace(/-/g, '/'),
            tanggal_akhir: formData.endDate?.replace(/-/g, '/'), id_roles: formData.r_role_id,
            email: formData.email, id_daerah_patroli: formData.id_daerah_patroli || member.id_daerah_patroli || '',
            kode_wilayah: formData.kode_wilayah?.replace(/\./g, ''), new_posko: isNewPosko,
            id_daops: formData.id_daops || member.id_daops || '', new_user: formData.email !== member.email,
            enabled: formData.isActive,
        };
        apiCalls.push(modifySk(mainMemberPayload));
        const originalGroupMembersMap = new Map(member.groupMembers?.map((m: { id: any; }) => [m.id, m]));
        for (const groupMember of groupMembersData) {
            const originalMember = originalGroupMembersMap.get(groupMember.id);
            const groupMemberPayload = {
                id_regu_tim_patroli: groupMember.id, tanggal_awal: formData.startDate?.replace(/-/g, '/'),
                tanggal_akhir: formData.endDate?.replace(/-/g, '/'), id_roles: groupMember.r_role_id,
                email: groupMember.email, id_daerah_patroli: formData.id_daerah_patroli || member.id_daerah_patroli || '',
                kode_wilayah: formData.kode_wilayah?.replace(/\./g, ''), new_posko: isNewPosko,
                id_daops: formData.id_daops || member.id_daops || '', new_user: !originalMember || groupMember.email !== (originalMember as any).email,
                enabled: groupMember.isActive,
            };
            apiCalls.push(modifySk(groupMemberPayload));
        }
        try {
            await Promise.all(apiCalls);
            await Swal.fire({
                title: 'Berhasil!', text: 'Semua data anggota berhasil diperbarui.', icon: 'success',
                timer: 2000, showConfirmButton: false, timerProgressBar: true,
            });
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error('Gagal memperbarui satu atau lebih data:', err);
            Swal.fire({
                title: 'Gagal!', text: `Terjadi kesalahan: ${err.response?.data?.message || err.message || 'Silakan coba lagi.'}`,
                icon: 'error', confirmButtonColor: '#d33', confirmButtonText: 'Tutup'
            });
        } finally {
            setLoading(false);
        }
    };

    const renderMemberRow = (memberData: SuratTugasTeamMemberData, emailOption: EmailOption | null, onEmailChange: (opt: any) => void, onRoleChange: (value: string) => void, onActiveChange: (value: boolean) => void) => {
        return (
            <tr className={memberData.r_role_id === '4' ? 'bg-blue-50' : ''}>
                <td className="px-4 py-2"><select value={memberData.r_role_id} onChange={(e) => onRoleChange(e.target.value)} className="w-full sm:text-sm border-gray-300 rounded-md">{roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></td>
                <td className="px-4 py-2"><input type="text" value={memberData.name || ''} readOnly className="bg-gray-100 w-full sm:text-sm border-gray-300 rounded-md p-2" /></td>
                <td className="px-4 py-2"><input type="text" value={memberData.registrationNumber || ''} readOnly className="bg-gray-100 w-full sm:text-sm border-gray-300 rounded-md p-2" /></td>
                <td className="px-4 py-2"><input type="text" value={memberData.phoneNumber || ''} readOnly className="bg-gray-100 w-full sm:text-sm border-gray-300 rounded-md p-2" /></td>
                <td className="px-4 py-2">
                    <AsyncSelect
                        cacheOptions defaultOptions loadOptions={loadUserOptions} value={emailOption} onChange={onEmailChange}
                        isClearable placeholder="Ketik nama/email..." styles={selectStyles} menuPortalTarget={document.body}
                        menuPosition="fixed" noOptionsMessage={({ inputValue }) => inputValue.length < 2 ? 'Ketik min. 2 karakter' : 'Personil tidak ditemukan'}
                        components={{ SingleValue: CustomSingleValue }}
                    />
                </td>
                <td className="px-4 py-2"><select value={memberData.isActive ? 'Ya' : 'Tidak'} onChange={(e) => onActiveChange(e.target.value === 'Ya')} className="w-full sm:text-sm border-gray-300 rounded-md"><option value="Ya">Ya</option><option value="Tidak">Tidak</option></select></td>
            </tr>
        );
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-xl shadow-xl w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto transition-transform duration-300 transform ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}>
                <div className="header-primary text-white p-4 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-semibold">Komposisi Tim Patroli</h2>
                    <button onClick={handleClose} className="text-white hover:text-gray-200"><X size={24} /></button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat Tugas</label>
                            <input type="text" value={skNumber} disabled className="bg-gray-100 w-full sm:text-sm border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Daerah Operasi</label><input type="text" name="daops" value={formData.daops || ''} disabled className="w-full sm:text-sm border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Desa/Posko</label><AsyncSelect<KelurahanOption> cacheOptions defaultOptions loadOptions={promiseOptions} value={selectedKelurahan} onChange={handleKelurahanSelect} isClearable placeholder="Ketik min. 3 karakter..." styles={kelurahanSelectStyles} menuPortalTarget={document.body} menuPosition="fixed" noOptionsMessage={({ inputValue }) => inputValue.length < 3 ? 'Ketik minimal 3 karakter untuk memulai pencarian.' : `Tidak ada hasil untuk "${inputValue}"`} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label><input type="date" name="startDate" value={formData.startDate || ''} onChange={handleFieldChange} max={formData.endDate || undefined} className="w-full sm:text-sm border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label><input type="date" name="endDate" value={formData.endDate || ''} onChange={handleFieldChange} min={formData.startDate || undefined} className="w-full sm:text-sm border-gray-300 rounded-md p-2" />
                            </div>
                        </div>
                        <div>
                            {/* <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">Data Anggota Tim</h3>
                                <button type="button" onClick={handleAddMember} className="flex items-center gap-2 px-3 py-2 header-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"><Plus size={16} /> Tambah Tim</button>
                            </div> */}
                            <div className="overflow-x-auto border rounded-md">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50"><tr className="text-left text-xl font-medium text-gray-500 uppercase"><th className="px-4 py-3">Peran</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Nomor Reg</th><th className="px-4 py-3">Nomor HP</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Bertugas</th></tr></thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {membersToRender.map((memberItem, idx) => {
                                            const absoluteIndex = startIndex + idx;
                                            const isMainMember = absoluteIndex === 0;
                                            const groupMemberIndex = absoluteIndex - 1;
                                            return (
                                                <React.Fragment key={isMainMember ? formData.id : memberItem.id}>
                                                    {isMainMember ?
                                                        renderMemberRow(formData, mainEmailOption, handleMainEmailSelect, (value) => setFormData(p => ({ ...p, r_role_id: value })), (value) => setFormData(p => ({ ...p, isActive: value }))) :
                                                        renderMemberRow(memberItem, groupEmailOptions[groupMemberIndex], (opt) => handleGroupEmailSelect(opt, groupMemberIndex), (value) => handleGroupMemberFieldChange(groupMemberIndex, 'r_role_id', value), (value) => handleGroupMemberFieldChange(groupMemberIndex, 'isActive', value))
                                                    }
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div><label htmlFor="rowsPerPage" className="text-sm text-gray-700 mr-2">Tampilkan per Halaman:</label><select id="rowsPerPage" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setCurrentMemberPage(1); }} className="w-20 border border-gray-300 rounded-md shadow-sm sm:text-sm"><option value={1}>1</option><option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={totalRows}>Semua</option></select></div>
                                <div className="flex items-center gap-2"><button type="button" onClick={() => setCurrentMemberPage(p => Math.max(1, p - 1))} disabled={currentMemberPage === 1} className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">‹ Prev</button><span className="text-sm text-gray-700">Halaman {currentMemberPage} dari {totalPages === 0 ? 1 : totalPages}</span><button type="button" onClick={() => setCurrentMemberPage(p => Math.min(totalPages, p + 1))} disabled={currentMemberPage === totalPages || totalPages === 0} className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">Next ›</button></div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" disabled={loading} className="px-4 py-2 border-transparent rounded-md shadow-sm font-medium text-white header-primary hover:opacity-90 transition-opacity">
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPenugasan;