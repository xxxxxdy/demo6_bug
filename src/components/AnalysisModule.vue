<template>
    <div style="width: 900px; border: 2px solid #F1F4FA;position: relative;border-radius: 20px; height: 554px;">
        <div class="text">Barcode Evolution
            <input type="button" class="clear" value="Clear" @click="clearCanvas">
        </div> 

        <div class="select-box">
            <div class="select-data" v-for="it in interactive_name" :id="'div_'+it.idx" :style="{border: isChecked(it.check)}" @click="checkThisOne">
                <input :id="'radio_'+it.idx" class="radio-tree" type="radio">
                <div class="color-box" :style="{backgroundColor:getColor(it.idx)}" :id="'box_'+it.idx"  @click="checkThisOne"></div>
                <label :for="'radio_'+it.idx" style="margin-left: 10px;" >{{it.name}}</label>
                <svg :id="'svg_'+it.idx" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="deleteThisOne">
                    <path :id="'path_'+it.idx" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
        </div>
        
        <div class="treewindow">
            <!-- <div style="font-weight:bold; padding-left: 25px;padding-top: 18px;font-size: 20px;">{{name}}</div> -->
            <div style="padding-left:25px; padding-top: 20px;">
                <canvas id="analysis" :width="1260" :height="900" :style="style_var" @mousedown="movePersistence"></canvas>
            </div>
        </div>
    </div>
</template>

<style scoped>

.text{
  color:#2932FF;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  border-radius: 20px;
  background-color: #F1F4FA;
}

.select-box{
    width: 24%;
    height: 450px;
    background-color: #F1F4FA;
    margin: 12px;
    padding-top: 20px;
    padding-bottom: 10px;
    overflow-y: auto;
    border-radius: 20px;
    display: inline-block;
    vertical-align:top;
}

.select-box::-webkit-scrollbar{
    width: 0px;
}

.color-box{
    width: 12px;
    height: 12px;
    border-radius: 2px;
    position:absolute;
    top: 50%;
    transform:translate(0,-50%);
    left: 10px;
}
.treewindow{
    width: 70%;
    height: 80%;
    display: inline-block;
    vertical-align:top;
}

.select-data{
    position: relative;
    border-radius: 10px;
    padding: 2px;
    margin-left: 10%;
    width: 80%;
    font-weight: bold;
    background-color: white;
    margin-bottom: 10px;
}

label{
    display: inline-block;
    color:#809FB8;
    width: 120px;
    height: 24px;
    position: absolute;
    font-size: 16px;
    top: 50%;
    transform:translate(0,-50%);
    overflow-x: hidden;
    overflow-y: hidden;
}

svg{
    position: absolute;
    right: 10px;
    width: 20px;
    color: #809FB8;
    position:absolute;
    top: 50%;
    transform:translate(0,-50%);
    z-index: 98;
}

.clear{
    right: 20px;
    position: absolute;
    width: 69px;
    padding: 3px;
    color: #2932FF;
    background-color: #F1F4FA;
    font-size: 16px;
    border-radius: 20px;
    border: 2px solid #C6D7E5;
}


input[type=radio]{
	visibility: hidden;
}

</style>

<script>
import { interactive_list, pers_list, visualcode_object } from '../util/codeList';
// import { pers_list, visualcode_object, getCodePoints, code_points } from '../util/codeList';
import { data_field, data_type_name, data_value_line, getDataTime } from '../util/dataManager';
import bus from "../util/eventBus";
import { color_for_highlight } from '../util/colorMapping';
// import { data_dis, dbscan, cluster_res } from '../util/similarityCalculate';
// import { CLUSTER_COLOR_SET } from '../util/colorMapping'
import VisualCode from './VisualCode.vue';

