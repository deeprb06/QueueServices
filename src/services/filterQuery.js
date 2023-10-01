const getFilterQuery = async (query) => {
    if (query.search && query.search !== '') {
        const searchQuery = query.searchColumns.map((column) => {
            return {
                [column]: {
                    $regex: `${query.search.replace(
                        /[-[\]{}()*+?.,\\/^$|#\s]/g,
                        '\\$&',
                    )}`,
                    $options: 'i',
                },
            };
        });
        if (query['$or'] !== undefined) {
            query['$and'] = [{ $or: query['$or'] }, { $or: searchQuery }];
            delete query['$or'];
        } else {
            query['$or'] = searchQuery;
        }
        delete query.search;
        delete query.searchColumns;
    }

    return query;

    /**
     * if (query.search && query.search !== '') {
        query['$or'] = query.searchColumns.map((column) => {
            return {
                [column]: {
                    $regex: query.search
                        .replace(/[-[\]{}()*+?.,\\/^$|#]/g, '\\$&')
                        .trim(),
                    $options: 'i',
                },
            };
        });
    }
    delete query.search;
    delete query.searchColumns;
    return query;
     */
};

module.exports = {
    getFilterQuery,
};
