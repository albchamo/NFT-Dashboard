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
Navigate to the project directory.
sh
Copy code
cd NFT-Dashboard-master
Install the dependencies.
sh
Copy code
npm install
Create a .env file in the root directory and add your Alchemy API key.
makefile
Copy code
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key
Run the development server.
sh
Copy code
npm run dev


Usage
Open the dashboard in your browser.
Use the NodeForm to input and manage node addresses.
Fetch holder data and analyze the relationships.
Visualize the data using the Chart and AstroChart components.
Instructions
Fetching and Analyzing Data
Input Node Addresses and Tags:
Use the sidebar to input the addresses and tags of the nodes (NFT contracts) you want to analyze.
Click "Add Another Node" to add more nodes.
Upload Node Data via CSV:
Click "Upload CSV" to upload a CSV file with node addresses and tags.
Fetch Holders Data:
Click "Fetch Holders" to retrieve holder data from the Alchemy API.
View Analysis:
The bar chart displays the number of holders with 1, 2, 3, etc., tokens in common.
The AstroChart visualizes the relationships between token holders.
Interacting with the Visualization
Hover Over Bar Chart:
Hovering over the bars in the chart will highlight the corresponding connections in the AstroChart.
Click on Bars:
Clicking on bars in the chart will keep the corresponding connections highlighted.
Not Used Components
AnalysisResults: Currently not being used in the dashboard.