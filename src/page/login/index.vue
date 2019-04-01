<template>
<div class="leyer-wrapper">
	
    <div class="layer">
        <div class="layer-flex">
			<div class="an-title">
				<img :src="logoImg" alt="安阳交警管理平台">
				<span>安阳交警</span>
			</div>
			
			<h6 class="an-tip">请输入登陆信息</h6>
            <div class="formBox">
                <el-form labelPosition="top" :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item label="用户名：" prop="userName">
                        <el-input 
							placeholder="请输入" 
							:maxlength="m20" 
							v-model="loginForm.userName"
						></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="passWord">
                        <input 
							class="el-input__inner" 
							@keyup.enter="submitForm" 
							placeholder="请输入" 
							type="password" 
							:maxlength="m14" 
							v-model="loginForm.passWord" 
						/>
                    </el-form-item>
                </el-form>
                <div class="btn-footer">
					<el-checkbox v-model="loginForm.remember_me" class="footer-check">记住我</el-checkbox>
                    <el-button 
						:disabled="disabled" 
						class="footer-btn" 
						type="primary" 
						@click="submitForm"
					>登录</el-button>

                </div>
            </div>
        </div>
        
    </div>
	<div class="an-footer">
		<p>Copyright © 2019  安阳市公安局交通警察支队</p>
				<p>豫ICP备19007535号</p>
	</div>
</div>  
</template>

<script>
import Api  from '../../api/index.js';
import localDb from '../../util/localDb.js'
import logoImg from '@/assets/images/coin.png'
export default {
	name: 'HelloWorld',
	data () {
        // 校验用户名
		let verifyUserName = function(rule, value, callback){
				let val = value;
				if(!val){
					callback('请输入用户名');
				}else if(!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/.test(val)){
					// callback('用户名仅支持2-20位中英文、数字和下划线  ');
					callback()
				}else{
					callback();
				}
		};
		// 校验密码
		let verifyPassWord = function(rule, value, callback){
			let val = value;
			if(!val){
				callback('请输入密码');
			}else if(!/^[a-zA-Z0-9_!@#$%^&*()_+]{6,14}$/.test(val)){
				callback()
				// callback('密码仅支持6-14位大小写字母，数字和标点符号');
			}else{
				callback();
			}
		}
		return {
			loginForm: {
                userName: '',
				password: '',
				remember_me: true,
				
			},
			logoImg: logoImg,
            m14: 14,
            m20: 20,
            // 校验
			rules : {
				userName : [
					{ required:true,validator : verifyUserName, trigger: 'blur'}
				],
				passWord : [
					{ required:true,validator : verifyPassWord, trigger: 'blur' }
				]
            },
            disabled: false
		}
	},
	mounted(){
	},
    methods: {
        // 点击提交
		submitForm : function(){
			let self = this;
			this.$refs.loginForm.validate((valid) => {
				// 通过校验
				if(valid){
					this.disabled = true;

					const {userName, passWord,remember_me} = this.loginForm;
					let _remember_me = 0;
					if(remember_me){
						_remember_me = 1;
					}
					let params = {
						"username": userName.trim(),
						"password":passWord.trim(),
						"remember_me":_remember_me  // 记住我 0 不记，1记
					}
					Api.authLogin(params)
					.then((response) =>{
						this.disabled = false;
						if(response && response.status === 200){
							// 设置token
							let _user = {
								isRem: _remember_me,
								token: response['headers']['x-auth-token'],
								userName: response.data.sub
							}
							// localDb.clear('3')
							this.$store.dispatch('setToken', _user)
							this.$store.dispatch('setUser', _user)
							this.$store.dispatch('setIsRem',_remember_me)
							this.$store.dispatch('setAuthorties',response.data.authorities)
							// this.$store.dispatch('setAuthorties',[])
							this.$router.push({path: "/unexam"});
							if(localStorage.getItem('uid') !== null){
								localStorage.removeItem('uid');
							}
							localStorage.setItem('uid',response.data.uid);
						}else{

						}
						
						
					})
					.catch((error) => {
						this.disabled = false;
					});
				}else{
					return false;
				}
			});
		},
		// 重置 表单
		reset : function(){
			this.$refs.loginForm.resetFields();
		}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.leyer-wrapper{
	position: relative;
	background:#f1f1f1;
	
}
.layer{
    min-height: 100vh;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
	flex-direction: column;
	
    .layer-flex{
		position: relative;
        width: 500px;
		height: 400px;
		border-radius: 5px;
		background: #fff;
		padding: 30px 60px 10px 60px;
		box-shadow: 0 0 8px rgba(0,0,0,.1);
    }
}
.btn-footer{
	height: 40px;
	padding-top: 20px;
	.footer-check{
		height: 40px;
		line-height: 40px;
	}
	.footer-btn{
		float: right;
	}
}

</style>
