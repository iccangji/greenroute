import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, LogOutIcon, Menu, LogInIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import MobileSidebar from "./SidebarNav";
import Link from "next/link";

type HeaderProps = {
    onLogout: () => void;
    pageTitle: string;
    username: string;
}
export default function Header({ onLogout, pageTitle, username }: HeaderProps) {
    return (
        <header className="bg-white p-6 border-b border-gray-900 flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 mt-2">
                <div className="block md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant={"outline"} className="my-2 py-2 border border-gray-900 bg-transparent">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[250px]">
                            <SheetHeader>
                                <SheetTitle>GreenRoute</SheetTitle>
                            </SheetHeader>
                            <SheetDescription></SheetDescription>
                            <MobileSidebar page={pageTitle} />
                        </SheetContent>
                    </Sheet>
                </div>
                <h2 className="text-xl font-semibold">{pageTitle}</h2>
            </div>
            <div className="mt-2">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="border border-gray-900 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer flex items-center"
                    >
                        <div className="flex">
                            <UserIcon className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">{username}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex justify-center px-2">
                        {username !== 'guest' ? (
                            <Button
                                onClick={onLogout}
                                variant={"destructive"}
                                className="mx-4 my-2 w-full flex items-center justify-center"
                            >
                                <LogOutIcon className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        ) : (
                            <Link
                                href={'/login'}>
                                <Button
                                    className="my-2 w-full flex items-center justify-center bg-lime-600 hover:bg-lime-700"
                                >
                                    <LogInIcon className="w-4 h-4 mr-2" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}