export const CODE_HEIGHT = 90;
export const CODE_WIDTH = 480;
export const CODE_PADDING = 10;
export const MAX_STROKEWIDTH = CODE_HEIGHT*0.2;
export const MIN_STROKEWIDTH = 0.6;
export const MAX_STROKEWIDTH2 = 20;
export const STROKEDASH_LENGTH = 18;
export const MIN_STROKEDASH = 8;
export const MAX_STROKEDASH2 = 40;
export const MIN_LINE2_HEIGHT = 20; 
export const MIN_RECT_HEIGHT = 20;
export const LINECHART_WIDTH = 800;
export const LINECHART_HEIGHT = 470; // 记得在App.vue中修改对应参数
export const SHOW_HEIGHT = CODE_HEIGHT/2 + CODE_PADDING;
export const SHOW_WIDTH = CODE_WIDTH/2 + CODE_PADDING;

// 可能会用到的编码通道
// [width, left, right, top, area/avg, max, persistence, none, min]

export var user_parameters = {
    "global_time": true,
    "global_value": true,
    "line_opacity": 1,
    "rect_opacity": 0.8
}

export var mapping_relationship = {
    "hline":{ // line1 的 y 和 y2 是一样的
        // x 和 x2 共同由hill-width来决定
        // "x": "left",
        // "x2": "right",
        "width": "width",
        "y":  "none",
        "strokeWidth": "none",
        "strokeDash": "none",
        "stroke": "none"
    },
    "vline":{ // line2 的 x 和 x2 是一样的
        // x 同样由hill-width来决定
        // "x":  "right",
        // "y":  "none",
        // "y2":  "none",
        "height": "none",
        "strokeWidth": "none",
        "stroke": "none"
    },
    "rect":{ // y 和 y2 由矩形的idx决定，不受其他变量影响
        "x": "peak_time",
        "width": "area",
        "height": "none",
        "fill": "none",
    }
}

export const mapping_default = {
    "hline":{ // line1 的 y 和 y2 是一样的
        // x 和 x2 共同由一个变量【x】来决定
        // "x": 0,
        // "x2": CODE_WIDTH,
        "width": CODE_WIDTH,
        "y":  CODE_HEIGHT/2, // 这里需要加上idx产生的偏移量
        "strokeWidth": 4,
        "strokeDash": [STROKEDASH_LENGTH/2, STROKEDASH_LENGTH/2],
        "stroke": "black" // color
    },
    "vline":{ // line2 的 x 和 x2 是一样的
        // x 同样由【x】来决定
        // "x":  "right",
        // y 和 y2 由同一个变量【y】来决定
        "y":  CODE_HEIGHT/4, // 这里需要加上idx产生的偏移量
        "y2":  CODE_HEIGHT*3/4, // 这里需要加上idx产生的偏移量
        "height": CODE_HEIGHT/2,
        "strokeWidth": 4,
        "stroke": "black" // color
    },
    "rect":{ // y 和 y2 由矩形的idx决定，不受其他变量影响
        "x": CODE_WIDTH/2,
        "width": 0.8,
        "height": CODE_HEIGHT, 
        "fill": "black", // color
    }
}
