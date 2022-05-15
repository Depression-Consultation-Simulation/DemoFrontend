let baseUrl = "http://202.120.38.125:7785";
let serverUrl = "http://202.120.38.125:7786";
let metrics = [
    "流畅程度(Fluency): 整个对话流程的顺畅程度，机器人不重复提问已经问过的问题，同时能在不同话题之间进行正常跳转",
    "使人舒服的程度(Comforting): 机器人能理解你说的话，对你进行恰当回应的程度，除简单的表示理解的话之外，有明显共情安慰语句的机器人可多加分",
    "像医生的程度(Doctorness): 机器人能根据你所述的内容灵活调整问话流程的程度",
    "参与程度(Engagingness): 机器人能维持你注意力，使你想和它倾诉，继续聊下去的程度"
];
let examples = [
    {
        "right":"Bot: 有没有产生过不想活的念头呀？\nUser: 有我最近总是梦到自己跳楼。\nBot: 嗯嗯，那你有具体的计划或者实施过吗？",
        "wrong":"Bot: 有没有产生过不想活的念头呀？\nUser: 有我最近总是梦到自己跳楼。\nBot: 那有没有产生过不想活的念头呀？"
    },
    {
        "right":"Bot: 会觉得在生活中是自己在拖累别人吗?\n User: 我觉得我这么没用，是父母的负担。\n Bot: 嗯嗯好的，那有没有产生过不想活的念头呀？",
        "wrong":"Bot: 会觉得在生活中是自己在拖累别人吗?\n  User: 我觉得我这么没用，是父母的负担。\nBot: 那有没有产生过不想活的念头呀？"
    },
    {
        "right":"Bot: 你最近有什么问题呀?\n User: 我睡不着总是。\n Bot: 躺到床上之后，需要多久能睡着？",
        "wrong":"Bot: 你最近有什么问题呀?\n User: 我睡不着总是。\n Bot: 你最近心情怎么样？"
    }
];
// let baseUrl = "https://yyz.labdoc.cn:8089";
// let baseUrl = "https://kefu.shchildren.com.cn:8999";
// let baseUrl = "https://funingx.ugsg.com.cn:61080";
function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase();
    return /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent);
}

export {baseUrl, serverUrl,metrics, browserRedirect, examples};
