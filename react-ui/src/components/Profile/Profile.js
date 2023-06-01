import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBInput,
  MDBFile,
  MDBTypography,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
} from "mdb-react-ui-kit";
import axios from "axios";
import qs from "qs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoCard from "./VideoCard";
import Button from "@material-ui/core/Button";
import "./Profile.css";
import { LinearProgress } from "@material-ui/core";
import Navigation from "../Navigation/Navigation";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export default function Profile() {
  const mfaRequired = localStorage.getItem("mfaRequired");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userImage, setUserImage] = useState("");
  const [role, setRole] = useState("user");
  const [trainerDetails, setTrainerDetails] = useState("");
  const [status, setStatus] = useState("todo");
  const [videos, setVideos] = useState([]);
  const [varyingModal, setVaryingModal] = useState(false);
  const [category, setCategory] = useState("Yoga");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [varyingUpload, setVaryingUpload] = useState(false);
  const [hidden, setHidden] = useState(true);

  // User body measurements
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [userHeightFeet, setUserHeightFeet] = useState("");
  const [userHeightInches, setUserHeightInches] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [error, setError] = useState(""); // String

  // User Goals
  const [weightGoal, setWeightGoal] = useState("Lose");
  const [muscleMassGoal, setMuscleMassGoal] = useState("Gain");

  // Trainer appointment input
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [repeatFor, setRepeatFor] = useState(1);
  const [duration, setDuration] = useState('15 minutes');
  const [description, setDescription] = useState('');
  const [aptTitle, setAptTitle] = useState('');
  const [atpError, setAptError] = useState('');

  // Wellness Score
  const [wellnessScore, setWellnessScore] = useState(NaN);
  const [wellnessScoreError, setWellnessScoreError] = useState("");

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem("authToken") || "";
  const [authToken] = useState(existingAuthtoken);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });

    instance
      .get("/api/users/profile/getdetails", { params: { email: email } })
      .then((res) => {
        if (res.data.userProfile.email)
          setUserEmail(res.data.userProfile.email);
        if (res.data.userProfile.city) setUserCity(res.data.userProfile.city);
        if (res.data.userProfile.fullName)
          setUserFullName(res.data.userProfile.fullName);
        if (res.data.userProfile.phone)
          setUserPhone(res.data.userProfile.phone);
        if (res.data.userProfile.age) setAge(res.data.userProfile.age);
        if (res.data.userProfile.gender) setGender(res.data.userProfile.gender);
        if (typeof res.data.userProfile.heightFeet === "number")
          setUserHeightFeet(res.data.userProfile.heightFeet);
        if (typeof res.data.userProfile.heightInches === "number")
          setUserHeightInches(res.data.userProfile.heightInches);
        if (res.data.userProfile.weight)
          setUserWeight(res.data.userProfile.weight);
        if (res.data.userProfile.weightGoal)
          setWeightGoal(res.data.userProfile.weightGoal);
        if (res.data.userProfile.muscleMassGoal)
          setMuscleMassGoal(res.data.userProfile.muscleMassGoal);
        setRole(res.data.role);
        if (!res.data.userProfile.profileImage) {
          setUserImage("https://ui-avatars.com/api/?name=ME&size=256");
        } else {
          setUserImage(res.data.userProfile.profileImage);
        }
      })
      .catch((error) => {
        if (error.response) console.log(error.response.data);
      });

    instance
      .get("/api/trainer/approvals", { params: { email: email } })
      .then((res) => {
        setStatus(res.data.status);
      })
      .catch((error) => {
        setStatus("notfound");
        console.log(error);
      });
    if (role === "trainer") {
      instance
        .get("/api/trainer/videos", { params: { email: email } })
        .then((res) => {
          setVideos(res.data.data);
        })
        .catch((error) => {
          setVideos([]);
          console.log(error);
        });
    }

    instance
      .get("/api/users/calculateWellnessScore")
      .then((res) => {
        setWellnessScore(res.data.wellnessScore);
      })
      .catch((error) => {
        setWellnessScoreError(error);
      });
  }, [authToken, email, role]);

  const onVideoTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onAgeChange = (event) => {
    setAge(event.target.value);
  };

  const onDaysChange = (event) => {
    const buttonId = event.target.value;
    if (days.includes(event.target.value)) setDays(days.filter((e) => e !== buttonId))
    else days.push(buttonId)
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const onGenderChange = (event) => {
    setGender(event.target.value);
  };

  const onNameChange = (event) => {
    setUserFullName(event.target.value);
  };

  const onEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const onPhoneChange = (event) => {
    setUserPhone(event.target.value);
  };

  const onRepeatForChange = (event) => {
    setRepeatFor(Number.parseInt(event.target.value));
  };

  const onCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const onCityChange = (event) => {
    setUserCity(event.target.value);
  };

  const onMuscleMassGoalChange = (event) => {
    setMuscleMassGoal(event.target.value);
  };

  const onStartTimeChange = (event) => {
    setStartTime(event.target.value);
    console.log(typeof event.target.value);
  };

  const onTagsChange = (event) => {
    const clickedTag = event.target.value;
    if (tags.includes(clickedTag))
      setTags(tags.filter((tag) => tag !== clickedTag));
    // filter returns new array... ight
    else tags.push(clickedTag);
  };

  const onAptTitleChange = (event) => {
    setAptTitle(event.target.value);
  };

  const onUserHeightFeetChange = (event) => {
    setUserHeightFeet(parseInt(event.target.value));
  };

  const onUserHeightInchesChange = (event) => {
    setUserHeightInches(parseInt(event.target.value));
  };

  const onUserWeightChange = (event) => {
    setUserWeight(parseInt(event.target.value));
  };

  const onWeightGoalChange = (event) => {
    setWeightGoal(event.target.value);
  };

  const ageValidation = (event) => {
    if (age < 18) {
      setError("You must be an adult to use Fitocity!");
      return false;
    } else if (age >= 125) {
      setError(`Congradulations on living past 125 years old! Please email 
                fitocity4g@gmail.com to increase the age limit of our application!`);
      return false;
    }

    setError("");
    return true;
  };

  const genderValidation = (event) => {
    if (!(gender === "Male" || gender === "Female")) {
      setError("Please select a gender!");
      return false;
    }

    setError("");
    return true;
  };

  const userHeightValidation = (event) => {
    const isValidHeightFeet =
      Number.isInteger(userHeightFeet) &&
      userHeightFeet >= 3 &&
      userHeightFeet < 8;
    const isValidHeightInches =
      Number.isInteger(userHeightInches) &&
      userHeightInches >= 0 &&
      userHeightInches <= 11;
    if (!isValidHeightFeet || !isValidHeightInches) {
      setError("Height must be between 3'0\" and 8'0\"!");
      return false;
    }

    setError("");
    return true;
  };

  const userWeightValidation = (event) => {
    const validWeight =
      Number.isInteger(userWeight) && userWeight >= 50 && userWeight <= 1000;
    if (!validWeight) {
      setError("Weight must be between 50 and 1000 lbs!");
      return false;
    }

    setError("");
    return true;
  };

  const createAppointmentTimestamps = () => {
    let timestamps = [];
    days.forEach(element => {
        let aptDate = new Date();
        let dayOffset = aptDate.getDay() - element;
        aptDate.setDate(aptDate.getDate() - dayOffset);
        aptDate.setHours(startTime.substring(0, 2));
        aptDate.setMinutes(startTime.substring(3, 5));
        aptDate.setSeconds(0);
        aptDate.setMilliseconds(0);

        let endDate = new Date(aptDate);
        endDate.setDate(endDate.getDate() + repeatFor*7)
        
        timestamps.push(aptDate.getTime());
        timestamps.push(endDate.getTime());
    });

    return timestamps;
  }

  const createAppointmentsValidation = () => {
    console.log(typeof repeatFor);
    if (!aptTitle) setAptError("Appointments must have a title!");
    else if (!duration) setAptError("Appointments must have a duration!");
    else if (!Number.isInteger(repeatFor) || repeatFor < 1) setAptError("Repeat For must be a whole number greater than 0!");
    else if (days.length === 0) setAptError("You must select at least one day!");
    else if (!startTime) setAptError("Appointments must have a start time!");
    else setAptError('');

    if (atpError) return false;
    return true;
  }

  const createAppointments = (event) => {
    event.preventDefault();
    
    setAptError('');
    if (!createAppointmentsValidation()) return;
    
    let timestamps = createAppointmentTimestamps();

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });
    const formData = {
      timestamps,
      title: aptTitle,
      description,
      duration
    };
    console.log(formData);
    instance
      .post("/api/scheduling/openAppointments", qs.stringify(formData))
      .then((res) => {
        toast("Appointments created!");
      })
      .catch((err) => {
        setAptError(err.response.data);
      });
  }

  // Updates the wellness information of the user's profile
  const updateWellnessInfo = (event) => {
    event.preventDefault();

    // Make sure the user entered valid wellness information
    if (
      !ageValidation() ||
      !userHeightValidation() ||
      !userWeightValidation() ||
      !genderValidation()
    )
      return;

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });
    const formData = {
      age: age,
      gender: gender,
      heightFeet: userHeightFeet,
      heightInches: userHeightInches,
      weight: userWeight,
      weightGoal: weightGoal,
      muscleMassGoal: muscleMassGoal,
    };
    instance
      .post("/api/users/profile/updatewellnessinfo", qs.stringify(formData))
      .then((res) => {
        toast("Wellness Information Updated!");
      })
      .catch((err) => {
        toast("Something went wrong!");
      });
  };

  const updateProfile = (event) => {
    event.preventDefault();
    const formData = {
      fullName: userFullName,
      phone: userPhone,
      city: userCity,
      email: userEmail,
    };
    axios
      .post("/api/users/profile/updatedetails", qs.stringify(formData))
      .then((res) => {
        toast("Profile Updated!");
      })
      .catch((err) => {
        toast("Something went wrong!");
      });
  };

  const updateImage = (event) => {
    event.preventDefault();
    var formData = new FormData();
    var imagefile = document.getElementById("customFile");
    formData.append("image", imagefile.files[0]);
    formData.append("email", userEmail);
    axios
      .post("/api/users/profile/upload", qs.stringify(formData))
      .then((res) => {
        toast("Profile Updated!");
        setUserImage(res.data.data);
        setVaryingUpload(false);
      })
      .catch((err) => {
        toast("Something went wrong!");
      });
  };

  const uploadVideo = (event) => {
    event.preventDefault();
    const file = document.getElementById("video").files[0];

    if (!email || !title || !category || !(tags.length > 0) || !file) {
      toast("You must fill out all sections to upload a video!");
      return;
    }

    setHidden(false); // Show loading spinner
    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });

    const formData = new FormData();
    formData.append("email", email);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("file", file);
    instance
      .post("/api/trainer/upload", formData)
      .then((res) => {
        setHidden(true);
        setTitle("");
        videos.push(res.data);
        setVaryingModal(false);
        window.location.reload(false); // Reload the current page from cache
      })
      .catch((err) => {
        console.error(err);
        toast("Something went wrong!");
        setHidden(true);
        setTitle("");
      });
  };

  const tellUsMore = (event) => {
    setTrainerDetails(event.target.value);
  };

  const submitForApproval = (event) => {
    event.preventDefault();
    const formData = {
      email: userEmail,
      description: trainerDetails,
    };
    axios
      .post("/api/trainer/approval", qs.stringify(formData))
      .then((res) => {
        toast("Thank you for submitting the form!");
        setStatus(res.data.status);
      })
      .catch((err) => {
        toast("Something went wrong!");
      });
  };

  const renderByStatus = () => {    
    if (role === 'trainer') {
      if(status === 'inprocess' || status === 'pending') {
        return (<h1>Your profile is under Review</h1>)
      }
      else if(status === 'notfound' || status === 'todo') {
        return (<MDBCol style={{ 'width': '100%' }} md="6">
          <br />
          <p className="lead fw-normal mb-1">Tell us about yourself</p>
          <form onSubmit={submitForApproval}>
            <MDBTextArea value={trainerDetails} onChange={tellUsMore} id='textAreaExample' rows={10} />
            <MDBBtn style={{ 'margin-top': '10px' }} >Submit</MDBBtn>
          </form>
        </MDBCol>)
      }
    }
  };

  return (
    <div className="gradient-custom-2" style={{ backgroundColor: "#cbe2f7"}}>
      <LinearProgress id="spinner" hidden={hidden} color="secondary" />
      <ToastContainer />

      <Navigation />

      {/* Profile section */}
      <MDBContainer className="py-5 h-100 section">
        <MDBRow className="justify-content-center align-items-center h-100 ">
          <MDBCol lg="9" xl="7" className="subsection">
            {/* User Profile Card */}
            <MDBCard>
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#000", height: "200px" }}
              >
                <div
                  className="ms-4 mt-5 d-flex flex-column"
                  style={{ width: "150px" }}
                >
                  <div className="image-container">
                    <MDBCardImage
                      src={userImage}
                      alt="Generic placeholder image"
                      className="mt-4 mb-2 img-thumbnail"
                      fluid
                      style={{ width: "150px", zIndex: "1" }}
                    />
                    <div class="overlay">
                      <Button
                        class="icon"
                        onClick={() => {
                          setVaryingUpload(!varyingUpload);
                        }}
                      >
                        <CloudUploadIcon className="fa user" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="ms-3" style={{ marginTop: "130px" }}>
                  <MDBTypography tag="h5">{userFullName}</MDBTypography>
                  <MDBCardText>{userCity}</MDBCardText>
                </div>
              </div>

              {/* Trainer video upload button */}
              <div
                className="p-4 text-black"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    {role === 'trainer' && status === 'approved' ? 
                      <Button variant="contained" color="default"
                        className='material-button'
                        startIcon={<CloudUploadIcon />}
                        onClick={() => {
                          setVaryingModal(!varyingModal);
                        }}
                      >
                        Upload
                      </Button>
                     : 
                      ''
                    }
                  </div>
                </div>
              </div>

              {/* User information card */}
              <MDBCardBody className="text-black p-4">
                {/* About */}
                <form onSubmit={updateProfile}>
                  <div className="mb-5">
                    <h1 className="fw-bold mb-1">About</h1>
                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Full Name</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBInput
                              label="Name"
                              onChange={onNameChange}
                              value={userFullName}
                              type="text"
                            />
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Email</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBInput
                              label="Email"
                              onChange={onEmailChange}
                              value={userEmail}
                              type="text"
                            />
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Phone</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBInput
                              label="Phone"
                              onChange={onPhoneChange}
                              value={userPhone}
                              type="text"
                            />
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>City</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBInput
                              label="City"
                              onChange={onCityChange}
                              value={userCity}
                              type="text"
                            />
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </div>
                    <MDBBtn style={{ marginTop: "10px" }}>Update</MDBBtn>
                  </div>
                </form>

                {/* Trainer approval status */}
                {renderByStatus()}

                {/* Trainer videos */}
                <MDBRow
                  md="4"
                  className="justify-content-center align-items-center h-100"
                >
                  {(true || (status === "approved" && role === "trainer")) &&
                  videos.length > 0 ? (
                    <div>
                      <h1 className="fw-bold mb-1">Videos</h1>
                      <VideoCard videos={videos} />
                    </div>
                  ) : (
                    ""
                  )}
                </MDBRow>
                      <hr/>
                {/* User wellness information */}
                <form onSubmit={updateWellnessInfo}>
                  <div className="mb-5">
                    <h1 className="fw-bold mb-2">Wellness Information</h1>

                    {/* User body measurements */}
                    <h2 className="mb-">General Information</h2>
                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Age</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <div style={{ width: "176px" }}>
                              <MDBInput
                                label="yrs"
                                onChange={onAgeChange}
                                value={age}
                                onBlur={ageValidation}
                                type="number"
                              />
                            </div>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Gender</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="3">
                          <select
                            value={gender}
                            onChange={onGenderChange}
                            class="form-select"
                            aria-label="Category Select"
                          >
                            <option value={""}>Select a Gender</option>
                            <option value={"Male"}>Male</option>
                            <option value={"Female"}>Female</option>
                          </select>
                        </MDBCol>
                      </MDBRow>
                    </div>

                    {/* User body measurements */}
                    <h2 className="mb-">Body Measurements</h2>
                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Height</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBRow
                              className="align-items-center"
                              style={{ flex: "left" }}
                            >
                              <div style={{ width: "200px" }}>
                                <MDBInput
                                  label="Feet"
                                  onChange={onUserHeightFeetChange}
                                  value={userHeightFeet}
                                  onBlur={userHeightValidation}
                                  type="number"
                                />
                              </div>
                              <div style={{ width: "200px" }}>
                                <MDBInput
                                  label="Inches"
                                  onChange={onUserHeightInchesChange}
                                  value={userHeightInches}
                                  onBlur={userHeightValidation}
                                  type="number"
                                />
                              </div>
                            </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Weight</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <div style={{ width: "176px" }}>
                              <MDBInput
                                label="lbs"
                                onChange={onUserWeightChange}
                                value={userWeight}
                                onBlur={userWeightValidation}
                                type="number"
                              />
                            </div>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </div>

                    {/* User fitness goals */}
                    <h2 className="mt-2 mb-1">Fitness Goals</h2>
                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Weight</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="3">
                          <select
                            value={weightGoal}
                            onChange={onWeightGoalChange}
                            class="form-select"
                            aria-label="Category Select"
                          >
                            <option value={"Loose"}>Loose</option>
                            <option value={"Maintain"}>Maintain</option>
                            <option value={"Gain"}>Gain</option>
                          </select>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Muscle Mass</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="3">
                          <select
                            value={muscleMassGoal}
                            onChange={onMuscleMassGoalChange}
                            class="form-select"
                            aria-label="Category Select"
                          >
                            <option value={"Gain"}>Gain</option>
                            <option value={"Maintain"}>Maintain</option>
                            <option value={"Loose"}>Loose</option>
                          </select>
                        </MDBCol>
                      </MDBRow>
                    </div>

                    {/* Error message for wellness info submission */}
                    {error ? (
                      <MDBTypography
                        id="danger-text"
                        note
                        noteColor="danger"
                        style={{ marginTop: "10px" }}
                      >
                        <strong>{error}</strong>
                      </MDBTypography>
                    ) : (
                      ""
                    )}

                    {/* User wellness info update button */}
                    <MDBBtn style={{ marginTop: "10px" }}>Update</MDBBtn>
                  </div>
                </form>

                {/* User wellness score */}
                <h2 className="mt-2 mb-1">Your Wellness Score</h2>
                {wellnessScoreError ? (
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBRow>
                      <MDBCol sm="13">
                        <MDBCardText>
                          In order to calculate your Wellness Score you must
                          have logged at least three meals, nights of sleep, and
                          workouts in addition to having filled out your profile
                          page!
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </div>
                ) : (
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBRow>
                      <MDBCol sm="6">
                        <MDBCardText>
                          Your wellness score is:{" "}
                          <strong>{wellnessScore}</strong>
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBAccordion alwaysOpen initialActive={1}>
                      <MDBAccordionItem
                        collapseId={1}
                        headerTitle="Know more about how your wellness score is calculated"
                      >
                        Your Wellness Score (a number betwee 0 and 100) is
                        calculated based on data that you input into Fitocity.
                        Your BMI, level of physical activity, diet, and sleep
                        all play a part in your overall wellness, so we use this
                        information to provide you with a measurement of your
                        progress!
                        <br />
                        <br />
                        As you explore Fitocity and utilize the services our
                        trainers provide, you will watch your Wellness Score
                        rise as you become the best you you can be!
                      </MDBAccordionItem>
                    </MDBAccordion>
                  </div>
                )}
             {(true || status === "approved") && role === "trainer" ? (
                
              <div className="mb-5 my-5">
                    
                    <h1 className="fw-bold mb-2">Appointment</h1>

                    {/* User body measurements */}
                    <h2 className="mb-">
                      Schedule your availability for appointments
                    </h2>
                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>

                    <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText for="appt-time">Title:</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBRow>
                              <MDBCol sm="12" >
                                <MDBInput onChange={onAptTitleChange} style={{width: '400px'}}></MDBInput>
                              </MDBCol>
                            </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Select Days:</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBRow>
                              <MDBCol sm="6">                       
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="0"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Sunday
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="1"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Monday
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="2"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Tuesday
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="3"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Wednesday
                                  </label>
                                </div>

                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="4"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Thursday
                                  </label>
                                </div>

                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="5"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Friday
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="6"
                                    onClick={onDaysChange}
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexCheckDefault"
                                  >
                                    Saturday
                                  </label>
                                </div>
                                
                              </MDBCol>
                            </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText for="appt-time">Repeat For:</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                          <MDBRow className="" style={{flex: 'left', width: '400px'}}>
                            <div style={{ flex: 'left', width: '150px'}}>
                               <MDBInput value={repeatFor} onChange={onRepeatForChange}></MDBInput>
                            </div>
                            <div style={{position: 'relative', left: '-10px', width: '100px'}}>
                              weeks
                            </div>
                          </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText for="appt-time">Start Time:</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBRow>
                              <MDBCol sm="3">
                                <input
                                  id="appt-time"
                                  type="time"
                                  name="appt-time"
                                  onChange={onStartTimeChange}
                                 
                                  style={{
                                    width: "120px",
                                    borderRadius: "5px",
                                    height: "35px",
                                  }}
                                />
                              </MDBCol>
                            </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Duration:</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBRow>
                              <MDBCol sm="3">
                                <select
                                  value={duration}
                                  onChange={onDurationChange}
                                  class="form-select"
                                  aria-label="Category Select"
                                >
                                  <option value="15 minutes">15 minutes</option>
                                  <option value="30 minutes">30 minutes</option>
                                  <option value="45 minutes">45 minutes</option>
                                  <option value="60 minutes">60 minutes</option>
                                </select>

                              </MDBCol>
                            </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />

                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Description: </MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBRow>
                              <MDBCol style={{width:'200px'}}>
                                <MDBTextArea onChange={onDescriptionChange}></MDBTextArea>
                              </MDBCol>
                            </MDBRow>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />


                      {/* Error message for wellness info submission */}
                      {atpError ? (
                        <MDBTypography
                          id="danger-text"
                          note
                          noteColor="danger"
                          style={{ marginTop: "10px" }}
                        >
                          <strong>{atpError}</strong>
                        </MDBTypography>
                      ) : (
                        ""
                      )}

                      <MDBBtn onClick={createAppointments}>Save</MDBBtn>
                    </div>
                  </div>
                ) :(
                  "")}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Video upload Modal for when trainer clicks upload video */}
      <MDBModal show={varyingModal} setShow={setVaryingModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <form onSubmit={uploadVideo}>
              <MDBModalHeader>
                <MDBModalTitle>Upload Video</MDBModalTitle>
              </MDBModalHeader>
              <MDBModalBody>
                <div className="mb-3">
                  <h4>Title</h4>
                  <MDBInput
                    value={title}
                    onChange={onVideoTitleChange}
                    labelClass="col-form-label"
                    label="Title"
                  />
                </div>
                <div className="mb-3">
                  <h4>Category</h4>
                  <select
                    onChange={onCategoryChange}
                    class="form-select"
                    aria-label="Category Select"
                  >
                    <option value={"Yoga"}>Yoga</option>
                    <option value={"Upper Body"}>Upper Body</option>
                    <option value={"Lower Body"}>Lower Body</option>
                    <option value={"Cardio"}>Cardio</option>
                    <option value={"Cardio"}>Biking</option>
                    <option value={"Other"}>Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <h4>Tags</h4>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox1"
                      value="beginner"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      beginner
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox2"
                      value="intermediate"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      intermediate
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox3"
                      value="expert"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      expert
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox4"
                      value="low intensity"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      low intensity
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox5"
                      value="medium intensity"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      medium intensity
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox6"
                      value="high intensity"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      high intensity
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox7"
                      value="equipment required"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      equipment required
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      onChange={onTagsChange}
                      class="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox8"
                      value="equipment not-required"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      equipment not-required
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <h4>Upload</h4>
                  <MDBFile size="sm" id="video" />
                </div>
              </MDBModalBody>
              <MDBModalFooter>
                {/* type='button' prevents form submission */}
                <MDBBtn
                  type="button"
                  color="secondary"
                  onClick={() => setVaryingModal(!varyingModal)}
                >
                  Close
                </MDBBtn>
                <MDBBtn>Upload</MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Profile photo upload Modal */}
      <MDBModal show={varyingUpload} setShow={setVaryingUpload} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <form onSubmit={updateImage}>
              <MDBModalHeader>
                <MDBModalTitle>Upload Profile Picture</MDBModalTitle>
              </MDBModalHeader>
              <MDBModalBody>
                <div className="mb-3">
                  {varyingUpload && <MDBFile size="sm" id="customFile" />}
                </div>
              </MDBModalBody>
              <MDBModalFooter>
                {/* type='button' prevents form submission */}
                <MDBBtn
                  type="button"
                  color="secondary"
                  onClick={() => setVaryingUpload(!varyingUpload)}
                >
                  Close
                </MDBBtn>
                <MDBBtn>Upload</MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
