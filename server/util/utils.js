class Utils {
    paging (array, pageNo, pageSize) {
        const result = {
            pageNo: parseInt(pageNo) || 1,
            pageSize: parseInt(pageSize) || 10,
            totalSize: array && array.length,
            jsonBody: array.slice((pageNo - 1) * pageSize, pageNo * pageSize)
        }
        
        // result.totalSize = array && array.length;

        return result
    }
}

module.exports = new Utils()