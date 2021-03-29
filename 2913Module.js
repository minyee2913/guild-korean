"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.form = exports.ListenInvTransaction = exports.numberFormat = exports.numberToKorean = exports.netCmd = exports.deleteBossBar = exports.setBossBar = exports.CustomScore = exports.DataById = exports.Disconnect = exports.playerList = exports.getScore = exports.playerPermission = exports.setHealth = exports.transferServer = exports.sendText = exports.NameById = exports.IdByName = exports.XuidByName = exports.Formsend = void 0;
//
// _______        _______    __     _____     ______    ___      ___                                                      ________          ___      __________
// |      \      /      |   |__|    |    \    |    |    \  \    /  /    ___________     ___________       __________    _|        |__      /   |    |  ____    |
// |       \    /       |    __     |     \   |    |     \  \  /  /     |   _______|    |   _______|     |  ____    |   |           |     /_   |    |__|  |    |
// |        \__/        |   |  |    |      \  |    |      \  \/  /      |  |_______     |  |_______      |__|   /   |   |_          |       |  |       ___|    |
// |     |\      /|     |   |  |    |   |\  \ |    |       |    |       |   _______|    |   _______|           /   /      |______   |       |  |     _|___     |
// |     | \____/ |     |   |  |    |   | \  \|    |       |    |       |  |_______     |  |_______       ____/   /__            |  |    ___|  |__  |  |__|    |
// |_____|        |_____|   |__|    |___|  \_______|       |____|       |__________|    |__________|     |___________|           |__|   |_________| |__________|
//
//
const bdsx_1 = require("bdsx");
const packets_1 = require("bdsx/bds/packets");
const colors_1 = require("colors");
const fs_1 = require("fs");
const system = server.registerSystem(0, 0);
let playerList = [];
exports.playerList = playerList;
let nIt = new Map();
let nMt = new Map();
let nXt = new Map();
bdsx_1.nethook.after(bdsx_1.PacketId.Login).on((ptr, networkIdentifier) => {
    const cert = ptr.connreq.cert;
    const xuid = cert.getXuid();
    const username = cert.getId();
    nXt.set(username, xuid);
    nIt.set(username, networkIdentifier);
    nMt.set(networkIdentifier, username);
});
bdsx_1.nethook.after(bdsx_1.PacketId.SetLocalPlayerAsInitialized).on((ptr, target) => {
    let actor = target.getActor();
    let playerName;
    playerName = NameById(target);
    setTimeout(() => {
        if (!playerList.includes(playerName))
            playerList.push(playerName);
    }, 100);
});
bdsx_1.NetworkIdentifier.close.on(networkIdentifier => {
    setTimeout(() => {
        const id = nMt.get(networkIdentifier);
        if (playerList.includes(id))
            playerList.splice(playerList.indexOf(id), 1);
        nXt.delete(id);
        nMt.delete(networkIdentifier);
        nIt.delete(id);
        FormData.delete(networkIdentifier);
    }, 100);
});
/**
  *get playerXuid by Name
*/
function XuidByName(PlayerName) {
    let Rlt = nXt.get(PlayerName);
    return Rlt;
}
exports.XuidByName = XuidByName;
/**
  *get playerName by Id
*/
function NameById(networkIdentifier) {
    let actor = networkIdentifier.getActor();
    let playerName;
    try {
        let entity = actor.getEntity();
        playerName = system.getComponent(entity, "minecraft:nameable").data.name;
    }
    catch (_a) {
        playerName = nMt.get(networkIdentifier);
    }
    return playerName;
}
exports.NameById = NameById;
/**
  *get playerData by Id
  *result = [name,actor,entity, xuid]
*/
function DataById(networkIdentifier) {
    let actor = networkIdentifier.getActor();
    let entity = actor.getEntity();
    let name = actor.getName();
    let xuid = nXt.get(name);
    return [name, actor, entity, xuid];
}
exports.DataById = DataById;
/**
  *get playerId by Name
*/
function IdByName(PlayerName) {
    let Rlt = nIt.get(PlayerName);
    return Rlt;
}
exports.IdByName = IdByName;
/////////////////////////////////////////
//JSform
let FormData = new Map();
class formJSONTYPE {
}
class formJSON {
}
class CustomformJSON {
}
class modalJSON {
}
class FormFile {
    setTitle(title) {
        this.json.title = title;
    }
    setContent(content) {
        this.json.content = content;
    }
    addButton(text, image) {
        var _a;
        (_a = this.json.buttons) === null || _a === void 0 ? void 0 : _a.push({
            text: text,
            image: image
        });
    }
    addhandler(handler) {
        this.handler = handler;
    }
    send() {
        Formsend(this.target, this.json, this.handler);
    }
}
class CustomFormFile {
    setTitle(title) {
        this.json.title = title;
    }
    addContent(content) {
        this.json.content = content;
    }
    addhandler(handler) {
        this.handler = handler;
    }
    send() {
        Formsend(this.target, this.json, this.handler);
    }
}
class ModalFile {
    setTitle(title) {
        this.json.title = title;
    }
    setContent(content) {
        this.json.content = content;
    }
    setButton1(button) {
        this.json.button1 = button;
    }
    setButton2(button) {
        this.json.button2 = button;
    }
    addhandler(handler) {
        this.handler = handler;
    }
    send() {
        Formsend(this.target, this.json, this.handler);
    }
}
var form;
(function (form_1) {
    function create(target, type) {
        let form;
        if (type == "form" || type == undefined) {
            form = new FormFile();
        }
        else if (type == "custom_form") {
            form = new CustomFormFile();
        }
        else if (type == "modal") {
            form = new ModalFile();
        }
        form.target = target;
        return form;
    }
    form_1.create = create;
    form_1.write = Formsend;
})(form || (form = {}));
exports.form = form;
/**
  *JsonType example : https://github.com/NLOGPlugins/Form_Json You can use form.write instead of this
*/
function Formsend(target, form, handler, id) {
    try {
        const modalPacket = packets_1.ShowModalFormPacket.create();
        let formId = Math.floor(Math.random() * 1147483647) + 1000000000;
        if (typeof id == "number")
            formId = id;
        modalPacket.setUint32(formId, 0x30);
        modalPacket.setCxxString(JSON.stringify(form), 0x38);
        modalPacket.sendTo(target, 0);
        if (handler == undefined)
            handler = () => { };
        if (!FormData.has(target)) {
            FormData.set(target, [
                {
                    Id: formId,
                    func: handler
                }
            ]);
        }
        else {
            let f = FormData.get(target);
            f.push({
                Id: formId,
                func: handler
            });
            FormData.set(target, f);
        }
        modalPacket.dispose();
    }
    catch (err) { }
}
exports.Formsend = Formsend;
bdsx_1.nethook.raw(bdsx_1.PacketId.ModalFormResponse).on((ptr, size, target) => {
    ptr.move(1);
    let formId = ptr.readVarUint();
    let formData = ptr.readVarString();
    let dataValue = FormData.get(target).find((v) => v.Id == formId);
    let data = JSON.parse(formData.replace("\n", ""));
    if (dataValue == undefined)
        return;
    dataValue.func(data);
    let f = FormData.get(target);
    f.splice(f.indexOf(dataValue), 1);
    FormData.set(target, f);
});
/////////////////////////////////////////
//TEXT
/**
 * NAME or NETWORKIDENTIFIER
 *
 *Type Code :
 * Raw == 0,
 * Chat == 1,
 * Translation == 2,
 * Popup == 3,
 * Jukeboxpopup == 4,
 * Tip == 5,
 * system == 6,
 * Whisper == 7,
 * Announcement == 8,
 * Json == 9,
*/
function sendText(target, text, type) {
    let networkIdentifier;
    if (target instanceof bdsx_1.NetworkIdentifier)
        networkIdentifier = target;
    else {
        networkIdentifier = IdByName(target);
    }
    if (type == undefined || typeof type != "number")
        type = 0;
    const Packet = packets_1.TextPacket.create();
    Packet.message = text;
    Packet.setUint32(type, 0x30);
    Packet.sendTo(networkIdentifier, 0);
    Packet.dispose();
}
exports.sendText = sendText;
/////////////////////////////////////////
//transferServer
function transferServer(networkIdentifier, address, port) {
    const Packet = packets_1.TransferPacket.create();
    Packet.address = address;
    Packet.port = port;
    Packet.sendTo(networkIdentifier, 0);
    Packet.dispose();
}
exports.transferServer = transferServer;
/////////////////////////////////////////
//Health
function setHealth(networkIdentifier, value) {
    const HealthPacket = packets_1.SetHealthPacket.create();
    HealthPacket.setInt32(value, 0x30);
    HealthPacket.sendTo(networkIdentifier, 0);
    HealthPacket.dispose();
}
exports.setHealth = setHealth;
;
/////////////////////////////////////////
//Permission
function playerPermission(playerName, ResultEvent = (perm) => { }) {
    let xuid = nXt.get(playerName);
    var operJs;
    let permissions = '';
    try {
        operJs = JSON.parse(fs_1.readFileSync("permissions.json", "utf8"));
        let Js = operJs.find((v) => v.xuid == xuid);
        if (Js != undefined)
            permissions = Js.permission;
        if (Js == undefined)
            permissions = 'member';
    }
    catch (err) {
        permissions = 'member';
    }
    ResultEvent(permissions);
    return permissions;
}
exports.playerPermission = playerPermission;
;
/////////////////////////////////////////
//Score
function getScore(targetName, objectives, handler = (result) => { }) {
    system.executeCommand(`scoreboard players add @a[name="${targetName}",c=1] ${objectives} 0`, result => {
        // @ts-ignore
        let msgs = result.data.statusMessage;
        let msg = String(msgs).split('now');
        let a = String(msg[1]);
        let s = null;
        if (a.includes('-') == true)
            s = Number(a.replace(/[^0-9  ]/g, '')) - (Number(a.replace(/[^0-9  ]/g, '')) * 2);
        if (a.includes('-') == false)
            s = Number(a.replace(/[^0-9  ]/g, ''));
        handler(s);
    });
    return;
}
exports.getScore = getScore;
;
class ScoreTYPE {
    constructor() {
        this.TYPE_PLAYER = 1;
        this.TYPE_ENTITY = 2;
        this.TYPE_FAKE_PLAYER = 3;
    }
}
class ScoreEntry {
}
class scoreboard {
    CreateSidebar(player, name, order) {
        const pkt = packets_1.SetDisplayObjectivePacket.create();
        pkt.displaySlot = "sidebar";
        pkt.objectiveName = "2913:sidebar";
        pkt.displayName = name;
        pkt.criteriaName = "dummy";
        pkt.sortOrder = order;
        pkt.sendTo(player);
        pkt.dispose();
    }
    destroySidebar(player) {
        const pkt = packets_1.RemoveObjectivePacket.create();
        pkt.objectiveName = "2913:sidebar";
        pkt.sendTo(player);
        pkt.dispose();
    }
    SetSidebarValue(player, Id, name, score) {
        const pkt = packets_1.SetScorePacket.create();
        // let entry = new ScoreEntry()
        // entry.objectiveName = '2913:sidebar';
        // entry.type = ScoreTYPE.prototype.TYPE_FAKE_PLAYER;
        // entry.score = score;
        // entry.scoreboardId = Id;
        // entry.customName = name;
        // console.log(JSON.stringify(entry));
        pkt.setCxxString('2913:sidebar', 0x48);
        pkt.setInt32(ScoreTYPE.prototype.TYPE_FAKE_PLAYER, 0x8B);
        pkt.setInt32(score, 0xC4);
        pkt.setInt32(Id, 0x57);
        pkt.setCxxString(name, 0x48);
        pkt.setInt32(0, 0x81);
        // pkt.setCxxString(JSON.stringify(entry), 0x48);
        pkt.sendTo(player);
        pkt.dispose();
    }
    CreateList(player, name, order) {
        const pkt = packets_1.SetDisplayObjectivePacket.create();
        pkt.displaySlot = "list";
        pkt.objectiveName = "2913:list";
        pkt.displayName = name;
        pkt.criteriaName = "dummy";
        pkt.sortOrder = order;
        pkt.sendTo(player);
        pkt.dispose();
    }
    destroyList(player) {
        const pkt = packets_1.RemoveObjectivePacket.create();
        pkt.objectiveName = "2913:list";
        pkt.sendTo(player);
        pkt.dispose();
    }
}
const CustomScore = new scoreboard();
exports.CustomScore = CustomScore;
/////////////////////////////////////////
//Disconnect
function Disconnect(networkidentifier, message) {
    const Packet = packets_1.DisconnectPacket.create();
    Packet.message = message;
    Packet.sendTo(networkidentifier, 0);
    Packet.dispose();
}
exports.Disconnect = Disconnect;
///////////////////////////////////////
//bossbar
function setBossBar(target, title, healthPercent) {
    var _a;
    return;
    let pk = packets_1.BossEventPacket.create();
    let uniqueId = (_a = target.getActor()) === null || _a === void 0 ? void 0 : _a.getUniqueIdPointer().getBin64();
    pk.entityUniqueId = uniqueId;
    pk.type = 0;
    pk.title = title;
    pk.healthPercent = healthPercent;
    pk.unknown = "";
    pk.unknown2 = "";
    // pk.setBin(uniqueId, 0x40);
    // pk.setUint32(0, 0x48);
    // pk.setCxxString(title, 0x68);
    // pk.setFloat32(healthPercent, 0xA8);
    pk.sendTo(target);
    pk.dispose();
}
exports.setBossBar = setBossBar;
function deleteBossBar(target) {
    var _a;
    return;
    let pk = packets_1.BossEventPacket.create();
    let uniqueId = (_a = target.getActor()) === null || _a === void 0 ? void 0 : _a.getUniqueIdPointer().getBin64();
    pk.setBin(uniqueId, 0x38);
    pk.setUint32(2, 0x40);
    pk.setCxxString("", 0x48);
    pk.setFloat32(0, 0x68);
    pk.sendTo(target);
    pk.dispose();
}
exports.deleteBossBar = deleteBossBar;
///////////////////////
function netCmd(handler = (ev) => { }) {
    bdsx_1.nethook.before(bdsx_1.PacketId.CommandRequest).on((pkt, target) => {
        let data = DataById(target);
        let ev = {
            command: pkt.command,
            networkIdentifier: target,
            originActor: data[1],
            originEntity: data[2],
            originName: data[0],
            originXuid: data[3]
        };
        return handler(ev);
    });
}
exports.netCmd = netCmd;
function numberFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
exports.numberFormat = numberFormat;
function numberToKorean(number) {
    var inputNumber = number < 0 ? false : number;
    var unitWords = ['', '만', '억', '조', '경'];
    var splitUnit = 10000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = '';
    for (var i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
        unitResult = Math.floor(unitResult);
        if (unitResult > 0) {
            resultArray[i] = unitResult;
        }
    }
    for (var i = 0; i < resultArray.length; i++) {
        if (!resultArray[i])
            continue;
        resultString = String(numberFormat(resultArray[i])) + unitWords[i] + resultString;
    }
    if (number == 0)
        resultString = "0";
    return resultString;
}
exports.numberToKorean = numberToKorean;
function ListenInvTransaction(handler = (ev) => { }) {
    bdsx_1.nethook.raw(bdsx_1.PacketId.InventoryTransaction).on((ptr, size, networkIdentifier) => {
        let sactiontype = ptr.readVarInt();
        let sourceType = ptr.readVarInt();
        let CraftingAction = ptr.readVarInt();
        let ReleaseAction = ptr.readVarInt();
        let UseAction = ptr.readVarInt();
        let useOnAction = ptr.readVarInt();
        let ev = {
            sactiontype: sactiontype,
            sourceType: sourceType,
            CraftingAction: CraftingAction,
            ReleaseAction: ReleaseAction,
            UseAction: UseAction,
            useOnAction: useOnAction,
            networkIdentifier: networkIdentifier,
            size: size
        };
        //console.log(`size : ${String(size)}\n\nsactiontype : ${String(sactiontype)}\nsourcetype : ${String(sourceType)}\nCraftingAction : ${String(CraftingAction)}\nReleaseAction : ${String(ReleaseAction)}\nUseAction : ${String(UseAction)}\nuseOnAction : ${String(useOnAction)}`)
        return handler(ev);
    });
}
exports.ListenInvTransaction = ListenInvTransaction;
console.log(colors_1.red('2913MODULE LOADED'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjkxM01vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIjI5MTNNb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsRUFBRTtBQUNGLCtKQUErSjtBQUMvSixnS0FBZ0s7QUFDaEssZ0tBQWdLO0FBQ2hLLGdLQUFnSztBQUNoSyxnS0FBZ0s7QUFDaEssZ0tBQWdLO0FBQ2hLLGdLQUFnSztBQUNoSyxFQUFFO0FBQ0YsRUFBRTtBQUNGLCtCQUFtSjtBQUNuSiw4Q0FBc1A7QUFDdFAsbUNBQTZCO0FBQzdCLDJCQUF1RDtBQUV2RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUUxQyxJQUFJLFVBQVUsR0FBWSxFQUFFLENBQUM7QUFpZ0J6QixnQ0FBVTtBQWhnQmQsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDcEIsY0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7SUFDeEQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUE7SUFDN0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFD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