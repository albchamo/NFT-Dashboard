### README

## NFT Dashboard

### Overview
The NFT Dashboard is a tool for analyzing the relationships between holders of multiple NFT contracts. It uses data fetched from the Alchemy API to visualize how many holders own tokens across different contracts and how these relationships are structured.

### Key Features
- **Node Form**: Allows input of node addresses and tags, and fetches holder data for the entered nodes.
- **Chart**: Displays a bar chart showing the number of holders with tokens in common.
- **AstroChart**: Visualizes relationships between token holders with a minimum size to fit the screen correctly.
- **CSV Upload/Export**: Upload a CSV file to batch import node addresses and tags, and export the current configuration to a CSV file.

### Latest Changes

#### 1. AstroChart Component
- **Minimum Size**: The `AstroChart` component now has a minimum size of 960x600 to prevent horizontal overflow.
- **SVG Element Styling**: Ensured the SVG element within `AstroChart` adheres to the minimum size.
  
#### 2. Dashboard Layout
- **Adjusted Widths**: The `Chart` component now occupies 25% of the width, and the `AstroChart` component occupies 75%, ensuring they fit within the screen without horizontal scrolling.
  
#### 3. Drawer Component
- **White Border**: Added a white border to the sides and bottom of the drawer.
  ```javascript
  <Drawer
    anchor="top"
    open={drawerOpen}
    onClose={toggleDrawer}
    PaperProps={{
      style: {
        width: '70%',
        margin: '0 auto',
        backgroundColor: '#000000',
        color: '#ffffff',
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        borderRadius: '8px',
        borderLeft: '2px solid #fff',
        borderRight: '2px solid #fff',
        borderBottom: '2px solid #fff'
      },
    }}
  >
  ```

#### 4. Typography Padding
- **Added Padding**: Added padding on top, bottom, left, and right for the Typography component inside the drawer.
  ```javascript
  <Typography
    variant="body1"
    gutterBottom
    style={{ paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px' }}
  >
    Paste the Contract Address and add a Tag for identification. You can also upload a CSV. Remember to export and store your contract lists locally, we will not save any data.
  </Typography>
  ```

#### 5. TextField Border Width
- **Adjusted Border Width**: Modified the border width of the `TextField` components for Node Contract Address and Tag input fields.
  ```javascript
  <TextField
    label={`Node ${index + 1} Contract Address`}
    value={node.address}
    onChange={(e) => handleNodeChange(index, 'address', e.target.value)}
    margin="normal"
    style={{ flex: 2 }}
    InputLabelProps={{ style: { color: '#ffffff' } }}
    InputProps={{
      style: { color: '#ffffff' },
      sx: {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ffffff',
          borderWidth: '2px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ffffff',
          borderWidth: '2px',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ffffff',
          borderWidth: '2px',
        },
      },
    }}
  />
  ```

#### 6. CSV Export Component
- **Updated CSV Export**: Ensured the CSV export functionality works correctly by wrapping the `Button` with `CSVLink`.
  ```javascript
  <CSVLink data={data} filename={filename} style={{ color: 'white', textDecoration: 'none' }}>
    <Button variant="contained" color="primary" id="csv-export-button">
      Export CSV
    </Button>
  </CSVLink>
  ```

### Instructions

#### Fetching and Analyzing Data
1. **Input Node Addresses and Tags**:
   - Use the sidebar to input the addresses and tags of the nodes (NFT contracts) you want to analyze.
   - Click "Add Another Node" to add more nodes.
2. **Upload Node Data via CSV**:
   - Click "CSV" and select "Upload CSV" to upload a CSV file with node addresses and tags.
3. **Fetch Holders Data**:
   - Click "Fetch Data" to retrieve holder data from the Alchemy API.
4. **View Analysis**:
   - The bar chart displays the number of holders with 1, 2, 3, etc., tokens in common.
   - The AstroChart visualizes the relationships between token holders.

#### Interacting with the Visualization
1. **Hover Over Bar Chart**:
   - Hovering over the bars in the chart will highlight the corresponding connections in the AstroChart.
2. **Click on Bars**:
   - Clicking on bars in the chart will keep the corresponding connections highlighted.

### Additional Notes
- **Styling and UI Enhancements**: Adjusted the styling of buttons and inputs for a better user experience and improved the layout and visual appeal of the components.
- **Event Handling**: Implemented proper event handling for CSV upload and export functionalities.

Feel free to reach out if you need any further assistance or if there are other functionalities you would like to implement!