import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

const CreateEmployee = () => {
  const { toast } = useContext(ToastContext);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    gender: "",
    course: "",
    image:"",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle Checkboxes (for multiple selections like courses)
    if (type === "checkbox") {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: prevDetails[name]
          ? prevDetails[name].includes(value)
            ? prevDetails[name].filter((item) => item !== value) // Remove if already selected
            : [...prevDetails[name], value] // Add if not already selected
          : [value], // Initialize as an array if not already set
      }));
    } else {
      // Handle Select, Text, and Radio inputs
      setUserDetails({ ...userDetails, [name]: value });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    // Validate file type
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      alert("Only JPG or PNG files are allowed.");
      return;
    }

    // Validate file size (e.g., max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("File size must be less than 2MB.");
      return;
    }

    // Read file as base64 (if you prefer sending base64 to the backend)
    const reader = new FileReader();
    reader.onload = () => {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profileImage: reader.result, // Store base64 string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch(`http://localhost:8000/api/employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userDetails),
    });
    const result = await res.json();
    if (!result.error) {
      toast.success(`Created [${userDetails.name} employee`);
      setUserDetails({
        name: "",
        email: "",
        phone: "",
        designation: "",
        gender: "",
        course: "",
        image:"",
      });
      navigate("/employees");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create employee
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel id="namelabel">Name:</InputLabel>
            <TextField
              id="name"
              name="name"
              variant="outlined"
              value={userDetails.name}
              onChange={handleInputChange}
              placeholder="John"
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel id="email">Email:</InputLabel>
            <TextField
              id="email"
              name="email"
              type="email"
              variant="outlined"
              value={userDetails.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="phonelabel">Mobile No.:</InputLabel>
            <TextField
              id="phone"
              name="phone"
              type="tel"
              variant="outlined"
              value={userDetails.phone}
              onChange={handleInputChange}
              placeholder="+977 987654321"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="designation">Designation:</InputLabel>
            <Select
              name="designation"
              value={userDetails.designation}
              onChange={handleInputChange}
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="gender">Gender</InputLabel>
            <RadioGroup
              name="gender"
              value={userDetails.gender}
              onChange={handleInputChange}
            >
              <FormControlLabel value="Female" control={<Radio />} label="F" />
              <FormControlLabel value="Male" control={<Radio />} label="M" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="Checkbox">Course</InputLabel>
            <FormControlLabel
              control={
                <Checkbox
                  name="course"
                  value="MCA"
                  onChange={handleInputChange}
                  checked={userDetails.course?.includes("MCA") || false}
                />
              }
              label="MCA"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="course"
                  value="BCA"
                  onChange={handleInputChange}
                  checked={userDetails.course?.includes("BCA") || false}
                />
              }
              label="BCA"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="course"
                  value="BSC"
                  onChange={handleInputChange}
                  checked={userDetails.course?.includes("BSC") || false}
                />
              }
              label="BSC"
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/jpeg, image/png" // Limit accepted file types
              style={{ display: "none" }} // Hide the input element
              id="upload-image"
              type="file"
              onChange={handleFileChange} // Handle file changes
            />
            <label htmlFor="upload-image">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadFileIcon />}
              >
                Upload Image
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateEmployee;
