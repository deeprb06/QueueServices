const exportData = async (req) => {

    req.body.options = {
        pagination: false,
    };

    req.body.query = {
        search: req.query.search,
        searchColumns: req.query?.searchColumns?.split(','),
    };

    const result = await getData(req);
    const columns = [
        { header: 'Sr. No.', key: 'srNo' },
        { header: 'User Name', key: 'userName' },
        { header: 'Date', key: 'date' },
        { header: 'Total Amount', key: 'totalAmount' },
        { header: 'Status', key: 'status' },
    ];
    const fileName = `Transaction list`;

    const exportData = result.data.map((item, index) => {
        return {
            srNo: index + 1,
            userName: item?.userId?.fullName || '-',
            date: item?.createdAt
                ? moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')
                : '-',
            totalAmount: item?.amt || '-',
            status: item?.stsNm || '-',
        };
    });
    const workbook = await dbService.exportToExcel(
        'Sheet',
        columns,
        exportData,
    );
    return {
        workbook,
        fileName: `${fileName}.xlsx`,
    };
};

module.exports = {
    exportData
}
