import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/option';

import { dbConnect } from "../../../../lib/dbConnect";
import Manufacturer from '../../../../model/Manufacturer';
import Product from '../../../../model/Product';
import Batch from '../../../../model/Batch';
import mongoose from 'mongoose';


 export async function GET(request){
  try{
    await dbConnect();
    const session=await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const manufacturerId=await session.user._id;
    //get all rpoduct data
    const chartData=await Product.aggregate([
      {
        //first match and find all products with this manufacturer
        $match:{manufacturerId:new mongoose.Types.ObjectId(manufacturerId)}, 
      },
      {
        $lookup:{
          from:'batches',
          localField:'_id',
          foreignField:'productId',
          as:'batches'
        }
      },
      {
        $unwind:{
          path:"$batches",
          preserveNullAndEmptyArrays:true
        }
      },
      {
        $addFields:{
          monthYear:{
            $dateToString:{
              format:"%Y-%m",
              date:"$batches.utcTimestamp"
            }
          }
        }
      },
      {
        $group:{
          _id:{
            productName:'$name',
            monthYear:'$monthYear'
          },
          totalUnits:{$sum:'$batches.totalUnits'}
        } 
      },
      {
        $group:{
          _id:'$_id.productName',
          monthlyData:{
            $push:{
              month:'$_id.monthYear',
              units:'$totalUnits'
            }
          }
        }
      },
      {
        $sort:{'_id':1}
    }

    ]);
    console.log("✅ Aggregated chartData:", JSON.stringify(chartData, null, 2));
  //   const chartData = await Product.aggregate([
  //     {
  //         $match: { manufacturerId: new mongoose.Types.ObjectId(manufacturerId) }
  //     },
  //     {
  //         $lookup: {
  //             from: 'batches',
  //             localField: '_id',
  //             foreignField: 'productId',
  //             as: 'batches'
  //         }
  //     },
  //     {
  //         $unwind: {
  //             path: '$batches',
  //             preserveNullAndEmptyArrays: true
  //         }
  //     },
  //     {
  //         $addFields: {
  //             monthYear: {
  //                 $dateToString: {
  //                     format: "%Y-%m",
  //                     date: "$batches.utcTimestamp"
  //                 }
  //             }
  //         }
  //     },
  //     {
  //         $group: {
  //             _id: {
  //                 productName: '$name',
  //                 monthYear: '$monthYear'
  //             },
  //             totalUnits: { $sum: '$batches.totalUnits' }
  //         }
  //     },
  //     {
  //         $group: {
  //             _id: '$_id.productName',
  //             monthlyData: {
  //                 $push: {
  //                     month: '$_id.monthYear',
  //                     units: '$totalUnits'
  //                 }
  //             }
  //         }
  //     },
  //     {
  //         $sort: { '_id': 1 }
  //     }
  // ]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear=new Date().getFullYear();
      const monthKeys=months.map((month,index)=>
        
        `${currentYear}-${String(index+1).padStart(2,'0')}`
      );
      console.log("🗓️ monthKeys:", monthKeys);
      const series=chartData.map((product)=>{
        const monthlyUnits=new Array(12).fill(0);
product.monthlyData.forEach(data=>{
  if(data.month){
    const monthIndex=monthKeys.indexOf(data.month); //to find the index that matches with product date 
    if(monthIndex!==-1){
      monthlyUnits[monthIndex]=data.units || 0;      
    }
  }
});
console.log(`📊 Product: ${product._id} → Monthly Units:`, monthlyUnits);


return {
  name:product._id,
  data:monthlyUnits
};
      });
      
      const options = {
        chart: { 
            toolbar: { show: false },
            type: 'area',
            background: '#1e1e2f'
        },
        xaxis: {
            categories: months,
            labels: { 
                style: { colors: '#fff' } 
            }
        },
        yaxis: { 
            labels: { 
                style: { colors: '#fff' } 
            } 
        },
        stroke: { 
            curve: "smooth" 
        },
        dataLabels: { 
            enabled: false 
        },
        legend: {
            labels: {
                colors: '#fff'
            }
        }
    };
    //find the no of qrcodes generated
     const totalUnits=series.reduce((acc,product)=>{
        return acc + product.data.reduce((sum,val)=>{return sum+val},0)
     },0)
     console.log("The total Units are",totalUnits);
     //find the cout of products
    const noOfProducts=await Product.countDocuments({
      manufacturerId:new mongoose.Types.ObjectId(manufacturerId)
    })
    //now find the unist produced last montha n this month
    const now=new Date();
    const thisMonthKey=now.toISOString().slice(0,7);
    const lastMonthDate=new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
    const lastMonthKey=lastMonthDate.toISOString().slice(0,7);

    let thisMonthUnit=0;
    let lastMonthUnit=0;
    chartData.map((product)=>{
      product.monthlyData.forEach((data)=>{
        if(data.month===thisMonthKey){
          thisMonthUnit+=data.units;
        }
        if(data.month===lastMonthKey){
          lastMonthUnit+=data.units;
        }
      })
    })
    const pieSeries = chartData.map(p =>
      p.monthlyData.reduce((sum, d) => sum + d.units, 0)
    );
    
    const pieLabels = chartData.map(p => p._id);
    return NextResponse.json({
        success: true,
        series: series,
        options: options,
        totalUnits,
        noOfProducts,
        thisMonthUnit,
        lastMonthUnit,
        pie: {
          series: pieSeries,
          labels: pieLabels
        }
    }, { status: 200 });

  }catch(error){
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
    );
  }

    

    //first task is to fetch all the produt ids that belon to this paticular manufacturer 
     
 }

