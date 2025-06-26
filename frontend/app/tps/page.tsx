'use client';


import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { EyeIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import swal from 'sweetalert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "@/lib/axios";
import BarLoader from "react-spinners/BarLoader";
import MapDialog from "@/components/MapDialog";
import { AddDialog, DeleteDialog, EditDialog } from "@/components/tps/TpsDialog";
import { usePageStore } from "@/store/usePageStore";

type Tps = {
    id: number;
    tps: string;
    latitude: number;
    longitude: number;
    volume_sampah: number;
}
export default function Tps() {
    const router = useRouter();
    const [tpsData, setTpsData] = useState<Tps[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        username,
        setUsername,
        isLoading,
        setIsLoading,
        alertMsg,
        setAlertMsg,
        refreshKey,
        setRefreshKey,
        isAdmin,
        setIsAdmin
    } = usePageStore();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    const filteredData = useMemo(() => {
        return tpsData.filter((item) =>
            item.tps.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, tpsData]);

    useEffect(() => {
        setIsLoading(true);
        // Misalnya token menyimpan data user yang bisa di-decode
        const token = Cookies.get('token');
        const user = Cookies.get('user');
        if (token) {
            setIsAdmin(true);
        }

        setUsername(user || 'guest'); // sementara hardcoded
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('/tps', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTpsData(response.data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
            finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
                if (alertMsg !== '') {
                    setTimeout(() => {
                        swal({
                            title: "",
                            text: alertMsg,
                            icon: "success",
                            buttons: [false],
                            timer: 1000
                        });
                        setAlertMsg('');
                    }, 1000);
                }
            }
        }
        fetchData();

        document.title = 'TPS - GreenRoute';
    }, [refreshKey]);
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar page="TPS" />

            {/* Main Content */}
            <main className="flex-1 bg-[#fefbf5] overflow-y-scroll">
                <Header
                    onLogout={handleLogout}
                    pageTitle="TPS"
                    username={username}
                />
                {isLoading ? (
                    <div className="w-full h-4/5 flex items-center justify-center">
                        <BarLoader
                            color="#75c900"
                            height={10}
                            width={240}
                        />
                    </div>
                ) : (
                    <div className="p-6 overflow-x-auto">
                        <div className="w-full flex justify-between items-center mb-6">
                            <div className="flex justify-between">
                                <Input
                                    type="text"
                                    placeholder="Cari TPS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="md:w-72 border border-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors"
                                />
                            </div>
                            {isAdmin && (
                                <Dialog>
                                    <DialogTrigger>
                                        <Button asChild
                                            className="bg-lime-600 text-white hover:bg-lime-700 transition-colors px-4 py-2 rounded border border-gray-900 rounded-md flex items-center"
                                        >
                                            <div className="flex items-center">
                                                <PlusIcon className="w-4 h-4" />
                                                <span className="text-sm hidden md:inline">Tambah TPS</span>
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent
                                        className="md:max-w-[800px] important"
                                    >
                                        <DialogHeader>
                                            <DialogTitle>Tambah TPS</DialogTitle>
                                            <DialogDescription></DialogDescription>
                                        </DialogHeader>
                                        <AddDialog
                                            onFinish={() => {
                                                setAlertMsg("Data berhasil ditambahkan");
                                                setRefreshKey(refreshKey + 1);
                                                setSearchQuery("");
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                        {filteredData.length > 0 && (
                            <div className="rounded-xl border border-gray-900 bg-white">
                                <div className="overflow-x-auto">
                                    <Table className="min-w-full text-center">
                                        <TableCaption></TableCaption>
                                        <TableHeader>
                                            <TableRow className="border-b border-gray-900">
                                                <TableHead className="text-center md:p-2">#</TableHead>
                                                <TableHead className="text-center md:p-2">TPS</TableHead>
                                                <TableHead className="text-center md:p-2 w-[100px]">Latitude</TableHead>
                                                <TableHead className="text-center md:p-2">Longitude</TableHead>
                                                <TableHead className="text-center md:p-2">Muatan</TableHead>
                                                <TableHead className="text-center md:p-2">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Data Rute */}
                                            {filteredData.map((item, idx) => (
                                                <TableRow key={idx} className="border-t border-gray-900">
                                                    <TableCell className="font-medium md:py-3 px-2">{idx + 1}</TableCell>
                                                    <TableCell className="font-medium md:py-3 px-2 whitespace-normal w-2/5">{item.tps}</TableCell>
                                                    <TableCell className="md:py-3 px-2">{item.latitude}</TableCell>
                                                    <TableCell className="md:py-3 px-2">{item.longitude}</TableCell>
                                                    <TableCell className="md:py-3 px-2">{item.volume_sampah}</TableCell>
                                                    <TableCell className="flex justify-center py-3 gap-1 items-center">
                                                        {/* View Dialog */}
                                                        <Dialog>
                                                            <DialogTrigger className="bg-lime-600 text-white hover:bg-lime-700 transition-colors rounded flex items-center p-2 border border-gray-900 cursor-pointer">
                                                                <EyeIcon className="w-4 h-4" />
                                                            </DialogTrigger>
                                                            <DialogContent className="md:max-w-[800px] important">
                                                                <DialogHeader>
                                                                    <DialogTitle>Peta TPS</DialogTitle>
                                                                    <DialogDescription>
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <MapDialog
                                                                    mapData={filteredData}
                                                                    locationId={idx}
                                                                />
                                                            </DialogContent>
                                                        </Dialog>

                                                        {/* Edit Dialog */}
                                                        {isAdmin && (
                                                            <Dialog>
                                                                <DialogTrigger className="bg-lime-600 text-white hover:bg-lime-700 transition-colors rounded flex items-center p-2 border border-gray-900 cursor-pointer">
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </DialogTrigger>
                                                                <DialogContent
                                                                    className="md:max-w-[800px] important"
                                                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                                                >
                                                                    <DialogHeader>
                                                                        <DialogTitle>Edit Dialog</DialogTitle>
                                                                        <DialogDescription>
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <EditDialog
                                                                        tpsData={{
                                                                            id: item.id,
                                                                            tps: item.tps,
                                                                            latitude: item.latitude,
                                                                            longitude: item.longitude,
                                                                            volumeSampah: item.volume_sampah,
                                                                        }}
                                                                        onFinish={() => {
                                                                            setAlertMsg("Data berhasil diubah");
                                                                            setRefreshKey(refreshKey + 1);
                                                                            setSearchQuery("");
                                                                        }}
                                                                    />
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}

                                                        {/* Delete Dialog */}
                                                        {isAdmin && (
                                                            <Dialog>
                                                                <DialogTrigger className="bg-red-600 text-white hover:bg-red-700 transition-colors rounded flex items-center p-2 border border-gray-900 cursor-pointer">
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </DialogTrigger>
                                                                <DialogContent className="md:max-w-[800px] important">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Hapus TPS</DialogTitle>
                                                                        <DialogDescription>
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DeleteDialog
                                                                        id={item.id}
                                                                        onFinish={() => {
                                                                            setAlertMsg("Data berhasil dihapus");
                                                                            setRefreshKey(refreshKey + 1);
                                                                            setSearchQuery("");
                                                                        }}
                                                                    />
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}