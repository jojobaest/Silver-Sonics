document
  .getElementById("contrastButton")
  .addEventListener("click", switchActiveTab); // when button is clicked, call switchActiveTab

function switchActiveTab() {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
      var activeTab = tabs[0]; // activeTab = tab user is currently on
      var activeTabId = activeTab.id;
      return chrome.scripting.executeScript({
        target: { tabId: activeTabId }, // allows us to access the current webpage when using document in the highContrast
        injectImmediately: true, // uncomment this to make it execute straight away, other wise it will wait for document_idle
        func: highContrastPage, // call highContrastPage
      });
    });
}
var contrast;

function highContrastPage() {
  if (contrast == true) {
    // turn contrast off by reloading page
    console.log("turning contrast off");
    contrast = false;
    location.reload();
    return false;
  } else {
    // run image processing code!
    contrast = true;
  }

  var images = document.getElementsByTagName("img"); // get all images in the page and store in array
  console.log("images.length: " + images.length);

  let imgData;
  let currentPixels;
  for (let i = 0; i < images.length; i++) {
    // go thru each of the images on the page
    try {
      // need to try since some images are locked and may throw an access error
      let srcImage = images[i];

      var canvas = document.createElement("canvas");
      canvas.width = srcImage.width;
      canvas.height = srcImage.height;

      var ctx = canvas.getContext("2d"); // flatten image to 2D, so image type doesn't matter
      console.log(ctx);
      ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height); // would display image

      // since some webpages have accessing restrictions, this tries to remove those restrictions
      srcImage.crossOrigin = "Anonymous";

      imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height); // get image data
      currentPixels = imgData.data.slice(); // slice creates a shallow copy of the image data

      //go through each pixel of the image and add contrast
      for (let i = 0; i < srcImage.height; i++) {
        for (let j = 0; j < srcImage.width; j++) {
          addContrast(currentPixels, j, i, srcImage.width);
        }
      }

      //change original image data to new image data
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = currentPixels[i];
      }

      // Update the 2d rendering canvas with the image we just updated so the user can see
      ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height);

      //converting canvas to a src URL so that we can directly edit the page's image
      var dataURL = canvas.toDataURL();
      images[i].src = dataURL;
      console.log("image " + i + "/" + images.length + " changed!");
    } catch (err) {
      console.log(err);
    }
  }
  console.log("done editing all of the images!");
}

// input: array of pixels, the coordinates of the target pixel, and size of pixel array
function addContrast(currentPixels, x, y, width) {
  //offsets for array indexing, since the pixels are stored like [red, green, blue, alpha] values
  const R_OFFSET = 0;
  const G_OFFSET = 1;
  const B_OFFSET = 2;

  // getIndex will get the index of the first value representing the pixel
  const redIndex = getIndex(x, y, width) + R_OFFSET;
  const greenIndex = getIndex(x, y, width) + G_OFFSET;
  const blueIndex = getIndex(x, y, width) + B_OFFSET;

  // gets the red, green, and blue(RGB) values of the pixel
  const redValue = currentPixels[redIndex];
  const greenValue = currentPixels[greenIndex];
  const blueValue = currentPixels[blueIndex];

  // converts the RGB values to hue, saturation, and value(HSV) for editing
  var [hueValue, satValue, valValue] = rgb_to_hsv(
    redValue,
    greenValue,
    blueValue
  );

  // image processing!
  // rounds the value and saturation to the nearest interval of thirds
  valValue = nearestValue(valValue, 2);
  satValue = nearestValue(satValue, 2);

  // convert new HSV values back into RGB
  const [nextRed, nextGreen, nextBlue] = hsv_to_rgb(
    hueValue,
    satValue,
    valValue
  );

  // update current image data array
  currentPixels[redIndex] = nextRed;
  currentPixels[greenIndex] = nextGreen;
  currentPixels[blueIndex] = nextBlue;
}

// conversion from rgb(red, green, blue) values to hsv(hue, saturation, value) values
function rgb_to_hsv(r, g, b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  const cMax = Math.max(r, g, b);
  const cMin = Math.min(r, g, b);
  const delta = cMax - cMin;

  h = -1;
  s = -1;
  v = -1;

  //hue calculation
  if (delta == 0) {
    h = 0;
  } else if (cMax == r) {
    h = 60 * (((g - b) / delta) % 6);
  } else if (cMax == g) {
    h = 60 * ((b - r) / delta + 2);
  } else if (cMax == b) {
    h = 60 * ((r - g) / delta + 4);
  }
  // saturation calculation
  if (cMax == 0) {
    s = 0;
  } else {
    s = delta / cMax;
  }

  //value calculation
  v = cMax;

  return [h, s, v];
}

// conversion from hsv(hue, saturation, value) values to rgb(red, green, blue) values
function hsv_to_rgb(h, s, v) {
  var c = v * s;
  var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  var m = v - c;

  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// rounds the value to the nearest value
function nearestValue(v, n) {
  // n is # of segments
  let increment = 1 / n;
  let index = Math.round(v / increment);
  return index * increment;
}

// Given the (x, y) coordinate and the width of the image, return what position it should be in a 1d array
// example: currentPixels = [128, 255, 0, 255, 186, 182, 200, 255, 186, 255, 255, 255, 127, 60, 20, 128] for a 2x2 image
// passing in an x and y of (1, 0) means the pixel is in the upper right corner, so getIndex will return 4
function getIndex(x, y, width) {
  return (x + y * width) * 4;
}
