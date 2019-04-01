import Vue from 'vue';
import Vuex from 'vuex';
import managementPermits from "./modules/managementPermits";
import localDb from '../util/localDb'
Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        token: localDb.get('TOKEN',localDb.get('isRem')),
        userName: localDb.get('userName'),
        isRem: localDb.get('isRem'),
        authorities: localDb.get('authorities'),
        NewMsg:{
            Msgs:[
                {
                    title:'暂无消息',
                    content:'暂无消息！',
                    url:'#no_msg',
                    id:'no_msg'
                }
            ]
        },
    },
    mutations:{
        modifyMsg (state,Obj){
            // if(state.NewMsg.Msgs[0].id === 'no_msg'){
            //     state.NewMsg.Msgs.shift();
            // }
            // var obj = {
            //     title:Obj.title,
            //     content:Obj.content
            // };
            // obj.id = 'Msg_' + Obj.id;
            // obj.url = '#' + obj.id;
            // state.NewMsg.Msgs.push(obj);
        },
        SETTOKEN (state, payload){
            state.token = payload.token;
            localDb.set('TOKEN',payload.token,payload.isRem)
            if(payload.isRem){
                localDb.clear('2','TOKEN')
            }else{
                localDb.clear('1','TOKEN')
            }
            
        },
        SETUSER (state, payload ){
            localDb.set('userName',payload.userName)
            state.userName = localDb.get('userName');
        },
        SETISREM (state, payload ){
            localDb.set('isRem',payload)
            state.isRem = payload;
        },
        SETAUTHORTIES (state, payload ){
            localDb.set('authorities',payload)
            state.authorities = payload;
        }
    },
    actions:{
        setUser(context, payload ){
            context.commit( 'SETUSER', payload );
        },
        setToken(context, payload ){
            context.commit( 'SETTOKEN', payload );
        },
        setIsRem(context, payload ){
            context.commit( 'SETISREM', payload );
        },
        setAuthorties(context, payload ){
            context.commit( 'SETAUTHORTIES', payload );
        },
        fetchMsg (context){
            // $.ajax({
            //         url:'PHP/GetMsgs.php',
            //         type:'GET',
            //         data:{},
            //         dataType:'json',

            //         success:function(response){
            //             if ( typeof response === 'string') {
            //                 response = JSON.parse(response);
            //             }
            //             console.log(response);
            //             $(response).each(function(k,v){
            //                 // console.log(v.id+v.title+v.content);
            //                 context.commit('modifyMsg',v);
            //             });
            //         }
            //     });
        }
    },
    modules: {
        managementPermits,  //通行证审批
    }
});
export default store;