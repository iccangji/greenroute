import { ScrollArea } from '../ui/scroll-area';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';

type routeMapProps = {
    routeData: any[];
    routeSelectedId: number;
    tpaData: [number, number][];
}
const MapView = dynamic(() => import('@/components/route/RouteMapView'), {
    ssr: false,
})

export default function RouteMapDialog({ routeData, routeSelectedId, tpaData }: routeMapProps) {
    const refs = useRef<Record<string, HTMLDivElement | null>>({})
    const hasScrolled = useRef(false);

    const [route, selectRoute] = useState(routeSelectedId);
    const [coordinates, setCoordinates] = useState(routeData[routeSelectedId].rute_koordinat.split(';').map((coord: string) => coord.split(',').map(Number)));
    const handleRouteClick = (idx: number) => {
        selectRoute(idx)
        setCoordinates(routeData[idx].rute_koordinat.split(';').map((coord: string) => coord.split(',').map(Number)));
    }
    useEffect(() => {
        if (!hasScrolled.current) {
            const el = refs.current[routeSelectedId]
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                hasScrolled.current = true // hanya scroll sekali
            }
        }
    }, [routeSelectedId]);

    return (
        <div className="flex grid grid-cols-5 w-full">
            <div className="col-span-2 w-full h-[400px]">
                <ScrollArea className="h-full w-full rounded-md">
                    <div className="pe-4">
                        {routeData.map((item, idx) => (
                            <div
                                key={idx}
                                ref={(el) => { refs.current[idx] = el }}
                                onClick={() => handleRouteClick(idx)}
                            >
                                <div
                                    className={`text-sm cursor-pointer hover:text-lime-600 transition-colors` + (idx === route ? ' font-bold text-lime-600' : '')}
                                >{item.rute_tps.split(';').join(' > ')}</div>
                                <hr className="my-2 border-gray-900" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="col-span-3 w-full h-[400px]">
                <MapView coordinates={[...coordinates, tpaData]}></MapView>
                <div className="fixed top-18 right-8 z-999 rounded-md bg-white p-4 border border-gray-900 hidden md:block">
                    <div className="flex flex-col gap-0">
                        <span className="text-sm">Jarak tempuh: {routeData[route].jarak_tempuh.toFixed(2)} km</span>
                        <span className="text-sm">Muatan : {routeData[route].muatan} ton</span>
                    </div>
                </div>
            </div>
        </div>
    )
}