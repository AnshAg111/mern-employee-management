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
  FormControlLabel
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Grid from '@mui/material/Grid2';
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
    course: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!(file && (file.type === "image/jpeg" || file.type === "image/png"))) {
      // onFileSelect(file);
      alert("Only JPG or PNG files are allowed.");
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
      toast.success(
        `Updated [${userDetails.name} employee`
      );

      setUserDetails({
        name: "",
        email: "",
        phone: "",
        designation: "",
        gender: "",
        course: "",
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
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
              <InputLabel id="namelabel">Name:</InputLabel>
                <TextField
                  fullWidth
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
              <InputLabel id="email">Email:</InputLabel>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
              <InputLabel id="phonelabel">Mobile No.:</InputLabel>
                <TextField
                  fullWidth
                  name="phone"
                  type="tel"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
            <InputLabel id="designation">Designation:</InputLabel>
            <Select
              value={userDetails.designation}
              label="Select"
              onChange={handleInputChange}
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="demo-radio-buttons-group-label">Gender</InputLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value={userDetails.gender}
                control={<Radio />}
                label="F"
              />
              <FormControlLabel
                value={userDetails.gender}
                control={<Radio />}
                label="M"
              />
              {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="Checkbox">Course</InputLabel>
            <FormControlLabel
              value={userDetails.course}
              control={<Checkbox />}
              label="MCA"
            />
            <FormControlLabel
              value={userDetails.course}
              control={<Checkbox />}
              label="BCA"
            />
            <FormControlLabel
              value={userDetails.course}
              control={<Checkbox />}
              label="BSC"
            />
          </Grid>
          {/* <Grid>
            <input
              accept="image/jpeg, image/png"
              style={{ display: "none" }}
              id="upload-image"
              type="file"
              onChange={handleFileChange}
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
          </Grid> */}
            </Grid>
            <Box sx={{ mt: 3 }}>
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
