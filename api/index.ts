import { app } from "../src/app"
import initDB from "../src/config/db"


let dbInitialize = false
const handler = async (req: any, res: any) => {
    try {
        if (!dbInitialize) {
        await initDB()
        dbInitialize = true
    }
    } catch (error) {
        console.log('DB connection error', error)
    }
    
    return app(req, res);
}

export default handler  
