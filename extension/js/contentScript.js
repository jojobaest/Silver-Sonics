console.log("HELLO")

document.getElementById("myButton").addEventListener("click", myFunction);

function myFunction(){
    let images = document.getElementsByTagName('img');
    console.log(images)
    
    const links = new Array();
    for (let i = 0; i < images.length; i++){
        links.push(images[i].currentSrc);
    }
    
    // const s = JSON.stringify(images); // Stringify converts a JavaScript object or value to a JSON string (not sure whether this is necessary for us?)
    // console.log(s); // Prints the variables to console window, which are in the JSON format
    
    window.alert(s)
    
    $.ajax({
        url:"http://127.0.0.1:5000/test",
        type:"POST",
        contentType: "application/json",
        data: JSON.stringify(links)});
}
