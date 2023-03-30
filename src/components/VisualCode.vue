<template>
    <div :style="style_border">
        <div class="codename" :id="('name_'+target+'_'+mapping)" v-show="show_name"> {{code_name}} </div>
        <canvas :id="('_'+target+'_'+mapping)" :style="style_var"
        :width="canvas_x" :height="canvas_y"></canvas>
        <div :style="style_right"></div>
    </div>
    
</template>

<style scoped>
.codename{
    font-weight:bold; 
    padding-left: 30px; 
    height: 25px;
    color:#809FB8;
}

canvas{
    background-color: white;
}
</style>

<script>
import { color_for_highlight, pers_index, PERS_COLOR } from '../util/colorMapping'
import { CODE_PADDING, CODE_HEIGHT, CODE_WIDTH, SHOW_WIDTH, SHOW_HEIGHT, mapping_default, user_parameters } from '../util/parameters'

export default{
    name: 'VisualCode',
    // emits:['highlight', 'delete'],
    props:{
        target:{
            type: [String, Number],
            default: 0
        }, 
        mapping:{
            type: Number,
            default: -1
        },
        draw_message:{
            type: Object,
            default:{
                hline: [{x:0, y:30, x2: 200, y2:30}, {x:200, y:30, x2: 300, y2:30}],
                vline: [{x:200, y:10, x2:200, y2:50}, {x:300, y:10, x2:300, y2:50}],
                rect: [{x:40, y:0, width:80, height:60}, {x:280, y:0, width:20, height:60}]
            }
        },
        rect_opacity:{ type:[Number, String], default: 0.8 },
        line_opacity:{ type:[Number, String], default: 1 },
        show:{type:Boolean, default: false},
        show_name:{type:Boolean, default: false},
        code_name:{type:[String, Number], default: 0},
        filter:{type:Array, default: []}
    },

    data(){
        return{ 
            style_border:{
                "position": "relative",
                "border": "2px solid white",
                "height": "55px",
                "width": "100%",
                "margin": "2px"
            },
            style_var:{
                "width":SHOW_WIDTH +"px",
                "height": SHOW_HEIGHT+"px"
            },
            style_right:{
                "width": "3px",
                "borderRadius":"2px",
                "position": "absolute",
                "height": "80%",
                "right":"3px",
                "bottom": "6px",
                "backgroundColor": "white"

            },

            default_channel:{
                hline_strokewidth: mapping_default["hline"]["strokeWidth"],
                hline_strokedash: mapping_default["hline"]["strokeDash"],
                hline_color: mapping_default["hline"]["stroke"],
                vline_strokewidth: mapping_default["vline"]["strokeWidth"],
                vline_color: mapping_default["vline"]["stroke"],
                rect_color: mapping_default["rect"]["fill"]
            },

            canvas_x: CODE_WIDTH + 2*CODE_PADDING,
            canvas_y: CODE_HEIGHT + 2*CODE_PADDING,

        }
    },

    methods:{
        initCanvas(){
            this.canvas = document.querySelector("#_"+this.target+"_"+this.mapping)
            this.context = this.canvas.getContext('2d')
        },

        drawHline(){
            // this.context.strokeStyle = 'rgba(0, 0, 0, '+ this.line_opacity+')'
            this.context.lineWidth = this.default_channel['hline_strokewidth']
            this.context.setLineDash(this.default_channel['hline_strokedash'])
            for(let i=0, j=this.draw_message['hline'].length; i<j; i++){
                if(this.draw_message['hline'][i]['x2']-this.draw_message['hline'][i]['x']<10) continue
                if(this.filter.indexOf(i+1)!==-1) this.context.strokeStyle = 'rgba(128, 159, 184, '+ this.line_opacity+')'
                else if(this.filter.indexOf(-i-1)!==-1) this.context.strokeStyle = 'rgba(133, 184, 224, '+ this.line_opacity+')'
                else this.context.strokeStyle = 'rgba(209, 212, 222, '+ this.line_opacity+')'
                this.context.beginPath()
                this.context.moveTo(this.draw_message['hline'][i]['x'],this.draw_message['hline'][i]['y'])
                this.context.lineTo(this.draw_message['hline'][i]['x2'],this.draw_message['hline'][i]['y'])
                if('strokeWidth' in this.draw_message['hline'][i]){
                    this.context.lineWidth = this.draw_message['hline'][i]['strokeWidth']
                }
                if('strokeDash' in this.draw_message['hline'][i]){
                    this.context.setLineDash(this.draw_message['hline'][i]['strokeDash'])
                }       
                this.context.stroke()
            }
            this.context.setLineDash([])
        },

        drawVline(){
            // this.context.strokeStyle = 'rgba(0, 0, 0, '+ this.line_opacity+')'
            this.context.lineWidth = this.default_channel['vline_strokewidth']
            for(let i=0, j=this.draw_message['vline'].length; i<j; i++){
                if(i===0 && this.draw_message['vline'][i]['x']<10) continue
                if(i>0 && this.draw_message['vline'][i]['x']-this.draw_message['vline'][i-1]['x']<20) continue
                if(this.filter.indexOf(i+1)!==-1) this.context.strokeStyle = 'rgba(128, 159, 184, '+ this.line_opacity+')'
                else if(this.filter.indexOf(-i-1)!==-1) this.context.strokeStyle = 'rgba(133, 184, 224, '+ this.line_opacity+')'
                else this.context.strokeStyle = 'rgba(209, 212, 222,  '+ this.line_opacity+')'
                this.context.beginPath()
                this.context.moveTo(this.draw_message['vline'][i]['x'],this.draw_message['vline'][i]['y'])
                this.context.lineTo(this.draw_message['vline'][i]['x'],this.draw_message['vline'][i]['y2'])
                if('strokeWidth' in this.draw_message['vline'][i]){
                    this.context.lineWidth = this.draw_message['vline'][i]['strokeWidth']
                }      
                this.context.stroke()
            }
        },

        drawRect(){
            // this.context.fillStyle = 'rgba(0, 0, 0, '+ this.rect_opacity+')'
            for(let i=0; i<this.draw_message['rect'].length; i++){
                if(this.filter.indexOf(i+1)!==-1) this.context.fillStyle = 'rgba(128, 159, 184, '+ this.rect_opacity+')'
                else if(this.filter.indexOf(-i-1)!==-1) this.context.fillStyle = 'rgba(133, 184, 224, '+ this.rect_opacity+')'
                else this.context.fillStyle = 'rgba(209, 212, 222, '+ this.rect_opacity+')'
                this.context.fillRect(this.draw_message['rect'][i]['x'], this.draw_message['rect'][i]['y'],
                this.draw_message['rect'][i]['width'], this.draw_message['rect'][i]['height'])
            }
        },

        drawImage(){
            if(this.show){
                this.context.fillStyle = '#ffffff'
                this.context.fillRect(0, 0, this.canvas_x, this.canvas_y)
                this.drawHline()
                this.drawVline()
                this.drawRect()

            }
        },
        
        highlightReceiver(){
            if(this.style_right["backgroundColor"] === "white"){
                this.style_right["backgroundColor"] = color_for_highlight[this.mapping][0]
            }
            else{
                this.style_right["backgroundColor"] = "white"
            }
        },
    },

    watch:{
        mapping(new_value, old_value){
            if(new_value in color_for_highlight){
                this.style_right["backgroundColor"] = color_for_highlight[this.mapping][0]
            }
            else{
                this.style_right["backgroundColor"] = "white"
            }
        },
        draw_message(new_value, old_value){  
            this.drawImage()
        },
        rect_opacity(new_value, old_value){
            this.drawImage()
        },
        line_opacity(new_value, old_value){
            this.drawImage()
        },
        show(new_value, old_value){
            this.drawImage()
        },
        filter(new_value, old_value){
            this.drawImage()
        },
        show_name(new_value, old_value){
            if(new_value){
                this.style_border["height"] = "80px";
            } 
            else{
                this.style_border["height"] = "55px";
            }
        }
    },

    mounted(){
        if(this.show_name) this.style_border["height"] = "80px";
        
        this.initCanvas()
        this.drawImage()
    }
}
</script>