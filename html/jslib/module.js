var resJson = {};
var pageId = 'home';
var htmlRoot = "";
var cgibin = "/cgi-bin";
var sparqlQuery = "";
var queryId = "1.1";


////////////////////////////////
$(document ).ready(function() {

    setPageFrame();

    var url = '/cgi-bin/init.py';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            resJson = JSON.parse(reqObj.responseText);
            if(resJson["taskstatus"] != 1){
                $("#pagecn").html("<br><br>" + resJson["errormsg"]);
            }
            else{
                $("#moduleversioncn").html(resJson["moduleversion"]);
                setNavigation(resJson["domains"]);
                fillFrameCn();
            }
        }
    };
    var postData = '';
    reqObj.send(postData);


});



////////////////////////////
function setPageFrame(){

	var linkList = [
            {"id":"home", "label":"Home/Query", "url":htmlRoot+'home'},
            {"id":"xml", "label":"XML", "url":"#"},
            {"id":"json", "label":"JSON", "url":"#"},
            {"id":"n3", "label":"N3", "url":"#"},
            {"id":"csv", "label":"CSV", "url":"#"}
        ];
        var s1 = 'padding:10px 10px 10px 10px;background:#eee;border-right:1px solid #fff;';
        var s2 = 'padding:10px 10px 10px 10px;background:#ccc;border-right:1px solid #fff;';
        
        var cn = '<table><tr>';
        for (var i in linkList){
            var o = linkList[i];
            var s = (pageId == o.id ? s2 : s1);
            cn += '<td id="'+o.id+'" class="pagelink"  style="'+s+'">' + o.label + '</td>';
        }
        cn += '</tr></table>'
        $("#pagelinkscn").html(cn);
        
        $(".pagelink").css("display", "none");	
        $("#home").css("display", "inline-block");



        return;
}

////////////////////////////
function fillFrameCn(){

        var imgFile = htmlRoot + "/content/loading.gif";
        var gifImage = '<img src='+imgFile+' style="width:20%;margin-top:2%;">';        
        $("#pagecn").html(gifImage);

        var re = RegExp('^.*\/?' + htmlRoot + '\/?([^\/]*)\/?');
        var lastPart = re.exec(window.location)[1];
        pageId = (lastPart == '' ? 'home' : lastPart);

        fillStaticHtmlCn(htmlRoot + '/content/page.'+pageId+'.html', '#pagecn');
        setTimeout(setQueryValue, 100);
        return;
}


////////////////////////
function setQueryValue(){

    var cn = '';
    var groupId = queryId.split(".")[0];
    var obj = querySet[groupId]["querydict"][queryId];

    for (var i in obj["qlines"]){
        cn += obj["qlines"][i] + '\n';
    }
    $('#queryvalue').val(cn);

    
    var cn = '<b>Load example SPARQL query</b><br>';
    cn += '<select id=queryselector style="width:100%;height:30px;background:#ECF4F9;margin:3px;">';
    for (var queryGroupId in querySet){
        for (var qid in querySet[queryGroupId]["querydict"]){
            var obj = querySet[queryGroupId]["querydict"][qid];
            var s = (qid == queryId ? "selected" : "");
            cn += '<option value="'+qid+'"  '+s+'>'+obj.desc+'</option>';
        }
    }
    cn += '</select>';
    $('#samplequeriescn').html(cn);


}


