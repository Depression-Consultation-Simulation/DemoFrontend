let baseUrl = "http://localhost:5123/";
// let baseUrl = "https://yyz.labdoc.cn:8089";
// let baseUrl = "https://kefu.shchildren.com.cn:8999";
// let baseUrl = "https://funingx.ugsg.com.cn:61080";
function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase();
    return /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent);
}

export {baseUrl, browserRedirect};
