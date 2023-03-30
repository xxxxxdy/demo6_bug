<template>
    <div class="encode">
        <div class="text" style="display:inline-block;font-weight: bold " @click="makeEncodeFold"> Encode </div>
        <select id="reset" class="encode-button" @change="getEncodingTemplate">
            <option>Tem.1</option>
            <option>Tem.2</option>
            <option>Tem.3</option>
        </select>
        <input type="button" id="update" class="encode-button" value="Update" @click="startUpdateVisualCode">
        
        <div class="text3 rect" v-show="encode_fold">
            <div class="text2">Rectangle</div>
            Width
            <select class="rect-width" @change="setRectWidth">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
            Height
            <select class="rect-height" @change="setRectHeight">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
            Position
            <select class="rect-pos" @change="setRectPos">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
        </div>

        <div class="text3 line" v-show="encode_fold">
            <div class="text2">Hrizontal Strip</div>
            Width
            <select class="line1-width" @change="setLine1Width">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
            Position
            <select class="line1-height" @change="setLine1Pos">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
            Stroke Width
            <select class="line1-stroke" @change="setLine1StrokeWidth">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
            Dash Style
            <select class="line1-strokeDash" @change="setLine1StrokeDash">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
        </div>

        <div class="text3 line" v-show="encode_fold">
            <div class="text2">Vertical Bar</div>
            Width
            <select class="line2-height" @change="setLine2Height">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
            Stroke Width
            <select class="line2-stroke" @change="setLine2Stroke">
                <option v-for="item in encode_options">{{item}}</option>
            </select>
            <br>
        </div>
    </div>

    <div id="split-line" ></div>

    <div class="text3 sort">
        <div class="text" style="display:inline-block;font-weight: bold; margin-bottom: 5px;"> Order </div>
        <select class="windows-select" @change="loadSortRule">
            <option v-for="item in code_view">{{item}}</option>
        </select>
        <draggable v-model="sort_list" item-key="index" style="padding-left:5px" @change="updateSortRule" >
            <template #item="{element}">
                <div :key="element.index" class="dragbox" >
                    <div style="display:inline-block" position="relative" class="drag-text" > {{ element.name }}</div>
                    <select class="sort-option" :id="'sort_'+element.index" @change="updateSortMsg">
                        <option>ON</option>
                        <option>RE</option>
                        <option>OFF</option>
                    </select>
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" :id="'icon_'+element.index" @click="updateSortPos">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"></path>
                    </svg>
                </div>
            </template>
        </draggable>
    </div> 

    <div id="split-line" ></div>

    <div class="text3 param">
        <div class="text" style="display:inline-block;font-weight: bold; margin-bottom: 5px;" > Parameters </div>
        <button id="name" class="par-button" :style="{backgroundColor:named? '#2932FF': '#809FB8' }" @click="changeName">Name</button>
        <br>
        Rect-opacity
        <input type="range" class="opacity" id="rect" min="0" max="1" step="0.01" v-model="rect_opacity" @input="changeRectOpacity">
        <br>
        Line-opacity
        <input type="range" class="opacity" id="line" min="0" max="1"
            step="0.01" v-model="line_opacity" @input="changeLineOpacity">
        <!-- <input type="button" id="time" class="par-button" value="Global Time" @click="changeGlobalX">
        <input type="button" id="value" class="par-button" value="Global Value" @click="changeGlobalY"> -->
        

    </div>
    
</template>

<style scoped>
.encode, .param, .sort{
    position: relative;
    margin-left: 15%;
    margin-top: 5%;
}

.text{
  color:#2932FF;
  font-size: 16px;
  display: inline-block;
}

.drag-text:hover{
    font-weight: bold;
}

.encode-button{
    position: absolute;
    width: 70px;
    color: #F1F4FA;
    background-color: #809FB8;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #809FB8;
    opacity: 0.8;
}

#reset{
    right: 40%;
}

#update{
    right: 10%;
}

#update:active{
    background-color: #2932FF;
}

.text2{
    margin-top: 5px;
    margin-bottom: 5px;
    color:#809FB8;
    font-weight: bold;
    font-size: 14px;
}

.text3{
    color:#809FB8;
    text-align: 14px;
    line-height: 26px;
}

select{
    color: #809FB8;
    position: absolute;
    width: 100px;
    right: 10%;
    background-color: #F1F4FA;
    border-radius: 20px;
    border: 1px solid #C6D7E5;
    text-align: left;
    padding-left: 3px;
}

#split-line{
  height: 2px;
  background-color:#C6D7E5;
  margin-top: 8%;
  margin-left: 15%;
  margin-right: 10%;
  margin-bottom: 8%;
}

