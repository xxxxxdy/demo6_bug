import { CODE_HEIGHT, CODE_WIDTH, mapping_relationship, mapping_default, MAX_STROKEWIDTH, STROKEDASH_LENGTH, MAX_STROKEWIDTH2, 
    CODE_PADDING, MIN_STROKEWIDTH, MIN_STROKEDASH, MAX_STROKEDASH2, MIN_LINE2_HEIGHT, MIN_RECT_HEIGHT } from './parameters';

/// There is a problem to update data increasingly that the value should keep within bounds.
/// That means while changing those who change may influcence those who be still.
export function getMarksForDraw(data_list, total_width = CODE_WIDTH, start_width = 0){
    data_list.sort(function(a, b){return a['left'] - b['left']});
    /// may add hrect(hollow_rect) later
    // let marks_1code = {hline: [], vline:[], rect:[]};
    let marks_1code = {};
    let base_width = total_width / data_list.length;

    let marks_hlines = [];
    /// hline width: x & x2, necessary
    let x = CODE_PADDING + start_width;
    let x2 = x;
    if(mapping_relationship["hline"]["width"] === "none"){
        for(let i=0; i<data_list.length; i++){
            x2 += base_width;
            marks_hlines.push({x: x, x2: x2});
            x = x2;
        }
    }
    else{
        let sum = 0;
        let min_width = base_width * 0.2;
        let width_key = mapping_relationship["hline"]["width"];
        for(let i=0; i<data_list.length; i++){
            sum += data_list[i][width_key];
        }
        /// consider the zero position
        if(sum < 0.000001){
            for(let i=0; i<data_list.length; i++){
                x2 += base_width;
                marks_hlines.push({x: x, x2: x2});
                x = x2;
            }
        }
        else{
            let unit_length = total_width*0.8/sum;
            for(let i=0; i<data_list.length; i++){
                let this_width = data_list[i][width_key]*unit_length+min_width;
                x2 += this_width;
                marks_hlines.push({x: x, x2: x2});
                if(this_width < base_width) base_width=this_width;
                x = x2;
            }
        }
    }
    /// hline stroke width: strokeWidth, optional
    let max_l1sw = 0;
    if(mapping_relationship["hline"]["strokeWidth"] !== "none"){
        let sw_key = mapping_relationship["hline"]["strokeWidth"];
        for(let i=0; i<data_list.length; i++){
            let this_l1sw = data_list[i][sw_key]*MAX_STROKEWIDTH + MIN_STROKEWIDTH;
            if(this_l1sw > max_l1sw) max_l1sw=this_l1sw;
            marks_hlines[i]["strokeWidth"] = this_l1sw;
        }
    }
    /// hline stroke dash: strokeDash, optional
    if(mapping_relationship["hline"]["strokeDash"] !== "none"){
        let sw_key = mapping_relationship["hline"]["strokeDash"];
        for(let i=0; i<data_list.length; i++){
            let pre_sw_length = STROKEDASH_LENGTH * data_list[i][sw_key];
            if(pre_sw_length < MIN_STROKEDASH){
                let pre_sw2_length = MIN_STROKEDASH * (1-data_list[i][sw_key])/data_list[i][sw_key];
                if(pre_sw2_length > MAX_STROKEDASH2){
                    marks_hlines[i]["strokeDash"] = [MIN_STROKEDASH, MAX_STROKEDASH2];
                }
                else{
                    marks_hlines[i]["strokeDash"] = [MIN_STROKEDASH, pre_sw2_length];
                }
            }
            else{
                marks_hlines[i]["strokeDash"] = [pre_sw_length, STROKEDASH_LENGTH - pre_sw_length];
            }
        }
    }
    /// hline y position: y, necessary
    if(mapping_relationship["hline"]["y"] === "none"){
        for(let i=0; i<data_list.length; i++){
            marks_hlines[i]["y"]= mapping_default["hline"]["y"] + CODE_PADDING;
        }
    }
    else{
        let this_offset = max_l1sw/2 + CODE_PADDING, this_height = CODE_HEIGHT - max_l1sw;
        let y_key = mapping_relationship["hline"]["y"];
        for(let i=0; i<data_list.length; i++){
            marks_hlines[i]["y"] = (1-data_list[i][y_key])*this_height + this_offset;
        }
    }
    /// hline else: to be supplemented
    marks_1code["hline"] = marks_hlines;
    
    let marks_vlines = [];
    /// vline x position: x, necessary
    for(let i=0; i<marks_hlines.length; i++){
        marks_vlines.push({x: marks_hlines[i]["x2"]})
    }
    /// vline y position: y & y2, necessary, here I let the code center be the line center
    let center_dis = CODE_HEIGHT/2 + CODE_PADDING;
    if(mapping_relationship["vline"]["height"] === "none"){
        for(let i=0; i<data_list.length; i++){
            marks_vlines[i]["y"]= mapping_default["vline"]["y"] + CODE_PADDING;
            marks_vlines[i]["y2"]= mapping_default["vline"]["y2"] + CODE_PADDING;
        }
    }
    else{
        let height_key = mapping_relationship["vline"]["height"];
        let half_min_dis = MIN_LINE2_HEIGHT/2;
        for(let i=0; i<data_list.length; i++){
            let half_dis = data_list[i][height_key]*(CODE_HEIGHT-MIN_LINE2_HEIGHT)/2 + half_min_dis;
            marks_vlines[i]["y"] = center_dis - half_dis;
            marks_vlines[i]["y2"] = center_dis + half_dis;
        }
    }
    /// vline stroke width: strokeWidth, optional
    if(mapping_relationship["vline"]["strokeWidth"] !== "none"){
        let sw_key = mapping_relationship["vline"]["strokeWidth"];
        for(let i=0; i<data_list.length; i++){
            marks_vlines[i]["strokeWidth"] = data_list[i][sw_key]*MAX_STROKEWIDTH2+MIN_STROKEWIDTH ;
        }
    }
    /// vline else: to be supplemented
    marks_1code["vline"] = marks_vlines;
    
    let marks_rects = [];
    /// rect width, width, necessary 
    /// Here base width is local, which mean that the rect width is unfit to compare different code
    if(mapping_relationship["rect"]["width"] === "none"){
        let width = base_width*mapping_default["rect"]["width"];
        for(let i=0; i<data_list.length; i++){
            marks_rects.push({width: width});
        }
    }
    else{
        let width_key = mapping_relationship["rect"]["width"];
        let min_width = base_width * 0.2;
        if(mapping_relationship["rect"]["width"] === "area"){
            for(let i=0; i<data_list.length; i++){
                let area = data_list[i][width_key] * (marks_hlines[i]["x2"]-marks_hlines[i]["x"]);
                if(area < min_width){
                    marks_rects.push({width: min_width});
                }
                else{
                    marks_rects.push({width: area});
                }
            }
        }
        else{
            let increase_width = base_width * 0.8;
            for(let i=0; i<data_list.length; i++){
                marks_rects.push({width: min_width +increase_width * data_list[i][width_key]});
            }
        }
    }
    /// rect height, y & height, necessary
    if(mapping_relationship["rect"]["height"] === "none"){
        for(let i=0; i<data_list.length; i++){
            marks_rects[i]["y"]= CODE_PADDING; 
            marks_rects[i]["height"]= mapping_default["rect"]["height"]; 
        }
    }
    else{
        let height_key = mapping_relationship["rect"]["height"];
        for(let i=0; i<data_list.length; i++){
            let rect_dis = data_list[i][height_key]*(CODE_HEIGHT-MIN_RECT_HEIGHT) + MIN_RECT_HEIGHT;
            marks_rects[i]["y"] = center_dis - rect_dis/2 ;
            marks_rects[i]["height"] = rect_dis;
        }
    }
    /// rect position, x, necessary
    if(mapping_relationship["rect"]["x"] === "none"){
        for(let i=0; i< marks_hlines.length; i++){
            marks_rects[i]["x"] = marks_hlines[i]["x"] + 0.5 *
              (marks_hlines[i]["x2"] - marks_hlines[i]["x"] - marks_rects[i]["width"]);
        }
    }
    else{
        let x_key = mapping_relationship["rect"]["x"];
        for(let i=0; i< marks_hlines.length; i++){
            marks_rects[i]["x"] = marks_hlines[i]["x"] + data_list[i][x_key] *
              (marks_hlines[i]["x2"] - marks_hlines[i]["x"] - marks_rects[i]["width"]);
        }
    }
    /// rect else: to be supplemented
    marks_1code["rect"] = marks_rects;

    return marks_1code;
}
