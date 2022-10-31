
#-----------------------------------------------------------------------
#定义格式化输出样式
outputInfoTips_yellow(){
	echo "\033[33m" $1 "\033[0m"
}
	

outputInfoTips_green(){
	echo "\033[32m"$1 "\033[0m"
}

outputInfoTips_red(){
    echo "\033[31m" $1 "\033[0m"
}

outputInfoTips_normal(){
    echo $1
}


# ======================== texture type ========================
outputInfoTips_yellow "\n输入 要打开的项目(输入 1、 2、 3; 1:KBN  2:KBN_  3:KBN_000):"
read texture_type_val

while ([[ $texture_type_val -ne 1 ]] && [[ $texture_type_val -ne 2 ]] && [[ $texture_type_val -ne 3 ]] && [[ $texture_type_val -ne 4 ]] && [[ $texture_type_val -ne 5 ]])
do
    outputInfoTips_red "\n输入错误！重新输入要打开的项目 (输入 1、 2、 3; 1:KBN  2:KBN_  3:KBN_000):"
    read texture_type_val
done

if [ $texture_type_val -eq 1 ];then
    texture_type="KBN"
elif [ $texture_type_val -eq 2 ];then
    texture_type="KBN_"
else [ $texture_type_val -eq 3 ]
    texture_type="KBN_000"
fi
# elif [ $texture_type_val -eq 4 ];then
#     texture_type="PVRTC"
# else
#     texture_type="All"




unity_path='/Applications/Unity/Hub/Editor/2017.4.40c1/Unity.app'

project_path_prefix='/Users/xue/Desktop/'

project_path_suffix='/client/Unity'

build_target='ios'

project_path=$project_path_prefix$texture_type$project_path_suffix

outputInfoTips_green $project_path





open -n $unity_path --args  -projectPath $project_path -buildTarget $build_target 

exit