import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button";
import BarLoader from 'react-spinners/BarLoader';
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "@/lib/axios";

type DialogProps = {
    onFinish: () => void
}
export default function OptimizerDialog({ onFinish }: DialogProps) {

    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");

    const [route, setRoute] = useState<any[]>([]);
    const [cluster, setCluster] = useState(0);
    const [fitness, setFitness] = useState(0);
    const [totalTruck, setTotalTruck] = useState(0);
    const [avgDistance, setAvgDistance] = useState(0);
    const [avgLoad, setAvgLoad] = useState(0);

    const optimizeRoute = (popSize: number, maxGen: number, crossoverRate: number, mutationRate: number, initTemp: number, stopTemp: number, coolRate: number) => {
        setLoadingMsg("Melakukan optimasi rute...");
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');

                const response = await axios.post('/rute/optimize', {
                    pop_size: popSize,
                    max_gen: maxGen,
                    crossover_rate: crossoverRate,
                    mutation_rate: mutationRate,
                    initial_temp: initTemp,
                    stop_temp: stopTemp,
                    cooling_rate: coolRate
                },
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    });
                setCluster(response.data.data.klaster);
                setFitness(response.data.data.fitnesses);
                setTotalTruck(response.data.data.total_truk);
                setAvgDistance(response.data.data.avg_distance);
                setAvgLoad(response.data.data.avg_load);
                setRoute(response.data.data.rute);

                setIsLoading(false);
                setIsFinished(true);

            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }

        fetchData();
    };

    const saveRoute = () => {
        setLoadingMsg("Menyimpan rute...");
        setIsLoading(true);
        const sendData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.post('/rute/save', {
                    route
                },
                    {
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
        sendData();
    }
    return (
        <div className="w-full h-[400px] overflow-x-auto md:overflow-x-hidden px-1">
            {isLoading && <LoadingScreen message={loadingMsg} />}
            {!isFinished && !isLoading &&
                <ParameterForm
                    onFinish={(
                        popSize: number,
                        maxGen: number,
                        crossoverRate: number,
                        mutationRate: number,
                        initTemp: number,
                        stopTemp: number,
                        coolRate: number
                    ) => {
                        optimizeRoute(popSize, maxGen, crossoverRate, mutationRate, initTemp, stopTemp, coolRate);
                    }}
                />
            }
            {isFinished && !isLoading &&
                <ResultScreen cluster={cluster} fitness={fitness} totalTruck={totalTruck} avgDistance={avgDistance} avgLoad={avgLoad} route={route} onSave={saveRoute} />
            }
        </div>
    );
}

type ParameterFormProps = {
    onFinish: (
        popSize: number,
        maxGen: number,
        crossoverRate: number,
        mutationRate: number,
        initTemp: number,
        stopTemp: number,
        coolRate: number
    ) => void
}

function ParameterForm({ onFinish }: ParameterFormProps) {
    const [popSize, setPopSize] = useState(0);
    const [maxGen, setMaxGen] = useState(0);
    const [crossoverRate, setCrossoverRate] = useState(0);
    const [mutationRate, setMutationRate] = useState(0);
    const [initTemp, setInitTemp] = useState(0);
    const [stopTemp, setStopTemp] = useState(0);
    const [coolRate, setCoolRate] = useState(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'pop_size':
                setPopSize(parseInt(value, 10));
                break;
            case 'max_gen':
                setMaxGen(parseInt(value, 10));
                break;
            case 'crossover_rate':
                setCrossoverRate(parseFloat(value));
                break;
            case 'mutation_rate':
                setMutationRate(parseFloat(value));
                break;
            case 'init_temp':
                setInitTemp(parseFloat(value));
                break;
            case 'stop_temp':
                setStopTemp(parseFloat(value));
                break;
            case 'cool_rate':
                setCoolRate(parseFloat(value));
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFinish(popSize, maxGen, crossoverRate, mutationRate, initTemp, stopTemp, coolRate);
    };

    return (
        <div className="flex flex-col gap-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
                <h1 className="font-bold">Parameter Algoritma Genetika</h1>
                <div className="w-full grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="pop_size">Jumlah Populasi</Label>
                        <Input
                            name="pop_size"
                            type="text"
                            placeholder="Masukkan jumlah populasi"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="crossover_rate">Rate Crossover</Label>
                        <Input
                            name="crossover_rate"
                            type="text"
                            placeholder="Masukkan rate crossover"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="max_gen">Jumlah Generasi</Label>
                        <Input
                            name="max_gen"
                            type="text"
                            placeholder="Masukkan jumlah generasi"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="mutation_rate">Rate Mutasi</Label>
                        <Input
                            name="mutation_rate"
                            type="text"
                            placeholder="Masukkan rate mutasi"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                </div>
                <h1 className="font-bold">Parameter Simulated Annealing</h1>
                <div className="w-full grid grid-cols-2 gap-3 mt-0">
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="init_temp">Temperatur</Label>
                        <Input
                            name="init_temp"
                            type="text"
                            placeholder="Masukkan nilai temperatur"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="cool_rate">Penurunan Temperatur</Label>
                        <Input
                            name="cool_rate"
                            type="text"
                            placeholder="Masukkan rate penurunan temperatur"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm md:text-md" htmlFor="stop_temp">Batas Temperatur</Label>
                        <Input
                            name="stop_temp"
                            type="text"
                            placeholder="Masukkan batas temperatur"
                            onChange={(e) => handleChange(e)}
                            className="text-xs md:text-sm px-2"
                            required
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-1/2 bg-lime-500 hover:bg-lime-600 mt-1 text-white"
                >
                    Optimasi
                </Button>
            </form>
        </div>
    );
}

type LoadingProps = {
    message: string
}
function LoadingScreen({ message }: LoadingProps) {
    return (
        <div className="flex flex-col justify-center items-center h-full gap-2">
            <h1 className="font-semibold">{message}</h1>
            <BarLoader
                color="#75c900"
                height={10}
                width={400}
            />
        </div>
    );
}

type ResultProps = {
    cluster: number,
    fitness: number,
    totalTruck: number,
    avgDistance: number,
    avgLoad: number,
    route: any[],
    onSave: () => void
}
function ResultScreen({ cluster, fitness, totalTruck, avgDistance, avgLoad, route, onSave }: ResultProps) {
    return (
        <div className="overflow-x-auto h-full w-full">
            <div className="grid grid-cols-2 gap-2">
                <div className="w-full flex flex-col md:flex-row text-sm md:text-md">
                    <span className="font-semibold me-2">Nilai Fitness: </span>
                    <span>{fitness.toFixed(4)}</span>
                </div>
                <div className="w-full flex flex-col md:flex-row text-sm md:text-md">
                    <span className="font-semibold me-2">Klaster Wilayah: </span>
                    <span>{cluster}</span>
                </div>
                <div className="w-full flex flex-col md:flex-row text-sm md:text-md">
                    <span className="font-semibold me-2">Total Armada: </span>
                    <span>{totalTruck}</span>
                </div>
                <div className="w-full flex flex-col md:flex-row text-sm md:text-md">
                    <span className="font-semibold me-2">Rata-Rata Jarak Tempuh: </span>
                    <span>{avgDistance}</span>
                </div>
                <div className="w-full flex flex-col md:flex-row text-sm md:text-md">
                    <span className="font-semibold me-2">Rata-Rata Muatan:</span>
                    <span>{avgLoad}</span>
                </div>
            </div>
            <div className="my-4">
                <Button
                    className="bg-lime-600 hover:bg-lime-700"
                    onClick={() => {
                        onSave()
                    }}
                >
                    Simpan
                </Button>
            </div>
            <div className="overflow-x-auto md:overflow-y-auto">
                <table className="w-full rounded-md">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-900 p-2">#</th>
                            <th className="border-b border-gray-900 p-2">Armada</th>
                            <th className="border-b border-gray-900 p-2">Rute</th>
                            <th className="border-b border-gray-900 p-2">Jarak Tempuh</th>
                            <th className="border-b border-gray-900 p-2">Muatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {route.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-2 px-4 text-center font-semibold text-sm border-b border-gray-900">{idx + 1}</td>
                                <td className="py-2 text-center text-sm border-b border-gray-900">{item.armada}</td>
                                <td className="py-2 px-4 text-sm text-left border-b border-gray-900">{item.names.join(' > ')}</td>
                                <td className="py-2 text-center text-sm border-b border-gray-900">{item.distance}</td>
                                <td className="py-2 text-center text-sm border-b border-gray-900">{item.load}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}