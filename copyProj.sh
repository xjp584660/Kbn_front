#!/bin/bash 


kbn_proj_path="/Users/xue/Desktop/kbn_/client/Unity"
kbn_local_proj_path="/Users/xue/Desktop/Kbn_front"


echo  -e " \n -------------------------------------------- "
kbn_proj_assets_path=$kbn_proj_path/Assets
kbn_proj_ps_path=$kbn_proj_path/ProjectSettings

# 检查 原工程文件目录是否存在
if [ ! -d $kbn_proj_assets_path ];then
    echo -e "\033[31m \n 不存在目录： $kbn_proj_assets_path   \033[0m"
    echo -e " -------------------------------------------- "

    exit -1
fi

assets_path=$kbn_local_proj_path/Assets
ps_path=$kbn_local_proj_path/ProjectSettings


echo  -e "\n 清空 " $assets_path
# ---------------------- 1 ----------------------
# 删除掉 原有的 kbn_local project 文件
if [ -d $assets_path ];then
    rm -rf $assets_path
fi

if [ -d $ps_path ];then
    rm -rf $ps_path
fi

# if [ ! -d $kbn_local_proj_path ];then
#     # 如果不存在 kbn_local project 目录 ，则需要创建
#     mkdir -p $kbn_local_proj_path
# fi




echo  -e "\n\n 拷贝文件中... "

# ---------------------- 2 ----------------------
# 拷贝 所有的 kbn  文件到 kbn_local 中
cp -pr $kbn_proj_assets_path $assets_path

cp -pr $kbn_proj_ps_path $ps_path

echo  -e "\n\n\n 拷贝文件完成 "






# ---------------------- 3 ----------------------
# 剔除掉多余的 文件

ab_dir=$assets_path/OTA_AssetBundles
ab_dir_meta_file=$assets_path/OTA_AssetBundles.meta
ota_Resour=$assets_path/OTA_Resources
ota_Resour_meta_file=$assets_path/OTA_Resources.meta

if [ -f $ab_dir_meta_file ];then
    rm -rf $ab_dir_meta_file
fi

if [ -d $ab_dir ];then
    rm -rf $ab_dir rm -rf
fi

if [ -f $ota_Resour_meta_file ];then
    rm -rf $ota_Resour_meta_file
fi

if [ -d $ota_Resour ];then
    rm -rf $ota_Resour rm -rf
fi

# if [-f $ota_Resour_meta_file];then
#     rm -rf $ota_Resour_meta_file
# fi

# if [-d $ota_Resour];then
#     rm -rf $ota_Resour rm -rf
# fi

echo -e "\033[32m\n\n 操作完成 \033[0m"
echo -e " -------------------------------------------- "
