<template>
    <div style="position: relative; width: 100%;"> 
        <div class="text">Dataset</div>
        <select class="dataset" @change="changeDataSet">
            <option v-for="item in file_name">{{item}}</option>  
        </select>
        <input type="file" id="filename" @change="toReadInputFile" style="display:none"/>
    </div>
</template>

<style scoped>
select{
    display: inline-block;
    border: 2px #C6D7E5 solid;
    border-radius: 20px ;
    background-color: #F1F4FA;
    color: #809FB8;
    outline: none;
    position: absolute;
    right: 10%;
    text-align:center;
    font-size: 14px;
    margin-top: 2px;
}

.text{
  color:#2932FF;
  padding-left: 15%;
  padding-top: 5px; 
  display: inline-block; 
  font-size:16px; 
  font-weight: bold;
}


</style>

<script>
import { data_value, data_type_name, DATA_TYPE, data_field, data_value_line } from '../util/dataManager'
import bus from '../util/eventBus'

export default{
    data(){
        return{
            file_name:['null','airline','BeijingAir','population',
                'hardDrive','reading', 'stocks', 'weather','covid-19','load data'
            ]
        };
    },

    methods:{
        toCallback(){
            bus.emit("updateDataset", null);
        },

        /// read example file
        readCsvFile(filename, callback){
            var xhr;
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }
            else{
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open("GET",filename, true);
            xhr.overrideMimeType("text/html;charset=utf-8");
            xhr.send(null);
            xhr.onload = function(){
                if(xhr.status === 200){
                    // console.log(xhr.responseText);
                    let data_string = xhr.responseText;

                    data_value.splice(0, data_value.length); 
                    // <==> data_value.clear();
                    data_type_name.splice(0, data_type_name.length);
                    data_value_line.splice(0, data_value_line.length);

                    let data_list = data_string.split("\n");
                    let data_each_name = data_list[0].split(",");

                    for(let i=0, len=data_each_name.length; i<len; i++){
                        data_type_name.push(data_each_name[i]);
                    }
                    let cnt = 0;                    
                    let tmp_name = "";
                    let not_number_column = [];
                    data_field["x_is_date"] = false;
                    
                    for(let i=1, len=data_list.length; i<len; i++){
                        if(data_list[i].length < 1) continue;
                        let data_each = data_list[i].split(",");

                        if(tmp_name != data_each[0]){
                            tmp_name = data_each[0];
                            cnt++;
                            if(cnt > DATA_TYPE) break;
                        }

                        let data_json = { };
                        data_json[data_each_name[0]] = data_each[0];
                        for( let j=1, len2=data_each_name.length; j<len2; j++){
                            if(Number(data_each[j]) !== Number(data_each[j])){
                                if(j === 1){/// time series
                                    data_field["x_is_date"] = true;
                                    data_json[data_each_name[j]] = new Date(data_each[j]);
                                }
                                else{
                                    if(not_number_column.indexOf(j)===-1) not_number_column.push(j);
                                    data_json[data_each_name[j]] = data_each[j];
                                }
                            }
                            else{
                                data_json[data_each_name[j]] = Number(data_each[j]);
                            }
                        }
                        data_value.push(data_json);
                    }

                    for(let i=2, len=data_each_name.length; i<len; i++){
                        if(not_number_column.indexOf(i)===-1)
                            data_value_line.push(i)
                    }
                    callback();
                }
            }
        },

        /// read other file
        readInputFile(callback){
            var filelist = this.inputfile.files;
            if(filelist.length === 0) return;

            var reader = new FileReader();
            reader.readAsText(filelist[0]);
            reader.onload = function(e){
                // console.log(e.target.result);
                let data_string = e.target.result;

                data_value.splice(0, data_value.length); 
                // <==> data_value.clear();
                data_type_name.splice(0, data_type_name.length);
                data_value_line.splice(0, data_value_line.length);

                let data_list = data_string.split("\n");
                let data_each_name = data_list[0].split(",");

                for(let i=0, len=data_each_name.length; i<len; i++){
                    data_type_name.push(data_each_name[i]);
                }
                let cnt = 0;                    
                let tmp_name = "";
                let not_number_column = [];
                data_field["x_is_date"] = false;
                
                for(let i=1, len=data_list.length; i<len; i++){
                    if(data_list[i].length < 1) continue;
                    let data_each = data_list[i].split(",");

                    if(tmp_name != data_each[0]){
                        tmp_name = data_each[0];
                        cnt++;
                        if(cnt > DATA_TYPE) break;
                    }

                    let data_json = { };
                    data_json[data_each_name[0]] = data_each[0];
                    for( let j=1, len2=data_each_name.length; j<len2; j++){
                        if(Number(data_each[j]) !== Number(data_each[j])){
                            if(j === 1){/// time series
                                data_field["x_is_date"] = true;
                                data_json[data_each_name[j]] = new Date(data_each[j]);
                            }
                            else{
                                if(not_number_column.indexOf(j)===-1) not_number_column.push(j);
                                data_json[data_each_name[j]] = data_each[j];
                            }
                        }
                        else{
                            data_json[data_each_name[j]] = Number(data_each[j]);
                        }
                    }
                    data_value.push(data_json);
                }

                for(let i=2, len=data_each_name.length; i<len; i++){
                    if(not_number_column.indexOf(i)===-1)
                        data_value_line.push(i)
                }
                callback();
            }
        },

        toReadInputFile(){
            this.readInputFile(this.toCallback);
        },

        changeDataSet(){
            if(this.file.value === this.file_name[0]){
                alert("This is not a data file!")
            }
            if(this.file.value === this.file_name[this.file_name.length-1]){
                this.inputfile.click();
                this.file.value = null;
            }
            else{
                for(let i=1, len=this.file_name.length-1; i<len; i++){
                    if(this.file.value === this.file_name[i]){
                        this.readCsvFile("./data/"+this.file_name[i]+".csv", this.toCallback);
                    }
                }
            }
            console.log("finish reading file. ");
        },
    },

    mounted(){
        this.file = document.querySelector(".dataset");
        this.inputfile = document.getElementById("filename");
    }
}
</script>