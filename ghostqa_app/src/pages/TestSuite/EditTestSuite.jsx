import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  OutlinedInput,
  FormControl,
  Button,
  Typography,
  FormControlLabel,
  Grid,
  Box,
  Card,
  CircularProgress,
} from "@mui/material";
import useStyles, { StyledTypography } from "./styles";
import clsx from "clsx";
import Select from "react-select";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import { TestCaseTable } from "./TestCaseTable";
import SearchField from "../../comman/SearchField";
import { useDispatch } from "react-redux";
import {
  GetApplication,
  GetEnvironment,
  GetTestCases,
  AddUpdateTestSuites,
  Getsuitebyname,
  GetTestUser,
} from "../../redux/actions/seleniumAction";
import { useParams } from "react-router-dom";
import { GetTestUserList } from "../../redux/actions/settingAction";

export default function EditTestSuite() {
  const dispatch = useDispatch();

  const classes = useStyles();
  const navigate = useNavigate();
  const { suiteName } = useParams();
  const [selectedSuiteValue, setSelectedSuiteValue] = useState("custom-Suites");
  const [selectedRecepentValue, setSelectedRecepentValue] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedTestUser, setSelectedTestUser] = useState(null);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [Error, setError] = useState({
    name: "",
    application: "",
    environment: "",
    test_user: "",
    browser: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [openLoadingModal, setopenLoadingModal] = useState(false);
  const {
    applicationList,
    environementList,
    suiteToEdit,
    testCasesList,
    executingSuite,
  } = useSelector((state) => state.selenium);

  const { testUserList } = useSelector((state) => state.settings);
  const [isExecuting, setisExecuting] = useState(false);
  const [nameLengthError, setnameLengthError] = useState(false);

  useEffect(() => {
    dispatch(GetApplication());
    dispatch(GetEnvironment());
    dispatch(GetTestUserList());
    dispatch(GetTestCases());
    if (!suiteToEdit) {
      dispatch(Getsuitebyname(suiteName));
    }
    setName(suiteToEdit?.TestSuiteName);
    setSelectedApplication(() => {
      const x = applicationList?.find(
        (app) => app.ApplicationId === suiteToEdit?.Application?.ApplicationId
      );
      return x;
    });
    //work on all-user
    setSelectedRecepentValue(
      suiteToEdit?.SendEmail ? "only-for-me" : "all-users"
    );
    setSelectedEnvironment(() => {
      return environementList?.find(
        (env) => env.EnvironmentId === suiteToEdit?.Environment.EnvironmentId
      );
    });
    // setSelectedEnvironment(() => {
    //   return environementList?.find(
    //     (env) => env.EnvironmentId === suiteToEdit?.Environment.EnvironmentId
    //   );
    // });
    setSelectedTestUser(() => {
      return testUserList?.find(
        (env) => env.UserId === suiteToEdit?.TestUser?.TestUserId
      );
    });
    setDescription(suiteToEdit?.Description);
    // setSelectedRows(() => {
    //   const selectedTestCasesArray = suiteToEdit?.SelectedTestCases
    //     ? suiteToEdit.SelectedTestCases.split(",")
    //     : [];
    //   console.log("suiteToEdit", selectedTestCasesArray, testCasesList);
    //   return testCasesList.filter((test) =>
    //     selectedTestCasesArray.some(
    //       (selectedTestCase) => selectedTestCase.trim() === test.TestCaseName
    //     )
    //   );
    // });
  }, [dispatch, suiteToEdit]);

  useEffect(() => {
    if (suiteToEdit && testCasesList.length > 0) {
      setSelectedRows(() => {
        const selectedTestCasesArray = suiteToEdit.SelectedTestCases
          ? suiteToEdit.SelectedTestCases.split(",")
          : [];
        return testCasesList.filter((test) =>
          selectedTestCasesArray.some(
            (selectedTestCase) => selectedTestCase.trim() === test.TestCaseName
          )
        );
      });
    }
  }, [suiteToEdit, testCasesList]);

  const handleRadioChange = (event) => {
    setSelectedSuiteValue(event.target.value);
  };

  const handleRadioChangeRecepent = (event) => {
    setSelectedRecepentValue(event.target.value);
  };

  const handleNameChange = (e) => {
    // setName(e.target.value);
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setName(inputValue);
      setnameLengthError(false);
      setError((prev) => ({ ...prev, name: "" }));
    } else {
      setnameLengthError(true);
    }
  };
  const handleApplication = (env) => {
    const app = env
      ? {
          ApplicationId: env.ApplicationId,
          ApplicationName: env.ApplicationName,
        }
      : null;
    setSelectedApplication(app);
  };

  const getTestcaseNameOnly = () => {
    let testCaseArrName = [];
    selectedRows.map((testCase) => testCaseArrName.push(testCase.TestCaseName));
    // .join(",");
    return testCaseArrName;
  };

  const handleLoading = (status) => {
    // setopenLoadingModal(false)
    setisExecuting(false);
    if (status === "pass") navigate("/");
  };
  const handleSubmit = (action) => {
    const testCaseNames = getTestcaseNameOnly();
    let payload = {
      TestSuiteName: name,
      Description: description,
      TestSuiteId: suiteToEdit?.TestSuiteId,
      TestSuiteType: selectedSuiteValue,
      TestUserId: selectedTestUser.UserId,
      ApplicationId: selectedApplication?.ApplicationId,
      SendEmail: selectedRecepentValue === "only-for-me" ? true : false,
      EnvironmentId: selectedEnvironment?.EnvironmentId,
      // browser: selectedBrowser.BrowserId,
      SelectedTestCases: testCaseNames,
      AllTestCases: [
        {
          disabled: true,
          group: {
            disabled: true,
            name: "string",
          },
          selected: true,
          text: "string",
          value: "string",
        },
      ],
    };
    let error = {};
    if (!name.trim()) {
      error.name = "Name is required";
    }
    if (!selectedApplication) {
      error.application = "Application is required";
    }
    if (!selectedEnvironment) {
      error.environment = "Environment is required";
    }
    // if (!selectedBrowser) {
    //   error.browser = "Browser is required";
    // }
    if (!description) {
      error.description = "Description is required";
    }
    if (testCaseNames.length === 0) {
      error.testCaseError = "1px solid red";
      error.testCaseErrorText = "Select atleast one test case";
    }
    // Update error state
    setError(error);

    // Check if there are any errors
    if (Object.keys(error).length === 0) {
      // Proceed with form submission
      if (action === "SaveAndExecute") {
        // setopenLoadingModal(true)
        setisExecuting(true);
      }
      console.log("no error ", payload);
      dispatch(AddUpdateTestSuites(payload, action, handleLoading));
    } else console.log("handleSubmit error", error, payload);
  };

  const handleCheckboxChange = (event, row) => {
    const checked = event.target.checked;
    const checkedRows = checked
      ? [...selectedRows, row]
      : selectedRows.filter(
          (selectedRow) => selectedRow.TestCaseName !== row.TestCaseName
        );
    setSelectedRows(checkedRows);
    if (checkedRows.length === testCasesList.length) setSelectAll(true);
    else setSelectAll(false);
  };

  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    console.log("checked in all selection ", checked);
    setSelectAll(checked);
    setSelectedRows(checked ? testCasesList : []);
  };
  // const filteredTestCaseData = testCasesList.filter((data) =>
  //   data?.TestCaseName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  // );

  const filteredTestCaseData = testCasesList
    .map((data) => ({
      ...data,
      isChecked:
        selectedRows.find(
          (selectedRow) => selectedRow.TestCaseName === data.TestCaseName
        ) !== undefined,
    }))
    .filter((data) =>
      data?.TestCaseName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  const selectStyle = {
    container: (provided) => ({
      ...provided,
      backgroundColor: "rgb(242, 242, 242)",
      // zIndex: 999, // Adjust the zIndex value
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(242, 242, 242)",
      "&:hover": {
        borderColor: "#654DF7",
      },
      borderColor: Error.environment
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
        color: "#654DF7", // Change the color on hover if desired
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      cursor: "pointer",
      ":hover": {
        color: "#654DF7", // Change the color on hover if desired
      },
    }),
  };
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress sx={{ color: "#654DF7" }} />
        </Box>
      }
    >
      <div className={classes.main}>
        {/* <LoadingWave
        open={openLoadingModal}
        onClose={() => setopenLoadingModal(false)}
        suiteName={name}
        /> */}
        <Grid container>
          {/* First Section */}
          <Grid item xs={12} sm={4}>
            {/* Left Section Part 1 */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <Box className={classes.sideBar}>
                    <b>New Suite</b>
                  </Box>
                  <div
                    style={{
                      // overflow: "auto",
                      // maxHeight: "calc(35vh - 50px)",
                      padding: "0px 12px",
                    }}
                  >
                    <Grid container className={classes.body}>
                      {/* Row 1: Name Input Field */}
                      <Grid item>
                        <div className={classes.input}>
                          <Typography
                            variant="subtitle1"
                            className={clsx(classes.customFontSize)}
                          >
                            Name:
                          </Typography>
                          <FormControl
                            className={clsx(classes.textField)}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                  borderColor: "#654DF7",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#654DF7",
                                },
                                "& fieldset": {
                                  borderColor: "transparent ",
                                },
                              },
                              height: "40px",
                            }}
                          >
                            <OutlinedInput
                              id="outlined-adornment-name"
                              type="text"
                              placeholder="Enter your test suite name"
                              value={name}
                              error={Error.name ? true : false}
                              disabled={false}
                              onChange={handleNameChange}
                              className={clsx(
                                classes.customheight,
                                classes.customFontSize,
                                classes.customBackgroung
                              )}
                            />
                          </FormControl>
                          {nameLengthError && (
                            <StyledTypography>
                              Suite name cannot have more than 50 char*
                            </StyledTypography>
                          )}
                          {Error.name && (
                            <StyledTypography>{Error.name}</StyledTypography>
                          )}
                        </div>
                      </Grid>

                      {/* Row 2: Test Description Input Field */}
                      <Grid item mb={2}>
                        <div className={classes.input}>
                          <Typography
                            variant="subtitle1"
                            className={clsx(classes.customFontSize)}
                          >
                            Description:
                          </Typography>
                          <FormControl
                            className={clsx(classes.textField)}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                  borderColor: "#654DF7",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#654DF7",
                                },
                                "& fieldset": {
                                  borderColor: "transparent ",
                                },
                              },
                            }}
                          >
                            <OutlinedInput
                              id="outlined-adornment-name"
                              variant="outlined"
                              multiline
                              rows={2}
                              className={clsx(
                                classes.customFontSize,
                                classes.customBackgroung
                              )}
                              error={Error.description ? true : false}
                              placeholder="Enter description.."
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value);
                                setError((prev) => ({
                                  ...prev,
                                  description: "",
                                }));
                              }}
                              InputProps={{
                                sx: {
                                  "&:hover fieldset": {
                                    borderColor: "#654DF7",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#654DF7 !important",
                                  },
                                },
                              }}
                            />
                          </FormControl>
                          {Error.description && (
                            <StyledTypography>
                              {Error.description}
                            </StyledTypography>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Card>
              </Grid>
            </Grid>
            {/* Left Section Part 2 */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card style={{ minHeight: "42vh" }}>
                  <Box className={classes.sideBar}>
                    <b>Run Settings</b>
                  </Box>

                  <div>
                    {/* Your existing content */}
                    <Grid container className={classes.body}>
                      <Grid container className={classes.body}>
                        {/* Row 1: Radio Buttons */}
                        <Grid item>
                          <FormControl
                            component="fieldset"
                            className={classes.radioGroup}
                          >
                            <RadioGroup
                              aria-label="options"
                              name="options"
                              value={selectedSuiteValue}
                              onChange={handleRadioChange}
                              row
                            >
                              <FormControlLabel
                                value="custom-Suites"
                                control={<Radio style={{ color: "#654DF7" }} />}
                                label={
                                  <Typography
                                    variant="body1"
                                    className={classes.radioButtonLabel}
                                  >
                                    Custom Suites
                                  </Typography>
                                }
                                className={clsx(
                                  classes.radioLabel,
                                  classes.customFontSize
                                )}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>

                        {/* Row 5: Environment Dropdown */}
                        <Grid item>
                          <div className={classes.input}>
                            <Typography
                              variant="subtitle1"
                              className={clsx(classes.customFontSize)}
                            >
                              Environment
                            </Typography>
                            <Select
                              getOptionLabel={(option) =>
                                option.EnvironmentName
                              }
                              getOptionValue={(option) => option.EnvironmentId}
                              isClearable={true}
                              options={environementList}
                              value={selectedEnvironment}
                              onChange={(newValue) => {
                                setSelectedEnvironment(newValue);
                                setError((prev) => ({
                                  ...prev,
                                  ["environment"]: "",
                                }));
                                handleApplication(newValue);
                              }}
                              styles={selectStyle}
                              menuPosition={"fixed"} // Set menuPosition to fixed
                            />
                            {Error.environment && (
                              <StyledTypography>
                                {Error.environment}
                              </StyledTypography>
                            )}
                          </div>
                        </Grid>

                        {/* Row 3: Additional Name Dropdown */}
                        <Grid item>
                          <div>
                            <Typography
                              variant="subtitle1"
                              className={clsx(classes.customFontSize)}
                            >
                              Application :{" "}
                              {selectedApplication
                                ? selectedApplication.ApplicationName
                                : ""}
                            </Typography>
                          </div>
                        </Grid>

                        {/* Row 6: Test User Dropdown */}
                        <Grid item>
                          <div className={classes.input}>
                            <Typography
                              variant="subtitle1"
                              className={clsx(classes.customFontSize)}
                            >
                              Test User
                            </Typography>
                            <Select
                              getOptionLabel={(option) => option.UserName}
                              getOptionValue={(option) => option.UserId}
                              isClearable={true}
                              options={testUserList}
                              value={selectedTestUser}
                              onChange={(newValue) => {
                                setSelectedTestUser(newValue);
                                setError((prev) => ({
                                  ...prev,
                                  ["test_user"]: "",
                                }));
                              }}
                              styles={selectStyle}
                              menuPosition={"fixed"} // Set menuPosition to fixed
                            />
                            {Error.test_user && (
                              <StyledTypography>
                                {Error.test_user}
                              </StyledTypography>
                            )}
                          </div>
                        </Grid>
                        {/* Row 4: Radio Buttons */}
                        <Grid
                          container
                          alignItems="center"
                          mb={3}
                          sx={{ display: "grid" }}
                        >
                          <Grid item>
                            <Typography className={classes.customFontSize}>
                              Email Recipient
                            </Typography>
                          </Grid>
                          <Grid item>
                            <FormControl
                              component="fieldset"
                              className={classes.radioGroup}
                            >
                              <RadioGroup
                                aria-label="options"
                                name="options"
                                value={selectedRecepentValue}
                                onChange={handleRadioChangeRecepent}
                                row
                              >
                                <FormControlLabel
                                  value="only-for-me"
                                  control={
                                    <Radio style={{ color: "#654DF7" }} />
                                  }
                                  label={
                                    <Typography
                                      variant="body1"
                                      className={classes.radioButtonLabel}
                                    >
                                      Only for me
                                    </Typography>
                                  }
                                  className={clsx(
                                    classes.radioLabel,
                                    classes.customFontSize
                                  )}
                                />
                                <FormControlLabel
                                  value="all-users"
                                  control={
                                    <Radio style={{ color: "#654DF7" }} />
                                  }
                                  label={
                                    <Typography
                                      variant="body1"
                                      className={classes.radioButtonLabel}
                                    >
                                      All users
                                    </Typography>
                                  }
                                  className={classes.radioLabel}
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} sm={8}>
            <Grid container>
              <Grid item xs={12}>
                <Card>
                  <Box
                    className={classes.sideBar}
                    style={{ paddingLeft: "5vh" }}
                  >
                    <b>Test Cases </b>
                  </Box>
                  <Grid
                    container
                    // spacing={2}
                    alignItems="center"
                    style={{ marginBottom: "5px", paddingLeft: "5vh" }}
                  >
                    {/* Search Box */}
                    <Grid item xs={12} sm={4}>
                      <SearchField
                        placeholder="Search Test Cases..."
                        onChange={(value) => setSearchTerm(value)}
                      />
                    </Grid>
                  </Grid>

                  {/* Table with some space */}
                  <div
                    style={{
                      overflow: "auto",
                      maxHeight: "calc(100vh - 50px)",
                      border: Error.testCaseError,
                    }}
                  >
                    <TestCaseTable
                      rows={filteredTestCaseData}
                      selectedRows={selectedRows}
                      // selectedRows={testCasesList.filter((test)=> suiteToEdit.SelectedTestCases.includes(test.TestCaseName))}
                      handleSelectAllChange={handleSelectAllChange}
                      handleCheckboxChange={handleCheckboxChange}
                      selectAll={selectAll}
                    />
                    <Box className={classes.testCaseErrorStyle}>
                      {Error.testCaseErrorText}
                    </Box>
                  </div>
                </Card>
              </Grid>
            </Grid>

            <Grid container style={{ paddingTop: "10px" }}>
              <Grid item xs={12}>
                <Box className={classes.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleSubmit("Save")}
                    sx={{
                      backgroundColor: "rgb(101, 77, 247)",
                      "&:hover": {
                        backgroundColor: "rgb(101, 77, 247)",
                        borderColor: "#654DF7",
                      },
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleSubmit("SaveAndExecute")}
                    disabled={executingSuite ? true : false}
                    sx={{
                      backgroundColor: "rgb(101, 77, 247)",
                      "&:hover": {
                        backgroundColor: "rgb(101, 77, 247)",
                        borderColor: "#654DF7",
                      },
                    }}
                  >
                    Save & Execute
                  </Button>

                  <Button
                    color="primary"
                    className={classes.button}
                    onClick={() => navigate("/")}
                    sx={{
                      backgroundColor: "rgb(108, 117, 125)",
                      color: "#f1f1f1",
                      "&:hover": {
                        backgroundColor: "rgb(101, 77, 247)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                {/* </Card> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Suspense>
  );
}