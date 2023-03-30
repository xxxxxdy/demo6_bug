import { getDataName, getDataTime, getDataValue, data_value, data_value_line, data_field } from './dataManager'
import { color_for_highlight } from '../util/colorMapping'
import { CodeData } from './codeManager'

export function calculateInitpersistence(){
    if(newcode_list.length < 1) return 0;
    let min_distant = newcode_list[0].max_value - newcode_list[0].min_value;
    for(let i=1; i<newcode_list.length; i++){
        let distant = newcode_list[i].max_value - newcode_list[i].min_value;
        if(min_distant > distant) min_distant = distant;
    }
    return min_distant*0.8;
}

export function set1CodeData(name, start_idx, end_idx){
    if(end_idx - start_idx <= 1) {
        if(name !== "") console.log("data", name, "is too short to calculate persistence");
        return;
    }
    /// Assume that the data is sorted from small to large in time dimension
    data_value_line.forEach(j=>{
        let code = new CodeData(name, start_idx, end_idx); 
    
        let left = start_idx, top = start_idx, right = start_idx;
        let this_value = getDataValue(start_idx, j);
        let min_value = this_value, max_value = this_value;
        let before_value, after_value = getDataValue(start_idx+1, j);

        let before_time = 0, this_time = getDataTime(start_idx);
        let square = 0, pers = 0;

        for(let i=start_idx+1; i<end_idx-1; i++){
            before_value = this_value;
            this_value = after_value;
            after_value = getDataValue(i+1, j);

            before_time = this_time;
            this_time = getDataTime(i);
            square += (this_value+before_value)*(this_time-before_time)/2;

            if(this_value >= after_value && this_value > before_value){
                top = i;
                max_value = this_value;
            }
            else if(this_value < after_value && this_value <= before_value){
                right = i;
                if(min_value > this_value){
                    pers = max_value - min_value;
                    min_value = this_value;
                }
                else{
                    pers = max_value - this_value;
                }
                /// Ignore the min value at start/end position
                if(left === start_idx) pers = max_value - this_value;
                code.set1OriginHill(left, top, right, max_value, min_value, square, pers);
                /// Record the next hill message
                left = i; top = i; square = 0;
                max_value = this_value; min_value = this_value;
            }
            
        }
        before_value = this_value;
        this_value = after_value;
        before_time = this_time;
        this_time = getDataTime(end_idx-1);
        square += (this_value+before_value)*(this_time-before_time)/2;
    
        if(this_value > before_value){
            pers = this_value - min_value;
            code.set1OriginHill(left, end_idx-1, end_idx-1, this_value, min_value, square, pers);
        }
        else{
            pers = max_value - min_value;
            if(min_value > this_value) min_value = this_value;
            code.set1OriginHill(left, top, end_idx-1, max_value, min_value, square, pers);
        }

        code.buildTreeWithpersistence(j);
        code.updateDataDomain(j);

        visualcode_object[j].push(code);
    })
    
};

/// This function is called while changing the data set
/// including multivariate data
export function initAllTheHillsData(){
    for(let key in visualcode_object)
        delete visualcode_object[key]
    interactive_list.splice(0, interactive_list.length)
    for(let key in color_for_highlight)
        delete color_for_highlight[key]
    for(let i=0, len=data_value_line.length; i<len; i++)
        visualcode_object[data_value_line[i]] = [];
    
    /// Assume that data was sorted by name
    let name = "";
    let start_idx = 0, end_idx = 0;
    for(let i=0; i<data_value.length; i++){
        if(getDataName(i) !== name){
            end_idx = i;
            set1CodeData(name, start_idx, end_idx);
            start_idx = i;
            name = getDataName(i);
        }
    }
    set1CodeData(name, start_idx, data_value.length);
    // console.log(visualcode_object)
    
}

export function getTimeSpan(){
    for(let key in hill_distri){
        delete hill_distri[key]
        delete max_hill_distri[key]
    }
    let data_step = (data_field["maxs"][1] - data_field["mins"][1])/24;
    data_field.x_distri = new Array(24).fill(0);
    data_field.max_distri = 0;
    let tmp_min = data_field["mins"][1];
    data_value_line.forEach(j=>{
        hill_distri[j]=new Array(24).fill(0)
        max_hill_distri[j]=0
        visualcode_object[j].forEach(m=>{
            m.hill_list.forEach(h=>{
                let t=getDataTime(h.top_idx)
                let tmp = Math.floor((t-tmp_min)/data_step);
                if(tmp >= 24) tmp--;
                hill_distri[j][tmp]++;
                if(hill_distri[j][tmp]>max_hill_distri[j]) 
                    max_hill_distri[j] = hill_distri[j][tmp];
            })
        })
    })
}


/// {data_type_index: list}
export var visualcode_object = {};
/// {visual_code_list_index: list}
export var data_lists = {};
/// {visual_code_list_index: [data_type, persistence, color]}
export var pers_list = {};
export var interactive_list = [];

export var filter_list = {};
// export var code_points = [];
export var hill_distri = {};
export var max_hill_distri = {};