.dragbox{
    border: 1px #809FB8 solid;
    width: 85%;
    margin-top: 10px;
    padding-left: 5px;
    border-radius: 20px;
    position: relative;
}

/* .par-button{
    margin-top: 10px;
    position: absolute;
    color: #F1F4FA;
    background-color: #809FB8;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #809FB8;
    opacity: 0.8;
} */

#time{
    width: 90px;
}

#value{
    width: 90px;
    right: 105px;
}

#name{
    position: absolute;
    color: #F1F4FA;
    background-color: #809FB8;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #809FB8;
    opacity: 0.8;
    width:50px;
    right: 10%;
}

svg{
    width: 20px;
    color: #809FB8;
    position: absolute;
    right: 6px;
    top: 3px;
}

svg:hover{
    width: 22px;
    right: 5px;
    top:2px;
}

.sort-option{
    position: absolute;
    width: 60px;
    color: #F1F4FA;
    background-color: #809FB8;
    font-size: 14px;
    border-radius: 10px;
    opacity: 0.8;
    right:40px;
    top: 3px;
}

.opacity{
    position: absolute;
    right: 10%;
    width: 30%;
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
    width: 10px;
    height:10px;
    border-radius: 50%;
    background-color: #809FB8;
    margin-top: -4px;
    border: 1px solid transparent;
    border-image: linear-gradient(#809FB8,#809FB8) 0 fill / 6 10 6 0 / 0 0 0 99vw;
}

[type="range"]::-webkit-slider-container {
    height: 10px;
    overflow: hidden;
}
[type="range"]::-webkit-slider-runnable-track {
    height: 2px;
    background: #D1D4DE;
}

</style>

<script>
import { mapping_relationship, user_parameters } from '../util/parameters'
import bus from '../util/eventBus'
import Draggable from 'vuedraggable'
import { sort_type, updateOrder } from '../util/sortForVisual'
import { initAllTheHillsData } from '../util/codeList'
import { calculateDataField } from "../util/dataManager"
import { PERS_COLOR, pers_index } from '../util/colorMapping';

export default{
    components:{ Draggable },
    data(){
        return{
            encode_options:['none','width','peak_time',
                'peak_value','min_value','persistence','area'],
            encode_fold: true,
            // sort_fold: true,
            global_x: true,
            global_y: true,
            named: false,
            rect_opacity: 0.8,
            line_opacity: 1,     
            // on_line_order: false,
            sort_list:sort_type.map((name, index) =>{
                return { name, index, on:true, reverse:false};
            }),
            code_view:[],
            win_index: []
        }
    },

    methods:{

        /// fold toorbar
        makeEncodeFold(){
            this.encode_fold = !this.encode_fold;
        },

        getEncodingTemplate(flag = true){
            switch(this.template.value){
                case 'Tem.1':
                    this.rect_width.value = this.encode_options[6]
                    mapping_relationship["rect"]["width"] = this.encode_options[6]
                    this.rect_height.value = this.encode_options[0]
                    mapping_relationship["rect"]["height"] = this.encode_options[0]
                    this.rect_pos.value = this.encode_options[2]
                    mapping_relationship["rect"]["x"] = this.encode_options[2]
                    // this.rect_color.value = this.encode_options[0]
                    // mapping_relationship["rect"]["fill"] = this.encode_options[0]
                    this.line1_width.value = this.encode_options[1]
                    mapping_relationship["hline"]["width"] = this.encode_options[1]
                    this.line1_y.value = this.line1_y.options[0].value;
                    mapping_relationship["hline"]["y"] = this.encode_options[0]
                    this.line1_strokeWidth.value = this.encode_options[0]
                    mapping_relationship["hline"]["strokeWidth"] = this.encode_options[0]
                    this.line1_strokeDash.value = this.encode_options[0]
                    mapping_relationship["hline"]["strokeDash"] = this.encode_options[0]
                    // this.line1_color.value = this.encode_options[0]
                    // mapping_relationship["hline"]["stroke"] = this.encode_options[0]
                    this.line2_height.value = this.encode_options[0]
                    mapping_relationship["vline"]["height"] = this.encode_options[0]
                    this.line2_strokeWidth.value = this.encode_options[0]
                    mapping_relationship["vline"]["strokeWidth"] = this.encode_options[0]
                    // this.line2_color.value = this.encode_options[0]
                    // mapping_relationship["vline"]["stroke"] = this.encode_options[0]
                    break;

                case 'Tem.2':
                    this.rect_width.value = this.encode_options[6]
                    mapping_relationship["rect"]["width"] = this.encode_options[6]
                    this.rect_height.value = this.encode_options[5]
                    mapping_relationship["rect"]["height"] = this.encode_options[5]
                    this.rect_pos.value = this.encode_options[4]
                    mapping_relationship["rect"]["x"] = this.encode_options[4]
                    this.line1_width.value = this.encode_options[1]
                    mapping_relationship["hline"]["width"] = this.encode_options[1]
                    this.line1_y.value = this.line1_y.options[0].value;
                    mapping_relationship["hline"]["y"] = this.encode_options[0]
                    this.line1_strokeWidth.value = this.encode_options[0]
                    mapping_relationship["hline"]["strokeWidth"] = this.encode_options[0]
                    this.line1_strokeDash.value = this.encode_options[0]
                    mapping_relationship["hline"]["strokeDash"] = this.encode_options[0]
                    this.line2_height.value = this.encode_options[2]
                    mapping_relationship["vline"]["height"] = this.encode_options[2]
                    this.line2_strokeWidth.value = this.encode_options[3]
                    mapping_relationship["vline"]["strokeWidth"] = this.encode_options[3]
                    break;
                case 'Tem.3':
                    this.rect_width.value = this.encode_options[1]
                    mapping_relationship["rect"]["width"] = this.encode_options[1]
                    this.rect_height.value = this.encode_options[6]
                    mapping_relationship["rect"]["height"] = this.encode_options[6]
                    this.rect_pos.value = this.encode_options[5]
                    mapping_relationship["rect"]["x"] = this.encode_options[5]
                    this.line1_width.value = this.encode_options[2]
                    mapping_relationship["hline"]["width"] = this.encode_options[2]
                    this.line1_y.value = this.line1_y.options[0].value;
                    mapping_relationship["hline"]["y"] = this.encode_options[0]
                    this.line1_strokeWidth.value = this.encode_options[3]
                    mapping_relationship["hline"]["strokeWidth"] = this.encode_options[3]
                    this.line1_strokeDash.value = this.encode_options[0]
                    mapping_relationship["hline"]["strokeDash"] = this.encode_options[0]
                    this.line2_height.value = this.encode_options[3]
                    mapping_relationship["vline"]["height"] = this.encode_options[3]
                    this.line2_strokeWidth.value = this.encode_options[0]
                    mapping_relationship["vline"]["strokeWidth"] = this.encode_options[0]
                    break;
            }


            if(flag) this.startUpdateVisualCode();
        },
        startUpdateVisualCode(){
            bus.emit("updateVisualCode", false);
            // console.log(mapping_relationship);
        },

        /// a series of assignment funtions
        setRectWidth(){
            mapping_relationship["rect"]["width"] = this.rect_width.value;
        },
        setRectHeight(){
            mapping_relationship["rect"]["height"] = this.rect_height.value;
        },
        setRectPos(){
            mapping_relationship["rect"]["x"] = this.rect_pos.value;
        },
        setRectColor(){
            mapping_relationship["rect"]["fill"] = this.rect_color.value;
        },
        setLine1Width(){
            mapping_relationship["hline"]["width"] = this.line1_width.value;
        },
        setLine1Pos(){
            mapping_relationship["hline"]["y"] = this.line1_y.value;
        },
        setLine1StrokeWidth(){
            mapping_relationship["hline"]["strokeWidth"] = this.line1_strokeWidth.value;
        },
        setLine1StrokeDash(){
            mapping_relationship["hline"]["strokeDash"] = this.line1_strokeDash.value;
        },
        setLine1Color(){
            mapping_relationship["hline"]["stroke"] = this.line1_color.value;
        },
        setLine2Height(){
            mapping_relationship["vline"]["height"] = this.line2_height.value;
        },
        setLine2Stroke(){
            mapping_relationship["vline"]["strokeWidth"] = this.line2_strokeWidth.value;
        },
        setLine2Color(){
            mapping_relationship["vline"]["stroke"] = this.line2_color.value;
        },

        changeRectOpacity(){
            user_parameters["rect_opacity"] = this.rect_opacity;
            bus.emit("changeRectOpacity", this.rect_opacity);
        },
        changeLineOpacity(){
            user_parameters["line_opacity"] = this.line_opacity;
            bus.emit("changeLineOpacity", this.line_opacity);
        },

        changeName(){
            this.named = !this.named
            bus.emit("changeName", this.named)
        },

        loadSortRule(){
            for(let i=0; i<this.code_view.length; i++){
                if(this.win_now.value === this.code_view[i]){
                    bus.emit("updateOrderRule", [this.win_index[i], null])
                }
            }
        },

        updateSortRule(){
            for(let i=0; i<this.code_view.length; i++){
                if(this.win_now.value === this.code_view[i]){
                    bus.emit("updateOrderRule", [this.win_index[i], this.sort_list])
                }
            }
        },

        updateSortMsg(e){
            e = window.event || e;
            let node = e.target
            for(let i=0;i<this.sort_list.length; i++){
                if(this.sort_list[i].index === Number(node.id.split('_')[1])){
                    switch(node.value){
                        case 'ON': this.sort_list[i].reverse = false, this.sort_list[i].on = true; break;
                        case 'RE':this.sort_list[i].reverse = true, this.sort_list[i].on = true; break;
                        case 'OFF': this.sort_list[i].on = false; break;
                    }
                    break;
                }
            }
            this.updateSortRule();
        },

        updateSortPos(e){
            e = window.event || e;
            let node = e.target
            for(let i=0;i<this.sort_list.length; i++){
                if(this.sort_list[i].index === Number(node.id.split('_')[1])){
                    let tmp = this.sort_list[i];
                    if(i===0){
                        this.sort_list[i] = this.sort_list[i+1];
                        this.sort_list[i+1] = tmp;
                    }
                    else{
                        this.sort_list[i] = this.sort_list[i-1];
                        this.sort_list[i-1] = tmp;
                    }
                    break;
                }
            }
            this.updateSortRule();
        }



        // changeGlobalX(){
        //     user_parameters["global_time"] = !user_parameters["global_time"];
        //     for(let key in visualcode_object){
        //         for(let i=0, len=visualcode_object[key].length; i<len; i++)
        //             visualcode_object[key][i].updateDataXDomain();
        //     }
        //     bus.emit("updateVisualCode", false);
        // },
        // changeGlobalY(){
        //     user_parameters["global_value"] = !user_parameters["global_value"];
        //     for(let key in visualcode_object){
        //         for(let i=0, len=visualcode_object[key].length; i<len; i++)
        //             visualcode_object[key][i].updateDataYDomain(key);
        //     }
        //     bus.emit("updateVisualCode", false);
        // },

    },

    created(){
        bus.on("updateDataset", msg=>{
            /// parameters will not reset while update dataset
            this.getEncodingTemplate(false);
            this.sort_list = sort_type.map((name, index) =>{
                return { name, index, on:true, reverse:false};
            })
            calculateDataField();
            /// This function only call here to deal the origin data
            initAllTheHillsData()
            console.log("finish coding.");
        })

        bus.on("changeCodeView", msg=>{
            if(msg[1]){
                this.win_index.push(msg[0])
                for(let k=0; k<pers_index.length; k++){
                    if(pers_index[k]===msg[0]){
                        switch(PERS_COLOR[k]){
                            case 'red': this.code_view.push('Group A'); break;
                            case 'green': this.code_view.push('Group B'); break;
                            case 'blue': this.code_view.push('Group C'); break;
                        }
                        break;
                    }
                }
            }
            else{
                for(let i=0; i<this.win_index.length;i++){
                    if(this.win_index[i] === msg[0]){
                        this.win_index.splice(i, 1)
                        this.code_view.splice(i, 1)
                    }
                }
            }
        })

        bus.on("sendSortRule", msg=>{
            if(msg!== null)  this.sort_list = msg;
            else this.sort_list = sort_type.map((name, index) =>{
                return { name, index, on:true, reverse:false};
            })

            let select_list = document.querySelectorAll(".sort-option");
            for(let i=0; i<this.sort_list.length; i++){
                if(this.sort_list[i].on){
                    if(this.sort_list[i].reverse){
                        select_list[i].value = 'RE';
                    }
                    else{
                        select_list[i].value = 'ON';
                    }
                }
                else{
                    select_list[i].value = 'OFF';
                }
            }
        })

        calculateDataField();
        initAllTheHillsData()
    },

    mounted(){
        this.template = document.querySelector("#reset");
        this.rect_width = document.querySelector(".rect-width");
        this.rect_height = document.querySelector(".rect-height");
        this.rect_pos = document.querySelector(".rect-pos");
        // this.rect_color = document.querySelector(".rect-color");
        this.line1_width = document.querySelector(".line1-width");
        this.line1_y = document.querySelector(".line1-height");
        this.line1_strokeWidth = document.querySelector(".line1-stroke");
        this.line1_strokeDash = document.querySelector(".line1-strokeDash");
        // this.line1_color = document.querySelector(".line1-color");
        this.line2_height = document.querySelector(".line2-height");
        this.line2_strokeWidth = document.querySelector(".line2-stroke");
        // this.line2_color = document.querySelector(".line2-color");
        this.win_now = document.querySelector(".windows-select");

        this.getEncodingTemplate(false);
    }
}
</script>