<template>
    <div class="menu-lists">
        <el-menu
                default-active="/projectFile"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                router
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <div v-for="(item,index) in menuList" :key="index">
                <el-submenu v-if="item.children.length>0" router :index="item.name">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for="(i,id) in item.children" route :index="i.route">
                            {{i.name}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item :route="{name:item.route}" :index="item.route" v-if="item.children.length===0"
                              index="">{{item.name}}
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Aside",
        data() {
            return {
                menuList: [
                    {
                        name: "高新申报", route: '', children: [
                            {name:"上传文件",route:'/projectFile',children:[]},
                            {name:"数据查询",route:'/projectDetails',children:[]}
                        ]
                    }
                ]
            }
        },
        methods: {
            handleOpen: function () {
                console.log(1);
            },
            handleClose: function () {
                console.log(2);
            }
        },
        created: function () {


        }
    }
</script>

<style scoped>

</style>
