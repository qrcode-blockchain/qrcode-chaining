import React from "react";
import { MoonIcon, Settings } from "lucide-react";
import ProductRegistration from "@/components/ProductRegistration";
import SideBarComponent from "@/components/SideBarComponent";

export default function QRCreator() {
	return (
		<div className="flex flex-col bg-sky-100 w-screen h-screen">
        	<div className="bg-blue-600 z-10 w-full h-1/3 absolute"></div>
        	<div className="flex h-full w-screen z-20">
			  	<SideBarComponent />
	  			<div className="flex-1 flex flex-col p-4 overflow-auto">
				  	<div className="flex items-center justify-between my-3">
                    	<span className="text-md text-white">QR Code Generator</span>
                    	<div className="flex flex-row mx-3 gap-2">
                        	<MoonIcon className="text-white bg-blue-600 rounded-full" size={24}/>
                        	<Settings className="text-white bg-blue-600 rounded-full" size={24}/>
                    	</div>
                	</div>
					<ProductRegistration />		
			  	</div>
			</div>
	  	</div>
	);
}