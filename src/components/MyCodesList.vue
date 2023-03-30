<template>
    <div class="text">
        <div style="display:inline-block;">Group</div>
        <div style="display:inline-block; text-align: center; background-color: #2932FF; color:white; font-size: 16px; margin-left: 10px; width: 22px; height: 22px; border-radius: 50%;">{{ identify }}</div>
    </div>

    <div @mouseenter="rollingForDetail" @mouseleave="rollingCancel">
        <div style="color:#809FB8; display: inline-block; font-weight: bold; font-size: 14px; padding:12px;">Attribute</div>
        <select :class="'seletor'+index" @change="changeDataValue">
            <option v-for="item in data_value_name">{{item}}</option>  
        </select>
        <br>
        <div style="color:#809FB8; display: inline-block; font-size: 14px; margin-left:12px;">Persistence</div>
        <div style="color:#809FB8; display: inline-block; font-size: 14px; position: absolute; right:22px"> {{per_val}}</div>
        
        <div class="range" style="position: relative; padding-left: 18px; padding-bottom: 30px;" >
            <input type="range" class="persistence" min="0" :max="coarse_max" :step="coarse_step" v-model="per_val" @input="changepersistence" @mouseup="judgeReorderVisualCode">
        </div>
     
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="kill" @click="$emit('delete', index)">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
       
        <button class="align" v-show="sort_mode" :style="{backgroundColor:base_sort? '#2932FF': '#809FB8' }" @click="alignAsBase"> Primary </button>
    </div>

    <div id="split-line" ></div>

    <TimeMover ref="timeaxis" :target="index" :type="data_type" @time-axis="cutTimeRange" @fast-time-axis="fastCutTimeRange"/>

    <div class="visual-code-canvas" :id="'canvas'+index" @scroll="recordScroll" >
        <div class="triangle_list">
            <div class="triangle" :id="'tri_'+it" v-for="it in match_idx" :style=draw_triangle(it) @click="jumpPosition"></div>
        </div>
        <div class="my-scroll-bar" @mousedown="moveFloat">
            <div class="my-scroll-bar-item" v-for="item in codes_message" :key="item" 
            :style="{backgroundColor:getColorByMsg(item), height:myScorllBarItemHeight}"></div>
        </div>
        <div class="my-scroll-bar-float" :style="style_float" @mousedown="clickFloat"></div>

        <div class="on-canvas" style="display:inline-block; margin-left: 30px; position: relative;" @mousedown="startSelectFunction">
            <div :class="'code-list'+index" v-for="item in codes_message" :id="'box_'+item.idx" @mouseenter="showFilterIfExist" @mouseleave="coverFilter">
                <div :style="'height:'+onecode_height+'px'">
                <VisualCode ref="subcode" :target="index" :mapping="item.idx" :draw_message="item.value"  :line_opacity="line_opacity" :rect_opacity="rect_opacity" :show="item.show" :code_name="item.name" :show_name="show_name" :filter="item.filter"/></div>
            </div>
        </div>
        
    </div> 
    
</template>

<style scoped>

.text{
    color:#2932FF;
    font-size: 14px;
    font-weight: bold;
    width: 100%-12px;
    margin-top: 5px;
    padding: 2px;
    padding-left: 12px;
    border-radius: 20px;
    border: 2px solid #F1F4FA;
    box-shadow: 0px 4px 4px rgba(216, 216, 216, 0.2);
}

select{
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

#split-line{
  height: 1.2px;
  background-color:#C6D7E5;
  margin-top: 5px;
  margin-left: 12px;
  margin-right: 20px;
  margin-bottom: 10px;
}

.my-scroll-bar{
    display: inline-block;
    position: absolute;
    left: 12px;
    height: 940px;
    /* margin-left: 4px; */
}

.my-scroll-bar-float{
    width: 15px;
    left: 12px;
    opacity: 0.4;
    position: absolute;
    border: 1px grey solid;
    border-radius: 5px;
    background-color: whitesmoke;
    z-index: 50;
}

.my-scroll-bar-float:hover{
    opacity: 0.7;
}

.my-scroll-bar-item{
    width: 16px;
}

.visual-code-canvas{
    /* position: relative; */
    width: 100%;
    height: 940px;
    /* border-radius: 5px; */
    overflow-y: auto;
    background: white;
}

.visual-code-canvas::-webkit-scrollbar{
    width: 0px;
}

.triangle_list{
    position: absolute;
    width: 12px;
    left: 0;
    height: 940px;
}
.kill{
    position: absolute;
    right: 12px;
    top: 8px;
    width: 25px;
    color: #2932FF;
}
input[type=range]{
    position: absolute;
    left: 12%;
    right: 8%
}

.align{
    position: absolute;
    right: 20px;
    top: 52px;
    color: #F1F4FA;
    font-size: 14px;
    border-radius: 20px;
    opacity: 0.8;
    border: 0px;
    padding: 2px;
    width: 60px;
}

