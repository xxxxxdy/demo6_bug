<template>
    <div class="center" :style="style_width">
        <div class="text">Barcode </div>

        <svg class="lock locked" v-show="!independance" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="changeSortMode">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
        </svg>

        <svg class="lock unlocked" v-show="independance" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="changeSortMode">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
        </svg>

        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="add" @click="addVisualCodeList">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
        </svg>

        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="top" @click="showFloatView">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"></path>
        </svg>
    
        <div class="pers-bar">
            <div class="one-bar" v-for="item in visual_list" :key="item" :id="'bar_'+item">
                <MyCodesList  ref="code_window" @delete="deleteVisualCodeList" :index="item" :show_name="show_name" :sort_mode="!independance" :sort_base="sort_idx"/>
            </div>
        </div>

        <!-- <div class="float-div" v-show="float_hover" style="cursor: pointer;" >
            <div class="topping" :style="{color: top_match? '#2932FF': '#809FB8' }" @click="changeTopMatch">Top matching</div>
           <div class="topping" :style="{color: top_select? '#2932FF': '#809FB8'}" @click="changeTopSelect">Top selected</div>
        </div> -->

        <div class="float-div" v-show="float_hover" style="cursor: pointer;" >
            <div class="topping" @click="changeTopMatch">Top matching</div>
            <div class="topping" @click="changeTopSelect">Top selected</div>
            <div class="topping" @click="changeTopToNone">No top</div>
        </div>

    </div>
</template>

<style scoped>
.center{
    height: 1250px;
    border-radius: 20px; 
    position: relative;
    border: 2px solid #F1F4FA;
}

.topping:hover{
    font-weight: bold;
}

.text{
  color:#2932FF;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  border-radius: 20px;
  background-color: #F1F4FA;
}

.pers-bar{
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
}

.one-bar{
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: 2px;
    margin-right: 2px;
    transform: all 0.3s
}

.add, .top, .lock{
    position: absolute;
    width: 25px;
    color:#2932FF;
    top: 8px;
}
.add{
    right: 12px;
}
.top{
    right: 40px;
}

.lock{
    right: 70px;
}

.float-div{
    position: absolute;
    padding: 5px;
    padding-left: 10px;
    top: 5px;
    font-size: 14px;
    box-shadow: 0 0 2px 2px #C6D7E5;
    border-radius: 10px;
    width: 110px;
    left: 260px;
    color:#809FB8;
    background-color: white;
    z-index: 100;
}

</style>

<script>
import MyCodesList from './MyCodesList.vue';
import bus from '../util/eventBus';
import { interactive_list } from '../util/codeList';
import { color_for_highlight } from '../util/colorMapping';
import { select_first, match_first } from '../util/sortForVisual';

export default{
    emits:['change'],
    components:{ MyCodesList },
    data(){
        return{
            style_width:{
                "width": "300px"
            },
            show_name: false,
            visual_list: [0],
            latest_idx: 0,
            independance :false,
            float_hover: false,
            sort_idx: 0
            // top_select: false,
            // top_match: false, 
        }
    },

    methods:{
        exportToCsv(){

        },
        
        changeSortMode(){
            this.independance = !this.independance
        },

        changeTopToNone(){
            select_first[0] = false
            match_first[0] = false
            bus.emit("updateDataOrder", null)
        },

        changeTopSelect(){
            // this.top_select = !this.top_select
            // select_first[0] = this.top_select
            select_first[0] = true
            bus.emit("updateDataOrder", null)
        },

        changeTopMatch(){
            // this.top_match = !this.top_match
            // match_first[0] = this.top_match
            match_first[0] = true
            bus.emit("updateDataOrder", null)
        },

        closeFloatView(e){   
            e = e || window.event;
            let tar = e.target;
            let flag = false;
            while(tar.nodeName !== "BODY"){
                if(tar.className === "float-div"){
                    flag = true;
                    break;
                }
                tar =  tar.offsetParent;
            }
            if(flag) return;

            this.float_hover = false;
            document.removeEventListener("mouseup", this.closeFloatView);
        },
        showFloatView(){
            this.float_hover = true;
            let closeFunction = this.closeFloatView;
            document.addEventListener("mouseup", closeFunction);
        },    


        addVisualCodeList(){
            if(this.visual_list.length >= 3){
                alert('The visual codes list exceed its upper limit')
                return
            }
            this.visual_list.push(++this.latest_idx)
            this.$emit('change', this.visual_list.length)
            this.style_width["width"] = 300*this.visual_list.length+"px";

        },

        deleteVisualCodeList(index){
            if(this.visual_list.length<=1){
                alert('This is the last visual code')
                return
            }
      
            for(let i=0; i<this.visual_list.length; i++){
                if(Number(index) === this.visual_list[i]){
                    this.visual_list.splice(i, 1)
                    bus.all.get("updateVisualCode").splice(i, 1)
                    bus.all.get("updateOrderRule").splice(i, 1)
                    bus.all.get("updateDataOrder").splice(i, 1)
                    bus.all.get("changeRectOpacity").splice(i, 1)
                    bus.all.get("changeLineOpacity").splice(i, 1)
                    bus.all.get("clickForLine").splice(i+1, 1)
                    // bus.all.get("showSimilarityCode").splice(i, 1)
                    // bus.all.get("calculateDistance").splice(i, 1)
                    bus.all.get("alignOrder").splice(i, 1)
                    bus.all.get("synchronizeScroll").splice(i, 1)
                    bus.all.get("updatePersistence").splice(i, 1)
                    break
                }
            }

            if(this.sort_idx === index){
                this.sort_idx = this.visual_list[0];
                if(!this.independance) bus.emit("alignOrder", [this.sort_idx, 0])
            }
            this.$emit('change', this.visual_list.length)
            this.style_width["width"] = 300*this.visual_list.length+"px";

        },
 
    },
    created(){
        bus.on("clearCanvas", msg=>{
            for(let i=0; i<this.visual_list.length; i++)
                this.$refs.code_window[i].clearHighlight()
            for(let key in color_for_highlight)
                delete color_for_highlight[key]
            interactive_list.splice(0, interactive_list.length)
            bus.emit("clickForLine", -1)
        })

        bus.on("alignOrder", msg=>{
            this.sort_index = msg[0];
        })

        bus.on("changeName", msg=>{
            this.show_name = msg
        })
    },

}
</script>