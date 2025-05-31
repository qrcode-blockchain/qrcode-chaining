'use client'
import React from "react";
import { useSession } from "next-auth/react";
import { MoonIcon } from "lucide-react";

import SideBarComponent from "../../components/SideBarComponent";
import TaskStatusMan from "../../components/taskStatusMan";
export default function QRCreator() {
	
	const {data:session}=useSession();
	const role=session?.user.role;
	

	return (
		<div className="min-h-screen bg-gray-900 text-white">			
			<SideBarComponent />
			<main className="ml-64 p-10">
				
					<TaskStatusMan />

				
			</main>
		</div>
	);
}