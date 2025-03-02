import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function InfoTip({ Component, message }) {
    return (<>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    { Component }
                </TooltipTrigger>
                <TooltipContent>{ message }</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </>);
}