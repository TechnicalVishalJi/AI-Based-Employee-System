const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/employees
// @desc    Add Employee
// @access  Private
router.post('/', authMiddleware, employeeController.addEmployee);

// @route   GET api/employees
// @desc    Get All Employees
// @access  Private
router.post('/search', authMiddleware, employeeController.searchEmployee); // changed to avoid conflict
router.get('/search', authMiddleware, employeeController.searchEmployee);

router.get('/', authMiddleware, employeeController.getAllEmployees);


module.exports = router;
