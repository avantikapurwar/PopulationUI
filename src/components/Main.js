import ScatterPlot from "../charts/ScatterPlot";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config";


const Main = () => {

    const [yearList, setYearList] = useState([]);
    const [year,setYear] = useState(2021);
    const [filteredchartData,setFilteredChartData] = useState([]);
    const [chartData,setChartData] = useState([]);

    //Set the Year
    const handleChange = (e)=>{
        setYear(Number(e));     
    }

    //Get the Population Data
    const getPopulationData = () => {
       
        axios.get('http://localhost:3003/api/csv').then(d=>{

            setChartData(d.data);   
            setFilteredChartData(d.data);
        })
    }

    //Call the population api
    useEffect(()=>{
        getPopulationData();
       
    },[])

    // Filter all te data based on the year selected
    useEffect(()=>{
        const filterData = chartData.filter(d=>d.Year == year);
        setFilteredChartData(filterData);
       
    },[year])

    // Find the unique year list for the dropdown 
    useEffect(()=>{
        const filterYear = chartData.map(d => d.Year);
        const uniqueYear = new Set(filterYear);  
        setYearList(Array.from(uniqueYear));
        const filterData = chartData.filter(d=> d.Year== year);
        setFilteredChartData(filterData);
    },[chartData])

    return <>

    
        <div className="menu-container">
        <FormControl sx={{ m: 1, width: 300 }} >
  <InputLabel id="demo-simple-select-label">Year</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={year}
    label="Year"
    onChange={(e)=> handleChange(e.target.value)}
  >
     {yearList.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))} 
    

  </Select>
</FormControl>
</div>

<div>
<h4>Population Growth vs Density Correlation</h4> <br/><br/>
        <ScatterPlot chartData= {filteredchartData} year={year}/>
        </div>
    
    </>
}

export default Main;