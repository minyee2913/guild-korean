import { bedrockServer } from "bdsx";
import { green, yellow } from "colors";
import { existsSync, mkdirSync } from "fs";

let ex = existsSync("../2913plugins");
if (ex == false) mkdirSync("../2913plugins");

console.log(yellow('[2913plugin:GUILD-KOREAN] 적용중...'));

bedrockServer.open.on(()=>{
    require("./guild");
    console.log(green('[2913plugin:GUILD-KOREAN] 적용됨!'));
});
    
