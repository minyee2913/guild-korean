"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bdsx_1 = require("bdsx");
const colors_1 = require("colors");
const fs_1 = require("fs");
let ex = fs_1.existsSync("../2913plugins");
if (ex == false)
    fs_1.mkdirSync("../2913plugins");
console.log(colors_1.yellow('[2913plugin:GUILD-KOREAN] 적용중...'));
bdsx_1.bedrockServer.open.on(() => {
    require("./guild");
    console.log(colors_1.green('[2913plugin:GUILD-KOREAN] 적용됨!'));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFxQztBQUNyQyxtQ0FBdUM7QUFDdkMsMkJBQTJDO0FBRTNDLElBQUksRUFBRSxHQUFHLGVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksRUFBRSxJQUFJLEtBQUs7SUFBRSxjQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU3QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7QUFFeEQsb0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRTtJQUN0QixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUMsQ0FBQyxDQUFDIn0=