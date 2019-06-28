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
        return http.get(`${baseUrl}/v1.0/management/gate/group`, param, callbak)
    },
    //用户列表
    accountLists(param,callbak){
        return http.get(`${baseUrl}/v1.0/auth/account`, param, callbak)
    },
    //注册用户
    register(param,callbak){
        return http.post(`${baseUrl}/v1.0/auth/register`, param, callbak)
    },
    //修改用户权限
    editAccount(param,callbak){
        return http.put(`${baseUrl}/v1.0/auth/account`, param, callbak)
    },
    //删除用户
    deleteAccount(username,callbak){
        return http.delete(`${baseUrl}/v1.0/auth/account/${username}`, callbak)
    },
    //查询账号配额
    quota(param,callbak){
        return http.get(`${baseUrl}/v1.0/auth/account/quota`, param, callbak)
    },
    //删除通行证
    deletePermits(id,callbak) {
        return http.delete(`${baseUrl}/v1.0/management/permits/${id}`, callbak)
    },
    //查看开闸记录
    passLog(param,callbak){
        return http.get(`${baseUrl}/v1.0/management/gate/pass-log`, param, callbak)
    },
    //查看卡口状态
    gateStatus(param,callbak){
        return http.get(`${baseUrl}/v1.0/gate/status`, param, callbak)
    },
    //关闭卡口
    gateClose(param,callbak){
        return http.post(`${baseUrl}/v1.0/gate/gate-close`, param, callbak)
    },
    //开启卡口
    gateRecover(param,callbak){
        return http.post(`${baseUrl}/v1.0/gate/gate-recover`, param, callbak)
    },
    //取消通行证
    cancelPermits(param,id,callbak){
        return http.post(`${baseUrl}/v1.0/management/permits/cancel/${id}`, param, callbak)
    },
    //白名单列表
    gateWhitelist(param,callbak){
        return http.get(`${baseUrl}/v1.0/gate/whitelist`, param, callbak)
    },
    //添加白名单
    addWhitelist(param,callbak){
        return http.post(`${baseUrl}/v1.0/gate/whitelist`, param, callbak)
    },
    //删除白名单
    deleteWhitelist(id,callbak) {
        return http.delete(`${baseUrl}/v1.0/gate/whitelist/${id}`, callbak)
    },
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