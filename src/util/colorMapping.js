// 这个玩意的结构大概是下面这个样子的
//  {
//   key: number, 表示对应的是第几条线
//   value: string, 颜色编码
//  }
export var color_for_highlight = {};

// const HIGHLIGHT_COLOR_SET = [
//     "#ff7e0e",
//     "#9367bc",
//     "#8b554a",
//     "#e277c2",
//     "#7e7e7e",
//     "#bbbc21",
//     "#16bdcf",
//     "#adc6e8",
//     "#ffba78",
//     "#97df89",
//     "#ff9795",
//     "#c5afd4",
//     "#c49c93",
//     "#f7b6d2",
//     "#c6c6c6",
//     "#dbdb8d",
//     "#9edae4",
//     "#1f77b4",
//     "#2c9f2c",
//     "#d52728",
// ];

// const HIGHLIGHT_COLOR_SET = [
//     '#b15928','#00bfff','#ffb6c1','#33a02c',
//     '#6a3d9a',
//     '#ff7f00','#2a52be',
//     '#ff0800','#008000',
//     '#1f78b4','#bf00ff','#fdbf6f','#e32636',
//     '#ffbf00','#fe6f5e',
//     '#cab2d6',
//     '#b2df8a','#00008b',
//     '#a6cee3','#ff4f00','#ffd700','#fb9a99',
// ];

const HIGHLIGHT_COLOR_SET=[
 '#F32012','#8F00FF', '#0056A5','#00B127', 
 '#FF720D','#A841CC','#2D7BD6', '#339E98',
  '#D5B133','#E93ED8','#499DFF','#1AD5CA', 
  '#FFE500','#D395CD', '#339DBF','#35FFBD',
 '#F0E9B2', '#FFE2E2','#9CE7FF', '#B5F0D3'
];

export const CLUSTER_COLOR_SET = [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2"
];

export const SCROLL_BAR_SET = [
    '#fff7fb',
    '#ece7f2',
    '#d0d1e6',
    '#a6bddb',
    '#74a9cf',
    '#3690c0',
    '#0570b0',
    '#045a8d',
    '#023858'
];

export const PERS_COLOR = ["red", "green","blue"]
export var pers_index = [-1, -1, -1]

export function getRandomColor(){
    for(let i=0; i<HIGHLIGHT_COLOR_SET.length; i++){
        let flag = true
        for(let key in color_for_highlight){
            if(color_for_highlight[key][1] === i){
                flag = false
                break
            }
        }
        if(flag){
            return [HIGHLIGHT_COLOR_SET[i], i]
        }

    }

    return ['#' + Math.floor(Math.random()*0xffffff).toString(16), -1]
}
