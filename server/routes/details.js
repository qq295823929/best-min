var express = require('express');
var router = express.Router();
const query=require('./mysql');

/* GET users listing. */
router.post('/searchById', function (req, res, next) {
    let id=req.body.id;


    let sql=`SELECT
        a.filename,
        a.project_name,
        a.project_num,
        a.project_time,
        a.origin,
        a.study_person,
        a.study_cost,
        a.spend_of_three,
        a.spend_details1,
        a.spend_details2,
        a.spend_details3,
        a.project_purpose,
        a.main_point,
        a.project_result,
        b.years,
        b.study_cost_count
    FROM
    establishment a
    LEFT JOIN study_cost b ON a.project_num = b.project_name where a.id=${id}`;

    query(sql,function (data) {
        if(data.length>0){

            var result=data[0];
            result.cost=[];
            for(let i=0;i<data.length;i++){
                var obj={
                    years:data[i].years,
                    cost:data[i].study_cost_count
                }
                result.cost.push(obj)
            }
            res.send(result);
        }
    })
















    // res.send('respond with a resource');
});

router.post('/getProjectList',function (req,res,next) {
    let sql='select * from establishment';
    query(sql,function (data) {
        res.send(data);
    })



})

module.exports = router;
