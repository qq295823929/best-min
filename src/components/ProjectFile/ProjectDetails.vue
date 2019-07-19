<template>
    <div class="project-details">
        <div class="">
            <ul class="project-lists">
               <li class="project-list" v-for="(item,id) in projectList" @click="getProjectDetails(item)"   :key="id" :class="id===activeId?'active':''">
                   <span>{{item.project_num}}</span>
                   <div>{{item.project_name}}</div>
               </li>
            </ul>
        </div>
        <div class="details_table">
            <div class="details-content">
                <div class="details-item-2">
                    <div class="item-name">项目名称:</div>
                    <div class="item-con"><p id="project_name">{{projectInfo.project_name}}</p></div>
                </div>
                <div class="details-item-2">
                    <div class="item-name">项目编号:</div>
                    <div class="item-con"><p id="project_num"></p>{{projectInfo.project_num}}</div>
                </div>
                <div class="details-item-2">
                    <div class="item-name">起止时间:</div>
                    <div class="item-con"><p id="project_time"></p>{{projectInfo.project_time}}</div>
                </div>

                <div class="details-item-2">
                    <div class="item-name">技术来源:</div>
                    <div class="item-con"><p id="origin"></p>{{projectInfo.origin}}</div>
                </div>
                <div class="details-item-3">
                    <div class="item-name">本项目研发人员数:</div>
                    <div class="item-con"><p id="study_person">{{projectInfo.xxxxxx}}</p></div>
                </div>
                <div class="details-item-3">
                    <div class="item-name">研发经费总预算:</div>
                    <div class="item-con"><p id="study_cost">{{projectInfo.xxxxxx}}</p></div>
                </div>
                <div class="details-item-3">
                    <div class="item-name">研发经费近三年总支出(万元):</div>
                    <div class="item-con"><p id="spend_of_three">{{studyCost}}</p></div>
                </div>
                <div class="details-item-3">
                    <div class="item-name">其中:</div>
                    <div class="item-con">
                        <div class="item_tip" v-for="(item) in projectInfo.cost" :key="item"><span>{{item.years}}年:</span><span id="spend_details1">{{item.cost}}</span></div>
                    </div>
                </div>
                <div class="details-item">
                    <div class="item-name">立项目的及组织实施方式</div>
                    <div class="item-con"><p id="project_purpose">{{projectInfo.project_purpose}}</p></div>
                </div>
                <div class="details-item">
                    <div class="item-name">核心技术及创新点</div>
                    <div class="item-con"><p id="main_point"></p>{{projectInfo.main_point}}</div>
                </div>
                <div class="details-item">
                    <div class="item-name">取得的阶段性成果</div>
                    <div class="item-con"><p id="project_result"></p>{{projectInfo.project_result}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: "ProjectDetails",
        data(){
            return {
                projectList:[],
                projectInfo:{
                    filename: "",
                    main_point: '',
                    origin: null,
                    project_name:'',
                    project_num: "",
                    project_purpose: "",
                    project_result: "",
                    project_time: "",
                    cost:[],
                },
                activeId:''
            }
        },
        computed:{
            studyCost:function () {
                let cost=this.projectInfo.cost;
                let result=0;
                for(let i=0;i<cost.length;i++){
                    result+=parseFloat(cost[i].cost)
                }
                return result
            }
        },
        methods:{
            getProjectList:function () {
                var self=this;
                let url='http://127.0.0.1/details/getProjectList'
                this.$http({"url": url, "method": "post",}).then((res) => {
                    console.log(res);
                    self.projectList=res.data;

                })
            },
            getProjectDetails:function (obj) {
                var self=this;
                var id=obj.id;
                this.activeId=id;
                let params={
                    id:id
                };
                params=qs.stringify(params)
                let url='http://127.0.0.1/details/searchById';
                this.$http({"url": url, "method": "post",data:params}).then((res) => {
                    console.log(res);
                    self.projectInfo=res.data;
                })
                console.log(this.projectInfo);
            }
        },
        created:function () {
            this.getProjectList()
        }
    }
</script>

<style scoped>
    .project-lists{
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
    }
    .project-list{
        margin: 5px;
        background: #cccccc;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 3px 5px;
        border-radius: 3px;
    }

    .project-list>span{
        white-space: nowrap;
        line-height: 18px;
        font-size: 16px;
        font-weight: 700;
    }
    .project-list>div{
        line-height: 18px;
        font-size: 14px;
    }
    .project-list:hover{
        opacity: 0.85;
    }
    .project-list.active{
        background: #2a8170;
        color: #ffffff;
    }


    .details-content{
        border: 1px solid #e5e5e5;
        width: 1200px;
        display: flex;
        border-radius: 3px;
        flex-wrap: wrap;
        font-size: 16px;
    }
    .details-item{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e5e5e5;
        padding: 5px;
    }
    .details-item .item_con{
        width: 1000px;
    }
    .details-item>span{
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }
    .details-item-2{
        width: 50%;
        align-items: center;
        display: flex;
        justify-content: start;
        border: 1px solid #e5e5e5;
        padding: 5px;
    }
    .item-name{
        min-width: 200px;
    }
    .item-con{
        flex-grow: 1;
        color: #ff1d00;
    }
    .details-item-3{
        width: 33%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e5e5e5;
        padding: 5px;
    }



</style>
