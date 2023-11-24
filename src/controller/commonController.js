const commonService = require('../services/common');

const exportData = catchAsync(async (req, res) => {
    const { workbook, fileName } = await commonService.exportData(req);
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    workbook.xlsx.write(res).then(function () {
        res.end();
    });
});

module.exports = {
    exportData
}
