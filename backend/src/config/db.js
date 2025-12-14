import mongoose from "mongoose"


export const connectDB= async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected sucessfully")

    }catch(error){
        console.error("error connecting to mongodb",error);
        process.exit(1);//exit with failure

    }
}