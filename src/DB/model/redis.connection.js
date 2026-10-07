import { createClient } from "redis"
import { REDIS_URI } from "../../config.js";

export const client = createClient({
  url: REDIS_URI
});

export async function connectRedis() {
try {
await client.connect()
console.log(`Radis connction stablish successfully ✅✅`);

} catch (error) {
    console.log(error);
    console.log(`Fail tro stablish Redis connction ❌❌`);
    
    
}
}