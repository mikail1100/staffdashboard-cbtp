const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET /api/staff/dashboard
// @desc    Get dashboard statistics
// @access  Private (Staff)

/*app.use(express.json());
app.use('/api', staffRoutes);
exports.getStaff = (req, res) => {
  res.send("Staff list goes here");
};
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

router.get('/dashboard', authMiddleware, staffController.getDashboardStats);

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Private (Admin)
router.get('/staffReg', authMiddleware, adminMiddleware, staffController.getAllStaff);

// @route   POST /api/staff
// @desc    Register new staff member
// @access  Private (Admin)
router.post('/staff', authMiddleware, adminMiddleware, staffController.registerStaff);

router.get('/appointments', staffController.getAppointments);

module.exports = router;*/

// Sample in-memory staff data (Replace with DB logic later)
let staffList = [
  { id: 1, name: "John Doe", role: "Secretary" },
  { id: 2, name: "Sara Ahmed", role: "Registrar" }
];

// GET all staff
router.get('/staff', (req, res) => {
  res.json(staffList);
});

// GET a specific staff by ID
router.get('/staff/:id', (req, res) => {
  const staffId = parseInt(req.params.id);
  const staff = staffList.find(s => s.id === staffId);
  if (staff) {
    res.json(staff);
  } else {
    res.status(404).json({ error: "Staff not found" });
  }
});

// POST a new staff
router.post('/staff', (req, res) => {
  const { name, role } = req.body;
  const newStaff = {
    id: staffList.length + 1,
    name,
    role
  };
  staffList.push(newStaff);
  res.status(201).json(newStaff);
});

// PUT update a staff member
router.put('/staff/:id', (req, res) => {
  const staffId = parseInt(req.params.id);
  const staffIndex = staffList.findIndex(s => s.id === staffId);
  if (staffIndex !== -1) {
    const { name, role } = req.body;
    staffList[staffIndex] = { id: staffId, name, role };
    res.json(staffList[staffIndex]);
  } else {
    res.status(404).json({ error: "Staff not found" });
  }
});

// DELETE a staff member
router.delete('/staff/:id', (req, res) => {
  const staffId = parseInt(req.params.id);
  const staffIndex = staffList.findIndex(s => s.id === staffId);
  if (staffIndex !== -1) {
    const deleted = staffList.splice(staffIndex, 1);
    res.json({ message: "Staff deleted", staff: deleted[0] });
  } else {
    res.status(404).json({ error: "Staff not found" });
  }
});

module.exports = router;