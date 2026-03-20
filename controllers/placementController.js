const Student = require('../models/Student');
const Application = require('../models/Application');

exports.markStudentAsPlaced = async (req, res) => {
    try {
        const { studentId, companyId, packageOffered } = req.body;

      
        if (!studentId || !companyId || !packageOffered) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student ID, Company ID, and Package are required.' 
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            {
                status: 'Placed',
                placedInCompany: companyId,
                packageOffered: packageOffered,
                isEligibleForPlacement: false 
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        await Application.findOneAndUpdate(
            { student: studentId, company: companyId },
            { status: 'Offered' }
        );

        res.status(200).json({
            success: true,
            message: 'Student successfully marked as placed!',
            data: updatedStudent
        });

    } catch (error) {
        console.error("Placement Error:", error);
        res.status(500).json({ success: false, message: 'Server error during placement update.' });
    }
};