export default{
    data() {
        return {
            style_var: {
                "width": "630px",
                "height": "450px"
            },
            interactive_name:[],
            draw_x: 750,
            draw_y: 800,
            analysis_idx: -1,
            tree_cnt: 0,
            per_points:[]
        };
    },

    methods: {
        getColor(msg){
            return color_for_highlight[msg]
        },
        isChecked(msg){
            // return msg?'#d0d8df':'#f0f8ff'; // Aliceblue
            return msg?'1px solid #2932FF':'1px solid white';
        },
        stopMovePer(){
            this.is_move = false;
            let moveFunction = this.movePersistence
            let upFunction = this.stopMovePer
            document.removeEventListener("mousemove", moveFunction)
            document.removeEventListener("mouseup", upFunction)

            bus.emit("updatePersistence", [this.min_color,-1, true])
        },
        movePersistence(e){
            e = e || window.event
            let x_val = Math.floor(2*e.offsetX/(this.draw_x+50));

            if(x_val>=this.per_points.length) x_val = 0;

            console.log(x_val, this.per_points, e.offsetX,(this.draw_x+50))
            let y_val = e.offsetY * 2
            if(y_val<20) y_val = 20;
            else if(y_val>this.draw_y-20) y_val = this.draw_y-20;
            let min_dis = this.draw_y
            
            for(let key in this.per_points[x_val]){
                let dis = Math.abs(y_val-this.per_points[x_val][key][0])
                if(min_dis>dis){
                    min_dis = dis
                    if(!this.is_move) this.min_color = this.per_points[x_val][key][1]
                }
            }
            
            if(min_dis >= 20){
                let type = 0
                for(let key in pers_list){
                    if(this.min_color === pers_list[key][2]) {
                        type = pers_list[key][0]
                        break
                    }
                }
                
                let hills = visualcode_object[type][this.analysis_idx].hill_list;
                let total_pers = hills[hills.length - 1].end_persistence;
                bus.emit("updatePersistence", [this.min_color, (y_val-20)/(this.draw_y-40) *total_pers, false])
            }

            if(!this.is_move){
                let moveFunction = this.movePersistence
                let upFunction = this.stopMovePer
                document.addEventListener("mousemove", moveFunction)
                document.addEventListener("mouseup", upFunction)
            }
            
            this.is_move = true;
        },

        clearCanvas(){
            this.analysis_idx = -1;
            this.interactive_name.splice(0, this.interactive_name.length);
            this.drawAnalysisTrees();
            bus.emit("clearCanvas", null);
        },

        /// the function for drawing code tree
        getMaxMinX(data_type) {
            this.x_start = visualcode_object[data_type][this.analysis_idx].getStartTime();
            this.x_draw_width = this.draw_x / (visualcode_object[data_type][this.analysis_idx].getEndTime() - this.x_start);
            // this.x_end = visualcode_object[this.data_type][this.analysis_idx].getEndTime()
            // this.x_width = this.x_end - this.x_start
        },
        drawAnalysisTree(data_type, pos = 0) {
            let x_offset = 0;
            this.context.font = "40px Arial"
            switch(this.tree_cnt){
                case 2: x_offset= 630*pos; this.draw_x=580;this.context.font = "35px Arial"; break;
                case 3: x_offset= 420*pos; this.draw_x=370; this.context.font = "30px Arial"; break;
                default: this.draw_x = 750;
            }
            let y_offset = 20;

            // let threshold = (visualcode_object[this.data_type][this.analysis_idx].max_value- 
            //    visualcode_object[this.data_type][this.analysis_idx].min_value)/2
            this.getMaxMinX(data_type);

            /// this variable should not be in class but I am lazy to modify it
            this.y_draw_width = -1;
            let hills_list = visualcode_object[data_type][this.analysis_idx].hill_list;
            this.context.lineWidth = 4;
            this.context.strokeStyle = 'rgb(209, 212, 222)'
            this.context.fillStyle = 'rgb(209, 212, 222)'
            for (let i = hills_list.length - 1; i >= 0; i--) {
                // if(hills_list[i].start_persistence > threshold) continue
                if (this.y_draw_width === -1) {
                    this.y_draw_width = (this.draw_y-2*y_offset) / hills_list[i].end_persistence;
                }
                let line_y = hills_list[i].start_persistence * this.y_draw_width, line_y2 = hills_list[i].end_persistence * this.y_draw_width;

                let le_x = getDataTime(hills_list[i].left_idx), ri_x = getDataTime(hills_list[i].right_idx);
                let line_x = (le_x - this.x_start) * this.x_draw_width + x_offset, line_x2 = (ri_x - this.x_start) * this.x_draw_width + x_offset;
                /// draw h line
                let rect_width = (hills_list[i].value_sum / (ri_x - le_x) - hills_list[i].min_value) / (hills_list[i].max_value - hills_list[i].min_value) * (line_x2 - line_x);
                let rect_x = line_x + (line_x2 - line_x - rect_width) * (getDataTime(hills_list[i].top_idx) - le_x) / (ri_x - le_x);
                this.context.setLineDash([20, 20]);
                this.context.beginPath();
                this.context.moveTo(line_x, (line_y2 + line_y) / 2+ y_offset);
                this.context.lineTo(line_x2, (line_y2 + line_y) / 2+ y_offset);
                this.context.stroke();
                this.context.setLineDash([]);
                this.context.beginPath();
                this.context.moveTo(line_x2, line_y2+y_offset);
                this.context.lineTo(line_x2, line_y+y_offset);
                this.context.stroke();
                // this.context.fillStyle = 'rgba(0, 0, 0, 1)'
                this.context.fillRect(rect_x, line_y + 2 +y_offset, rect_width, line_y2 - line_y - 2);
            }
            this.context.fillStyle = '#809FB8'
            
            this.context.fillText(data_type_name[data_type], x_offset+this.draw_x/3, this.draw_y + 30 +y_offset)
        },
        drawpersistenceLine(type, pers, color, pos) {
            let y_offset = 20;
            let hills = visualcode_object[type][this.analysis_idx].hill_list;
            let total_pers = hills[hills.length - 1].end_persistence;
            let y_pos = (this.draw_y - 2*y_offset) / total_pers * pers;
            if (y_pos < 0) y_pos = 0;
            if (y_pos > this.draw_y-40) y_pos = this.draw_y-40;
       
            let x_start = pos * (this.draw_x+50) , x_end = x_start + this.draw_x + 5;

            let y_sign = y_pos+y_offset;
            if (y_sign < 20)
                y_sign = 20;
            else if (y_sign > this.draw_y+20)
                y_sign = this.draw_y+20;
            let str = 'A'
            switch (color) {
                case "red":// 被设计师换颜色了，别问我为啥这里是red
                    this.context.strokeStyle = '#2932FF'
                    this.context.fillStyle = '#2932FF'
                    break;
                case "green":
                    this.context.strokeStyle = '#6A6EC7'
                    this.context.fillStyle = '#6A6EC7'
                    str = 'B'
                    break;
                case "blue":
                    this.context.strokeStyle = '#888CFF'
                    this.context.fillStyle = '#888CFF'
                    str = 'C'
                    break;
                default:
                    break;
            }

            this.context.beginPath();
            this.context.moveTo(x_start, y_pos+y_offset);
            this.context.lineTo(x_end, y_pos+y_offset);
            // this.context.strokeStyle = color
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(x_end + 25, y_sign, 15, 0, 2 * Math.PI);
            this.context.closePath();
            this.context.fill(); 

            this.context.fillStyle = '#D1D4DE'
            this.context.font = "30px Arial"
            this.context.fillText(str, x_end + 15, y_sign+12)

            this.per_points[pos].push([y_sign, color])

        },
        drawAnalysisTrees() {
            this.context.fillStyle = "#ffffff";
            this.context.fillRect(0, 0, 1260, 900);
            this.context.fillStyle = "rgb(0, 0, 0)";
            if (this.analysis_idx < 0) return
            
            this.tree_cnt = 0
            let tree_list = []
            this.per_points.splice(0, this.per_points.length)
            for (let key in pers_list) {
                if (tree_list.indexOf(pers_list[key][0]) === -1) { 
                    tree_list.push(pers_list[key][0])
                    this.tree_cnt++
                    this.per_points.push([])
                }
            }

            for(let i=0; i<this.tree_cnt; i++){
                this.drawAnalysisTree(tree_list[i], i)
            }
            for (let key in pers_list) {
                this.drawpersistenceLine(pers_list[key][0], pers_list[key][1], pers_list[key][2], tree_list.indexOf(pers_list[key][0]))
            }

        },
        checkThisOne(e){
            e = e || window.e;
            let idx = Number(e.target.getAttribute('id').split('_')[1]);

            if(this.is_delete){
                for(let i=0, j=this.interactive_name.length; i<j; i++){
                    if(idx === this.interactive_name[i].idx){ //  idx === interactive_list[i]
                        delete(color_for_highlight[idx]);
                        this.interactive_name.splice(i, 1);
                        interactive_list.splice(i, 1);
                        break;
                    }
                } 
                
                if(this.interactive_name.length <= 0){
                    this.analysis_idx = -1;
                    this.drawAnalysisTrees();
                }
                else if(idx === this.analysis_idx){
                    this.analysis_idx = this.interactive_name[0].idx;
                    this.interactive_name[0].check = true;
                    this.drawAnalysisTrees();
                }
                
                bus.emit("clickForLine", idx);
                this.is_delete = false;
            }
            else{
                this.analysis_idx = idx;
                for(let i=0, j=this.interactive_name.length; i<j; i++){
                    if(idx === this.interactive_name[i].idx){
                        this.interactive_name[i].check = true;
                    }
                    else{
                        this.interactive_name[i].check = false;
                    }
                } 
                this.drawAnalysisTrees();
                bus.emit("alignOrder", [-2, idx])
            }
        },
        deleteThisOne(e){
            this.is_delete = true;       
        }


    },
    created() {
        bus.on("analysisCode", msg => {
            if(interactive_list.length<=0){
                this.analysis_idx = -1;
                this.interactive_name.splice(0, this.interactive_name.length);
                this.drawAnalysisTrees();
                return;
            }

            if(msg[1]) this.analysis_idx = msg[0];
            // if (msg[0] !== -1)
            //     this.name = visualcode_object[data_value_line[0]][msg[0]].name;
            // else
            //     this.name = " ";
            let one_check = false;
            this.interactive_name.splice(0, this.interactive_name.length);
            
            for(let i=0, j=interactive_list.length; i<j; i++){
                let idx = interactive_list[i];
                let name = visualcode_object[data_value_line[0]][idx].name;
                let check = false;
                if(this.analysis_idx == idx){
                    check = true;
                    one_check = true;
                }
                this.interactive_name.push({'idx':idx, 'name':name, 'check':check})
            }
            if(!one_check) {
                this.interactive_name[0].check = true;
                this.analysis_idx = this.interactive_name[0].idx;
            }
            // this.list_idx = msg[1];
            this.drawAnalysisTrees();
            // this.getSelectInfo(msg[2]);
        });

        bus.on("updateDataset", msg=>{
            // this.list_idx= -1;
            this.analysis_idx= -1;
            // this.name = " ";
            this.interactive_name.splice(0, this.interactive_name.length);
            this.drawAnalysisTrees();
            // this.getSelectInfo();
        })

    },
    mounted() {
        this.canvas = document.querySelector("#analysis");
        this.context = this.canvas.getContext("2d");
        // this.c_canvas = document.querySelector("#cluster");
        // this.c_context = this.c_canvas.getContext("2d");
    },
    components: { VisualCode }
}
</script>