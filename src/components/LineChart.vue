<template>
    <div style="width: 900px; height: 650px; margin-bottom:40px; border-radius: 20px; position: relative; border: 2px solid #F1F4FA;">
        <div class="text">Line Chart</div>
        <select class="select-linechart" @change="changeDataValue">
            <option v-for="item in data_value_name">{{item}}</option>  
        </select>

        <div id="chart"></div>  
    </div>
        
    
</template>

<style scoped>
.chart{
    position: bottom;
}

.text{
  color:#2932FF;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  border-radius: 20px;
  background-color: #F1F4FA;
}

select{
    margin: 12px;
    display: inline-block;
    border: 2px #C6D7E5 solid;
    border-radius: 20px ;
    color: #809FB8;
    outline: none;
    text-align:center;
    font-size: 14px;
    width: 100px;
    padding: 2px;
}

</style>

<script>
import * as vega from "vega"
import * as vegalite from "vega-lite"
import vegaEmbed from "vega-embed"

import { data_type_name, data_value, data_field, data_value_line } from '../util/dataManager'
import { getDataTime, getDataValue, calculateDataField } from "../util/dataManager"
import bus from "../util/eventBus"
import { data_lists, interactive_list, visualcode_object, pers_list, getTimeSpan, filter_list } from "../util/codeList"
import { LINECHART_WIDTH, LINECHART_HEIGHT } from "../util/parameters"
import { color_for_highlight, pers_index } from "../util/colorMapping"
import { stripAndRedirectConfig } from "vega-lite/build/src/config"

