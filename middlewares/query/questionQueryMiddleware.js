
const asyncErrorWrapper = require("express-async-handler");
const { 
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
} = require('./queryMiddlewareHelpers');
const questionQueryMiddleware = function(model,options){

    return asyncErrorWrapper(async function(req,res,next){
        // Inıtıal Query
        let query = model.find();

        // Search

        query = searchHelper("title",query,req);

        if(options && options.population) {
            query = populateHelper(query, options.population);
        }
        const total = await model.countDocuments();
        query = questionSortHelper(query,req);

        // Pagination

        const paginationResult = await paginationHelper(total, query, req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        }
        next();
    });
};

module.exports = questionQueryMiddleware;