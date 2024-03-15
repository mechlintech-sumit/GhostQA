import React, { useState, useRef, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./../styles";

export default function LoadPanel({ testCase }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [graphData,setGraphData]= useState([])
  const [xaxisCategories,setxaxisCategories]= useState([])
  const [graphState, setGraphState] = useState({
    options: {
      chart: {
        type: "line",
      },
      stroke: {
        curve: "stepline",
      },
    
    xaxis: {
        categories: [1,2,3,4,5,6,7,8],
        title: {
          text: "Duration (min)",
        },
      },
      yaxis: {
        title: {
          text: "Users",
        },
      },
    },
    series: [
      {
        data: graphData,
      },
    ],
  });
  const [totalusers, settotalusers] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rampUpTime, setRampUpTime] = useState(0)
  const [rampUpSteps, setRampUpSteps] = useState(0)
  const testNamefield = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [designTabsActive, setDesignTabsActive] = useState(false);

  useEffect(() => {
    const userPerStep = totalusers / rampUpSteps;
    const stepsUntilRampUp = Math.floor(totalusers/userPerStep);
    let data = [];
  
    // Generate data for the slope until rampUpTime
    for (let i = 0; i <= stepsUntilRampUp; i++) {
      data.push(i * userPerStep);
    }
    console.log(data)
    // Add a straight line after rampUpTime
    for (let i = 0; i < stepsUntilRampUp; i++) {
      data.push(totalusers);
    }
    let xCatagory = [0]
    for(let i = 0; i< rampUpSteps-1; i++){
        debugger
        xCatagory.push(1/(5-i))
    }
    console.log(xCatagory)
    setxaxisCategories(['0',...xCatagory,rampUpTime,duration])
    setGraphData(data);
  }, [totalusers, rampUpSteps, duration, rampUpTime]);
  
  useEffect(() => {
    // Update the series data whenever graphData changes
    setGraphState((prevState) => ({
      ...prevState,
      options: {
          ...prevState.options,
          xaxis: {
              ...prevState.options.xaxis,
              categories: xaxisCategories,
            },
        },
        series: [{ data: graphData }],
    }));
  }, [graphData]);

  const handleActiveTabs = () => {
    setDesignTabsActive(!designTabsActive);
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const [testCaseData, setTestCaseData] = useState([
    {
      id: 1,
      name: "Test name ",
      file: "",
      fileName: "Myscript1.jmx",
    },
    {
      id: 2,
      name: "Test name ",
      file: "",
      fileName: "Myscript1.jmx",
    },
  ]);
  const [expanded, setExpanded] = useState([]);
  const handleInputData = (event, type) => {
    switch (type) {
      case "totalUsers":
        settotalusers(event.target.value)
        break;
      case "duration":
        setDuration(event.target.value)
        break;
      case "rampUpTime":
        setRampUpTime(event.target.value)
        break;
      case "rampUpSteps":
        setRampUpSteps(event.target.value)
        break;
      default:
        break;
    }
  };
  const toggleExpand = (id) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((item) => item !== id));
    } else {
      setExpanded([...expanded, id]);
    }
    handleActiveTabs();
  };
  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          border: "solid 2px #DADADA",
          borderRadius: "5px",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Total Users*</TableCell>
              <TableCell align="center">Duration(m)*</TableCell>
              <TableCell align="center">Ramp up Time (s)</TableCell>
              <TableCell align="center">Ramp up steps</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={0}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <input
                  type="number"
                  value={totalusers}
                  className={classes.inputField}
                  onChange={(event)=>handleInputData(event,'totalUsers')}
                />
              </TableCell>
              <TableCell align="left">
                <input
                  type="number"
                  value={duration}
                  className={classes.inputField}
                  onChange={(event)=>handleInputData(event,'duration')}
                />
              </TableCell>

              <TableCell align="left">
                <input
                  type="number"
                  value={rampUpTime}
                  className={classes.inputField}
                  onChange={(event)=>handleInputData(event,'rampUpTime')}
                />
              </TableCell>
              <TableCell align="left">
                <input
                  type="number"
                  value={rampUpSteps}
                  className={classes.inputField}
                  onChange={(event)=>handleInputData(event,'rampUpSteps')}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Chart
        options={graphState.options}
        series={graphState.series}
        type="area"
      />
    </>
  );
}
