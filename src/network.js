//------------------------------------------------------------------------------
//
// Eschersketch - A drawing program for exploring symmetrical designs
//
//
// Copyright (c) 2017 Anselm Levskaya (http://anselmlevskaya.com)
// Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
// license.
//
//------------------------------------------------------------------------------

import {gS, prepForUpload, fetchFromCloud, getJPGdata} from './main.js'
import {lsGetJSON, lsSaveJSON} from './utils.js';

//Server Endpoints
const SketchEndpoint    = "https://k7kvzcc7s0.execute-api.us-west-1.amazonaws.com/prod/sketch/";
const PostImageEndpoint = "https://k7kvzcc7s0.execute-api.us-west-1.amazonaws.com/prod/postimage";

const HttpClient = function() {
    this.get = function(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                callback(xmlhttp.responseText);
        }
        xmlhttp.open( "GET", url, true );
        xmlhttp.send( null );
    }
    this.post = function(url, jsonStr, callback) {
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST", url, true);
      xmlhttp.setRequestHeader("Content-type", "application/json");
      xmlhttp.onreadystatechange = function () { //Call a function when the state changes.
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              callback(xmlhttp.responseText);
          }
        }
      xmlhttp.send(jsonStr);
    }
}

// record list of shared sketches in localstorage, not used now and questionably useful
// given the ephemerality of localstorage data in many browsers
const rememberSketch = function(id){
    let memory = lsGetJSON("sketches") || [];
    let dateStr = (new Date()).toLocaleString();
    memory.push({sketchID:id, name:gS.params.filename, date:dateStr})
    lsSaveJSON("sketches", memory);
}

export const saveSketch = function(){
  let resturl = SketchEndpoint;
  let client = new HttpClient();
  client.post(resturl, prepForUpload(), function(str){
    let jsonObj = JSON.parse(str);
    console.log("new sketchID", jsonObj.sketchID);
    rememberSketch(jsonObj.sketchID);
    //gS.params.copyText = "https://eschersket.ch/?s="+jsonObj.sketchID;
    gS.params.copyText = "https://eschersket.ch/s/"+jsonObj.sketchID;
    gS.params.showShareLinks = true;
    console.log("trying an image post");
    let imgclient = new HttpClient();
    let imgdata = JSON.stringify({
                    hash:   jsonObj.sketchID,
                    b64img: getJPGdata().replace("data:image/jpeg;base64,","")
                  });
    imgclient.post(PostImageEndpoint, imgdata, function(str){
      console.log("imgpost response", str);
    });

  });
}

export const loadSketch = function(sketchID){
  let resturl = SketchEndpoint;
  let client = new HttpClient();
  client.get(resturl, function(str){
    //console.log("success", str);
    fetchFromCloud(str);
  });
}
