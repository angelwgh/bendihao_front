const express = require('express');
const demoesController = require('../../controllers/demoController')
const router = express.Router();


console.log(demoesController)
router.get('/getDemoesList', (req, res, next) => {
    // console.log(req.query)
    demoesController.getDemoesList(req.query)
    .then((result) => {
        res.send(result)
    })
    .catch( (err)=>{
        res.send(err)
    })
    
})

router.get('/getDemoDetail', (req, res, next) => {
    const id = parseInt(req.query.id)
    if(id){
        demoesController.getDemoDetail(id)
            .then((ret)=>{
                res.send(ret)
            })
            .catch( (err) => {
                res.send(err)
            } )
    } else {
        res.send({
            status:0,
            msg:'参数错误'
        })
    }
    
})

module.exports = router