"use client";

import React from "react";
import { QrCodeIcon } from "lucide-react";
import { 
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, 
    NavigationMenuList 
} from "@/components/ui/navigation-menu";

const links = [
    { url: "/", title: "Home" },
    { url: "/about", title: "About Us" },
    { url: "/contact", title: "Contact Us" }
];

export default function NavBar() {
    return (
        <NavigationMenu className="w-screen flex justify-between bg-white-100 shadow">
            <NavigationMenuList className="flex items-center gap-4">
                <NavigationMenuItem className="flex items-center gap-2 text-lg font-semibold">
                    <QrCodeIcon className="w-6 h-6 text-blue-600" />
                    QR Chain
                </NavigationMenuItem>
            </NavigationMenuList>
            
            <NavigationMenuList className="flex items-center gap-4">
                {links.map((link, index) => (
                    <NavigationMenuItem key={index}>
                        <NavigationMenuLink href={link.url} className="text-black-100 hover:text-blue-600">
                            {link.title}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
