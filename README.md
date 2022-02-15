## @bdsx/guild-korean

# 명령어
* /guild - 길드창을 띄웁니다

* /길드 - 길드창을 띄웁니다

* /guild invite - 받은 길드 초대장 목록을 봅니다

* /g <text> - 길드 채팅을 보냅니다

[GITHUB](https://github.com/minyee2913/guild-korean)

## API
```ts
import { addXp } from '@bdsx/guild-korean/guild';
import { command } from 'bdsx';
import { int32_t } from "bdsx/nativetype";

command.register("addXp", "길드 경험치를 추가합니다").overload((p,origin)=>{
	addXp(p.value, origin.getName());
},{ value: int32_t });
