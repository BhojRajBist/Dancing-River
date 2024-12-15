// Define years and region of interest
var years = ee.List.sequence(2015, 2024);
var region = ee.Geometry.Polygon()  //replace this with the region of the interest

// Load Sentinel-1 data
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(region)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .select('VV');

// Load Sentinel-2 data
var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(region)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .select(['B4', 'B3', 'B2', 'B8', 'B11', 'B12']);

// Define NDWI function
var NDWI = function(image) {
  var ndwi = image.normalizedDifference(['B3', 'B8']);
  return image.addBands(ndwi.rename('NDWI'));
};

// Define MNDWI function
var MNDWI = function(image) {
  var mndwi = image.normalizedDifference(['B3', 'B11']);
  return image.addBands(mndwi.rename('MNDWI'));
};

// Apply NDWI and MNDWI to Sentinel-2 collection
var sentinel2_with_ndwi = sentinel2.map(NDWI);
var sentinel2_with_mndwi = sentinel2.map(MNDWI);

// Function to process flood and display layers
function processFlood(year, selectedLayer) {
  // Filter Sentinel-1 data for the year and monsoon months
  var surfaceWater = sentinel1
    .filter(ee.Filter.calendarRange(year, year, 'year'))
    .filter(ee.Filter.calendarRange(6, 9, 'month'))
    .mean()
    .clip(region);

  var groundSurfaceWater = surfaceWater.gt(-20);

  // Calculate seasonal flood
  var seasonalFlood = groundSurfaceWater.updateMask(groundSurfaceWater);
  var permanentWater = ee.Image("JRC/GSW1_4/GlobalSurfaceWater")
    .select('occurrence').gte(80).clip(region);
  var monsoonFlood = seasonalFlood.subtract(permanentWater).selfMask();

  // NDWI and MNDWI-based water detection
  var waterThreshold = 0.1;
  var ndwiWaterBodies = sentinel2_with_ndwi.mean().select('NDWI').gt(waterThreshold);
  var mndwiWaterBodies = sentinel2_with_mndwi.mean().select('MNDWI').gt(waterThreshold);

  // Visualization
  Map.layers().reset(); // Clear previous layers

  if (selectedLayer === 'Permanent Water') {
    Map.addLayer(permanentWater, {palette: ['blue'], min: 0, max: 1}, 'Permanent Water ' + year);
  } else if (selectedLayer === 'Monsoon Flood') {
    Map.addLayer(monsoonFlood, {palette: ['red'], min: 0, max: 1}, 'Monsoon Flood ' + year);
  } else if (selectedLayer === 'NDWI Water') {
    Map.addLayer(ndwiWaterBodies.updateMask(ndwiWaterBodies), {palette: ['cyan'], min: 0, max: 1}, 'NDWI Water ' + year);
  } else if (selectedLayer === 'MNDWI Water') {
    Map.addLayer(mndwiWaterBodies.updateMask(mndwiWaterBodies), {palette: ['green'], min: 0, max: 1}, 'MNDWI Water ' + year);
  } else if (selectedLayer === 'Sentinel VV') {
    Map.addLayer(surfaceWater, {min: -20, max: 0, palette: ['blue', 'green', 'yellow']}, 'Sentinel-1 VV ' + year);
  }
}

// Add slider for year selection
var yearSlider = ui.Slider({
  min: 2015,
  max: 2024,
  value: 2015,
  step: 1,
  style: {width: '300px'}
});

// Add label for slider
var sliderLabel = ui.Label('Select Year:');

// Add dropdown for layer selection
var layerSelector = ui.Select({
  items: ['Permanent Water', 'Monsoon Flood', 'NDWI Water', 'MNDWI Water', 'Sentinel VV'],
  placeholder: 'Select Layer',
  value: 'Permanent Water', // Default selection
  style: {width: '200px'}
});

// Add a panel to hold the slider, dropdown, and label
var controlPanel = ui.Panel({
  widgets: [sliderLabel, yearSlider, layerSelector],
  style: {position: 'top-center', padding: '8px'}
});
Map.add(controlPanel);

// Add event listeners to the slider and dropdown
yearSlider.onChange(function(value) {
  var selectedYear = Math.round(value);
  var selectedLayer = layerSelector.getValue();
  processFlood(selectedYear, selectedLayer);
});

layerSelector.onChange(function(value) {
  var selectedYear = Math.round(yearSlider.getValue());
  processFlood(selectedYear, value);
});

// Initialize the map with the first year and default layer
processFlood(2015, 'Permanent Water');

// Add legend
function addLegend() {
  var legend = ui.Panel({
    style: { position: 'bottom-left', padding: '8px 15px' }
  });

  legend.add(ui.Label({
    value: 'Legend',
    style: { fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0', padding: '0' }
  }));

  function makeRow(color, name) {
    var colorBox = ui.Label({
      style: { backgroundColor: color, padding: '8px', margin: '0 0 4px 0' }
    });
    var description = ui.Label({ value: name, style: { margin: '0 0 4px 6px' } });

    return ui.Panel({ widgets: [colorBox, description], layout: ui.Panel.Layout.Flow('horizontal') });
  }

  legend.add(makeRow('red', 'Monsoon Flood'));
  legend.add(makeRow('blue', 'Permanent Water'));
  legend.add(makeRow('cyan', 'NDWI Water'));
  legend.add(makeRow('green', 'MNDWI Water'));
  legend.add(makeRow('yellow', 'Sentinel VV'));

  Map.add(legend);
}

addLegend();

// Auto-move slider
var currentIndex = 0;
var yearList = years.getInfo();

function autoMoveSlider() {
  yearSlider.setValue(yearList[currentIndex]);
  currentIndex = (currentIndex + 1) % yearList.length;
}

var autoMoveInterval = 10000; // 10-second interval
ui.util.setInterval(autoMoveSlider, autoMoveInterval);