# Dancing-River

Here’s a detailed `README.md` file to accompany your Earth Engine script, which you can place in the GitHub repository:

```markdown
# Dancing River: Dynamic Water Detection Using Sentinel Data

This project provides a dynamic visualization tool for detecting and monitoring water bodies and flood patterns using Sentinel-1 and Sentinel-2 data. The tool leverages Google Earth Engine (GEE) to process and display data interactively for any year between 2015 and 2024.

## Features

- **Dynamic Water Detection**: Identify permanent water bodies, monsoon flood extents, and seasonal water patterns.
- **Interactive Controls**: Select year and visualization layer using a user-friendly UI.
- **Multi-Sensor Analysis**: Combines radar (Sentinel-1) and optical (Sentinel-2) data to enhance water detection accuracy.
- **NDWI and MNDWI**: Utilizes Normalized Difference Water Index (NDWI) and Modified NDWI for precise water detection.
- **Temporal Slider**: Auto-updating slider to visualize changes in water patterns over time.
- **Custom Legends**: Intuitive color-coded legends for easy interpretation of results.

## Layers

- **Permanent Water**: Stable water bodies based on the JRC Global Surface Water dataset.
- **Monsoon Flood**: Seasonal flood patterns during monsoon months (June–September).
- **NDWI Water**: Water detection using NDWI.
- **MNDWI Water**: Water detection using MNDWI.
- **Sentinel VV**: Radar backscatter intensity from Sentinel-1 for water surface characterization.

## Getting Started

### Prerequisites

- A Google Earth Engine account. [Sign up here](https://earthengine.google.com/).
- Basic familiarity with JavaScript and Earth Engine.

### Deployment

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/BhojRajBist/Dancing-River.git
   cd Dancing-River 
   ```

2. **Copy the Code**:
   Open the `dancing_river.js` file and paste the contents into the Earth Engine Code Editor: [Google Earth Engine Code Editor](https://code.earthengine.google.com/).

3. **Define Your Region of Interest**:
   Modify the `region` variable in the script to specify your area of interest:
   ```javascript
   var region = ee.Geometry.Rectangle([85.0, 26.5, 88.0, 28.5]);
   ```

4. **Run the Script**:
   Press the "Run" button in the Earth Engine Code Editor to start the tool.

## Visualization

- Use the **Year Slider** to choose the year of interest.
- Use the **Layer Selector** to choose the data layer to visualize:
  - Permanent Water
  - Monsoon Flood
  - NDWI Water
  - MNDWI Water
  - Sentinel VV

## Auto-Slider Feature

- The auto-slider feature animates the year selection, showing temporal changes in water bodies.

### Customizing Auto-Slider Interval

The auto-slider updates every 10 seconds by default. To customize the interval, modify the `autoMoveInterval` variable in the script:
```javascript
var autoMoveInterval = 10000; // Interval in milliseconds (10 seconds)
```

## Legend

The tool includes a legend in the bottom-left corner for easy interpretation of map layers:
- **Red**: Monsoon Flood
- **Blue**: Permanent Water
- **Cyan**: NDWI Water
- **Green**: MNDWI Water
- **Yellow**: Sentinel VV

## Acknowledgments

- **Sentinel-1**: Provides radar data for water surface detection.
- **Sentinel-2**: Provides optical data for NDWI and MNDWI calculations.
- **JRC Global Surface Water**: For permanent water body data.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to the project by submitting pull requests or reporting issues.
```