export default{
    data(){
        return{
            linechart:{
                "$schema":"https://vega.github.io/schema/vega-lite/v5.json", 
                "width": LINECHART_WIDTH,
                "height":LINECHART_HEIGHT,
                "data":{
                    "values":[]
                },
                "mark":"line",
                "labels": false,
                "encoding":{
                    //"x": { "field": "a", "type": "ordinal"},
                    //"x": { "field": "a", "type": "temporal"},
                    "x": { "field": "a", "type": "quantitative",
                        "scale":{"domain":[0, 100]},
                        "axis":{ "formatType": "number"}  
                    },
                    "y": { "field": "b", "type":"quantitative",
                        "scale":{"domain":[0, 100]}   
                    },
                    "color": {"field":"c", "type": "nominal", "legend":null,
                    // "scale": {"range": ["#00ffff", "#7fffd4", "#fedd00"]} },
                        "scale": {"range": ["D1D4DE"]} },

                    "opacity":{"value": 0.3},
                },
                "config": {
                    "axis": { 
                        "labelColor": "#809FB8",
                        "titleColor": "#809FB8",
                    },
                }
            },
            data_value_name:[],
            

        }
    },

    methods:{
        chart(){
            vegaEmbed("#chart", this.linechart);
        },

        updateData(){
            this.linechart["data"]["values"] = data_value;
            this.linechart["encoding"]["color"]["field"] = data_type_name[0];
            this.linechart["encoding"]["x"]["field"] = data_type_name[1];
            this.linechart["encoding"]["x"]["scale"]["domain"] = 
                [data_field["min_domain"][1], data_field["max_domain"][1]];
            this.linechart["encoding"]["y"]["field"] = data_type_name[this.data_type];
            this.linechart["encoding"]["y"]["scale"]["domain"] = 
                [data_field["min_domain"][this.data_type], data_field["max_domain"][this.data_type]];
            if(data_field["x_is_date"]){
                this.linechart["encoding"]["x"]["axis"]["labelExpr"] = 
                    "toString(year(datum.value))+ '.' +toString(month(datum.value))";
            }
            else{
                this.linechart["encoding"]["x"]["axis"]["labelExpr"] = "datum.value";
            }
        },

        changeDataValue(){
            this.canvas = undefined;
            for(let i=2, len=data_type_name.length; i<len; i++){
                if(this.type_selector.value === data_type_name[i]){
                    this.data_type = i;
                    break;
                }
            }
            this.linechart["encoding"]["y"]["field"] = data_type_name[this.data_type];
            this.linechart["encoding"]["y"]["scale"]["domain"] = 
                [data_field["min_domain"][this.data_type], data_field["max_domain"][this.data_type]];
            this.chart();

            setTimeout(()=>{this.drawHighlight()}, 300)
        },

        drawHighlight(){
            if(!this.canvas){
                this.canvas = document.querySelectorAll("canvas")[0];
                this.context = this.canvas.getContext('2d',  { willReadFrequently: true });
                // 这个玩意的大小不是LINECHART_WIDTH、LINECHART_HEIGHT
                this.original_canvas = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            }
            else{
                this.context.putImageData(this.original_canvas, 0, 0);
            }

            let x_min_domain = data_field["min_domain"][1];
            let y_max_domain = data_field["max_domain"][this.data_type];
            let x_range_to_draw = LINECHART_WIDTH/(data_field["max_domain"][1]-data_field["min_domain"][1]);
            let y_range_to_draw = LINECHART_HEIGHT/(data_field["max_domain"][this.data_type] - data_field["min_domain"][this.data_type]);
 
            for(let i=0; i<interactive_list.length; i++){
                let begin_idx = visualcode_object[this.data_type][interactive_list[i]].start_idx;
                let end_idx = visualcode_object[this.data_type][interactive_list[i]].end_idx;
                
                this.context.lineWidth = 2;
                this.context.beginPath();
                let x_to_draw = (getDataTime(begin_idx)-x_min_domain)*x_range_to_draw;
                let y_to_draw = (y_max_domain-getDataValue(begin_idx, this.data_type))*y_range_to_draw;
                this.context.moveTo(x_to_draw, y_to_draw);
                for(let j=begin_idx+1; j<end_idx;j++){
                    x_to_draw = (getDataTime(j)-x_min_domain)*x_range_to_draw;
                    y_to_draw = (y_max_domain-getDataValue(j, this.data_type))*y_range_to_draw;
                    this.context.lineTo(x_to_draw, y_to_draw);
                }
                
                this.context.strokeStyle = color_for_highlight[interactive_list[i]][0];
                this.context.stroke();
                this.context.closePath();
            }

            this.context.setLineDash([1, 0])
            for(let i=0; i<interactive_list.length; i++){               
                for(let key in data_lists){
                    if( pers_list[key][0]!==this.data_type){
                        continue;
                    }
                    let circle_type = -1;
                    for(let j=0; j<pers_index.length; j++){
                        if(Number(key) === pers_index[j]){
                            circle_type = j;
                            break;
                        }
                    }
                    for(let j=0; j<data_lists[key][interactive_list[i]].length-1; j++){
                        let idx = data_lists[key][interactive_list[i]][j]["right_idx"];
                        if(idx === visualcode_object[this.data_type][interactive_list[i]].end_idx) continue;
                        this.context.beginPath();
                        let x_to_draw = (getDataTime(idx)-x_min_domain)*x_range_to_draw;
                        let y_to_draw = (y_max_domain-getDataValue(idx, this.data_type))*y_range_to_draw;
                        this.context.fillStyle = color_for_highlight[interactive_list[i]][0];
                        this.context.strokeStyle = color_for_highlight[interactive_list[i]][0];
                        if(circle_type === 0){
                            this.context.arc(x_to_draw, y_to_draw, 3, 0, 2*Math.PI);
                        }
                        else if(circle_type === 1){
                            this.context.fillRect(x_to_draw-3, y_to_draw-3, 6, 6);
                        }
                        else if(circle_type === 2){
                            this.context.moveTo(x_to_draw-3, y_to_draw);
                            this.context.lineTo(x_to_draw, y_to_draw-3);
                            this.context.lineTo(x_to_draw+3, y_to_draw);
                            this.context.lineTo(x_to_draw, y_to_draw+3);
                        }
                        this.context.closePath();
                        this.context.fill();
                        this.context.stroke();
                    } 
                }
            }
            this.highlight_canvas = null
        }
    },

    created(){
        bus.on("updateDataset", msg=>{
            this.canvas = undefined;
            getTimeSpan();
            this.updateData();
            this.chart();
            this.data_value_name.splice(0, this.data_value_name.length)
            for(let i=0; i<data_value_line.length; i++)
                this.data_value_name.push(data_type_name[data_value_line[i]])
            this.data_type = data_value_line[0]
            console.log("finish drawing linechart.");
            bus.emit("updateVisualCode", true);
        });

        bus.on("clickForLine", msg=>{
            this.drawHighlight()
        })
        
        bus.on("showFilterInLineChart", msg=>{
            if(!this.canvas) return
            this.highlight_canvas = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            let x_min_domain = data_field["min_domain"][1];
            let y_max_domain = data_field["max_domain"][this.data_type];
            let x_range_to_draw = LINECHART_WIDTH/(data_field["max_domain"][1]-data_field["min_domain"][1]);
            let y_range_to_draw = LINECHART_HEIGHT/(data_field["max_domain"][this.data_type] - data_field["min_domain"][this.data_type]);
 
            let id = msg[0], pers = msg[1], segs = msg[2], cnt = 0

            let hills = visualcode_object[this.data_type][id].hill_list
            this.context.lineWidth = 4;

            hills.sort((a, b)=>{
                return a.left_idx - b.left_idx;
            })

            for(let i=0; i<hills.length; i++){
                if(pers >= hills[i].start_persistence && pers < hills[i].end_persistence){
                    cnt++;
                    if(segs.indexOf(cnt)!==-1 || segs.indexOf(-cnt)!== -1){
                        let begin_idx = hills[i].left_idx;
                        let end_idx = hills[i].right_idx+1;
                        
                        this.context.beginPath();
                        let x_to_draw = (getDataTime(begin_idx)-x_min_domain)*x_range_to_draw;
                        let y_to_draw = (y_max_domain-getDataValue(begin_idx, this.data_type))*y_range_to_draw;
                        this.context.moveTo(x_to_draw, y_to_draw);
                        
                        for(let j=begin_idx+1; j<end_idx;j++){
                            x_to_draw = (getDataTime(j)-x_min_domain)*x_range_to_draw;
                            y_to_draw = (y_max_domain-getDataValue(j, this.data_type))*y_range_to_draw;
                            this.context.lineTo(x_to_draw, y_to_draw);
                        }
                        
                        this.context.strokeStyle = color_for_highlight[id][0];
                        this.context.stroke();
                        this.context.closePath();

                    }
                }
               
            }
        })

        bus.on("coverFilter", msg=>{
            if(this.highlight_canvas === null) return
            this.context.putImageData(this.highlight_canvas, 0, 0);
        })

        for(let i=0; i<data_value_line.length; i++)
            this.data_value_name.push(data_type_name[data_value_line[i]])
        this.data_type = data_value_line[0]

        getTimeSpan();
        this.updateData();
    },

    mounted(){
        this.type_selector = document.querySelector(".select-linechart");
        this.chart();
    }
}
</script>