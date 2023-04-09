from PIL import Image
import urllib.request
import decimal

def roundHalfUp(d):
    # Round to nearest with ties going away from zero.
    rounding = decimal.ROUND_HALF_UP
    # See other rounding options here:
    # https://docs.python.org/3/library/decimal.html#rounding-modes
    return int(decimal.Decimal(d).to_integral_value(rounding=rounding))

#https://www.rapidtables.com/convert/color/hsv-to-rgb.html
def rgb_to_hsv(r, g, b):
    r = r/255
    g = g/255
    b = b/255
    cMax = max(r, g, b)
    cMin = min(r, g, b)
    delta = cMax - cMin

    h = -1
    s = -1
    v = -1

    # hue calculation
    if delta == 0:
        h = 0
    elif cMax == r:
        h = 60 * (((g-b)/delta)%6)
    elif cMax == g:
        h = 60 * (((b-r)/delta)+2)
    elif cMax == b:
        h = 60 * (((r-g)/delta)+4)
    
    # saturation calculation
    if cMax == 0:
        s = 0
    else:
        s = delta/cMax
    
    # value calculation
    v = cMax
    
    return (h, s, v)

def hsv_to_rgb(h, s, v):
    c = v * s
    x = c * (1 - abs((h/60)%2 - 1))
    m = v - c

    if h < 60:
        r, g, b = c, x, 0
    elif h < 120:
        r, g, b = x, c, 0
    elif h < 180:
        r, g, b = 0, c, x
    elif h < 240:
        r, g, b = 0, x, c
    elif h < 300:
        r, g, b = x, 0, c
    else:
        r, g, b = c, 0, x

    return ((r+m)*255, (g+m)*255, (b+m)*255)

def nearestValue(v, n): # n is # of segments
    increment = 1 / n
    index = roundHalfUp(v / increment)
    return index * increment

def highContrast(my_url, input_name):
    index = my_url.rfind('.')
    file_type = my_url[index:]
    file_name = "images\\" + input_name + file_type

    urllib.request.urlretrieve(my_url, file_name)
    input = Image.open(file_name)

    pixel_map = input.load()

    width, height = input.size

    for i in range(width):
        for j in range(height):
            r, g, b = input.getpixel((i, j))

            # converting RGB(0-255, 0-255, 0-255) -> HSV(0-360, 0-1, 0-1)
            h, s, v = rgb_to_hsv(r, g, b)

            # contrast using saturation & value
            v = nearestValue(v, 2)
            s = nearestValue(s, 2)

            # converting HSV(0-360, 0-1, 0-1) -> RGB(0-255, 0-255, 0-255)
            rNew, gNew, bNew = hsv_to_rgb(h, s, v)

            pixel_map[i, j] = (int(rNew), int(gNew), int(bNew))

    input.save("edited-"+file_name+file_type)
    input.show()
