import { randomBytes } from "crypto";

//generate seecret key
console.log(randomBytes(64).toString("hex"));
