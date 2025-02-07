<FormField control={methods.register} name="batchNo" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Batch No</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input placeholder="Enter Batch No." {...field}/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Product's Batch No or Batch ID</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.batchNo && <FormMessage>{errors.batchNo.message}</FormMessage>}
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={register} name="serialNo" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Serial No</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input placeholder="Enter Serial No." {...field}/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Serial No. of Product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.serialNo && <FormMessage>{errors.serialNo.message}</FormMessage>}
                            </FormControl>
                        </FormItem>
                    )} />
                        
                    <FormField control={register} name="expiryDate" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn( "w-[240px] justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        <Calendar1Icon /> {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={new Date(field.value)} onSelect={(date) => field.onChange(date.toISOString())} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Expiry Date of Product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.expiryDate && <FormMessage>{errors.expiryDate.message}</FormMessage>}
                            </FormControl>
                        </FormItem>
                    )} />
                        
                    <FormField control={register} name="manufacturingDate" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Manufacturing Date</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn( "w-[240px] justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        <Calendar1Icon /> {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={(date) => field.onChange(date.toISOString())} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Manufacturing Date of Product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.manufacturingDate && <FormMessage>{errors.manufacturingDate.message}</FormMessage>}
                            </FormControl>
                        </FormItem>
                    )} />
                        
                    <FormField control={register} name="amount" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Amount of Products</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input placeholder="Enter Amount" {...field}/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Amount of Products to be Manufactured</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.amount && <FormMessage>{errors.amount.message}</FormMessage>}
                            </FormControl>
                        </FormItem>
                    )} />
                        
                    <FormField control={register} name="location" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input placeholder="Enter Location" {...field}/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Location of Manufacturing Plant</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.location && <FormMessage>{errors.location.message}</FormMessage>}
                            </FormControl>
                        </FormItem>
                    )} />