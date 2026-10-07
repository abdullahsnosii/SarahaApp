import mongoose from "mongoose";
import { DB_URI } from "../config.js";
import { UserModel } from "./model/user.model.js";

// problem in wifi with me
import dns from "dns";
import { connectRedis } from "./model/redis.connection.js";
dns.setServers(["8.8.4.4"]);

export const bootstarpDB=async (app , port)=>{
    try {
        await mongoose.connect(DB_URI , {serverSelectionTimeoutMS:30000})
        console.log(`DB connected successfully ✅`)
        await connectRedis()
        await UserModel.syncIndexes()
        app.listen(port , ()=> console.log(`Example app listening on port ${port}`))
    } catch (error) {
        console.log(error)
        console.log(`Fail to connect DB ❌`)

    }
}