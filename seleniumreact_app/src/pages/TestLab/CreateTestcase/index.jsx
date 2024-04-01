import { Box, Button, Grid, Paper, Checkbox, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import {
  StyledFormControl,
  StyledOutlinedInput,
  StyledTypography,
} from "./styleTestCase";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { userActionsOptions, selectorTypeList } from "../DropDownOptions";
import { AddTestCaseDetails } from "./Api";
import { useStyles } from "../styles";
import { toast } from "react-toastify";
import RenderActionFields from "./RenderActionFields";

export default function CreateTestCase() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { rootId } = useParams();
  const [testCaseTitle, settestCaseTitle] = useState("");
  const [startUrl, setstartUrl] = useState("");
  const [steps, setSteps] = useState([
    {
      action: null,
      stepDescription: "",
      isOptional: false,
      selectorType: "",
      selectorValue: "",
      sendKeyInput: "",
      scrollPixel: "",
      url: "",
      fileName: null,
      elementValue: "",
      cssValue:"",
      cssProperty:""
    },
  ]);
  const [Errors, setErrors] = useState([]);
  const [testCaseTitleError, settestCaseTitleError] = useState("");
  const [startUrlError, setstartUrlError] = useState("");
  const goBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    console.log("final steps,", steps);
    let payload = {
      testCaseName: testCaseTitle,
      rootId: rootId,
      startUrl: startUrl,
    };
    let errors = steps?.map((step) => {
      let additionalErrors = {};
      let stepType = step?.action;
      additionalErrors.selectorTypeError = !step.selectorType;
      additionalErrors.selectorValueError = !step.selectorValue;
      switch (stepType) {
        case "type":
          additionalErrors.sendKeyInputError = !step.sendKeyInput;
          break;
        case "scroll_to_window":
          additionalErrors.scrollPixelError = !step.scrollPixel;
          break;
        case "go_to_url":
          additionalErrors.urlError = !step.url;
          break;
        case "upload_file":
          additionalErrors.fileNameError = !step.fileName;
          break;
        case "element_has_value":
          additionalErrors.elementValueError = !step.elementValue;
          break;
          case "element_has_css_property_with_value":
          additionalErrors.cssPropertyError = !step.cssProperty;
          additionalErrors.cssValueError = !step.cssValue;
          break;
        default:
          break;
      }
      if (selectorNoOptionList.includes(stepType)) {
        additionalErrors.selectorTypeError = false;
        additionalErrors.selectorValueError = false;
      }
      return {
        typeError: !step?.action,
        descriptionError: !step?.stepDescription,
        ...additionalErrors,
      };
    });
    setErrors(errors);
    let titleError = "";
    let urlError = "";
    if (!testCaseTitle.trim()) {
      settestCaseTitleError("test case title required");
      titleError = "test case title required";
    } else {
      settestCaseTitleError("");
    }
    if (!startUrl.trim()) {
      setstartUrlError("url is  required");
      urlError = "url is  required";
    } else {
      setstartUrlError("");
    }

    const hasError = errors.some((error) =>
      Object.values(error).some((value) => value)
    );

    if (!hasError && !titleError && !urlError) {
      AddTestCaseDetails(payload, steps, goBack);
      console.log("steps ", steps);
    } else {
      toast.error("Some field are empty");
    }
  };

  const handleAddMoreSteps = () => {
    setSteps([
      ...steps,
      {
        type: null,
        stepDescription: "",
        isOptional: false,
        selectorType: "",
        selectorValue: "",
        sendKeyInput: "",
        scrollPixel: "",
        url: "",
      },
    ]);
  };

  const handleRemoveStep = (curr) => {
    const updatedSteps = steps.filter((step) => step !== curr);
    setSteps(updatedSteps);
  };

  const handleInputChange = (inputValue, index, inputType) => {
    let updatedSteps = steps.map((step, i) => {
      switch (inputType) {
        case "action":
          return i === index ? { ...step, action: inputValue?.value } : step;
        case "stepDescription":
          return i === index
            ? { ...step, stepDescription: inputValue?.target.value }
            : step;
        case "selectorType":
          return i === index
            ? { ...step, selectorType: inputValue?.value }
            : step;
        case "selectorValue":
          return i === index
            ? { ...step, selectorValue: inputValue.target.value }
            : step;
        case "isOptional":
          return i === index
            ? { ...step, isOptional: inputValue.target.checked }
            : step;
        case "sendKeyInput":
          return i === index
            ? { ...step, sendKeyInput: inputValue.target.value }
            : step;
        case "scrollPixel":
          return i === index
            ? { ...step, scrollPixel: inputValue.target.value }
            : step;
        case "url":
          return i === index ? { ...step, url: inputValue.target.value } : step;
        case "elementValue":
          return i === index
            ? { ...step, elementValue: inputValue.target.value }
            : step;
        case "fileName":
          return i === index
            ? { ...step, fileName: inputValue.target.files[0] }
            : step;

        case "cssProperty":
          return i === index
            ? { ...step, cssProperty: inputValue.target.value }
            : step;
        case "cssValue":
          return i === index
            ? { ...step, cssValue: inputValue.target.value }
            : step;
        default:
          return step;
      }
    });
    setSteps(updatedSteps);
  };

  const findLabelByValue = (value) => {
    for (const pair of userActionsOptions) {
      if (pair.value === value) {
        return pair.label;
      }
    }
    return "not found"; // Return null if the value is not found
  };
  const selectorNoOptionList = [
    "scroll_to_window",
    "go_to_url",
    "go_back",
    "go_forward",
    "refresh_page",
  ];
  const listOfSteps = steps.map((step, index) => (
    <li key={index} style={{ listStyle: "none", margin: "10px 0" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "70%",
          "@media (max-width: 960px)": {
            width: "100%",
          },
        }}
      >
        <StyledTypography>Step {index + 1}</StyledTypography>
        <DeleteIcon
          onClick={() => handleRemoveStep(step)}
          sx={{ cursor: "pointer", color: "red" }}
        />
      </Box>
      <Paper
        elevation={1}
        sx={{
          width: "70%",
          padding: "10px",
          "@media (max-width: 960px)": {
            width: "100%",
          },
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <StyledFormControl>
              <StyledOutlinedInput
                type="text"
                placeholder="Step Description"
                value={step?.stepDescription}
                error={Errors[index]?.descriptionError}
                onChange={(event) => {
                  handleInputChange(event, index, "stepDescription");
                }}
              />
            </StyledFormControl>
          </Grid>
          <Grid item xs={6}>
            <Select
              isClearable={true}
              placeholder="Actions"
              options={userActionsOptions}
              value={
                step
                  ? step.action
                    ? {
                        label: findLabelByValue(step.action),
                        value: step.action,
                      }
                    : null
                  : null
              }
              onChange={(act) => handleInputChange(act, index, "action")}
              styles={{
                container: (provided) => ({
                  ...provided,
                  backgroundColor: "rgb(242, 242, 242)",
                  width: "100%",
                }),
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "rgb(242, 242, 242)",
                  "&:hover": {
                    borderColor: "#654DF7",
                  },
                  borderColor: Errors[index]?.typeError
                    ? "red"
                    : state.isFocused
                    ? "#654DF7"
                    : "rgb(242, 242, 242)",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#654DF7" : "transparent",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  cursor: "pointer",
                  ":hover": {
                    color: "#654DF7",
                  },
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  cursor: "pointer",
                  ":hover": {
                    color: "#654DF7",
                  },
                }),
              }}
              menuPosition={"fixed"}
            />
          </Grid>
          {/* bellow compenent will render field according to type */}
          <RenderActionFields
            action={step?.action}
            step={step}
            index={index}
            Errors={Errors}
            setSteps={setSteps}
            handleInputChange={handleInputChange}
            isEditable={true}
          />
          {step?.action && !selectorNoOptionList.includes(step.action) && (
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Select
                    isClearable={true}
                    placeholder="Selector type"
                    options={selectorTypeList}
                    value={
                      step
                        ? step.selectorType
                          ? {
                              label: step.selectorType,
                              value: step.selectorType,
                            }
                          : null
                        : null
                    }
                    onChange={(act) =>
                      handleInputChange(act, index, "selectorType")
                    }
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        backgroundColor: "rgb(242, 242, 242)",
                        width: "100%",
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "rgb(242, 242, 242)",
                        "&:hover": {
                          borderColor: "#654DF7",
                        },
                        borderColor: Errors[index]?.selectorTypeError
                          ? "red"
                          : state.isFocused
                          ? "#654DF7"
                          : "rgb(242, 242, 242)",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? "#654DF7"
                          : "transparent",
                      }),
                      clearIndicator: (provided) => ({
                        ...provided,
                        cursor: "pointer",
                        ":hover": {
                          color: "#654DF7",
                        },
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        cursor: "pointer",
                        ":hover": {
                          color: "#654DF7",
                        },
                      }),
                    }}
                    menuPosition={"fixed"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StyledFormControl>
                    <StyledOutlinedInput
                      type="text"
                      placeholder="Selector value"
                      error={Errors[index]?.selectorValueError}
                      value={step?.selectorValue}
                      onChange={(event) => {
                        handleInputChange(event, index, "selectorValue");
                      }}
                    />
                  </StyledFormControl>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Checkbox
                size="small"
                sx={{ "&.Mui-checked": { color: "#654DF7" } }}
                checked={step?.isOptional}
                onChange={(e) => {
                  handleInputChange(e, index, "isOptional");
                }}
              />
              <Typography fontSize="10px" fontFamily="Lexend Deca">
                Make this step optional (Continue on failure)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </li>
  ));
  return (
    <div>
      <Grid container mt={3} justifyContent="center">
        <Paper sx={{ width: "100%", p: 2 }}>
          <Grid item xs={12} display="flex" justifyContent="end">
            <Grid container justifyContent="space-between">
              <Grid item sx={6}>
                <StyledTypography sx={{ fontSize: "20px", fontWeight: "400" }}>
                  Add New Testcase
                </StyledTypography>
              </Grid>
              <Grid item sx={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(-1)}
                  sx={{
                    backgroundColor: "rgb(108, 117, 125)",
                    color: "#f1f1f1",
                    "&:hover": {
                      backgroundColor: "rgb(101, 77, 247)",
                    },
                    marginRight: "10px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  sx={{
                    backgroundColor: "rgb(101, 77, 247)",
                    "&:hover": {
                      backgroundColor: "rgb(101, 77, 247) !important",
                      borderColor: "#654DF7",
                      color: "#fff",
                      "&:before": {
                        backgroundColor: "rgb(101, 77, 247) !important",
                        color: "#fff",
                      },
                    },
                    color: "#fff",
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} display="flex">
            <Grid container spacing={1} mb={1} mt={1}>
              <Grid item xs={12} md={4} display="flex" alignItems="center">
                <StyledTypography mr={1} minWidth={"105px"}>
                  Testcase Title :
                </StyledTypography>
                <StyledFormControl>
                  <StyledOutlinedInput
                    id="outlined-adornment-name"
                    type="text"
                    placeholder="Enter title name"
                    value={testCaseTitle}
                    error={testCaseTitleError ? true : false}
                    onChange={(e) => settestCaseTitle(e.target.value)}
                  />
                </StyledFormControl>
              </Grid>
              <Grid item xs={12} md={4} display="flex" alignItems="center">
                <StyledTypography minWidth="80px">Start Url :</StyledTypography>
                <StyledFormControl>
                  <StyledOutlinedInput
                    id="outlined-adornment-name"
                    type="text"
                    placeholder="Enter URL"
                    value={startUrl}
                    error={startUrlError ? true : false}
                    onChange={(e) => setstartUrl(e.target.value)}
                  />
                </StyledFormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <Box sx={{ border: "1px solid rgb(219, 217, 217)" }}>
              <ul>
                {/* <li style={{ listStyle: "none", margin: "10px 0" }}>
                  <StyledTypography>step 1</StyledTypography>
                  <Paper
                    elevation={1}
                    sx={{
                      width: "70%",
                      padding: "10px",
                      "@media (max-width: 960px)": {
                        width: "100%",
                      },
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Select
                          isClearable={true}
                          placeholder="Navigate to"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              backgroundColor: "rgb(242, 242, 242)",
                              width: "100%",
                            }),
                            control: (provided, state) => ({
                              ...provided,
                              backgroundColor: "rgb(242, 242, 242)",
                              "&:hover": {
                                borderColor: "#654DF7",
                              },
                              borderColor: false
                                ? "red"
                                : state.isFocused
                                ? "#654DF7"
                                : "rgb(242, 242, 242)",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected
                                ? "#654DF7"
                                : "transparent",
                            }),
                            clearIndicator: (provided) => ({
                              ...provided,
                              cursor: "pointer",
                              ":hover": {
                                color: "#654DF7",
                              },
                            }),
                            dropdownIndicator: (provided) => ({
                              ...provided,
                              cursor: "pointer",
                              ":hover": {
                                color: "#654DF7",
                              },
                            }),
                          }}
                          menuPosition={"fixed"}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledFormControl>
                          <StyledOutlinedInput
                            type="text"
                            placeholder="www.google.com"
                          />
                        </StyledFormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </li> */}
                {/* step 2  starts from here */}
                {listOfSteps}
                <Button
                  onClick={handleAddMoreSteps}
                  sx={{
                    backgroundColor: "rgb(101, 77, 247)",
                    "&:hover": {
                      backgroundColor: "rgb(101, 77, 247) !important",
                      borderColor: "#654DF7",
                      color: "#fff",
                      "&:before": {
                        backgroundColor: "rgb(101, 77, 247) !important",
                        color: "#fff",
                      },
                    },
                    color: "#fff",
                  }}
                >
                  + Add More Steps
                </Button>
              </ul>
            </Box>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}
