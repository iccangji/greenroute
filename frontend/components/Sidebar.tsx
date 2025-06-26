import Image from 'next/image';
import { RouteIcon, MapPinIcon, TrashIcon } from 'lucide-react'; // Pastikan Anda mengimpor ikon yang sesuai jika ingin menggunakannya
import Link from 'next/link';
import SidebarNav from './SidebarNav';

type sidebarProps = {
    page: string;
}
export default function Sidebar({ page }: sidebarProps) {
    return (
        <aside className="absolute md:relative top-0 left-0 min-h-screen w-1/2 md:w-1/5 bg-white border-r border-gray-900 p-4 hidden md:block">
            <div className="flex items-center px-4 py-6 mt-2">
                <Image
                    src="/truck.png" // ganti dengan path gambar yang sesuai di public folder
                    alt="Green Truck"
                    width={40}
                    height={40}
                    className="mr-4 hidden md:block w-auto h-auto"
                />
                <span className="font-bold text-lg d-none md:d-block">GreenRoute</span>
            </div>
            <hr className='border-gray-900 mb-4 ' />
            <SidebarNav page={page} />
        </aside>
    )
}