let images = document.getElementsByTagName("img");
let imgData;
let originalPixels;
let currentPixels;
for (let i = 0; i < images.length; i++) {
  var srcImage = images[i];

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

  const nextRed = redValue;
  const nextGreen = greenValue;
  const nextBlue = blueValue;

  // **TODO: integrate python processing stuff to change nextRed, etc

  currentPixels[redIndex] = nextRed;
  currentPixels[greenIndex] = nextGreen;
  currentPixels[blueIndex] = nextBlue;
}

// Given the x, y index, return what position it should be in a 1d array
function getIndex(x, y) {
  return (x + y * srcImage.width) * 4;
}
