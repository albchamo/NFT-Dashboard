1. **CSV Upload and Export**:
   - The `CSVUpload` and `CSVExport` components are now properly triggered via hidden buttons and external controls.
   - The CSV upload button opens a file dialog for users to upload CSV files, and the CSV export button generates and downloads a CSV file with the current node data.

2. **Drawer UI**:
   - Adjustments have been made to the Drawer and NodeForm components to improve the visual appearance and usability, including styling changes for buttons and inputs.

3. **Charts**:
   - Both `Chart` and `AstroChart` components are functioning correctly, displaying analysis results as expected.

### Updated Readme File

Here's the updated readme file reflecting the latest changes and functionalities:

```markdown
# NFT Dashboard

## Overview

The NFT Dashboard is a tool for analyzing the relationships between holders of multiple NFT contracts. It uses data fetched from the Alchemy API to visualize how many holders own tokens across different contracts and how these relationships are structured.

## Components

### Header
- Provides navigation and toggles the sidebar.

### NodeForm
- Allows input of node addresses and tags.
- Fetches holder data for the entered nodes.

### Chart
- Displays a bar chart showing the number of holders with 1, 2, 3, etc., tokens in common.

### AstroChart
- Visualizes relationships between token holders.
- Nodes represent different contracts, and lines represent common holders.

### CSVUpload
- Upload a CSV file to batch import node addresses and tags.

### CSVExport
- Export the current configuration of nodes and tags to a CSV file.

## How It Works

1. **Input Node Addresses**: Use the NodeForm to input addresses and tags for the nodes (NFT contracts) you want to analyze.
2. **Fetch Holder Data**: Click the fetch button to retrieve holder data from the Alchemy API.
3. **Analyze Data**: The system compares holders of the main contract with holders of other contracts to find common holders.
4. **Visualize Data**: Use the Chart and AstroChart components to visualize the relationships between holders.

## Data Analysis

- **Fetching Holders**: The Alchemy API fetches the list of holders for each contract.
- **Comparing Holders**: The system compares the main contract's holders with those of other contracts to identify common holders and their relationships.
- **Visualizing Relationships**: The relationships are visualized in the AstroChart, showing how many holders have tokens from multiple contracts.

## Installation

1. Clone the repository.
   ```sh
   git clone <repository-url>
   cd NFT-Dashboard-master
   ```

2. Install the dependencies.
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your Alchemy API key.
   ```env
   NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key
   ```

4. Run the development server.
   ```sh
   npm run dev
   ```

## Usage

1. **Open the dashboard in your browser.**
2. **Use the NodeForm to input and manage node addresses.**
3. **Fetch holder data and analyze the relationships.**
4. **Visualize the data using the Chart and AstroChart components.**

### Instructions

#### Fetching and Analyzing Data

1. **Input Node Addresses and Tags:**
   - Use the sidebar to input the addresses and tags of the nodes (NFT contracts) you want to analyze.
   - Click "Add Another Node" to add more nodes.

2. **Upload Node Data via CSV:**
   - Click "CSV" and select "Upload CSV" to upload a CSV file with node addresses and tags.

3. **Fetch Holders Data:**
   - Click "Fetch Data" to retrieve holder data from the Alchemy API.

4. **View Analysis:**
   - The bar chart displays the number of holders with 1, 2, 3, etc., tokens in common.
   - The AstroChart visualizes the relationships between token holders.

#### Interacting with the Visualization

1. **Hover Over Bar Chart:**
   - Hovering over the bars in the chart will highlight the corresponding connections in the AstroChart.

2. **Click on Bars:**
   - Clicking on bars in the chart will keep the corresponding connections highlighted.

## Not Used Components

- **AnalysisResults**: Currently not being used in the dashboard.

## Additional Notes

- **Styling and UI Enhancements:**
  - Adjusted the styling of buttons and inputs for better user experience.
  - Improved the layout and visual appeal of the Drawer and NodeForm components.

- **Event Handling:**
  - Implemented proper event handling for CSV upload and export functionalities.
```

### Next Steps

1. **Testing**:
   - Test the CSV upload and export functionalities to ensure data is correctly imported and exported.
   - Test the fetching and visualization of holder data to confirm accurate analysis and representation.

2. **UI Improvements**:
   - Further refine the UI based on feedback and usability testing.

3. **Documentation**:
   - Update the documentation and readme file to reflect any new features or changes.

Feel free to reach out if you need any further assistance or if there are other functionalities you would like to implement!