const { validateEmployee, Employee } = require("../models/Employee");
const auth = require("../middlewares/auth");

const mongoose = require("mongoose");
const router = require("express").Router();

router.post("/employee", auth, async (req, res) => {
  const { error } = validateEmployee(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, phone, designation, gender, course, image } = req.body;

  try {
    const newEmployee = new Employee({
      name,
      email,
      phone,
      designation,
      gender,
      course,
      image,
      postedBy: req.user._id,
    });
    const result = await newEmployee.save();

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/employees", auth, async (req, res) => {
  try {
    const Employees = await Employee.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res.status(200).json({ employees: Employees.reverse() });
  } catch (err) {
    console.log(err);
  }
});

router.put("/employee", auth, async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const employee = await Employee.findOne({ _id: id });

    if (req.user._id.toString() !== employee.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't edit other employees data!" });

    const updatedData = { ...req.body, id: undefined };
    const result = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });
  try {
    const employee = await Employee.findOne({ _id: id });
    if (!employee) return res.status(400).json({ error: "no employee found" });

    if (req.user._id.toString() !== employee.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other employee details!" });

    const result = await Employee.deleteOne({ _id: id });
    const Employees = await Employee.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...contact._doc, Employees: Employees.reverse() });
  } catch (err) {
    console.log(err);
  }
});

router.get("/employee/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const employee = await Employee.findOne({ _id: id });

    return res.status(200).json({ ...employee._doc });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;