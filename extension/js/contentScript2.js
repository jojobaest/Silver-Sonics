let images = document.getElementsByTagName("img");
let imgData;
let originalPixels;
let currentPixels;
for (let i = 0; i < images.length; i++) {
  var srcImage = images[i];

  var canvas = $("<canvas>");

  canvas.width = srcImage.width;
  canvas.height = srcImage.height;

  var ctx = canvas.getContext("2d");
  console.log(ctx);
  ctx.drawImage(img, 0, 0, srcImage.width, srcImage.height);

  imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
  originalPixels = imgData.data.slice(); // slice creates a shallow copy
  currentPixels = imgData.data.slice(); // slice creates a shallow copy

  for (let i = 0; i < srcImage.height; i++) {
    for (let j = 0; j < srcImage.width; j++) {
      addContrast(j, i);
    }
  }

  for (let i = 0; i < imgData.data.length; i++) {
    imgData.data[i] = currentPixels[i];
  }

  var dataURL = canvas.toDataURL();
  images[index].src = dataURL;
}

// The image is stored as a 1d array with red first, then green, and blue
const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;

function addContrast(x, y) {
  const redIndex = getIndex(x, y) + R_OFFSET;
  const greenIndex = getIndex(x, y) + G_OFFSET;
  const blueIndex = getIndex(x, y) + B_OFFSET;

  const redValue = currentPixels[redIndex];
  const greenValue = currentPixels[greenIndex];
  const blueValue = currentPixels[blueIndex];

  var [hueValue, satValue, valValue] = rgb_to_hsv(
    redValue,
    greenValue,
    blueValue
  );

  valValue = nearestValue(v, 2);
  satValue = nearestValue(s, 2);
  const [nextRed, nextGreen, nextBlue] = hsv_to_rgb(
    hueValue,
    satValue,
    valValue
  );

  currentPixels[redIndex] = nextRed;
  currentPixels[greenIndex] = nextGreen;
  currentPixels[blueIndex] = nextBlue;
}

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

function hsv_to_rgb(h, s, v) {
  c = v * s;
  x = c * (1 - abs(((h / 60) % 2) - 1));
  m = v - c;

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

function nearestValue(v, n) {
  // n is # of segments
  let increment = 1 / n;
  let index = Math.round(v / increment);
  return index * increment;
}

// Given the x, y index, return what position it should be in a 1d array
function getIndex(x, y) {
  return (x + y * srcImage.width) * 4;
}
