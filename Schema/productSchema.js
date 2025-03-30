import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters." }),

    batchNo: z.coerce.number().min(1, { message: "Batch No. is required." }),

    startSerialNo: z.coerce
                .number()
                .min(1, { message: " Start Serial No. is required." }),

        endSerialNo:z.coerce.number().min(1,{message:"You need to specify an end serial number"}),

    price: z.coerce
            .number({ required_error: "Price is required" })
            .min(0, { message: "Price can't be less than 0." }),

    date: z.string().min(1,{message:"Date is required"}),

    NoOfUnits: z.coerce
            .number({ invalid_type_error: "Amount must be a number." })
            .min(1, { message: "Amount must be at least 1." }),

    location: z.string()
            .min(3, { message: "Location must be at least 3 characters." }),
});