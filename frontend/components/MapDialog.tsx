import { ScrollArea } from './ui/scroll-area';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';

type MapDialogProps = {
    mapData: any[];
    locationId: number;
}
const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
})

export default function RouteMapDialog({ mapData, locationId }: MapDialogProps) {
    const refs = useRef<Record<string, HTMLDivElement | null>>({})
    const hasScrolled = useRef(false);

    const [location, selectLocation] = useState(locationId);
    const [coordinates, setCoordinates] = useState<[number, number]>([mapData[locationId].latitude, mapData[locationId].longitude]);


    const isTpa = mapData[locationId].tpa;

    const handleRouteClick = (idx: number) => {
        selectLocation(idx)
        setCoordinates([mapData[idx].latitude, mapData[idx].longitude]);
    }
    useEffect(() => {
        if (!hasScrolled.current) {
            const el = refs.current[locationId]
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                hasScrolled.current = true // hanya scroll sekali
            }
        }
    }, [locationId]);

    return (
        <div className="flex grid grid-cols-5 w-full">
            {!isTpa && (
                <div className="col-span-2 w-full h-[400px]">
                    <ScrollArea className="h-full w-full rounded-md">
                        <div className="pe-4">
                            {mapData.map((item, idx) => (
                                <div
                                    key={idx}
                                    ref={(el) => { refs.current[idx] = el }}
                                    onClick={() => handleRouteClick(idx)}
                                >
                                    <div
                                        className={`text-sm cursor-pointer hover:text-lime-600 transition-colors` + (idx === location ? ' font-bold text-lime-600' : '')}
                                    >{item.tps}</div>
                                    <hr className="my-2 border-gray-900" />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
            <div className={`${!isTpa ? 'col-span-3' : 'col-span-5'} w-full h-[400px]`}>
                <MapView coordinates={coordinates}></MapView>
            </div>
        </div>
    )
}