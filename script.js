/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
//fixed variables
const conToken = "90935135|-31949240930407636|90903745";
const empDBName = "login2explore";
const relName = "student";
const jpdbBaseUrl = "http://api.login2explore.com:5577";
const jpdbIml = "/api/iml";
const jpdbIrl = "/api/irl";

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        jsonObj = JSON.parse(result.responseText);
    });
    return jsonObj;
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

function createUpdateRequest(connToken, jsonObj, dbName, relName, recordNo) {
    var updateRequest = "{\n"
            + "\"token\" : \"" + connToken + "\","
            + "\"dbName\": \"" + dbName + "\",\n"
            + "\"cmd\" : \"UPDATE\",\n"
            + "\"rel\" : \"" + relName + "\","
            + "\"jsonStr\": {"
            + "\"" + recordNo + "\": "
            + jsonObj
            + "}"
            + "\n}";
    return updateRequest;
}

function createGetByKeyRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}


function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#fullName").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollDate").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollNo").focus();
}

// create json object (basically actual data
function getEmpIdAsJsonObject() {
    let rollNo = $("#rollNo").val();
    if (rollNo === "") {
        alert("Student Roll No missing");
        $("#rollNo").focus();
        return "";
    }
    let jsonObjIdVal = {
        "rollNo": rollNo
    };
    return JSON.stringify(jsonObjIdVal);
}

function validateData() {
    let rollNo, fullName, stuClass, birthDate, address, enrollDate;
    rollNo = $("#rollNo").val();
    fullName = $("#fullName").val();
    stuClass = $("#class").val();
    birthDate = $("#birthDate").val();
    address = $("#address").val();
    enrollDate = $("#enrollDate").val();
    if (rollNo === "") {
        alert("Student Roll No missing");
        $("#rollNo").focus();
        return "";
    }
    if (fullName === "") {
        alert("Student Name missing");
        $("#fullName").focus();
        return "";
    }
    if (stuClass === "") {
        alert("Student Class missing");
        $("#class").focus();
        return "";
    }
    if (birthDate === "") {
        alert("Student Date of Birth missing");
        $("#birthDate").focus();
        return "";
    }
    if (address === "") {
        alert("Student Address missing");
        $("#address").focus();
        return "";
    }
    if (enrollDate === "") {
        alert("Student Enrollment Date missing");
        $("#enrollDate").focus();
        return "";
    }
    let jsonStrObjVal = {
        "rollNo": rollNo,
        "fullName": fullName,
        "class": stuClass,
        "birthDate": birthDate,
        "address": address,
        "enrollDate": enrollDate
    };
    return JSON.stringify(jsonStrObjVal);
    //remains
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(conToken, jsonStrObj, empDBName, relName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIml);
    if (resJsonObj.status === 200) {
        alert("Data saved successfully");
    } else {
        alert("Error while saving data");
    }
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollNo").focus();
}

function saveRecNo2LS(jsonObj) {
    let lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    let data_obj = JSON.parse(jsonObj.data).record;
    $("#rollNo").val(data_obj.rollNo);
    $("#fullName").val(data_obj.fullName);
    $("#class").val(data_obj.class);
    $("#birthDate").val(data_obj.birthDate);
    $("#address").val(data_obj.address);
    $("#enrollDate").val(data_obj.enrollDate);
}

function changeData() {
    $("#change").prop("disabled", true);
    let jsonChng = validateData();
    if (jsonChng === "") {
        $("#change").prop("disabled", false);
        return "";
    }
    var updateRequest = createUpdateRequest(conToken, jsonChng, empDBName, relName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIml);
    if (resJsonObj.status === 200) {
        alert("Data saved successfully");
    } else {
        alert("Error while saving data");
    }
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollNo").focus();
}

function getRoll() {
    let rollNoJsonObj = getEmpIdAsJsonObject();
    if (rollNoJsonObj === "") {
        return "";
    }
    $("#rollNo").prop("disabled", true);
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollDate").prop("disabled", false);
    $("#fullName").focus();
    let getRequest = createGetByKeyRequest(conToken, rollNoJsonObj, empDBName, relName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIrl);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
    }
}
$(document).ready(function () {
    resetForm();
});