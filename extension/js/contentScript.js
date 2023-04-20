document.getElementById("myButton").addEventListener("click", myFunction);

function myFunction() {
  // sets document to active tab instead of extension
  chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    var activeTab = tabs[0];
    var activeTabId = activeTab.id;
    return chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
      func: DOMtoString,
      args: ['img']  // you can use this to target what element to get the html for
    });
  }).then(function (results) { // after this stuff runs, return the result to message
    s = JSON.stringify(results[0].result);
    console.log(s)
    $.ajax({ // sends it to test
      url: "http://127.0.0.1:5000/test",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(s)
    });
  }).catch(function (error) { // if something goes wrong
    s = JSON.stringify('There was an error injecting script : \n' + error.message);
    $.ajax({ // sends it to test
      url: "http://127.0.0.1:5000/test",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(s)
    });
  })
  
}


function DOMtoString(selector) { // selector is img bc we're looking for images
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node"
  } else {
    selector = document.documentElement;
  }
  return selector.src; //right now this is getting the link. if you want everything in the image tag, use "selector.outerHTML"
}

/*
const links = Array(); // make an array
const foo = document.querySelectorAll("img"); // get nodeList of img objects

for(var i = 0; i < foo.length; i++){ //loop through nodeList and get each node
    links.push(foo.item(i).src) //add links of each node to array
}
return links //return array
*/

/*
above is a code snippet that will get us a list of all the links of images on a page. 
*/