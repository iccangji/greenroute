import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import Cookies from "js-cookie";
import axios from "@/lib/axios";

type TpaProps = {
    id: number
    tpa: string
    latitude: number
    longitude: number
}

type TpsFormDialogProps = {
    onSubmit: ({ tpa }: TpaProps) => void
    values: TpaProps | any
}

type EditDialogProps = {
    onFinish: () => void;
    tpaData: TpaProps;
}

function EditDialog({ tpaData, onFinish }: EditDialogProps) {
    const editData = async ({ tpa, latitude, longitude }: TpaProps) => {
        try {
            const token = Cookies.get('token');

            const response = await axios.put(`/tpa/${tpaData.id}`, {
                tpa, latitude, longitude
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
            onSubmit={(item: TpaProps) => editData(item)}
            // onSubmit={(item: TpsProps) => console.log(item.tps)}
            values={{
                id: tpaData.id,
                tpa: tpaData.tpa,
                latitude: tpaData.latitude,
                longitude: tpaData.longitude,
            }}
        />
    );
}

function TpsFormDialog({ onSubmit, values }: TpsFormDialogProps) {
    const [tpa, setTps] = useState(values.tpa);
    const [latitude, setLatitude] = useState(values.latitude);
    const [longitude, setLongitude] = useState(values.longitude);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ id: values.id, tpa, latitude, longitude })
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
                                value={tpa}
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
                    </div>
                    <Button
                        type="submit"
                        className="w-1/2 bg-lime-500 hover:bg-lime-600 mt-3 text-white"
                    >
                        Simpan
                    </Button>
                </form>
            </div>
        </div>
    );
}

export {
    EditDialog,
}