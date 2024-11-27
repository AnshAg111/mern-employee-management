
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import ToastContext from "../context/ToastContext";

const EmployeeList = () => {
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchEmployeesData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/employees`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setEmployees(result.employees);
        } else {
          console.error(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeesData();
  }, []);

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setShowModal(false);
        const result = await res.json();
        if (!result.error) {
          setEmployees(result.Employees);
          toast.success("Removed Employee");
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setEmployees(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Employee List 
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => window.location.reload()}
          sx={{ mb: 2 }}
        >
          Reload
        </Button>
        <hr />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {employees.length === 0 ? (
            <Typography variant="h6" align="center">
              No employees yet.
            </Typography>
          ) : (
            <Box>
              <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", mb: 3 }}>
                <TextField
                  id="searchInput"
                  name="searchInput"
                  label="Search Employees"
                  variant="outlined"
                  fullWidth
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ mr: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">
                  Search
                </Button>
              </Box>

              <Typography variant="body1" gutterBottom>
                Total Employees: <strong>{employees.length}</strong>
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile No.</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Create Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow
                        key={employee._id}
                        hover
                        onClick={() => {
                          setModalData(employee);
                          setShowModal(true);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>{employee.gender}</TableCell>
                        <TableCell>{employee.course}</TableCell>
                        <TableCell>{format(new Date(employee.createDate), "PPP")}</TableCell>
                        <TableCell>
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                            <Button
                              component={Link}
                              to={`/edit/${employee?._id}`}
                              variant="contained"
                              color="info"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => deleteEmployee(employee?._id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}

      {showModal && <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="employee-modal-title"
        aria-describedby="employee-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="employee-modal-title" variant="h6" component="h2" gutterBottom>
            {modalData?.name} 
          </Typography>
          <Typography>
            <strong>Email:</strong> {modalData?.email}
          </Typography>
          <Typography>
            <strong>Mobile No.:</strong> {modalData?.phone}
          </Typography>
          <Typography>
            <strong>Designation:</strong> {modalData?.designation}
          </Typography>
          <Typography>
            <strong>Gender:</strong> {modalData?.gender}
          </Typography>
          <Typography>
            <strong>Course:</strong> {modalData?.course}
          </Typography>
          <Typography>
            <strong>Date Created:</strong> {" "}
            {format(new Date(modalData?.createDate), "PPP")}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" color="warning" onClick={() => setShowModal(false)}>
              Close
            </Button>
            </Box>
          
        </Box>
      </Modal>}
    </Container>
  );
};

export default EmployeeList;