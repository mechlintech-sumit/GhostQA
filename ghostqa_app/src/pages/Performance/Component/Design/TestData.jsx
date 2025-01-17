import {
  Box,
  Grid,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { StyledTypography } from "./style";
import { Button, Divider } from "@mui/material";
import { header, headerForm } from "../../../../utils/authheader";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

import { toast } from "react-toastify";
import { Delete, Edit } from "@material-ui/icons";
import { getBaseUrl } from "../../../../utils/configService";
import { useDispatch, useSelector } from "react-redux";
import {
  GetTestData,
  deleteTestData,
  submitTestData,
} from "../../../../redux/actions/testDataAction";
import DeleteModal from "../../Comman/DeleteModal";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "api";

export default function DataEntryPanel() {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDelModal, setopenDelModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [expandedAccord, setExpandedAccord] = useState("");
  const { scenarioId } = useSelector((state) => state.performance);
  const { testDataList, testLoading, testError } = useSelector(
    (state) => state.testData
  );

  useEffect(() => {
    dispatch(GetTestData(scenarioId));
  }, [scenarioId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
    }
    const formData = new FormData();
    formData.append("Id", 0);
    formData.append("PerformanceFileId", scenarioId);
    formData.append("file", selectedFile);
    // submitTestData(formData);
    dispatch(submitTestData(formData));
    setSelectedFile(null);
  };

  const handleDelete = async (testId) => {
    setopenDelModal(false);
    dispatch(deleteTestData(testId));
  };
  const handleDelBtn = (test, event) => {
    event.stopPropagation();
    setDeleteItem({ name: test.Name, id: test.Id });
    setopenDelModal(true);
  };
  const handleExpandAccord = (panel) => (e, isExpanded) => {
    setExpandedAccord(isExpanded ? panel : "");
  };

  const renderJsonData = (jsonData) => {
    const dataObj = JSON.parse(jsonData);
    const tableData = transformArrayToObject(dataObj);
    let columns = Object.keys(tableData);
    return columns.map((key, index) => {
      const rows = tableData[key];
      const maxLength = 3; // Set the maximum number of items to display

      // Create a string with the displayed items and the remaining count
      const displayString = rows.slice(0, maxLength).join(", ");
      const remainingCount = rows.length - maxLength;
      const remainingText = remainingCount > 0 ? `...+${remainingCount}` : "";

      return (
          <TableRow>
            <TableCell>{`\${${key}}`}</TableCell>
            <TableCell>-</TableCell>
            <Tooltip title={rows.join(",")} placement="top-end" arrow>
              <TableCell>
                {displayString}
                {remainingText}{" "}
              </TableCell>
            </Tooltip>
          </TableRow>
      );
    });
  };

  const transformArrayToObject = (dataArray) => {
    // Initialize an object to store the transformed data
    const transformedObject = {};
    // Iterate over the array of objects
    dataArray?.forEach((item) => {
      // Iterate over each key-value pair in the current object
      Object.entries(item).forEach(([key, value]) => {
        // Check if the key exists in the transformed object
        if (!(key in transformedObject)) {
          // If the key doesn't exist, initialize it as an empty array
          transformedObject[key] = [];
        }
        // Push the value to the array corresponding to the key
        transformedObject[key].push(value);
      });
    });

    return transformedObject;
    // console.log('new obj',transformedObject)
  };
  return (
    <Box
      style={{
        border: "solid 2px #DADADA",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      <DeleteModal
        open={openDelModal}
        onClose={() => setopenDelModal(false)}
        deleteItem={deleteItem}
        handleDelete={handleDelete}
      />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {testLoading ? (
              // Render loading indicator
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <CircularProgress
                  style={{ color: "rgb(101, 77, 247)" }}
                  size={25}
                />
              </Grid>
            ) : testDataList?.length === 0 ? (
              // Render message when no test data is available
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Typography>No test data available</Typography>
              </Grid>
            ) : (
              testDataList &&
              testDataList?.map((test, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        style={{
                          fontSize: "12px",
                          color: "rgba(196, 196, 196, 0.8)",
                        }}
                      >
                        file name
                      </Typography>
                      <Box
                        style={{
                          padding: "15px 10px ",
                          border: "1px solid #DADADA",
                          width: "100%",
                        }}
                      >
                        <StyledTypography>{test.Name}</StyledTypography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        style={{
                          fontSize: "12px",
                          color: "rgba(196, 196, 196, 0.8)",
                        }}
                      >
                        uploaded file
                      </Typography>
                      <Accordion
                        expanded={expandedAccord === test}
                        onChange={handleExpandAccord(test)}
                        key={index}
                        sx={{
                          boxShadow: "none",
                          border: "1px solid rgb(217, 217, 217)",
                          marginBottom: "3px",
                          // '&:hover': {
                          //   border: "2px solid rgb(101, 77, 247)",
                          // },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <StyledTypography>Variables</StyledTypography>
                            <Box>
                              <Delete
                                style={{ color: "red" }}
                                onClick={(e) => handleDelBtn(test, e)}
                              />
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: "0" }}>
                          <Divider />
                          <TableContainer
                          // style={{
                          //   border: "solid 2px #DADADA",
                          //   borderRadius: "5px",
                          // }}
                          style={{maxHeight:'200px'}}
                          >
                            <Table aria-label="simple table">
                              <TableBody>
                              {renderJsonData(test?.JsonData)}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </React.Fragment>
                );
              })
            )}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography
            style={{ fontSize: "12px", color: "rgba(196, 196, 196, 0.8)" }}
          >
            upload a file
          </Typography>
          <Box
            style={{
              width: "100%",
              border: "1px solid #DADADA",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <input
                accept=".csv"
                style={{ display: "none" }}
                id="file-input"
                type="file"
                onChange={handleFileChange}
              />
              <StyledTypography sx={{ paddingLeft: "15px" }}>
                {selectedFile ? `${selectedFile.name}` : "Add a File"}
              </StyledTypography>
            </Box>
            {selectedFile ? (
              <Button
                style={{
                  fontSize: 14,
                  backgroundColor: "rgb(101, 77, 247)",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
                onClick={handleUpload}
              >
                Save
              </Button>
            ) : (
              <label
                htmlFor="file-input"
                variant="contained"
                color="primary"
                component="span"
                style={{
                  borderRadius: "3px",
                  padding: "5px 8px",
                  fontSize: 25,
                  backgroundColor: "rgb(101, 77, 247)",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                +
              </label>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}