input[type="range"]{
    position: absolute;
    right: 20px;
    left: 12px;
    border-radius: 5px;
    margin-top:8px;
    outline: 0;
    -webkit-appearance: none;
    -moz-animation: none;
    appearance: none;
    background-color: transparent;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none; 
    width: 14px;
    height:14px;
    border-radius: 50%;
    background-color: #2932FF;
    margin-top: -4.5px;
    border: 1px solid transparent;
    border-image: linear-gradient(#2932FF,#2932FF) 0 fill / 7 10 7 0 / 0 0 0 99vw;
}

[type="range"]::-webkit-slider-container {
    height: 14px;
    overflow: hidden;
}
[type="range"]::-webkit-slider-runnable-track {
    height: 5px;
    border-radius: 5px;
    background: #D1D4DE;
}

</style>

<script>
import { data_lists, visualcode_object, interactive_list, calculateInitpersistence, pers_list, filter_list} from '../util/codeList';
import { color_for_highlight, PERS_COLOR, pers_index, getRandomColor, SCROLL_BAR_SET } from '../util/colorMapping';
import { re_sort_order, sort_order, updateOrder, select_first } from '../util/sortForVisual';
import { CODE_PADDING, CODE_WIDTH, user_parameters } from '../util/parameters';
import { getMarksForDraw } from '../util/drawDataManager'
import {abs} from '../util/similarityCalculate'
import VisualCode from './VisualCode.vue';
import bus from "../util/eventBus";
import { data_value_line, data_type_name, data_field, data_value, max, min } from '../util/dataManager';
import TimeMover from './TimeMover.vue';

export default{
    props:{
        index:{type:[String, Number], default: 0},
        show_name:{type:[Boolean], default:false},
        sort_mode:{type:[Boolean], default:true},
        sort_base:{type:Number, default:0}
    },
    components: { VisualCode, TimeMover},
    emits:['delete'],
    data() {
        return {
            identify: 'A',
            data_value_name:[],
            codes_message:[],
            codes_message_beta: [],
            is_beta: false,
            line_opacity: user_parameters["line_opacity"],
            rect_opacity: user_parameters["rect_opacity"],
            /// these two parameters should be change if the canvas change
            onecode_height: 60, 
            once_render_num: 15,
            first_on_screen: 0,
            coarse_max: 1.2,
            coarse_step:0.05,
            fine_step:0.005,
            per_val: 0,
            base_sort: false,
            sort_index: -1,
            style_float:{top:"0px", height:"0px"},
            float_min:0, // start position
            float_height:0, // end position - start position
            float_num:0, 
            style_color:{color: "red", display:"inline-block"},
            sort_msg: null,
            /// tp, bt : no use
            box_para:{le: 0, tp: 0, ri: 0, bt: 0, canid: -1},
            is_mousemove: false,
            start_select_id: -1,
            upper_id: -1,
            lower_id: -1,
            past_id: -1,
            firstMove: true,
            match_idx: []
        };
    },
    computed:{
        myScorllBarItemHeight(){
            return (100 / this.codes_message.length) + '' + '%'
        }
    },
    methods: {
        jumpPosition(e){
            e = window.event || e
            let id = Number(e.target.id.split('_')[1])
            let y = re_sort_order[this.sort_index][id]*(this.onecode_height+2);
            this.scroll_unit.scrollTo(0, y)
        },
        draw_triangle(msg){
            if(msg === this.match_idx[0])
                return{
                    width: 0,
                    height: 0,
                    position: 'absolute',
                    top: 100 / this.codes_message.length * re_sort_order[this.sort_index][msg] + '%',
                    borderLeft: '12px solid #809FB8',
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent'
                }
            else{
                return{
                    width: 0,
                    height: 0,
                    position: 'absolute',
                    top: 100 / this.codes_message.length * re_sort_order[this.sort_index][msg] + '%',
                    borderLeft: '12px solid #85B8E0',
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent'
                }
            }

        },

        getColorByMsg(code_msg){
            // if(code_msg["filter"].length > 0) return code_msg.idx === this.box_para.canid?'red':'rgb(255, 124, 124)'
            if(this.max_hill_num<9) return SCROLL_BAR_SET[code_msg["value"].hline.length]
            let i = Math.floor(code_msg["value"].hline.length/this.max_hill_num*8.9)
            return SCROLL_BAR_SET[i];
        },

        showFilterIfExist(e){
            e = window.event || e
            let id = Number(e.target.id.split('_')[1])

            let code_message = this.codes_message[re_sort_order[this.sort_index][id]]
            if(code_message.filter.length > 0 && interactive_list.indexOf(code_message.idx) !== -1 ) bus.emit("showFilterInLineChart", [code_message.idx, this.per_val ,code_message.filter])
        },

        coverFilter(e){
            e = window.event || e
            let id = Number(e.target.id.split('_')[1])

            let code_message = this.codes_message[re_sort_order[this.sort_index][id]]
            if(code_message.filter.length > 0 && interactive_list.indexOf(code_message.idx) !== -1 ) bus.emit("coverFilter", null)
        },

        judgeReorderVisualCode(){
            if(this.sort_index !== this.index) return;
            this.reorderVisualCode();
        },     

        selectFunction(e){
            let times = Number(new Date());
            if(times-this.clicktime<100) return; // 0.1s 内
            this.is_mousemove = true;
            e = e || window.event;
            let tar = e.target;
            if(tar.tagName !== "CANVAS" && tar.className !== "codename") return;
            let str = tar.id;
            let canvasid = Number(str.split('_')[1]);
            if(canvasid !== this.index) return;
            let codeid = Number(str.split('_')[2]);

            if(this.is_move_cells) this.moveInCells(codeid)
            else if(codeid === this.click_id){
                this.box_para.canid = codeid
                this.changeBoxLeftTopForCell(e.offsetX, codeid) 
            } 
            else{
                this.is_move_cells = true;
                this.moveInCells(codeid)
            }
        },

        /// Interactive data (for codes)
        moveInCells(codeid){

            if(this.start_select_id === -1) {
                if(this.click_id===-1){
                    this.start_select_id = re_sort_order[this.sort_index][codeid];
                    if(interactive_list.indexOf(codeid) === -1){
                        color_for_highlight[codeid] = getRandomColor();
                        interactive_list.push(codeid);
                        bus.emit("clickForLine", codeid);
                    }
                }
                else{
                    this.start_select_id = re_sort_order[this.sort_index][this.click_id];
                    if(interactive_list.indexOf(this.click_id) === -1){
                        color_for_highlight[this.click_id] = getRandomColor();
                        interactive_list.push(this.click_id);
                        bus.emit("clickForLine", this.click_id);
                    }
                }
                
                this.upper_id = this.start_select_id;
                this.lower_id = this.start_select_id;
                this.past_id = this.start_select_id;
                
            }
            
            let nows = re_sort_order[this.sort_index][codeid];
            if(nows === this.past_id) return;
            this.past_id = nows;

            if(nows > this.upper_id) {
                for(let i=this.upper_id+1; i<=nows; i++){
                    let id = sort_order[this.sort_index][i];
                    if(interactive_list.indexOf(id) === -1){
                        color_for_highlight[id] = getRandomColor();
                        interactive_list.push(id);
                        bus.emit("clickForLine", id);
                    }
                }
                this.upper_id = nows;
            } 
            else if(nows < this.lower_id) {
                for(let i=nows; i<this.lower_id; i++){
                    let id = sort_order[this.sort_index][i];
                    if(interactive_list.indexOf(id) === -1){
                        color_for_highlight[id] = getRandomColor();
                        interactive_list.push(id);
                        bus.emit("clickForLine", id);
                    }
                }
                this.lower_id = nows;
            }
            else if(nows < this.start_select_id){
                for(let i=this.lower_id; i<nows; i++){
                    let id = sort_order[this.sort_index][i];
                    let idx = interactive_list.indexOf(id);
                    if(idx !== -1){
                        delete(color_for_highlight[id]);
                        interactive_list.splice(idx, 1);
                        bus.emit("clickForLine", id);
                    }
                }
                this.lower_id = nows;
            }
            else if(nows > this.start_select_id){
                for(let i=nows+1; i<=this.upper_id; i++){
                    let id = sort_order[this.sort_index][i];
                    let idx = interactive_list.indexOf(id);
                    if(idx !== -1){
                        delete(color_for_highlight[id]);
                        interactive_list.splice(idx, 1);
                        bus.emit("clickForLine", id);
                    }
                }
                this.upper_id = nows;
            }
            else{
                for(let i=this.lower_id; i<=this.upper_id; i++){
                    let id = sort_order[this.sort_index][i];
                    if(id === codeid){
                        if(interactive_list.indexOf(id) === -1){
                            color_for_highlight[id] = getRandomColor();
                            this.addInteractive(id);
                            bus.emit("clickForLine", id);
                        }
                    }
                    else{
                        let idx = interactive_list.indexOf(id);
                        if(idx !== -1){
                            delete(color_for_highlight[id]);
                            interactive_list.splice(idx, 1);
                            bus.emit("clickForLine", id);
                        }
                    }
                }
                this.upper_id = this.start_select_id;
                this.lower_id = this.start_select_id;
            }
            // bus.emit("analysisCode", [codeid, this.index, this.codes_message[nows]['value']]);
            bus.emit("analysisCode", [codeid, true]);
        },

        /// Interactive data (for one code)
        addInteractive(msg){
            interactive_list.push(msg);
            bus.emit("clickForLine", msg);

            bus.emit("analysisCode", [msg, true]);

            let ids = re_sort_order[this.sort_index][msg]
            if(this.codes_message[ids].filter.length >0 ) bus.emit("showFilterInLineChart", [this.codes_message[ids].idx, this.per_val ,this.codes_message[ids].filter])
        },
        removeInteractive(msg, idx=0){
            interactive_list.splice(idx, 1);

            bus.emit("clickForLine", msg);
            bus.emit("analysisCode", [idx, false])
        },
        closeSelectFunction(e){
            if(!this.is_mousemove){
                e = e || window.event;
                let tar = e.target;
                if(tar.tagName !== "CANVAS" && tar.className !== "codename") return;
                let str = tar.id;
                let codeid = Number(str.split('_')[2]);

                let idx = interactive_list.indexOf(codeid);
                if(idx === -1){
                    color_for_highlight[codeid] = getRandomColor();
                    this.addInteractive(codeid);
                }
                else{
                    delete(color_for_highlight[codeid]);
                    this.removeInteractive(codeid, idx);
                }
            }
            else if(!this.is_move_cells){
                this.realGetCodeRange();
            }

            let moveFunction = this.selectFunction;
            let upFunction = this.closeSelectFunction;
            document.removeEventListener("mousemove", moveFunction);
            document.removeEventListener("mouseup", upFunction);
            if(select_first[0]) this.reorderVisualCode(false)
        },
        startSelectFunction(e){
            this.is_mousemove = false;
            this.is_move_cells = false;
            this.start_move_in_one_cell = true;

            e = e || window.event;
            let tar = e.target;
            if(tar.tagName === "CANVAS" || tar.className === "codename"){
                let str = tar.id;
                this.click_id = Number(str.split('_')[2]);
            }
            else this.click_id = -1;
            this.start_select_id = -1;
            this.clicktime = Number(new Date());
            let moveFunction = this.selectFunction;
            let upFunction = this.closeSelectFunction;
            document.addEventListener("mousemove", moveFunction);
            document.addEventListener("mouseup", upFunction);
        },
        
        reorderVisualCode(flag = true){
            if(flag) this.cutTimeRange()

            updateOrder(this.index, this.data_type, this.sort_msg);
            this.sort_index = this.index;
            let tmp = this.index;
            this.codes_message.sort(function(a, b){
                return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
            })
            if(this.is_beta){
                this.codes_message_beta.sort(function(a, b){
                    return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
                })
            }
            for(let i =this.first_on_screen, j=0; i<this.codes_message.length && j<this.once_render_num; i++, j++){
                this.codes_message[i].show = true;
            }

            if(this.base_sort === true && this.sort_mode === true) 
                bus.emit("alignOrder", [this.sort_index, this.scroll_unit.scrollTop])
            
        },

        // alignAsBase(){
        //     this.base_sort = !this.base_sort;
        //     if(this.base_sort) bus.emit("alignOrder", [this.index, this.scroll_unit.scrollTop])
        //     else bus.emit("alignOrder", [-1, this.scroll_unit.scrollTop])
        // },
        
        alignAsBase(){
            if(this.base_sort) return
            // this.base_sort = true
            updateOrder(this.index, this.data_type, this.sort_msg);
            bus.emit("alignOrder", [this.index, this.scroll_unit.scrollTop])
        },  

        fastCutTimeRange(msg){
            if(this.firstMove){
                for(let i=0; i<this.codes_message.length; i++){
                    this.codes_message[i].filter.splice(0, this.codes_message[i].filter.length);
                }
                this.firstMove = false;
            }

            let new_x=CODE_PADDING, new_x2=CODE_PADDING+CODE_WIDTH;
            if(msg) {
                new_x = msg[0]+CODE_PADDING; this.time_x1=new_x;
                new_x2 = msg[1]+CODE_PADDING; this.time_x2 = new_x2;
            }
            else {
                new_x = this.time_x1;
                new_x2 = this.time_x2;
            }

            if(!this.is_beta) {
                if(this.codes_message_beta.length!==this.codes_message.length){
                    this.codes_message_beta.splice(0, this.codes_message_beta.length, new Array(this.codes_message.length).fill(0));
                }
                for(let i=0, j=this.codes_message.length; i<j; i++)
                    this.codes_message_beta[i] = JSON.parse(JSON.stringify(this.codes_message[i])); 
                this.is_beta = true;
            }
            else{
                for(let i=this.first_on_screen, j=this.codes_message.length, k=0; i<j && k<this.once_render_num; i++, k++){
                    this.codes_message[i] = JSON.parse(JSON.stringify(this.codes_message_beta[i]));
                    this.codes_message[i].show = true;
                }
                    
            }

            let k = CODE_WIDTH / (new_x2-new_x);
            let b = CODE_PADDING - k * new_x;
            for(let i=this.first_on_screen, j=this.codes_message.length, p=0; i<j && p<this.once_render_num; i++, p++){
                let m = this.codes_message[i].value.hline.length;        
                for(let h=0; h<m; h++){
                    if(this.codes_message[i].value.hline.x2 < 0) continue;
                    if(this.codes_message[i].value.hline.x < CODE_WIDTH) continue;
                    this.codes_message[i].value.hline[h].x = k*this.codes_message[i].value.hline[h].x + b;
                    this.codes_message[i].value.hline[h].x2 = k*this.codes_message[i].value.hline[h].x2 + b;
                    this.codes_message[i].value.rect[h].x = k*this.codes_message[i].value.rect[h].x + b;
                    this.codes_message[i].value.rect[h].width = k*this.codes_message[i].value.rect[h].width;
                    this.codes_message[i].value.vline[h].x = k*this.codes_message[i].value.vline[h].x + b;
                }
            }
            
        },

        cutTimeRange(msg){
            let new_x=CODE_PADDING, new_x2=CODE_PADDING+CODE_WIDTH;
            if(msg) {
                new_x = msg[0]+CODE_PADDING; this.time_x1=new_x;
                new_x2 = msg[1]+CODE_PADDING; this.time_x2 = new_x2;
            }
            else {
                new_x = this.time_x1;
                new_x2 = this.time_x2;
            }
            if(!this.is_beta) {
                // this.codes_message_beta.splice(0, this.codes_message_beta.length);
                // for(let i=0, j=this.codes_message.length; i<j; i++)
                //     this.codes_message_beta.push(JSON.parse(JSON.stringify(this.codes_message[i]))); 
                if(this.codes_message_beta.length!==this.codes_message.length){
                    this.codes_message_beta.splice(0, this.codes_message_beta.length, new Array(this.codes_message.length).fill(null));
                }
                for(let i=0, j=this.codes_message.length; i<j; i++)
                    this.codes_message_beta[i] = JSON.parse(JSON.stringify(this.codes_message[i])); 
                this.is_beta = true;
            }
            else{
                for(let i=0, j=this.codes_message.length; i<j; i++)
                    this.codes_message[i] = JSON.parse(JSON.stringify(this.codes_message_beta[i]));
            }

            let k = CODE_WIDTH / (new_x2-new_x);
            let b = CODE_PADDING - k * new_x;
            for(let i=0, j=this.codes_message.length; i<j; i++){
                let m = this.codes_message[i].value.hline.length;        
                for(let h=0; h<m; h++){
                    if(this.codes_message[i].value.hline.x2 < 0) continue;
                    if(this.codes_message[i].value.hline.x < CODE_WIDTH) continue;
                    this.codes_message[i].value.hline[h].x = k*this.codes_message[i].value.hline[h].x + b;
                    this.codes_message[i].value.hline[h].x2 = k*this.codes_message[i].value.hline[h].x2 + b;
                    this.codes_message[i].value.rect[h].x = k*this.codes_message[i].value.rect[h].x + b;
                    this.codes_message[i].value.rect[h].width = k*this.codes_message[i].value.rect[h].width;
                    this.codes_message[i].value.vline[h].x = k*this.codes_message[i].value.vline[h].x + b;
                }
            }
            
            this.firstMove = true;

        },

        /// Find similarity part
        realGetCodeRange(){
            // select function
            let filter_message = []
            let dis = []
            let canvas_id = re_sort_order[this.sort_index][this.box_para.canid]
            let origin_data = this.codes_message[canvas_id].filter
            // console.log(this.codes_message[canvas_id].filter)
            this.codes_message[canvas_id].filter.forEach( i=>{
                let hills = this.codes_message[canvas_id].value
                let line_width = hills['hline'][i-1].x2-hills['hline'][i-1].x
                filter_message.push([line_width, hills['rect'][i-1].width, hills['rect'][i-1].x-hills['hline'][i-1].x])
                dis.push(line_width/5)
            })
            // console.log(filter_message)
            let len1 = filter_message.length
            filter_list[this.index].splice(0, filter_list[this.index].length)

            if(len1 === 0){
                this.match_idx = []
                return
            }

            filter_list[this.index].push(sort_order[this.sort_index][canvas_id])

            this.codes_message.forEach(t=>{
                let hills = t.value
                t.filter = []
                let len2 = hills['hline'].length
                for(let i=0; i<=len2-len1;i++){
                    let same = true
                    let small_hill_num = 0
                    let j = i, k = 0;
                    for(j=i, k=0; k<len1; j++){
                        if(j>=len2) {same= false;break;}
                        let l_width = hills['hline'][j].x2-hills['hline'][j].x
                        let dis_tolerate = max(20, max(dis[k], l_width/5))
                        if(abs(l_width-filter_message[k][0])<dis_tolerate){
                            if(filter_message[k][0]<=60) {small_hill_num = 0; k++; continue;}
                            if(abs(hills['rect'][j].width-filter_message[k][1])<dis_tolerate){
                                let rect_x = hills['rect'][j].x-hills['hline'][j].x
                                if(abs(rect_x-filter_message[k][2])<dis_tolerate/2){
                                    k++;
                                    small_hill_num = 0;
                                    continue;
                                }
                            }
                        }
                        if(filter_message[k][0]<20 && small_hill_num<3){
                            small_hill_num++;
                            j--;
                            k++;
                            continue;
                        }
                        if(l_width<20 && small_hill_num<3){
                            small_hill_num++;
                            continue;
                        }
                        same = false;
                        break;
                    }
                    if(j-i-len1<=-2) continue
                    if(same){
                        for(let w = i; w<j; w++){
                            t.filter.push(-w-1)
                        }
                        i = j;
                        filter_list[this.index].push(t.idx)
                    }
                    
                }

            })
            
            origin_data.forEach(i=>{
                this.codes_message[canvas_id].filter.push(i)
            })

            this.match_idx = filter_list[this.index];

            if(interactive_list.indexOf(canvas_id) !== -1) bus.emit("showFilterInLineChart", [this.codes_message[canvas_id].idx, this.per_val ,this.codes_message[canvas_id].filter])
        },

        changeBoxLeftTopForCell(x, codeid){
            if(this.start_move_in_one_cell) {
                this.box_para["le"] = x;
                this.codes_message.forEach(c=>{
                    c.filter = []
                })
                this.start_move_in_one_cell = false;
                return;
            }
            this.box_para["ri"] = x;
            let le = this.box_para["le"], ri = this.box_para["ri"]
            if(this.box_para["le"]>this.box_para["ri"]) {le = this.box_para["ri"], ri = this.box_para["le"]}
            le *= 2, ri *= 2 
            let nows = re_sort_order[this.sort_index][codeid];
            let cnt = 1
            let filter_one_hill_list = []
            this.codes_message[nows].value.rect.forEach(r=>{
                if(r.x+r.width>=le && r.x<=ri) filter_one_hill_list.push(cnt)
                cnt++;
            })
            this.codes_message[nows].filter = filter_one_hill_list;

        }, 

        /// This function is called while changing the filter
        updateDrawMessage(pers = 0, init = false){
            data_lists[this.index].splice(0, data_lists[this.index].length);
         
            for(let i=0, len=visualcode_object[this.data_type].length; i<len; i++){
                data_lists[this.index].push(visualcode_object[this.data_type][i].getDataForOneDraw(pers));
            }
            if(init) updateOrder(this.index, this.data_type);

        },

        /// This function is called while changing the mapping channel
        updateMappingChannel(flag = false){ 
            let tmp = flag? this.index: this.sort_index;
    
            this.codes_message.splice(0, this.codes_message.length);

            this.is_beta = false;
            this.codes_message_beta.splice(0, this.codes_message_beta.length);

            this.max_hill_num = -1;

            for(let i=0, len=data_lists[this.index].length; i<len; i++){
                let w1 = visualcode_object[this.data_type][sort_order[tmp][i]].total_width;
                let w2 = visualcode_object[this.data_type][sort_order[tmp][i]].start_width;
                let d_idx = sort_order[tmp][i];
                let draw_value = { idx: d_idx, show: false, sim: 0, filter: [],
                    name: visualcode_object[data_value_line[0]][d_idx].name};
                draw_value['value'] = getMarksForDraw(data_lists[this.index][sort_order[tmp][i]], w1, w2);
                let hill_num = draw_value['value'].hline.length;
                this.max_hill_num = hill_num>this.max_hill_num?hill_num:this.max_hill_num; 
                this.codes_message.push(draw_value);
            }
            
            if(typeof(this.scroll_unit) === "undefined")
                this.updateScrollForDraw();
            else this.updateScrollForDraw(this.scroll_unit.scrollTop);
            
            filter_list[this.index].splice(0, filter_list[this.index].length);
            this.match_idx=[];

            /// For update circle in linechart in real time 
            if(interactive_list.length>0){
                bus.emit("clickForLine", -1);
                
                let idx = interactive_list[interactive_list.length-1]
                // bus.emit("analysisCode", [idx, this.index, this.codes_message[re_sort_order[this.sort_index][idx]]['value']]);
                bus.emit("analysisCode", [idx, false])
            }

        },

        /// This function is called just when initializing for synchronizing interaction
        synchronizeHighlight(){
            for(let i=0; i<interactive_list.length; i++){
                this.$refs.subcode[re_sort_order[this.sort_index][interactive_list[i]]].highlightReceiver();
            }
        },

        /// change persistence
        changeFinepersistence(event){
            event = event || window.event;
            if(event.wheelDelta){
                if(event.wheelDelta > 0)
                    this.per_val += this.fine_step;
                else
                    this.per_val -= this.fine_step;
            }
            else if(event.detail){
                if(event.wheelDelta > 0)
                    this.per_val += this.fine_step;
                else
                    this.per_val -= this.fine_step;
            }
            if(this.per_val < 0) this.per_val = 0;
            this.per_val = parseFloat(this.per_val.toFixed(6));
            this.changepersistence()
        },
        rollingForDetail(){
            window.onmousewheel = document.onmousewheel = this.changeFinepersistence;
            document.addEventListener("DOMMouseScroll", this.changeFinepersistence, false)
        },
        rollingCancel(){
            window.onmousewheel = document.onmousewheel = null;
            document.removeEventListener("DOMMouseScroll", this.changeFinepersistence, false)
        },
        changepersistence(){
            this.per_val = Number(this.per_val)
            pers_list[this.index][1] = this.per_val
            
            this.updateDrawMessage(this.per_val)
            this.updateMappingChannel()

            this.is_beta = false
            this.fastCutTimeRange()
        },

        /// change value attribute
        changeDataValue(){
            for(let i=2, len=data_type_name.length; i<len; i++){
                if(this.type_selector.value === data_type_name[i]){
                    this.data_type = i;
                    break;
                }
            }
            /// or init any other persistence value
            this.per_val = 0;
            this.coarse_max = data_field["max_domain"][this.data_type] - data_field["min_domain"][this.data_type]
            this.coarse_step = this.coarse_max / 50
            this.fine_max = data_field["step"][this.data_type]
            this.fine_step = this.fine_max / 50

            pers_list[this.index][0] = this.data_type;
            pers_list[this.index][1] = this.per_val;
            
            this.$refs.timeaxis.updateData(this.data_type)

            this.updateDrawMessage(this.per_val)
            this.updateMappingChannel()

        },

        moveFloat(e){
            if(this.float_include>=1) return;
            e = e || window.event;
            let wid = (this.float_height*this.float_include);
            let pos = e.offsetY + e.target.offsetTop - wid/2;
            if(pos<0) pos = 0;
            if(pos>this.float_height-wid) pos = this.float_height - wid;
            this.style_float.top = this.float_min+pos+"px";
            let scroll_float = pos/this.float_height*(this.codes_message.length*(this.onecode_height+2));
            this.scroll_unit.scrollTo(0, scroll_float);
            // this.updateScrollForDraw(scroll_float, false);
        },
        clickMoveFilter(e){
            e = e || window.event;
            let tar = e.target;
            if(tar.tagName !== "CANVAS" && tar.className !== "my-scroll-bar-float" && tar.className !== "my-scroll-bar-item"
                && tar.className !== "visual-code-canvas") return;

            let flag = false;
            let move_y = e.offsetY;
            while(tar.nodeName !== "MAIN"){
                if(tar.className === "one-bar"){
                    if(tar.id !== "bar_"+this.index) break;
                    flag = true;
                    break;
                }
                if(tar.className === "on-canvas"){
                    move_y -= this.scroll_unit.scrollTop;
                }
                move_y += tar.offsetTop;
                tar = tar.offsetParent;
            }
            
            if(!flag) return;

            let pos = move_y-this.click_float_y-this.float_min;
            let wid = (this.float_height*this.float_include);
            if(pos<0) pos = 0;
            if(pos>this.float_height-wid) pos = this.float_height - wid;

            this.style_float.top = this.float_min+pos+"px";
            let scroll_float = pos/this.float_height*(this.codes_message.length*(this.onecode_height+2));
            this.scroll_unit.scrollTo(0, scroll_float);
            // this.updateScrollForDraw(scroll_float, false);

        },
        upFliter(e){
            let moveFunction = this.clickMoveFilter;
            let upFunction = this.upFliter;

            document.removeEventListener("mousemove", moveFunction);
            document.removeEventListener("mouseup", upFunction);
        },
        clickFloat(e){
            if(this.float_include>=1) return;
            e = e || window.e;

            this.click_float_y = e.offsetY;
            let moveFunction = this.clickMoveFilter;
            let upFunction = this.upFliter;
            document.addEventListener("mousemove", moveFunction);
            document.addEventListener("mouseup", upFunction);
        },
        /// This function is used to record which codes should be render
        recordScroll(e){
            let scroll_y = this.scroll_unit.scrollTop;
            if(this.sort_mode)
                bus.emit("synchronizeScroll", [this.index, scroll_y])
            this.updateScrollForDraw(scroll_y)
        },

        updateScrollForDraw(scroll_y = 0, flag = true){
            /// This 2 is because the marign 2px in sub div
            this.first_on_screen = Math.floor(scroll_y / (this.onecode_height+2))
            let max_top = this.codes_message.length-this.once_render_num
            if( max_top > 0 && this.first_on_screen > max_top ) 
                this.first_on_screen = max_top;
            for(let i=0, j=0; i<this.codes_message.length && j<=this.once_render_num; i++){
                if(i>=this.first_on_screen){
                    this.codes_message[i].show = true;
                    j++;
                }
            }
            if(flag){
                let pos = scroll_y/(this.codes_message.length*(this.onecode_height+2))*this.float_height;
                this.style_float.top = this.float_min+pos+"px";
            }
        },

        /// This function is used to clear highlight and called in CodeCenter
        clearHighlight(){           
            for(let key in color_for_highlight){
                this.$refs.subcode[re_sort_order[this.sort_index][key]].highlightReceiver();
            }
        }
    },

    watch:{
        show_name(new_value, old_value){
            /// This number is the value of font size
            this.onecode_height += new_value ? 25: -25;
            // this.updateScrollForDraw(this.scroll_unit.scrollTop);
        },
        sort_mode(new_value, old_value){
            if(new_value){
                if(this.base_sort){
                    bus.emit("alignOrder", [this.index, this.scroll_unit.scrollTop])
                }
            }
            else{
                if(this.sort_index === this.index) return;
                this.sort_index = this.index
                updateOrder(this.index, this.data_type, this.sort_msg);
                let tmp = this.sort_index;
                this.codes_message.sort(function(a, b){
                    return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
                })
                this.codes_message_beta.sort(function(a, b){
                    return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
                })
            }
        }

    },

    created() {
        bus.on("updateVisualCode", msg=>{
            this.data_value_name.splice(0, this.data_value_name.length)
            for(let i=0; i<data_value_line.length; i++)
                this.data_value_name.push(data_type_name[data_value_line[i]])
            if(msg){
                this.per_val = 0
                this.data_type = data_value_line[0]
                this.coarse_max = data_field["max_domain"][this.data_type] - data_field["min_domain"][this.data_type]
                this.coarse_step = this.coarse_max / 50
                this.fine_step = data_field["step"][this.data_type] / 50
                this.time_x1 = CODE_PADDING
                this.time_x2 = CODE_WIDTH + CODE_PADDING
                this.type_selector.value = data_type_name[this.data_type]
                this.$refs.timeaxis.updateData(this.data_type);
                pers_list[this.index][0] = this.data_type;
                pers_list[this.index][1] = this.per_val;
            }
            
            this.updateDrawMessage(this.per_val, msg);
            this.updateMappingChannel(true);

            this.float_include = this.float_num/this.codes_message.length;
            // console.log(this.float_num,this.codes_message.length,this.float_include, this.float_height,  this.float_height*this.float_include);
            this.style_float.height = String(this.float_include>1?this.float_height: this.float_height*this.float_include)+"px";

        })

        bus.on("updateOrderRule", msg=>{
            if(msg[0] !== this.index) return;
            if(msg[1] === null){
                bus.emit("sendSortRule", this.sort_msg)
                return
            }
            this.sort_msg = msg[1];
            if(this.index === this.sort_index) this.reorderVisualCode()
        })

        bus.on("updateDataOrder", msg=>{ // 跟reorderVisualCode()函数大差不差，我也不知道我为啥写了两遍
            if(this.sort_index !== this.index) return;
            updateOrder(this.index, this.data_type, this.sort_msg);
            let tmp = this.sort_index;
            this.codes_message.sort(function(a, b){
                return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
            })
            for(let i =this.first_on_screen, j=0; i<this.codes_message.length && j<this.once_render_num; i++, j++){
                this.codes_message[i].show = true;
            }

            if(this.base_sort === true && this.sort_mode === true) 
                bus.emit("alignOrder", [this.sort_index, this.scroll_unit.scrollTop])
        })
        bus.on("changeRectOpacity", msg=>{  
            this.rect_opacity = msg
        })
        bus.on("changeLineOpacity", msg=>{  
            this.line_opacity = msg
        })

        bus.on("clickForLine", msg=>{
            if(msg === -1) return;
            this.$refs.subcode[re_sort_order[this.sort_index][msg]].highlightReceiver();
        })

        bus.on("alignOrder", msg=>{
            if(msg[0]===-2){
                let y = re_sort_order[this.sort_index][msg[1]]*(this.onecode_height+2);
                this.scroll_unit.scrollTo(0, y)
                return
            }

            // if(msg[0]===-1) this.sort_index = this.index;
            // else this.sort_index = msg[0];
            this.sort_index = msg[0];
            if(this.sort_index!== this.index) this.base_sort=false;
            else this.base_sort=true;
            let tmp = this.sort_index;
            this.codes_message.sort(function(a, b){
                return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
            })
            this.codes_message_beta.sort(function(a, b){
                return re_sort_order[tmp][a.idx] - re_sort_order[tmp][b.idx]
            })
            this.scroll_unit.scrollTo(0, msg[1]);
            // this.updateScrollForDraw(this.scroll_unit.scrollTop);
        })

        bus.on("synchronizeScroll", msg=>{
            if(msg[0] === this.index) return;
            if(!this.sort_mode) return;
            this.scroll_unit.scrollTo(0, msg[1]);
            // this.updateScrollForDraw(msg[1]);
        })

        bus.on("updatePersistence", msg=>{
            if(msg[0]!==pers_list[this.index][2]) return
            if(msg[2]) {
                this.cutTimeRange()
                return
            }
            this.per_val = parseFloat(msg[1].toFixed(6))
            pers_list[this.index][1] = this.per_val
            this.updateDrawMessage(this.per_val)
            this.updateMappingChannel()

            this.is_beta = false
            this.fastCutTimeRange()
        })

        /// get value type list, default the first one
        for(let i=0; i<data_value_line.length; i++)
            this.data_value_name.push(data_type_name[data_value_line[i]])
        this.data_type = data_value_line[0]
        /// update persistence range
        this.coarse_max = data_field["max_domain"][this.data_type] - data_field["min_domain"][this.data_type]
        this.coarse_step = this.coarse_max / 50
        // this.fine_max = data_field["step"][this.data_type]
        // this.fine_step = this.fine_max / 50
        this.fine_step = data_field["step"][this.data_type] / 50
        this.time_x1 = CODE_PADDING
        this.time_x2 = CODE_WIDTH + CODE_PADDING
        if(this.show_name)   this.onecode_height += 25;
        if(this.sort_mode) {
            this.sort_index = this.sort_base
            if(this.index == this.sort_index) this.base_sort = true
        }
        else this.sort_index = this.index


        for(let i=0; i<pers_index.length; i++){
            if(pers_index[i]===-1){
                pers_index[i] = this.index;
                this.style_color["color"] = PERS_COLOR[i];
                
                switch(this.style_color["color"]){
                    // case 'red': this.identify= 'A'; break;
                    case 'green': this.identify= 'B'; break;
                    case 'blue': this.identify= 'C'; break;
                }
                break;
            }
        }
        data_lists[this.index] = []
        pers_list[this.index] = [this.data_type, this.per_val, this.style_color["color"] ]
        sort_order[this.index] = []
        re_sort_order[this.index] = []
        filter_list[this.index] = []

        bus.emit("changeCodeView", [this.index, true])

        this.updateDrawMessage(this.per_val, true);
        this.updateMappingChannel();
        
    },
    mounted(){
        this.type_selector = document.querySelector(".seletor"+this.index)
        this.scroll_unit = document.getElementById("canvas"+this.index)

        this.float_min = this.scroll_unit.offsetTop;
        this.float_height = this.scroll_unit.offsetHeight;
        this.float_num = Math.ceil(this.float_height/(this.onecode_height+2));

        this.style_float.top = this.float_min+"px";
        this.float_include = this.float_num/this.codes_message.length;
        this.style_float.height = String(this.float_include>1?this.float_height: this.float_height*this.float_include)+"px";

        this.synchronizeHighlight()
    },
    /// destroyed() at vue2.0
    unmounted(){
        for(let i=0; i<pers_index.length; i++){
            if(pers_index[i]===this.index){
                pers_index[i] = -1;
                break;
            }
        }

        delete data_lists[this.index]
        delete pers_list[this.index]
        delete sort_order[this.index]
        delete re_sort_order[this.index]
        delete filter_list[this.index]

        bus.emit("changeCodeView", [this.index, false])

        /// update linechart
        if(interactive_list.length > 0){
            bus.emit("clickForLine", -1)
            // bus.emit("analysisCode", [interactive_list[0], -1, {}])
            bus.emit("analysisCode", [interactive_list[0], false])
        }
    }
}
</script>