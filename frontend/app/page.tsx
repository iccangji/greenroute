'use client';

import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Info, RefreshCw } from 'lucide-react';
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import RouteMapDialog from "@/components/route/RouteMapDialog";
import OptimizerDialog from "@/components/route/OptimizerDialog";
import BarLoader from "react-spinners/BarLoader";
import swal from "sweetalert";
import { usePageStore } from "@/store/usePageStore";

export default function Dashboard() {
  const router = useRouter();
  const [routeData, setRouteData] = useState<any[]>([]);
  const [tpaData, setTpaData] = useState<[number, number][]>([]);

  const {
    isLoading,
    setIsLoading,
    username,
    setUsername,
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

    setUsername(user || 'guest');
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('/rute', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRouteData(response.data);

        const tpaResponse = await axios.get('/tpa', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTpaData([tpaResponse.data[0].latitude, tpaResponse.data[0].longitude]);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
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

    document.title = 'Rute - GreenRoute';
  }, [refreshKey]);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar page="Rute" />

      {/* Main Content */}
      <main className="flex-1 bg-[#fefbf5] overflow-y-scroll">
        <Header
          onLogout={handleLogout}
          pageTitle="Rute"
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
          <div className="p-6 overflow-x-auto w-full">
            <div className="flex justify-start items-center mb-6 w-full">
              {/* <h1 className="text-xl font-semibold">Rute</h1> */}
              <div className="w-full flex items-center space-x-4">
                <div className="w-full flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-gray-900 flex items-center">
                        <Info className="w-5 h-5 text-gray-700" />
                        <span className="">Detail Rute</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Detail Rute</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-start justify-center gap-2">
                        Total Armada: <span className="font-bold inline">{routeData.length}</span>
                        Rata-rata Jarak Tempuh: <span className="font-bold inline">{(routeData.reduce((total, route) => total + route.jarak_tempuh, 0) / routeData.length).toFixed(2)} km </span>
                        Rata-rata Muatan: <span className="font-bold inline">{(routeData.reduce((total, route) => total + route.muatan, 0) / routeData.length).toFixed(2)} ton</span>
                      </div>
                      <DialogFooter className="sm:justify-start">
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {isAdmin && (
                    <Dialog>
                      <DialogTrigger className="px-4 py-2 bg-lime-600 text-white rounded flex items-center space-x-2 border border-gray-900 hover:bg-lime-700 transition-color cursor-pointer">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Optimasi Rute</span>
                      </DialogTrigger>
                      <DialogContent
                        className="md:max-w-[800px] important px-4"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <DialogHeader>
                          <DialogTitle className="px-1">Optimasi Rute</DialogTitle>
                          <DialogDescription>
                          </DialogDescription>
                        </DialogHeader>
                        <OptimizerDialog
                          onFinish={() => {
                            setAlertMsg('Rute berhasil diperbarui');
                            setRefreshKey(refreshKey + 1)
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>

            {routeData.length > 0 && (
              <div className="rounded-xl border border-gray-900 bg-white">
                <div className="overflow-x-auto">
                  <Table className="min-w-full text-center">
                    <TableCaption className="hidden"></TableCaption>
                    <TableHeader>
                      <TableRow className="border-b border-gray-900">
                        <TableHead className="text-center p-2">#</TableHead>
                        <TableHead className="text-center p-2">Armada</TableHead>
                        <TableHead className="text-center p-2 w-[100px]">Rute</TableHead>
                        <TableHead className="text-center p-2">
                          Jarak Tempuh
                          <span className="block">(km)</span>
                        </TableHead>
                        <TableHead className="text-center p-2">
                          Muatan
                          <span className="block">(ton)</span>
                        </TableHead>
                        <TableHead className="text-center p-2">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Data Rute */}
                      {routeData.map((item, idx) => (
                        <TableRow key={idx} className="border-t border-gray-900">
                          <TableCell className="font-medium py-3 px-2">{idx + 1}</TableCell>
                          <TableCell className="font-medium py-3 mx-4 whitespace-normal">{item.armada}</TableCell>
                          <TableCell className="py-3 px-2 whitespace-normal w-2/5">{item.rute_tps.split(';').join(' -> ')}</TableCell>
                          <TableCell className="py-3 px-2">{item.jarak_tempuh.toFixed(2)}</TableCell>
                          <TableCell className="py-3 px-2">{item.muatan}</TableCell>
                          <TableCell className="flex justify-center py-3 px-2">
                            <Dialog>
                              <DialogTrigger className="bg-lime-600 text-white hover:bg-lime-700 transition-colors p-2 rounded flex items-center space-x-2 border border-gray-900 cursor-pointer">
                                <EyeIcon className="w-4 h-4" />
                              </DialogTrigger>
                              <DialogContent className="md:max-w-[800px] rounded-xl border border-gray-900 bg-white">
                                <DialogHeader>
                                  <DialogTitle>Peta Rute</DialogTitle>
                                  <DialogDescription>
                                  </DialogDescription>
                                </DialogHeader>
                                <RouteMapDialog
                                  routeData={routeData}
                                  routeSelectedId={idx}
                                  tpaData={tpaData}
                                />
                              </DialogContent>
                            </Dialog>
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

      {/* Info Drawer */}

    </div>
  );
}