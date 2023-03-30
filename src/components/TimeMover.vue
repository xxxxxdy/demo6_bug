<template>
    <div class="time-axis" style="position: relative; height:90px; margin-left: 12px;">
        <svg t="1677927383035" class="resize_box_bar left_resize_bar" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7260" :style="style_left_resize_bar" @mousedown="startDrag($event, 2)"></svg>
        <svg  class="resize_box_bar left_resize_bar" t="1677929332360" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7888" :style="style_right_resize_bar" @mousedown="startDrag($event, 3)"></svg> 

        <canvas :id="'time_'+target" :style="style_var" :width="canvas_x" :height="canvas_y"></canvas>
        <div :id="'touter_'+target" class="outer" :style="style_box"  @mousedown="startDrag($event, 0)"></div>
    </div>
</template>

<style scoped>

.resize_box_bar{
    position:absolute;
    top: 50%;
    transform:translate(0,-50%);
    width: 12px;
    height: 100%;
    z-index: 98;
}

.resize_box_bar:hover{
    cursor: e-resize;
}
</style>

<script>
import { hill_distri, max_hill_distri } from '../util/codeList';
import { CODE_PADDING, CODE_HEIGHT, CODE_WIDTH, SHOW_WIDTH, SHOW_HEIGHT} from '../util/parameters'

