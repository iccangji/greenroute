'use client';


import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { EyeIcon, PencilIcon } from 'lucide-react';
import Sidebar from "@/components/Sidebar";
import { EditDialog } from "@/components/tpa/TpaDialog";
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
import { usePageStore } from "@/store/usePageStore";

type Tpa = {
    tpa: string;
    latitude: number;
    longitude: number;
}

export default function Tpa() {
    const router = useRouter();
    const [tpaData, setTpaData] = useState<Tpa>({
        tpa: '',
        latitude: 0,
        longitude: 0
    });

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
                const response = await axios.get('/tpa', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTpaData(response.data[0]);
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

        document.title = 'TPA - GreenRoute';
    }, [refreshKey]);
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar page="TPA" />

            {/* Main Content */}
            <main className="flex-1 bg-[#fefbf5] overflow-y-scroll">
                <Header
                    onLogout={handleLogout}
                    pageTitle="TPA"
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
                        <div className="rounded-xl border border-gray-900 bg-white">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full text-center">
                                    <TableCaption></TableCaption>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-900">
                                            <TableHead className="text-center md:p-2">TPA</TableHead>
                                            <TableHead className="text-center md:p-2 w-[100px]">Latitude</TableHead>
                                            <TableHead className="text-center md:p-2">Longitude</TableHead>
                                            <TableHead className="text-center md:p-2">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key={1} className="border-t border-gray-900">
                                            <TableCell className="font-medium md:py-3 px-2">{tpaData.tpa}</TableCell>
                                            <TableCell className="md:py-3 px-2">{tpaData.latitude ? tpaData.latitude : ''}</TableCell>
                                            <TableCell className="md:py-3 px-2">{tpaData.longitude ? tpaData.longitude : ''}</TableCell>
                                            <TableCell className="flex justify-center py-3 gap-1 items-center">
                                                {/* View Dialog */}
                                                <Dialog>
                                                    <DialogTrigger className="bg-lime-600 text-white hover:bg-lime-700 transition-colors rounded flex items-center p-2 border border-gray-900 cursor-pointer">
                                                        <EyeIcon className="w-4 h-4" />
                                                    </DialogTrigger>
                                                    <DialogContent className="md:max-w-[800px] important">
                                                        <DialogHeader>
                                                            <DialogTitle>Peta TPA</DialogTitle>
                                                            <DialogDescription>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <MapDialog
                                                            mapData={[tpaData]}
                                                            locationId={0}
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
                                                                tpaData={{
                                                                    id: 1,
                                                                    tpa: tpaData.tpa,
                                                                    latitude: tpaData.latitude,
                                                                    longitude: tpaData.longitude,
                                                                }}
                                                                onFinish={() => {
                                                                    setAlertMsg("Data berhasil diubah");
                                                                    setRefreshKey(refreshKey + 1);
                                                                }}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}