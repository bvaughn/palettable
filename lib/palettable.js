var palettable = {};

palettable.createTinyColor = function(value) {
  // Tiny color can parse hex values as well as rgb() and rgba().
  var color = tinycolor(value);

  return color.isValid() ? color : null;
};

palettable.parseSCSS = function(content, fileIdentifier, matchesArray) {
  var matchesArray = matchesArray ? matchesArray : [];

  content = '\n' + content; // (Simplifies our Regex below)

  // Look for any variables pointing at rgb(), rgba(), or Hex values.
  var regex = /\n[\s]*\$([^:]+): *(#[^;]+|rgb[^;]+);/g;
  var match;

  while (match = regex.exec(content)) {
    var name = match[1].replace(/^color-/, '');
    var color = this.createTinyColor(match[2]);

    if (color) {
      matchesArray.push({ fileName: fileIdentifier, variableName: name, tinycolor: color });
    } else {
      console.log('Invalid color found ' + name + ':' + color);
    }
  }

  return matchesArray;
};

palettable.parseSASS = function(content, fileIdentifier, matchesArray) {
  var matchesArray = matchesArray ? matchesArray : [];

  content = '\n' + content; // (Simplifies our Regex below)

  // Look for any variables pointing at rgb(), rgba(), or Hex values.
  var regex = /\n[\s]*\$([^:]+): *(#[^\r\n]+|rgb[^\r\n]+)/g;
  var match;

  while (match = regex.exec(content)) {
    var name = match[1].replace(/^color-/, '');
    var color = this.createTinyColor(match[2]);

    if (color) {
      matchesArray.push({ fileName: fileIdentifier, variableName: name, tinycolor: color });
    }
  }

  return matchesArray;
};

palettable.parseStylus = function(content, fileIdentifier, matchesArray) {
  var matchesArray = matchesArray ? matchesArray : [];

  content = '\n' + content; // (Simplifies our Regex below)

  // Look for any variables pointing at rgb(), rgba(), or Hex values.
  var regex = /\n[\s]*\$*([^\s=]+)\s*=\s*(#[^\r\n;]+|rgb[^\r\n;]+)/g;
  var match;

  while (match = regex.exec(content)) {
    var name = match[1].replace(/^color-/, '');
    var color = this.createTinyColor(match[2]);

    if (color) {
      matchesArray.push({ fileName: fileIdentifier, variableName: name, tinycolor: color });
    }
  }

  return matchesArray;
};

palettable.calculateDerivativeInformation = function(array, hoverColorFunction, shadeColorFunction, tintColorFunction) {
  array.forEach(function(colorHash) {
    //var contrastColor = colorHash.tinycolor.getContrast().toHexString();
    var contrastColor =
      colorHash.tinycolor.isLight() ?
        colorHash.tinycolor.clone().darken(65) :
        colorHash.tinycolor.clone().brighten(65);

    var lowContrastColor =
      colorHash.tinycolor.isLight() ?
        colorHash.tinycolor.clone().darken(25) :
        colorHash.tinycolor.clone().brighten(25);

    colorHash.color = colorHash.tinycolor.toHexString().toUpperCase();
    colorHash.contrastColor = contrastColor.toHexString().toUpperCase();
    colorHash.hoverColor = hoverColorFunction(colorHash.tinycolor).toHexString().toUpperCase();
    colorHash.lowContrastColor = lowContrastColor.toHexString().toUpperCase();
    colorHash.shadeColor = shadeColorFunction(colorHash.tinycolor).toHexString().toUpperCase();
    colorHash.tintColor = tintColorFunction(colorHash.tinycolor).toHexString().toUpperCase();
  });
};

palettable.sortColors = function(array, sortFunction) {
  return array.sort(
    function(a, b) {
      return sortFunction(a.tinycolor) - sortFunction(b.tinycolor);
    });
};

palettable.defaultColorSortWeightFunction = function(color) {
  var hsv = color.toHsv();

  // Sort grayish colors differently.
  // Grey is a fuzzy thing; a threshold of .095 seems to work well anecdotally.
  if (hsv.s < .095) {
    return hsv.v;

  } else {
    // Multiple ways for sorting colors
    // var rgb = color.toRgb();
    // var value = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    // var value = Math.sqrt(0.299 * rgb.r^2 + 0.587 * rgb.g^2 + 0.114 * rgb.b^2);
    // var value = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;

    // Sorting by hue at this point looks the best though!
    // Padd to ensure that colors come after grays.
    // Sort by brightness secondarily for colors with the same hue.
    return 1000 + 100 * hsv.h + hsv.v;
  }
};

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = palettable;
// AMD/requirejs: Define the module
} else if (typeof define === 'function' && define.amd) {
    define(function () {return palettable;});
// Browser: Expose to window
} else {
    window.palettable = palettable;
}
