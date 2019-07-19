<template>
    <div class="login-content">
        <div class="login-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="login">立即登录</el-button>
                </el-form-item>
            </el-form>
            <div></div>
        </div>
    </div>
</template>

<script>
    import qs from 'qs';
    import md5 from 'js-md5';
    export default {
        name: "Login",
        data(){
            let validatorUserName=(rule,value,callback)=>{
                console.log(rule);
                console.log(value);
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }else if(value.length>16){
                    return callback(new Error('用户名长度不能超过16位'))
                }
            };
            let validatorPassWord=(rule,value,callback)=>{
                console.log(rule);
                console.log(value);
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }else if(value.length>16){
                    return callback(new Error('密码长度不能超过16位'))
                }
            }
            return {
                form: {
                    username: "jiangmin",
                    password: "id511518",
                },
                rules:{
                    username: [ { validator: validatorUserName, trigger: 'blur' }],
                    password:[ { validator: validatorPassWord, trigger: 'blur' }]
                }
            }
        },
        methods:{
            login:function () {
                let self=this;

                if (this.form.username == '') {

                    return false;
                }
                if (this.form.password == '') {

                    return false
                }
                let params={
                    "username":self.form.username,
                    "password":md5(self.form.password)
                };
                params=qs.stringify(params);
                let url='/user/login';
                this.$http({"url":url,"method":"post",data:params}).then((res)=>{
                    console.log(res);
                    let data=res.data;

                    if(data.state===1){
                        let userInfo=data.data;
                        self.$router.replace({name:'ProjectFile',});

                    }

                })
            }
        }
    }
</script>

<style scoped>
    .login-content{
        background: #f5f5f5;
        height: 100%;
    }
    .login-form{
        width: 500px;
        margin: 0 auto;
        padding: 160px 0 0 0;
    }



</style>