export default{
    emits:['timeAxis', 'fastTimeAxis'], 

    props:{
        target:{ type: [String, Number], default: 0 },
        type:{type:[String, Number], default:2}
    },

    data(){
        return{
            style_x_num:SHOW_WIDTH*1.1,
            
            canvas_x: CODE_WIDTH + 2*CODE_PADDING,
            canvas_y: CODE_HEIGHT + 2*CODE_PADDING,
            
            box_para:{le: 0, ri: 0, step: 0},
            dragleft: false,
            move_offset: 0,
        
            nums: hill_distri[this.type],
            maxs: max_hill_distri[this.type],
            MouseDownPos: -1,
            leBeforeMove:0,
            riBeforeMove:0,
            changeBoxState:0,
            resize_bar_width:12
        }
    },
    computed:{
        style_var(){
            return {
                "width": this.style_x_num+"px",
                "height": "80px"
            }
        },
        style_box(){
            return {position:"absolute", left: "12px", top: "0px",
                width: this.style_x_num+"px", height: "100%"}
        },
        style_left_resize_bar(){
            return{
                left: (CODE_PADDING + (this.box_para.step * this.box_para.le)) * this._scale_x-this.resize_bar_width+3
            }
        },
        style_right_resize_bar(){
            return{
                left: (CODE_PADDING + (this.box_para.step * this.box_para.ri)) * this._scale_x
            }
        },
        _scale_x(){
            return this.style_x_num / this.canvas_x 
        }
    },
    methods:{

        resetData(){
            this.box_para.le = 0;
            this.box_para.ri = this.nums.length;
            this.drawAxis();
        },

        updateData(data_type){
            this.nums = hill_distri[data_type];
            this.maxs = max_hill_distri[data_type];
            this.context.fillStyle = '#ffffff'
            this.context.fillRect(0, 0, this.canvas_x, this.canvas_y)
            this.resetData();
        }, 

        moveBoxSide(e){
            e = e|| window.event;
            let tar = e.target;
            let str = tar.id;
            if(str !=="touter_"+this.target){
                return;
            }
            let nowPos = this.getNowMousePos(e.offsetX)
            if(nowPos < 0){
                nowPos = 0
            }else if(nowPos > this.nums.length){
                nowPos = this.nums.length
            }
            let tmp = nowPos - this.MouseDownPos
            if(this.changeBoxState == 0){
                // move the box
                if(tmp < 0){
                    //left move
                    let new_le = this.leBeforeMove + tmp
                    new_le = new_le < 0 ? 0:new_le
                    this.box_para.ri = this.riBeforeMove + (new_le - this.leBeforeMove)
                    this.box_para.le = new_le
                }else if(tmp > 0){
                    //right move
                    let new_ri = this.riBeforeMove + tmp
                    new_ri = new_ri > this.nums.length ? this.nums.length:new_ri
                    this.box_para.le = this.leBeforeMove + (new_ri - this.riBeforeMove)
                    this.box_para.ri = new_ri
                }
            }else if(this.changeBoxState == 1){
                //set a new box
                //defalut: nowPos is on the right
                let new_left_pos = this.MouseDownPos
                if(nowPos < new_left_pos){
                    tmp = new_left_pos
                    new_left_pos = nowPos
                    nowPos = tmp
                }
                if(new_left_pos >= this.nums.length){
                    new_left_pos = this.nums.length-1
                }
                // this.box_para.le = new_left_pos
                // this.box_para.ri = nowPos + 1
                this.box_para.le = new_left_pos
                this.box_para.ri = nowPos
                if(this.box_para.le === this.box_para.ri) this.box_para.ri++
            }else if(this.changeBoxState == 2){
                //left resize
                if(nowPos >= this.box_para.ri){
                    nowPos = this.box_para.ri - 1
                }
                this.box_para.le = nowPos
            }else if(this.changeBoxState == 3){
                //right resize
                if(nowPos <= this.box_para.le){
                    nowPos = this.box_para.le + 1
                }
                this.box_para.ri = nowPos
            }
            this.drawAxis();
            this.$emit('fastTimeAxis', [this.box_para.le*this.box_para.step, this.box_para.ri*this.box_para.step]);
        },

        updateBoxSide(e){
            let moveFunction = this.moveBoxSide;
            let upFunction = this.updateBoxSide;
            document.removeEventListener("mousemove", moveFunction);
            document.removeEventListener("mouseup", upFunction);
            this.$emit('timeAxis', [this.box_para.le*this.box_para.step, this.box_para.ri*this.box_para.step]);
        },

        getNowMousePos(offsetX){
            return Math.round(offsetX/this._scale_x/this.box_para.step)
        },
        startDrag(e, flag){
            e = e|| window.event;
            this.MouseDownPos = this.getNowMousePos(e.offsetX)
            if(flag == 0){
                if(this.MouseDownPos < 0){
                    this.MouseDownPos = 0
                }else if(this.MouseDownPos > this.nums.length){
                    this.MouseDownPos = this.nums.length
                }
                if( (this.box_para.le !== 0 || this.box_para.ri !== this.nums.length) && (this.MouseDownPos >= this.box_para.le && this.MouseDownPos < this.box_para.ri)){
                    // move the box
                    this.riBeforeMove = this.box_para.ri
                    this.leBeforeMove = this.box_para.le
                    this.changeBoxState = 0
                }else{
                    // set a new box
                    this.changeBoxState = 1
                }
            }else{
                // change size
                this.changeBoxState = flag
            }
            //console.log(flag,this.changeBoxState,e.offsetX,this.MouseDownPos,this.box_para.le, this.box_para.ri)
            //console.log(e.offsetX,this.box_para.step,this.dragleft, x, this.box_para.le, this.box_para.ri)
            let moveFunction = this.moveBoxSide;
            let upFunction = this.updateBoxSide;
            document.addEventListener("mousemove", moveFunction);
            document.addEventListener("mouseup", upFunction);
        },
        initCanvas(){
            this.canvas = document.querySelector("#time_"+this.target)
            this.context = this.canvas.getContext('2d')
        },

        drawDashLine([x1, y1], [x2, y2], step = 5) {
            const x = x2 - x1, y = y2 - y1,
                count = Math.floor(Math.sqrt(x * x + y * y) / step),
                xv = x / count, yv = y / count;
            this.context.beginPath();
            for (let i = 0; i < count; i++) {
                if (i % 2 === 0) {
                    this.context.moveTo(x1, y1);
                } else {
                    this.context.lineTo(x1, y1);
                }
                x1 += xv;
                y1 += yv;
            }
            this.context.lineTo(x2, y2);
        },

        drawDashRect(left, top, width, height, step = 5) {
            this.drawDashLine([left, top], [left + width, top], step);
            this.context.stroke();
            this.drawDashLine([left + width, top],[left + width, top + height],step);
            this.context.stroke();
            this.drawDashLine([left + width, top + height],[left, top + height],step);
            this.context.stroke();
            this.drawDashLine([left, top + height], [left, top], step);
            this.context.stroke();
        },

        drawAxis(){
            this.context.fillStyle = '#ffffff'
            this.context.fillRect(0, 0, this.canvas_x, this.canvas_y)

            let start = CODE_PADDING;
            let bottom = CODE_HEIGHT;
            let width = this.box_para.step;
            this.context.strokeStyle = '#809FB8';
            for(let i=0, j=this.nums.length; i<j; i++){
                if(i>=this.box_para.le && i<this.box_para.ri) {
                    this.context.fillStyle = '#2932FF';
                } 
                else{
                    this.context.fillStyle = '#F1F4FA';
                    
                }  
                let height = bottom*this.nums[i]/this.maxs;
                let top = bottom - height + CODE_PADDING;
                this.context.fillRect(start, top, width, height);
                this.context.strokeRect(start, top, width, height);
                start += width;
            }
            this.context.strokeStyle = '#2932FF';
            this.drawDashRect(CODE_PADDING + this.box_para.step*this.box_para.le, CODE_PADDING-6, this.box_para.step*(this.box_para.ri-this.box_para.le), CODE_HEIGHT+8);

        }
    },

    mounted(){
        this.initCanvas();
        this.box_para.ri = this.nums.length;
        this.box_para.step = CODE_WIDTH/this.nums.length;
        this.drawAxis();
    }
}
</script>