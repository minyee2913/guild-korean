"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rank = exports.guildJs = exports.dataJs = exports.backup = exports.addXp = void 0;
const bdsx_1 = require("bdsx");
const launcher_1 = require("bdsx/launcher");
const fs_1 = require("fs");
const _2913Module_1 = require("./2913Module");
const command_1 = require("bdsx/bds/command");
const colors_1 = require("colors");
const nativetype_1 = require("bdsx/nativetype");
const system = server.registerSystem(0, 0);
let dummyG = [{
        Name: '-',
        guildID: 0,
        subtitle: '',
        level: 0,
        xp: 0,
        xpM: 0,
        PMC: 0,
        o: '공개'
    }];
let dummyPl = [{
        Name: '-',
        xuid: '',
        guildID: 0,
        perm: ''
    }];
let ex = fs_1.existsSync("../2913plugins/guild");
if (ex == false) {
    fs_1.mkdirSync("../2913plugins/guild");
    console.log("[2913plugin:GUILD-KOREAN] 길드데이터가 \"2913plugins/guild\"에 생성됨");
}
let localfile = "../2913plugins/guild/guilds.json";
let localfilePlayer = "../2913plugins/guild/player.json";
let guildJs = [];
exports.guildJs = guildJs;
let dataJs = [];
exports.dataJs = dataJs;
let inviteJs = [];
let cooldown = new Map();
let c = setInterval(() => {
    cooldown.forEach((v, k) => {
        v -= 1;
        if (v > 0)
            cooldown.set(k, v);
        if (v <= 0)
            cooldown.delete(k);
    });
}, 1000);
fs_1.open(localfile, 'a+', function (err, fd) {
    if (err)
        throw err;
    try {
        JSON.parse(fs_1.readFileSync(localfile, "utf8"));
    }
    catch (err) {
        fs_1.writeFileSync(localfile, JSON.stringify(dummyG), "utf8");
    }
    exports.guildJs = guildJs = JSON.parse(fs_1.readFileSync(localfile, "utf8"));
});
fs_1.open(localfilePlayer, 'a+', function (err, fd) {
    if (err)
        throw err;
    try {
        JSON.parse(fs_1.readFileSync(localfilePlayer, "utf8"));
    }
    catch (err) {
        fs_1.writeFileSync(localfilePlayer, JSON.stringify(dummyPl), "utf8");
    }
    exports.dataJs = dataJs = JSON.parse(fs_1.readFileSync(localfilePlayer, "utf8"));
});
bdsx_1.command.register("guild", "길드창을 엽니다", command_1.CommandPermissionLevel.Normal).overload((p, origin) => {
    let target = _2913Module_1.IdByName(origin.getName());
    Nready(target);
}, {});
bdsx_1.command.register("길드", "길드창을 엽니다", command_1.CommandPermissionLevel.Normal).overload((p, origin) => {
    let target = _2913Module_1.IdByName(origin.getName());
    Nready(target);
}, {});
bdsx_1.command.register("guild invite", "길드 초대장을 봅니다", command_1.CommandPermissionLevel.Normal).overload((p, origin) => {
    let target = _2913Module_1.IdByName(origin.getName());
    Ginvlist(target);
}, {});
bdsx_1.command.register("g", "길드채팅을 보냅니다", command_1.CommandPermissionLevel.Normal).overload((p, origin) => {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let today2 = `${hours}:${minutes}:${seconds}`;
    let write = `${today2} [GUILD] ${origin.getName()} : ${p.text}\n`;
    if (!cooldown.has(origin.getName())) {
        let f = dataJs.find((v) => v.Name == origin.getName());
        if (f == undefined) {
            _2913Module_1.sendText(origin.getName(), "§c§l길드가 없습니다", 0);
            return;
        }
        let members = dataJs.filter((v) => v.guildID == f.guildID);
        if (members.length <= 0)
            return;
        members.forEach((v) => {
            system.executeCommand(`tellraw @a[c=1,name="${v.Name}"] {"rawtext":[{"text":"\n§l§a[GUILD] ${origin.getName()} §f: ${p.text.replace(/§/gi, '§6[$]§r§7').replace(/시발|세끼|새끼|병신|ㅅㅂ|또라이|성불구자|고자|애미|좆/gi, '§c[필터링]§r')}\n"}]}`, () => { });
        });
        console.log(colors_1.green(write));
        cooldown.set(origin.getName(), 3);
    }
    else {
        _2913Module_1.sendText(origin.getName(), `§c§l${cooldown.get(origin.getName())}초 후에 채팅을 칠 수 있습니다`, 0);
    }
}, {
    text: nativetype_1.CxxString
});
system.listenForEvent('minecraft:entity_use_item', eventData => {
    if (eventData.data.entity.__identifier__ === 'minecraft:player' && eventData.data.item_stack.item === 'play:guild') {
        system.executeCommand(`function hotbar`, () => { });
        let playerName = system.getComponent(eventData.data.entity, "minecraft:nameable").data.name;
        let target;
        try {
            target = bdsx_1.Actor.fromEntity(eventData.data.entity).getNetworkIdentifier();
        }
        catch (_a) {
            target = _2913Module_1.IdByName(playerName);
        }
        Nready(target);
    }
});
function Nready(target) {
    let playerName = _2913Module_1.DataById(target)[0];
    let sch_ = dataJs.find((v) => v.Name == playerName);
    if (sch_ != undefined) {
        let sch = dataJs.find((v) => v.guildID == sch_.guildID);
        if (sch == undefined) {
            let targetj = dataJs.find((e) => e.Name == playerName);
            if (targetj == undefined)
                return;
            let state = dataJs.indexOf(targetj);
            dataJs.splice(state, 1);
            _2913Module_1.sendText(target, "§c§l길드 데이터에 문제가 생겼습니다 내 데이터를 초기화합니다", 0);
            return;
        }
    }
    let gjs = dataJs.map((e) => e.Name);
    if (gjs.includes(`$${playerName}`) == true) {
        let data = dataJs.filter((e) => e.Name == `$${playerName}`)[0];
        if (data.perm == 'break') {
            _2913Module_1.Formsend(target, {
                type: "custom_form",
                title: "길드",
                content: [
                    {
                        "type": "label",
                        "text": "§c§l길드가 해산되었습니다!"
                    }
                ]
            }, () => {
                let state = dataJs.indexOf(data);
                dataJs.splice(state, 1);
                Nmain(target);
            });
        }
        else if (data.perm == 'kicked') {
            _2913Module_1.Formsend(target, { type: "custom_form", title: "길드", content: [{ "type": "label", "text": "§c§l길드에서 추방당했습니다!" }] }, () => {
                let state = dataJs.indexOf(data);
                dataJs.splice(state, 1);
                Nmain(target);
            });
        }
    }
    else if (gjs.includes(playerName) == false) {
        Nmain(target);
    }
    else {
        let data = dataJs.filter((e) => e.Name == playerName)[0];
        if (data.perm == 'leader') {
            Nmain2L(target);
        }
        if (data.perm == 'subleader') {
            Nmain2S(target);
        }
        if (data.perm == 'member') {
            Nmain2M(target);
        }
    }
    ;
}
bdsx_1.nethook.after(bdsx_1.PacketId.Login).on((ptr, networkIdentifier) => {
    const cert = ptr.connreq.cert;
    const xuid = cert.getXuid();
    const username = cert.getId();
    let gjs = dataJs.map((e) => e.xuid);
    if (gjs.includes(xuid)) {
        let data = dataJs.find((e) => e.xuid == xuid);
        let state = dataJs.indexOf(data);
        if (data.guildID != "")
            data.Name = username;
        if (data.guildID == "")
            data.Name = "$" + username;
        dataJs.splice(state, 1, data);
    }
});
function Nmain(target) {
    _2913Module_1.Formsend(target, {
        type: "form",
        title: "길드",
        content: '',
        buttons: [
            {
                "text": "길드 랭킹"
            },
            {
                "text": "길드 찾기"
            },
            {
                "text": "길드 만들기"
            },
            {
                "text": "초대장"
            }
        ]
    }, data => {
        if (data == 0)
            rank(target);
        if (data == 1)
            search(target);
        if (data == 2)
            make(target);
        if (data == 3)
            Ginvlist(target);
    });
}
;
function Nmain2M(target) {
    let data = dataJs.filter((e) => e.Name == _2913Module_1.DataById(target)[0])[0];
    let guild = guildJs.filter((e) => e.guildID == data.guildID)[0];
    let Id = String(data.guildID);
    _2913Module_1.Formsend(target, {
        type: "form",
        title: `길드`,
        content: `§l§a${guild.Name} §6${guild.level}Lv §7( ${guild.xp} / ${guild.xpM} )\n§r§8${guild.subtitle}\n§r내 직위 : ${data.perm}`,
        buttons: [
            {
                "text": "길드 랭킹"
            },
            {
                "text": "길드원 목록"
            },
            {
                "text": "길드 탈퇴"
            }
        ]
    }, data => {
        if (data == 0)
            rank(target);
        if (data == 1)
            memberlist(target, Id);
        if (data == 2)
            Gout(target, Id);
    });
}
;
function Nmain2S(target) {
    let data = dataJs.filter((e) => e.Name == _2913Module_1.DataById(target)[0])[0];
    let guild = guildJs.filter((e) => e.guildID == data.guildID)[0];
    let Id = String(data.guildID);
    _2913Module_1.Formsend(target, {
        type: "form",
        title: `길드`,
        content: `§l§a${guild.Name} §6${guild.level}Lv §7( ${guild.xp} / ${guild.xpM} )\n§r§8${guild.subtitle}\n§r내 직위 : ${data.perm}`,
        buttons: [
            {
                "text": "길드 랭킹"
            },
            {
                "text": "길드원 목록"
            },
            {
                "text": "길드원 추방"
            },
            {
                "text": "길드원 초대"
            },
            {
                "text": "길드 탈퇴"
            }
        ]
    }, data => {
        if (data == 0)
            rank(target);
        if (data == 1)
            memberlist(target, Id);
        if (data == 2)
            Gkick(target, Id);
        if (data == 3)
            Ginvite(target, Id);
        if (data == 4)
            Gout(target, Id);
    });
}
;
function Nmain2L(target) {
    let data = dataJs.filter((e) => e.Name == _2913Module_1.DataById(target)[0])[0];
    let guild = guildJs.filter((e) => e.guildID == data.guildID)[0];
    let Id = String(data.guildID);
    _2913Module_1.Formsend(target, {
        type: "form",
        title: `길드`,
        content: `§l§a${guild.Name} §6${guild.level}Lv §7( ${guild.xp} / ${guild.xpM} )\n§r§8${guild.subtitle}\n§r내 직위 : ${data.perm}`,
        buttons: [
            {
                "text": "길드 랭킹"
            },
            {
                "text": "길드원 목록"
            },
            {
                "text": "길드 관리"
            },
            {
                "text": "길드 탈퇴"
            }
        ]
    }, data => {
        if (data == 0)
            rank(target);
        if (data == 1)
            memberlist(target, Id);
        if (data == 2)
            leaderCmd(target, Id);
        if (data == 3)
            _2913Module_1.sendText(target, '§c§l길드장의 직책으론 탈퇴할 수 없습니다!\n길드장을 넘기거나 길드를 해산하세요!', 0);
        if (data == 3)
            system.executeCommand(`execute "${_2913Module_1.DataById(target)[0]}" ~ ~ ~ playsound mob.bat.death @s ~ ~ ~ 1 0.5`, () => { });
    });
}
;
function leaderCmd(target, Id) {
    _2913Module_1.Formsend(target, {
        type: "form",
        title: "길드 관리",
        content: "",
        buttons: [
            {
                "text": "길드설명 변경"
            },
            {
                "text": "공개 설정"
            },
            {
                "text": "길드원 추방"
            },
            {
                "text": "길드원 초대"
            },
            {
                "text": "하위리더 임명"
            },
            {
                "text": "길드장 넘기기"
            },
            {
                "text": "길드 해산"
            }
        ]
    }, data => {
        if (data == 0)
            Gsubtitle(target, Id);
        if (data == 1)
            Gosttt(target, Id);
        if (data == 2)
            Gkick(target, Id);
        if (data == 3)
            Ginvite(target, Id);
        if (data == 4)
            Gsub(target, Id);
        if (data == 5)
            Glead(target, Id);
        if (data == 6)
            GuildBreak(target, Id);
    });
}
function rank(target, what) {
    let array = [];
    var sortingField1 = "xp";
    var sortingField2 = "level";
    let rankJs = guildJs.sort((a, b) => b[sortingField1] - a[sortingField1]).sort((a, b) => b[sortingField2] - a[sortingField2]);
    let data = {
        Name: ''
    };
    rankJs.forEach(function (element, index, arr) {
        let numc = 'th';
        data = dataJs.filter((e) => e.xuid == element.guildID)[0];
        let member = dataJs.filter((e) => e.guildID == element.guildID);
        if (String(index + 1)[String(index + 1).length - 1] == '1')
            numc = 'st';
        if (String(index + 1)[String(index + 1).length - 1] == '2')
            numc = 'nd';
        if (String(index + 1)[String(index + 1).length - 1] == '3')
            numc = 'rd';
        let s = `§l\n${index + 1}${numc}. §6${element.Name} §7( ${member.length} / ${element.PMC} ) §7- ${data.Name}\n§8${element.o} | ${element.level}레벨 ( ${element.xp} / ${element.xpM} )\n\n§f---------------------------------`;
        array.push(s);
    });
    _2913Module_1.Formsend(target, {
        type: "form",
        title: "길드 랭킹",
        content: String(array).replace(/,/gi, '\n'),
        buttons: []
    }, () => {
        if (what == 1)
            system.executeCommand(`execute "${_2913Module_1.NameById(target)}" ~ ~ ~ rank`, () => { });
        else
            Nready(target);
    });
}
exports.rank = rank;
function GuildBreak(target, Id) {
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드 해산",
        content: [
            {
                "type": "label",
                "text": "정말로 길드를 해산하시겠습니까?"
            },
            {
                "type": "input",
                "text": "해산하려면 확인을 입력해주세요",
                "placeholder": "확인"
            }
        ]
    }, data => {
        if (data == null)
            return;
        let [, input] = data;
        if (input == '확인') {
            let djs = dataJs;
            let gjs = guildJs;
            _2913Module_1.sendText(target, '§c§l길드가 해산되었습니다!', 0);
            system.executeCommand(`execute "${_2913Module_1.DataById(target)[0]}" ~ ~ ~ playsound random.anvil_use @s`, () => { });
            let members = dataJs.filter((e) => e.guildID == Id);
            let guild = guildJs.filter((e) => e.guildID == Id)[0];
            members.forEach(function (element, index, array) {
                let state = djs.indexOf(element);
                element.Name = `$${element.Name}`;
                element.guildID = '';
                element.perm = 'break';
                djs.splice(state, 1, element);
            });
            let state = gjs.indexOf(guild);
            gjs.splice(state, 1);
        }
        if (input != '확인')
            _2913Module_1.sendText(target, '§c§l길드 해산이 취소되었습니다!', 0);
        if (input != '확인')
            system.executeCommand(`execute "${_2913Module_1.DataById(target)[0]}" ~ ~ ~ playsound mob.bat.death @s ~ ~ ~ 1 0.5`, () => { });
    });
}
function Glead(target, Id) {
    let member1 = dataJs.filter((e) => e.guildID == Id);
    let member2 = member1.filter((e) => e.perm == 'subleader');
    let memberA = member2.map((e, i) => e.Name);
    let Arr = ['길드원을 선택하세요'];
    memberA.forEach(function (ele) {
        if (_2913Module_1.playerList.includes(ele))
            Arr.push(ele);
    });
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드장 넘기기",
        content: [
            {
                "type": "dropdown",
                "text": "길드장을 넘겨줄 하위리더를 선택하세요(온라인인 길드원만 가능합니다)",
                "options": Arr
            }
        ]
    }, data => {
        if (data == null)
            return;
        let input = data;
        if (input == 0)
            return;
        let playerName = _2913Module_1.DataById(target)[0];
        let guild = guildJs.filter((e) => e.guildID == Id)[0];
        let state1 = dataJs.indexOf(guild);
        let targetj = member2.filter((e) => e.Name == Arr[input])[0];
        let targets = dataJs.filter((e) => e.Name == playerName)[0];
        let state = dataJs.indexOf(targetj);
        let state2 = dataJs.indexOf(targets);
        targetj.perm = 'leader';
        targets.perm = 'subleader';
        let newId = _2913Module_1.XuidByName(targetj.Name);
        guild.guildID = newId;
        guildJs.splice(state1, 1, guild);
        dataJs.splice(state, 1, targetj);
        dataJs.splice(state2, 1, targets);
        member1.map((e, i) => e.Name).forEach((v) => {
            system.executeCommand(`tellraw "${v}" {"rawtext":[{"text":"§a§l${targetj.Name}님이 길드장으로 임명되었습니다"}]}`, () => { });
            system.executeCommand(`tellraw "${v}" {"rawtext":[{"text":"§c§l${targets.Name}님이 하위리더로 강등되었습니다"}]}`, () => { });
        });
        member1.forEach((v) => {
            let state = dataJs.indexOf(v);
            v.guildID = newId;
            dataJs.splice(state, 1, v);
        });
        system.executeCommand(`execute "${_2913Module_1.DataById(target)[0]}" ~ ~ ~ playsound random.anvil_use @s`, () => { });
    });
}
;
function Gsub(target, Id) {
    let member1 = dataJs.filter((e) => e.guildID == Id);
    let member2 = member1.filter((e) => e.perm == 'member');
    let memberA = member2.map((e, i) => e.Name);
    let Arr = ['길드원을 선택하세요'];
    memberA.forEach(function (ele) {
        Arr.push(ele);
    });
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "하위리더 임명",
        content: [
            {
                "type": "dropdown",
                "text": "하위 리더로 임명하려는 길드원을 선택하세요",
                "options": Arr
            }
        ]
    }, data => {
        if (data == null)
            return;
        let input = data;
        if (input == 0)
            return;
        let targetj = member2.filter((e) => e.Name == Arr[input])[0];
        let state = dataJs.indexOf(targetj);
        targetj.perm = 'subleader';
        dataJs.splice(state, 1, targetj);
        member1.map((e, i) => e.Name).forEach((v) => {
            system.executeCommand(`tellraw "${v}" {"rawtext":[{"text":"§a§l${targetj.Name}님이 하위리더로 임명되었습니다"}]}`, () => { });
        });
        system.executeCommand(`execute "${_2913Module_1.DataById(target)[0]}" ~ ~ ~ playsound random.anvil_use @s`, () => { });
    });
}
;
function Gkick(target, Id) {
    let member1 = dataJs.filter((e) => e.guildID == Id);
    let member2 = member1.filter((e) => e.perm == 'member');
    let memberA = member2.map((e, i) => e.Name);
    let Arr = ['길드원을 선택하세요'];
    memberA.forEach(function (ele) {
        Arr.push(ele);
    });
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드원 추방",
        content: [
            {
                "type": "dropdown",
                "text": "추방하려는 길드원을 선택하세요",
                "options": Arr
            }
        ]
    }, data => {
        if (data == null)
            return;
        let input = data;
        if (input == 0)
            return;
        let targetj = member2.filter((e) => e.Name == Arr[input])[0];
        let state = dataJs.indexOf(targetj);
        targetj.Name = `$${targetj.Name}`;
        targetj.guildID = '';
        targetj.perm = 'kicked';
        dataJs.splice(state, 1, targetj);
        _2913Module_1.sendText(target, `§a§l${targetj.Name}님을 추방했습니다`, 0);
        system.executeCommand(`execute "${_2913Module_1.DataById(target)[0]}" ~ ~ ~ playsound random.anvil_use @s`, () => { });
    });
}
;
function Ginvite(target, Id) {
    let guild = guildJs.filter((e, i) => e.guildID == Id)[0];
    let Arr = ['플레이어를 선택하세요'];
    _2913Module_1.playerList.forEach(function (ele) {
        Arr.push(ele);
    });
    dataJs.forEach(function (ele) {
        let state = Arr.indexOf(ele.Name);
        if (state <= 0)
            return;
        Arr.splice(state, 1);
    });
    console.log(Arr);
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드원 초대",
        content: [
            {
                "type": "dropdown",
                "text": "초대하려는 플레이어를 선택하세요",
                "options": Arr
            }
        ]
    }, data => {
        if (data == null)
            return;
        let playerName = _2913Module_1.DataById(target)[0];
        let input = data[0];
        let member = dataJs.filter((e) => e.guildID == Id);
        if (input == 0)
            return;
        if (member.length >= guild.PMC) {
            _2913Module_1.sendText(target, `§c§l길드의 인원수가 가득찼습니다`, 0);
            return;
        }
        let js1 = {
            Name: Arr[data],
            Gname: guild.Name,
            Id: Id,
            inviter: playerName
        };
        inviteJs.push(js1);
        system.executeCommand(`tellraw "${Arr[data]}" {"rawtext":[{"text":"§a§l----------\n\n§f${playerName}님이 ${guild.Name}길드에 초대하였습니다\n수락하려면 /guild invite명령어를 사용하세요\n\n§a§l----------"}]}`, () => { });
        _2913Module_1.sendText(target, `§a§l${Arr[data]}님께 초대장을 보냈습니다`, 0);
    });
}
;
function Ginvlist(target) {
    try {
        let [playerName, , , playerXuid] = _2913Module_1.DataById(target);
        let inv = inviteJs.filter((e) => e.Name == playerName).reverse();
        let Arr = [];
        inv.forEach((value) => {
            let js = {
                text: `${value.Gname}`,
                value: value
            };
            Arr.push(js);
        });
        _2913Module_1.Formsend(target, {
            type: "form",
            title: "초대장",
            content: "받은 길드 초대장이 모두 표시됩니다",
            buttons: Arr
        }, data => {
            if (data == null)
                return;
            let selects = Arr[data];
            let select = guildJs.filter((e) => e.guildID == selects.value.Id)[0];
            let dt = dataJs.filter((e) => e.xuid == selects.value.Id)[0];
            let member = dataJs.filter((e) => e.guildID == selects.value.Id);
            _2913Module_1.Formsend(target, {
                type: 'form',
                title: '길드 정보',
                content: `길드명: ${select.Name}\n길드 레벨: ${select.level} ( ${select.xp} / ${select.xpM} )\n인원수: ${member.length} / ${select.PMC}\n길드장: ${dt.Name}`,
                buttons: [
                    { "text": "수락" },
                    { "text": "거절" }
                ]
            }, data => {
                if (data == null)
                    Ginvlist(target);
                let [playerName, , , playerXuid] = _2913Module_1.DataById(target);
                if (data == 1) {
                    inviteJs.splice(inviteJs.indexOf(selects.value), 1);
                    _2913Module_1.sendText(target, `§a§l초대를 거절하였습니다`, 0);
                    system.executeCommand(`tellraw "${selects.value.inviter}" {"rawtext":[{"text":"§c§l${playerName}님이 길드 초대를 거절하셨습니다"}]}`, () => { });
                }
                if (data == null || data == 1)
                    return;
                if (data == 0) {
                    if (member.length >= select.PMC) {
                        _2913Module_1.sendText(target, `§a§l해당 길드의 인원수가 가득찼습니다`, 0);
                        return;
                    }
                    let js1 = {
                        Name: playerName,
                        xuid: playerXuid,
                        guildID: select.guildID,
                        perm: 'member'
                    };
                    dataJs.push(js1);
                    _2913Module_1.sendText(target, `§a§l${select.Name} 길드에 가입했습니다`, 0);
                    system.executeCommand(`tellraw "${selects.value.inviter}" {"rawtext":[{"text":"§a§l${playerName}님이 길드 초대를 수락하셨습니다"}]}`, () => { });
                    system.executeCommand(`execute "${playerName}" ~ ~ ~ playsound random.anvil_use @s`, () => { });
                }
            });
        });
    }
    catch (err) { }
}
;
function Gout(target, Id) {
    let playerName = _2913Module_1.DataById(target)[0];
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드 탈퇴",
        content: [
            {
                "type": "label",
                "text": "정말로 길드를 탈퇴하시겠습니까?"
            }
        ]
    }, data => {
        if (data == null)
            return;
        let targetj = dataJs.filter((e) => e.Name == playerName)[0];
        let state = dataJs.indexOf(targetj);
        dataJs.splice(state, 1);
        _2913Module_1.sendText(target, `§a§l길드를 성공적으로 탈퇴하였습니다`, 0);
    });
}
;
function Gsubtitle(target, Id) {
    let playerName = _2913Module_1.DataById(target)[0];
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드설명 변경",
        content: [
            {
                "type": "input",
                "text": "길드 설명 바꾸기",
                "placeholder": "문구를 입력해주세요"
            }
        ]
    }, data => {
        if (data == null)
            return;
        let guild = guildJs.filter((e) => e.guildID == Id)[0];
        guild.subtitle = data[0];
        let state = guildJs.indexOf(guild);
        guildJs.splice(state, 1, guild);
        _2913Module_1.sendText(target, `§a§l성공적으로 설명을 변경하였습니다`, 0);
    });
}
;
function Gosttt(target, Id) {
    let drop = ['공개', '비공개'];
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드설명 변경",
        content: [
            {
                "type": "dropdown",
                "text": "길드 설명 바꾸기",
                "options": drop
            }
        ]
    }, data => {
        if (data == null)
            return;
        let osttt = drop[data];
        let guild = guildJs.filter((e) => e.guildID == Id)[0];
        guild.o = osttt;
        let state = guildJs.indexOf(guild);
        guildJs.splice(state, 1, guild);
        _2913Module_1.sendText(target, `§a§l성공적으로 공개 여부를 변경하였습니다`, 0);
    });
}
;
function memberlist(target, Id) {
    let guild = guildJs.filter((e) => e.guildID == Id)[0];
    let members = dataJs.filter((e) => e.guildID == Id);
    let leader = members.filter((e) => e.perm == 'leader').map((e, i) => e.Name);
    let subleader = members.filter((e) => e.perm == 'subleader').map((e, i) => e.Name);
    let member = members.filter((e) => e.perm == 'member').map((e, i) => e.Name);
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드원 목록",
        content: [
            {
                "type": "label",
                "text": `§l총 길드원: ${members.length}/${guild.PMC}\n§6§l----길드장----\n§f${String(leader)}\n\n§6§l----하위 리더----\n§f${String(subleader)}\n\n§6§l----맴버----\n§f${String(member).replace(/,/gi, '\n')}`
            }
        ]
    }, () => {
        Nready(target);
    });
}
function search(target) {
    let array = [];
    var sortingField1 = "xp";
    var sortingField2 = "level";
    let rankJs = guildJs.sort((a, b) => b[sortingField1] - a[sortingField1]).sort((a, b) => b[sortingField2] - a[sortingField2]);
    let data = {
        Name: ''
    };
    rankJs.forEach(function (element, index, arr) {
        let numc = 'th';
        data = dataJs.filter((e) => e.xuid == element.guildID)[0];
        let member = dataJs.filter((e) => e.guildID == element.guildID);
        if (String(index + 1)[String(index + 1).length - 1] == '1')
            numc = 'st';
        if (String(index + 1)[String(index + 1).length - 1] == '2')
            numc = 'nd';
        if (String(index + 1)[String(index + 1).length - 1] == '3')
            numc = 'rd';
        let s = `§l§6${element.Name} §8(${member.length}/${element.PMC}) - ${data.Name} ㅣ`;
        array.push(s);
    });
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드 찾기",
        content: [
            {
                "type": "input",
                "text": `검색어`,
                "placeholder": "길드 이름을 적어주세요"
            },
            {
                "type": "dropdown",
                "text": '길드 목록',
                "options": array
            }
        ]
    }, data => {
        if (data == null)
            Nready(target);
        if (data == null)
            return;
        let [input,] = data;
        if (input == '')
            search(target);
        if (input != '')
            searchRs(target, input);
    });
}
function searchRs(target, input) {
    let array = [];
    let content = '';
    let searchJs = guildJs.filter((e) => new RegExp(input).test(e.Name));
    var sortingField1 = "xp";
    var sortingField2 = "level";
    let rankJs = searchJs.sort((a, b) => b[sortingField1] - a[sortingField1]).sort((a, b) => b[sortingField2] - a[sortingField2]);
    let data = {
        Name: ''
    };
    rankJs.forEach(function (element, index, arr) {
        let member = dataJs.filter((e) => e.guildID == element.guildID);
        let numc = 'th';
        data = dataJs.filter((e) => e.xuid == element.guildID)[0];
        if (String(index + 1)[String(index + 1).length - 1] == '1')
            numc = 'st';
        if (String(index + 1)[String(index + 1).length - 1] == '2')
            numc = 'nd';
        if (String(index + 1)[String(index + 1).length - 1] == '3')
            numc = 'rd';
        let s = {
            "text": `${index + 1}${numc}. §6${element.Name} §7( ${member.length} / ${element.PMC} ) - ${data.Name}\n§8${element.level}레벨 ( ${element.xp} / ${element.xpM} )`,
            "gName": element.Name,
            "owner": data.Name
        };
        array.push(s);
    });
    if (array.length <= 0)
        content = '\n검색 결과가 없습니다';
    _2913Module_1.Formsend(target, {
        type: "form",
        title: `검색어: §9${input}`,
        content: content,
        buttons: array
    }, data => {
        if (data == null)
            search(target);
        if (data == null)
            return;
        let selectdata = array[data];
        let select = guildJs.filter((e) => e.Name == selectdata.gName)[0];
        let button = [];
        if (select.o == '공개')
            button = [
                {
                    "text": "가입하기"
                },
                {
                    "text": "돌아가기"
                }
            ];
        if (select.o == '비공개')
            button = [
                {
                    "text": "가입 불가"
                },
                {
                    "text": "돌아가기"
                }
            ];
        data = dataJs.filter((e) => e.xuid == select.guildID)[0];
        let member = dataJs.filter((e) => e.guildID == select.guildID);
        _2913Module_1.Formsend(target, {
            type: 'form',
            title: '길드 정보',
            content: `길드명: ${select.Name}\n길드 레벨: ${select.level} ( ${select.xp} / ${select.xpM} )\n인원수: ${member.length} / ${select.PMC}\n길드장: ${data.Name}`,
            buttons: button
        }, data => {
            if (data == null || data == 1)
                searchRs(target, input);
            if (data == null || data == 1)
                return;
            let playerName = _2913Module_1.NameById(target);
            let playerXuid = _2913Module_1.DataById(target)[3];
            if (select.o == '공개' && data == 0) {
                if (member.length >= select.PMC) {
                    _2913Module_1.sendText(target, `§a§l해당 길드의 인원수가 가득찼습니다`, 0);
                    return;
                }
                let js1 = {
                    Name: playerName,
                    xuid: playerXuid,
                    guildID: select.guildID,
                    perm: 'member'
                };
                dataJs.push(js1);
                _2913Module_1.sendText(target, `§a§l${select.Name} 길드에 가입했습니다`, 0);
            }
            if (select.o == '비공개' && data == 0) {
                _2913Module_1.sendText(target, '§c§l이 길드에는 초대없인 가입할 수 없습니다', 0);
                system.executeCommand(`execute "${_2913Module_1.NameById(target)}" ~ ~ ~ playsound mob.bat.death @s ~ ~ ~ 1 0.5`, () => { });
                searchRs(target, input);
                return;
            }
        });
    });
}
function regExp(str) {
    let reg = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;
    if (reg.test(str)) {
        return str.replace(reg, "");
    }
    else {
        return str;
    }
}
function make(target) {
    let drop = ['공개', '비공개'];
    _2913Module_1.Formsend(target, {
        type: "custom_form",
        title: "길드 만들기",
        content: [
            {
                "type": "label",
                "text": "나만의 길드를 만들어보세요!"
            },
            {
                "type": "input",
                "text": "길드 이름을 적어주세요",
                "placeholder": "특수 문자는 사용할 수 없습니다! ex) .!@§"
            },
            {
                "type": "input",
                "text": "길드 설명을 적어주세요",
                "placeholder": "특수 문자는 사용할 수 없습니다! ex) .!@§"
            },
            {
                "type": "dropdown",
                "text": "공개 범위",
                "options": drop
            }
        ]
    }, data => {
        if (data == null)
            return;
        let [, input, sub, dropz] = data;
        let dropd = drop[dropz];
        let Gname = regExp(String(input).replace(/§/gi, ''));
        let subtitle = regExp(String(sub).replace(/§/gi, ''));
        _2913Module_1.Formsend(target, {
            type: "form",
            title: "",
            content: `${Gname}으로 길드를 만드시겠습니까?`,
            buttons: [{ "text": "만들기" }]
        }, data => {
            if (data == null)
                return;
            if (data == 0) {
                let [playerName, actor, entity, playerXuid] = _2913Module_1.DataById(target);
                let objL = guildJs.map((e, i) => e.Name);
                if (objL.includes(Gname)) {
                    _2913Module_1.sendText(target, '§c§l이미 존재하는 길드입니다!', 0);
                    return;
                }
                if (objL.includes(Gname) == false) {
                    if (guildJs[0].Name == '-') {
                        guildJs.splice(0, 1);
                    }
                    let js = {
                        Name: Gname,
                        guildID: String(playerXuid),
                        subtitle: subtitle,
                        level: 1,
                        xp: 0,
                        xpM: 2000,
                        PMC: 10,
                        o: dropd
                    };
                    guildJs.push(js);
                    let js1 = {
                        Name: playerName,
                        xuid: String(playerXuid),
                        guildID: String(playerXuid),
                        perm: 'leader'
                    };
                    if (dataJs[0].Name == '-') {
                        dataJs.splice(0, 1);
                    }
                    dataJs.push(js1);
                    _2913Module_1.sendText(target, `§a§l${Gname} 길드를 만들었습니다!`, 0);
                    system.executeCommand(`execute "${playerName}" ~ ~ ~ playsound random.anvil_use @s`, () => { });
                }
            }
        });
    });
}
;
system.listenForEvent("minecraft:entity_death", eventData => {
    // @ts-ignore
    try {
        if (eventData.data.killer.__identifier__ == 'minecraft:player') {
            // @ts-ignore
            let killerName = system.getComponent(eventData.data.killer, "minecraft:nameable").data.name;
            addXp(Math.floor(Math.random() * 100) + 50, killerName);
        }
    }
    catch (_a) { }
});
function addXp(xp, playerName) {
    if (dataJs.find((e, i) => e.Name == playerName) != undefined) {
        let data = dataJs.find((e) => e.Name == playerName);
        let id = data.guildID;
        let IdJs = guildJs.find((e) => e.guildID == data.guildID);
        let memberJs = dataJs.filter((e) => e.guildID == id);
        let before = IdJs;
        let [lastLv, lastXp, lastXpM] = [IdJs.level, IdJs.xp, IdJs.xpM];
        IdJs.xp += xp;
        if (IdJs.xp >= IdJs.xpM) {
            IdJs.xp -= IdJs.xpM;
            IdJs.xpM += Math.round(IdJs.xpM * (33 / 100));
            IdJs.level += 1;
            IdJs.PMC += 2;
            let members = memberJs.map((e, i) => e.Name);
            members.forEach(function (element, index, array) {
                system.executeCommand(`tellraw "${element}" {"rawtext":[{"text":"§a§l--------------------\n\n     §6↑ 길드 레벨업 ↑\n§b+1레벨 +2인원수 +33%필요 경험치 접속중인 길드원 전체 ${IdJs.level}0000원 획득\n\n§a--------------------"}]}`, () => { });
                system.executeCommand(`execute "${element}" ~ ~ ~ playsound random.anvil_use @s ~ ~ ~ 0.6`, () => { });
                system.executeCommand(`execute "${element}" ~ ~ ~ scoreboard players add @s money ${IdJs.level}000`, () => { });
                setTimeout(function () {
                    system.executeCommand(`execute "${element}" ~ ~ ~ playsound block.grindstone.use @s`, () => { });
                }, 400);
            });
        }
        guildJs.splice(guildJs.indexOf(before), 1, IdJs);
    }
}
exports.addXp = addXp;
function backup() {
    fs_1.writeFileSync(localfilePlayer, JSON.stringify(dataJs), 'utf8');
    fs_1.writeFileSync(localfile, JSON.stringify(guildJs), 'utf8');
}
exports.backup = backup;
;
launcher_1.bedrockServer.close.on(() => {
    clearInterval(c);
    fs_1.writeFileSync(localfilePlayer, JSON.stringify(dataJs), 'utf8');
    fs_1.writeFileSync(localfile, JSON.stringify(guildJs), 'utf8');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJndWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBa0g7QUFDbEgsNENBQThDO0FBQzlDLDJCQUF3RjtBQUN4Riw4Q0FBd0c7QUFDeEcsOENBQTBEO0FBQzFELG1DQUErQjtBQUMvQixnREFBNEM7QUFFNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFM0MsSUFBSSxNQUFNLEdBQUcsQ0FBQztRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsT0FBTyxFQUFFLENBQUM7UUFDVixRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxDQUFDO1FBQ1IsRUFBRSxFQUFFLENBQUM7UUFDTCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sQ0FBQyxFQUFFLElBQUk7S0FDVixDQUFDLENBQUE7QUFFRixJQUFJLE9BQU8sR0FBRyxDQUFDO1FBQ1gsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsRUFBRTtRQUNSLE9BQU8sRUFBRSxDQUFDO1FBQ1YsSUFBSSxFQUFFLEVBQUU7S0FDWCxDQUFDLENBQUE7QUFFRixJQUFJLEVBQUUsR0FBRyxlQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM1QyxJQUFJLEVBQUUsSUFBSSxLQUFLLEVBQUU7SUFDYixjQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7Q0FDOUU7QUFFRCxJQUFJLFNBQVMsR0FBRyxrQ0FBa0MsQ0FBQztBQUNuRCxJQUFJLGVBQWUsR0FBRyxrQ0FBa0MsQ0FBQztBQUV6RCxJQUFJLE9BQU8sR0FBUyxFQUFFLENBQUM7QUFxN0JuQiwwQkFBTztBQXA3QlgsSUFBSSxNQUFNLEdBQVMsRUFBRSxDQUFDO0FBbTdCbEIsd0JBQU07QUFsN0JWLElBQUks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