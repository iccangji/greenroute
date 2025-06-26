import Image from 'next/image';
import { RouteIcon, MapPinIcon, TrashIcon } from 'lucide-react'; // Pastikan Anda mengimpor ikon yang sesuai jika ingin menggunakannya
import Link from 'next/link';

type sidebarProps = {
    page: string;
}

const menu = [
    { name: 'Rute', href: '/', icon: 'route' },
    { name: 'TPS', href: '/tps', icon: 'map-pin' },
    { name: 'TPA', href: '/tpa', icon: 'landmark' }
];

export default function SidebarNav({ page }: sidebarProps) {
    return (
        <nav className="space-y-2 px-4">
            {menu.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg transition-all ${page === item.name
                        ? 'bg-lime-200 text-black font-semibold'
                        : 'text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {/* Anda bisa render ikon pakai lucide-react */}
                    {item.icon === 'route' && <RouteIcon className="w-5 h-5" />}
                    {item.icon === 'map-pin' && <TrashIcon className="w-5 h-5" />}
                    {item.icon === 'landmark' && <MapPinIcon className="w-5 h-5" />}
                    <span className="ml-2 text-md">{item.name}</span>
                </Link>
            ))}
        </nav>
    )
}