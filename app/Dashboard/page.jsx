import React from "react";
import ProductRegistration from "../components/ProductRegistration";
import SideBarComponent from "../components/SideBarComponent";
import NavBar from "../components/NavBar";

export default function Home() {
    return (
      <div className="flex flex-col w-screen h-screen">
            <NavBar />
            <div className="container flex w-full flex-grow min-h-0">
              <SideBarComponent />
                  <div className="flex-1 p-4 overflow-auto">
                    <ProductRegistration />		
              </div>
            </div>
      </div>
    );
}