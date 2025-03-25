'use client';
import React,{Suspense} from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import { MoonIcon } from "lucide-react";
import ProductRegistration from "../../components/ProductRegistration";
import SideBarComponent from "../../components/SideBarComponent";
import { useSearchParams } from "next/navigation";
function QRCreatorContent() {
	
	const {data:session,status}=useSession();
	
	const searchParams=useSearchParams();
	const [taskId,setTaskId]=useState(null);
	useEffect(()=>{
		if(status==="authenticated"){
			setTaskId(searchParams.get("taskId"));
		}
		
	},[searchParams,status]); 
	if (status === "loading") return <div>Loading...</div>;
	const role=session?.user.role;
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
export default function QRCreator() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<QRCreatorContent />
		</Suspense>
	);
}