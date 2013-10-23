/**
 * Created by hadihariri on 10/22/13.
 */


var sessionId = -1;

var consoleView = new ConsoleView($("#console"), null);
var errorView = new ProblemsView($("#problems"), null)
var runButton = new Button($("#run"), null);

var kotlinServerBaseUrl = "http://kotlinsrv.labs.intellij.net/";

var configuration = new Configuration(Configuration.mode.ONRUN, Configuration.type.JAVA, true);
var runProvider = new RunProvider();
var editor = new KotlinEditor(configuration);

runButton.onClick = function () {
    runButton.setEnabled(false);
    runProvider.run(configuration, editor.getProgramText(), "");
};

runProvider.onExecutionFinish = function (output) {
    runButton.setEnabled(true);
    consoleView.setOutput(output);
};

runProvider.onFail = function (error) {
    runButton.setEnabled(true);
    consoleView.writeException(error);
};

function generateAjaxUrl(url, type, args) {
    return url + "kotlinServer?sessionId=" + sessionId + "&type=" + type + "&args=" + args;
}

function setSessionId() {
    $.ajax({
        url:generateAjaxUrl(kotlinServerBaseUrl, "getSessionId", "null"),
        context:document.body,
        type:"GET",
        dataType:"json",
        timeout:10000,
        success:getSessionIdSuccess
    });
}

function getSessionIdSuccess(data) {
    data = eval(data);
    if (data[0] != null && data[0] != '') {
        sessionId = data[0];
    }

    var info = "browser: " + navigator.appName + " " + navigator.appVersion;
    info += " " + "system: " + navigator.platform;

    $.ajax({
        url:generateAjaxUrl(kotlinServerBaseUrl, "sendUserData", "null"),
        context:document.body,
        type:"POST",
        data:{text:info},
        timeout:5000
    });
}

setSessionId();