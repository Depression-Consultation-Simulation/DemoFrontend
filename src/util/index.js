let baseUrl = "http://202.120.38.125:7785";
let serverUrl = "http://202.120.38.125:7786";
let metrics = [
    "流利程度(Fluency): 机器人表达的流畅程度，可以被理解的程度",
    "使人舒服的程度(Comforting): 机器人表达令人舒适，不会觉得被冒犯，能被机器人宽慰的程度",
    "参与程度(Engagingness): 机器人能维持你注意力，使你想和它继续聊的程度",
    "像医生的程度(Doctorness): 机器人像人的程度，像医生的程度"
];

// let baseUrl = "https://yyz.labdoc.cn:8089";
// let baseUrl = "https://kefu.shchildren.com.cn:8999";
// let baseUrl = "https://funingx.ugsg.com.cn:61080";
function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase();
    return /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent);
}

export {baseUrl, serverUrl,metrics, browserRedirect};
