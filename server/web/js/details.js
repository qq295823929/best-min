window.onload=function () {
    layui.use(['layer'],function () {
        var layer=layui.layer;



        var projectList=[];

        $.ajax({
            url:"http://127.0.0.1/details/getProjectList",
            type:"post",
            data:{
            },
            success:function (res) {
                console.log(res);
                projectList=res;
                var str='';
                for(var i=0;i<res.length;i++){
                    str+='<div class="project_list">';
                    str+=   '<span>'+res[i].project_num+'</span>';
                    str+=   '<p>'+res[i].project_name+'</p>';
                    str+='</div>';
                }
                $(".project_lists").html(str);
            }
        });



        $(".project_lists").on("click",".project_list",function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index=$(this).index();
            var data=projectList[index];
            var id=data.id;     //这个项目的id;

            $.ajax({
                url:"http://127.0.0.1/details/searchById",
                type:"post",
                data:{
                    id:id,
                },
                success:function (res) {
                    console.log(res);
                    if(res){
                        var data=res;
                        $("#project_name").html(data.project_name);
                        $("#project_num").html(data.project_num);
                        $("#project_result").html(data.project_result);
                        $("#origin").html(data.origin);
                        $("#main_point").html(data.main_point);
                        $("#project_purpose").html(data.project_purpose);
                        $("#project_time").html(data.project_time);
                        $("#spend_details1").html(data.spend_details1);
                        $("#spend_details2").html(data.spend_details2);
                        $("#spend_details3").html(data.spend_details3);
                        $("#spend_of_three").html(data.spend_of_three);
                        $("#study_cost").html(data.study_cost);
                        $("#study_cost_count").html(data.study_cost_count);
                        $("#study_person").html(data.study_person);
                        $("#xxxxxx").html(data.xxxxxxx);
                        $("#xxxxxx").html(data.xxxxxxx);
                        $("#xxxxxx").html(data.xxxxxxx);
                        $("#xxxxxx").html(data.xxxxxxx);










                    }



                }
            })



        })






        $(".search").on("click",function () {
            var keyWords=$("#project_keyword").val();

            if(keyWords===''){
                return false
            }

            $.ajax({
                url:"http://127.0.0.1/file",
                type:"post",
                data:{

                },
                success:function (res) {
                    console.log(res);
                }
            })




        })










    })
}
