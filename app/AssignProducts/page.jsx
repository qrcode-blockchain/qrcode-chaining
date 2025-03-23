'use client';
import React from "react";
import { useSession } from "next-auth/react";
import { MoonIcon } from "lucide-react";
import ProductRegistration from "../../components/ProductRegistration";
import SideBarComponent from "../../components/SideBarComponent";
import { useSearchParams } from "next/navigation";
export default function QRCreator() {
	
	const {data:session}=useSession();
	const role=session?.user.role;
	const searchParams=useSearchParams();
    const taskId=searchParams.get("taskId");
	return (
		<div className="min-h-screen bg-gray-900 text-white">			
			<SideBarComponent />
			<main className="ml-64 p-10">
				<div className="flex-1 flex flex-col p-4 overflow-auto">
					<div className="flex items-center justify-between my-3">
						<span className="text-md text-white">QR Code Generator</span>
						<div className="flex flex-row mx-3 gap-2">
							<MoonIcon className="text-white bg-none rounded-full" size={24}/>
						</div>
					</div>
					<ProductRegistration taskId={role==="lineManager"?taskId:null} role={role} />

				</div>
			</main>
		</div>
	);
}