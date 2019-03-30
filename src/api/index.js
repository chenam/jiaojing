const baseUrl = process.env.API_URL ? process.env.API_URL : '';
import http from './http'

export default{
    // 登录
    authLogin(param,callbak) {
        return http.post(`${baseUrl}/v1.0/auth/login`, param, callbak)
    },
    // 修改密码
    resetPsd(param,callbak) {
        return http.post(`${baseUrl}/v1.0/auth/account`, param, callbak)
    },
    examList(param,callbak) {
        return http.get(`${baseUrl}/v1.0/management/permits`, param, callbak)
    },
    examApply(param,callbak) {
        return http.get(`{baseUrl}/v1.0/management/permitsv1.0/auth/login`, param, callbak)
    },
    //通行证列表
    managementPermits(param,callbak) {
        return http.get(`${baseUrl}/v1.0/management/permits`, param, callbak)
    },
    //查看通行证
    lookPermits(id) {
        return http.get(`${baseUrl}/v1.0/management/permits/${id}`)
    },
    //审批通行证
    approvalPermits(param,id,callbak) {
        return http.post(`${baseUrl}/v1.0/management/permits/${id}`, param, callbak)
    },
    //审批通行证备注
    opinions(param,callbak) {
        return http.get(`${baseUrl}/v1.0/management/opinions`, param, callbak)
    },
    //查看图片
    photoPath(param,callbak){
        return http.get(`${baseUrl}/v1.0/management/photo`, param, callbak)
    },
    //通行证
    permitsInfo(param,id,callbak){
        return http.get(`${baseUrl}/v1.0/management/permits/${id}/info`, param, callbak)
    },
    //关卡
    gateNames(param,callbak){
        return http.get(`${baseUrl}/v1.0/management/gate/names`, param, callbak)
    }
}


// 上传图片
// export const uploadImg = params => {
//     // return axios.post(`${base}/article/editorUpload`,params);
//     return axios({
//         url: `${base}/article/editorUpload`,
//         method: 'post',
//         data: params,
//         headers: { 'Content-Type': 'multipart/form-data' }
//     })
// }