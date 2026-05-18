const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, department, skills, performanceScore, experience } = req.body;

        // Basic validation
        if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ error: 'Employee with this email already exists' });
        }

        employee = new Employee({
            name,
            email,
            department,
            skills,
            performanceScore,
            experience
        });

        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.searchEmployee = async (req, res) => {
    try {
        const { department, name } = req.query;
        let query = {};
        
        if (department) {
            query.department = { $regex: new RegExp(department, 'i') };
        }
        if (name) {
            query.name = { $regex: new RegExp(name, 'i') };
        }

        const employees = await Employee.find(query);
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateScore = async (req, res) => {
    try {
        const { performanceScore } = req.body;
        if (performanceScore === undefined || performanceScore < 0 || performanceScore > 100) {
            return res.status(400).json({ error: 'Please provide a valid performance score (0-100)' });
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { performanceScore },
            { new: true } // Returns the updated document
        );

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};
