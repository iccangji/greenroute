import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { DialogClose } from "@radix-ui/react-dialog";

type TpsProps = {
    id: number | null
    tps: string
    latitude: number
    longitude: number
    volumeSampah: number
}

type DialogMode = 'add' | 'edit'
type TpsFormDialogProps = {
    onSubmit: ({ tps }: TpsProps) => void
    values: TpsProps | any
    mode: DialogMode
}

type AddDialogProps = {
    onFinish: () => void;
}
type EditDialogProps = {
    onFinish: () => void;
    tpsData: TpsProps;
}

type DeleteDialogProps = {
    onFinish: () => void;
    id: number;
}

function AddDialog({ onFinish }: AddDialogProps) {
    const sendData = async ({ tps, latitude, longitude, volumeSampah }: TpsProps) => {
        try {
            const token = Cookies.get('token');

            const response = await axios.post('/tps', {
                tps, latitude, longitude, volume_sampah: volumeSampah
            },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

            if (response.data) {
                onFinish();
            }

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }
    return (
        <TpsFormDialog
            onSubmit={(tps: TpsProps) => sendData(tps)}
            values={{ tps: "", latitude: 0, longitude: 0, volumeSampah: 0 }}
            mode="add"
        />
    );
}

function EditDialog({ tpsData, onFinish }: EditDialogProps) {
    const editData = async ({ tps, latitude, longitude, volumeSampah }: TpsProps) => {
        try {
            const token = Cookies.get('token');

            const response = await axios.put(`/tps/${tpsData.id}`, {
                tps, latitude, longitude, volume_sampah: volumeSampah
            },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

            if (response.data) {
                onFinish();
            }

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }
    return (
        <TpsFormDialog
            onSubmit={(item: TpsProps) => editData(item)}
            // onSubmit={(item: TpsProps) => console.log(item.tps)}
            values={{
                id: tpsData.id,
                tps: tpsData.tps,
                latitude: tpsData.latitude,
                longitude: tpsData.longitude,
                volumeSampah: tpsData.volumeSampah
            }}
            mode="edit"
        />
    );
}


function DeleteDialog({ id, onFinish }: DeleteDialogProps) {
    const onDelete = async () => {
        try {
            const token = Cookies.get('token');
            await axios.delete(`/tps/${id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            onFinish();
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }
    return (
        <div className="w-full h-[100px]">
            <div className="flex flex-col gap-2">
                <h1>Apakah anda yakin?</h1>
                <div className="w-full flex justify-end gap-2 mt-8">
                    <DialogClose>
                        <Button asChild
                            variant="outline"
                        >
                            Tidak
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onDelete}
                        variant="destructive"
                    >
                        Hapus
                    </Button>
                </div>
            </div>
        </div>
    )

}

function TpsFormDialog({ onSubmit, values, mode }: TpsFormDialogProps) {
    const [tps, setTps] = useState(values.tps);
    const [latitude, setLatitude] = useState(values.latitude);
    const [longitude, setLongitude] = useState(values.longitude);
    const [volumeSampah, setvolumeSampah] = useState(values.volumeSampah);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ id: null, tps, latitude, longitude, volumeSampah })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "tps":
                setTps(value);
                break;
            case "latitude":
                if (/^-?\d*\.?\d*$/.test(value)) {
                    setLatitude(value);
                }
                break;
            case "longitude":
                if (/^-?\d*\.?\d*$/.test(value)) {
                    setLongitude(value);
                }
                break;
            case "volume_sampah":
                if (/^-?\d*\.?\d*$/.test(value)) {
                    setvolumeSampah(value);
                }
                break;
            default:
                break;
        }
    };
    return (
        <div className="w-full h-[200px]">
            <div className="flex flex-col gap-0">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="w-full grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm md:text-md" htmlFor="tps">TPS</Label>
                            <Input
                                name="tps"
                                type="text"
                                placeholder="Masukkan tps"
                                onChange={(e) => handleChange(e)}
                                className="text-xs md:text-sm"
                                value={tps}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm md:text-md" htmlFor="latitude">Latitude</Label>
                            <Input
                                name="latitude"
                                type="text"
                                placeholder="Masukkan latitude"
                                onChange={(e) => handleChange(e)}
                                className="text-xs md:text-sm"
                                value={latitude ? latitude : ""}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm md:text-md" htmlFor="longitude">Longitude</Label>
                            <Input
                                name="longitude"
                                type="text"
                                placeholder="Masukkan longitude"
                                onChange={(e) => handleChange(e)}
                                className="text-xs md:text-sm"
                                value={longitude ? longitude : ""}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm md:text-md" htmlFor="volume_sampah">Volume Sampah</Label>
                            <Input
                                name="volume_sampah"
                                type="text"
                                placeholder="Masukkan volume sampah"
                                onChange={(e) => handleChange(e)}
                                className="text-xs md:text-sm"
                                value={volumeSampah ? volumeSampah : ""}
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-1/2 bg-lime-500 hover:bg-lime-600 mt-3 text-white"
                    >
                        {mode === "add" ? "Tambah" : "Simpan"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export {
    AddDialog,
    EditDialog,
    DeleteDialog,
}