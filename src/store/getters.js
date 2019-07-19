const getters = {
    getUserId:(state)=>state.userInfo.id,      //获取用户的id
    getUserInfo:(state) => state.userInfo,      //获取用户的所有信息；
}



export default getters
