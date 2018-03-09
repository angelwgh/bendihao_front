const fs = require ('fs')
const path = require('path')
const utils = require('../../util/utils')

const LIST_PATH = path.join(__dirname, '../../datas/demo/list.json')

class DemoesController {
    constructor () {

    }
    
    async getDemoesList (params) {
        let result;
        const type = params === undefined
        const pageNo = params && params.pageNo || 2;
        const pageSize = params && params.pageSize || 10;

        await new Promise( (resolve) => {
            fs.readFile(LIST_PATH,'utf8', (err, data) => {
                // console.log(LIST_PATH)
                if(err){
                    result = {
                        status: 0,
                        msg: '列表读取错误'
                    }
                }else{
                    
                    
                    result = type === true ? JSON.parse(data).list:
                         utils.paging(JSON.parse(data).list, pageNo, pageSize)
                }
                // console.log(JSON.parse(data))
                
                resolve()
            })
        } ) 

        return result;
    }

    async getDemoDetail (id) {
        let result;
        await new Promise( (resolve) => {
            this.getDemoesList()
                .then( (ret) => {
                    // console.log(ret)
                    const len = ret.length || 0;
                    for( let i = 0; i < ret.length; i++){
                        if(ret[i].id == id){
                            result ={
                                jsonBody: ret[i],
                                status: 1,
                                msg: '查询成功'
                            } 
                            break;
                        }
                    }

                    resolve()
                })
        } )

        return result;
    }
}

module.exports = new DemoesController()