///////////////////////////
function fillQueryResultsViewCn(menuId){

    var jqId = "#" +  menuId;
    $(".pagelink").css("display", "inline-block");
    $(".pagelink").css("background","#eee");
    $(jqId).css("background","#ccc");
    
    var imgFile =  htmlRoot + "/content/loading.gif";
    var gifImage = '<img src='+imgFile+' style="width:20%;margin-top:2%;">';
    $("#resultscn").html(gifImage);

    if (menuId == "home"){
        $("#queryvalue").val(sparqlQuery);
        $("#pagecn").css("display", "block");
        $("#resultscn").css("display", "none");
        return;
    }
    else{
        $("#pagecn").css("display", "none");
        $("#resultscn").css("display", "block");
    }
    sparqlQuery = $("#queryvalue").val().trim();

    var inJson = {}
    var qs = '';
    var parts = sparqlQuery.split("\n");
    for (var i in parts){
        qs += parts[i] + ' ';
    }
    inJson = {"qs":qs, "format":menuId.toUpperCase()};

    var url = cgibin + '/get_triples.py';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.inJson = inJson;
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            //console.log('response='+reqObj.responseText);
            resJson = JSON.parse(reqObj.responseText);
            if(resJson["taskstatus"] != 1){
                $("#resultscn").html("<br><br>" + resJson["errormsg"]);
            }
            else{
                var style = 'font-size:11px;float:right;padding:3px;';
                var cn = '<div style="'+style+'">';
                cn += 'Total of ' + resJson["ntriples"] + ' triples returned.';
                cn += '</div>';
                var style = 'width:100%;height:800px;padding:10px;text-align:left;';
                cn += '<textarea style="'+style+'">';
                if (this.inJson["format"] == "JSON"){
                    cn += JSON.stringify(resJson["triples"],  null, 2);
                }
                else{
                    cn += resJson["triples"];
                }
                cn += '</textarea>';
                $("#resultscn").html(cn);
            }
        }
    };
    var postData = 'injson=' + JSON.stringify(inJson);
    reqObj.send(postData);
    console.log(postData);


}



////////////////////////////////
$(document).on('change', '#queryselector', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    //queryId = this.id;
    queryId = $("#queryselector option:selected").val();

    setQueryValue();

});


///////////////////////////
$(document).on('click', '#searchbtn', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    fillQueryResultsViewCn("xml");

});


/////////////////////////////
$(document).on('click', '.pagelink', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
   

    //if  (this.id == "home"){
    //    location.href = htmlRoot;
    //}
    //else{
    //    alert(this.id);
        fillQueryResultsViewCn(this.id);
    //}


});






function setNavItemAsCurrent(itemText) {
     $('.nav > li > a').each(function () {
        if ($(this).text().indexOf(itemText) >= 0) {
                $(this).parent().addClass('current');
        }
    });
}


function setNavigation(domainUrls){

    var url = window.location.href;
    var fullFilename = url.substring(url.lastIndexOf('/') + 1);
    var filename = fullFilename.substring(0, fullFilename.lastIndexOf('.'));
    var navItemText = filename.replace(/_/g, ' ').toUpperCase();
    var glygen_url = window.location.origin;
    if (glygen_url.indexOf('beta-') >= 0) {
        glygen_url = glygen_url.replace("beta-", "beta.");
    }
    if (glygen_url.indexOf('data.') >= 0) {
       glygen_url = glygen_url.replace("data.", "");
    } else if (glygen_url.indexOf('sparql.') >= 0) {
       glygen_url = glygen_url.replace("sparql.", "");
    }
   
   var domain = glygen_url + "/";
    
    if (navItemText == '') {
        navItemText = 'HOME';
    } else if (navItemText == 'INDEX') {
        navItemText = 'HOME';
    } else if (navItemText == 'CONTACT') {
        navItemText = 'HELP';
    } else if (navItemText == 'HOW TO CITE') {
        navItemText = 'HELP';
    } else if (navItemText == 'ABOUT') {
        navItemText = 'HELP';
    } else if (navItemText == 'RESOURCES') {
        navItemText = 'MORE';
    } else if (navItemText == 'MEDIA') {
        navItemText = 'MORE';
    } else if (navItemText == 'FRAMEWORKS') {
        navItemText = 'MORE';
    } else if (navItemText == 'GLYGEN SETTINGS') {
        navItemText = 'MY GLYGEN';
    }

    if (url.indexOf('data.') >= 0) {
        navItemText = 'DATA';
    } else if (url.indexOf('sparql.') >= 0) {
        navItemText = 'SPARQL';
    }
    else if (url.indexOf('api.') >= 0) {
        navItemText = 'API';
    }

    $('.nav > li').removeClass('current');
    setNavItemAsCurrent(navItemText);
    
    $("#a_portal").attr('href', domainUrls["portal"]);
    $("#a_data").attr('href', domainUrls["data"]);
    $("#a_api").attr('href', domainUrls["api"]);
    $("#a_sparql").attr('href', domainUrls["sparql"]);

    
    $.each($(".a_header"), function(i, v) {
        var nav_url = $(v).attr('href');
        $(v).attr('href', domain + nav_url);
    });


}

