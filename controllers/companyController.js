const Company = require('../models/Company');


exports.updateCompanyStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const { id } = req.params;

       
        const validStatuses = ['Upcoming', 'Ongoing', 'Completed', 'Not Scheduled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const company = await Company.findByIdAndUpdate(
            id,
            { placementStatus: status },
            { new: true } 
        );

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json({
            success: true,
            message: `Drive status updated to ${status}`,
            data: company
        });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};