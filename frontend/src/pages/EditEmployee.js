import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });
  const [loading, setLoading] = useState(false);

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
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserDetails({ ...userDetails, image: file });
    } else {
      alert("Please upload the image.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:8000/api/employee`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id, ...userDetails }),
    });

    const result = await res.json();
    if (!result.error) {
      toast.success(`Updated [${userDetails.name} successfully!`);
      // navigate("/employees");

      setUserDetails({
        name: "",
        email: "",
        phone: "",
        designation: "",
        gender: "",
        course: [],
        image: "",
      });
      navigate("/employees");
    } else {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/employee/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        setUserDetails({
          name: result.name,
          email: result.email,
          phone: result.phone,
          designation: result.designation,
          gender: result.gender,
          course: result.course,
          image: null,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [id]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {loading ? (
        <Spinner splash="Loading..." />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Employee Edit
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* <Grid container spacing={2}> */}
              <Grid item xs={12} padding={2}>
                <InputLabel id="namelabel">Name:</InputLabel>
                <TextField
                  id="name"
                  fullWidth
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} padding={2}>
                <InputLabel id="emaillabel">Email:</InputLabel>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} padding={2}>
                <InputLabel id="phonelabel">Mobile No.:</InputLabel>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} padding={2}>
                <InputLabel id="designation">Designation:</InputLabel>
                <Select
                  name="designation"
                  value={userDetails.designation}
                  label="Select"
                  onChange={handleInputChange}
                >
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} padding={2}>
                <InputLabel id="gender">Gender</InputLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="gender"
                  value={userDetails.gender}
                  onChange={handleInputChange}
                  row 
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="F"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="M"
                  />
                  {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
                </RadioGroup>
              </Grid>
              <Grid item xs={12} padding={2}>
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
              <Grid item xs={12} padding={2}>
                <input
                  label="Upload Image"
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
                    Select File 
                  </Button>
                </label>
              </Grid>
            {/* </Grid> */}
            <Box sx={{ mt: 3 }} padding={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </Box>
          </form>
        </>
      )}
    </Container>
  );
};

export default EditEmployee;
