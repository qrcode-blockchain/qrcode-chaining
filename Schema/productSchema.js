import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters." }),

    batchNo: z.string().min(1,{message:"Minimun 1 character"}),

    startSerialNo: z.coerce
                .number()
                .min(1, { message: " Start Serial No. is required." }),

        endSerialNo:z.coerce.number().min(1,{message:"You need to specify an end serial number"}),

    price: z.coerce
            .number({ required_error: "Price is required" })
            .min(0, { message: "Price can't be less than 0." }),

    date: z.string().optional(),

    TotalNoOfUnits: z.coerce
            .number({ invalid_type_error: "Amount must be a number." })
            .min(1, { message: "Amount must be at least 1." }),

    location: z.string()
            .min(3, { message: "Location must be at least 3 characters." }),

	VideoLink: z.string().url().optional()
})
.refine(
        (data) => data.endSerialNo >= data.startSerialNo,
        {
          message: "End Serial Number must be greater than or equal to Start Serial Number",
          path: ["endSerialNo"],
        }
      )
.refine(
        (data)=>data.endSerialNo<=data.TotalNoOfUnits,
        {
                message:"End Serial Number can't exceed the total number of units",
                path:['endSerialNo'],
        }
);

export const MproductSchema = z.object({
        name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
    
        batchNo: z.string().min(1,{message:"Minimun 1 character"}),
    
        startSerialNo: z.coerce
                    .number()
                    .min(1, { message: " Start Serial No. is required." }),
    
            endSerialNo:z.coerce.number().min(1,{message:"You need to specify an end serial number"}),
    
        price: z.coerce
                .number({ required_error: "Price is required" })
                .min(0, { message: "Price can't be less than 0." }),
    
        date: z.string().min(1,{message:"Date is required"}),
    
       
    
        location: z.string()
                .min(3, { message: "Location must be at least 3 characters." }),
    });
      
      