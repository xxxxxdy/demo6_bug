import { visualcode_object ,data_lists, interactive_list, filter_list } from "./codeList"

export const sort_type = [
    // "matching", /// 0
    // "selecting", /// 1
    "hills number",  /// 2, data_list[i].length
    "data width",  /// 3, newcode_list[i].end-newcode_list[i].start
    "start position", /// 4, newcode_list[i].start
    "max value", /// 5, newcode_list[i].max
    "data name" /// 6, newcode_list[i].name
]

export var sort_order = {}
export var re_sort_order = {}

export var select_first = [false];
export var match_first = [false];

export function getReSortOrder(idx){
    let tmp = new Array(sort_order[idx].length).fill(0);
    for(let i=0,len=sort_order[idx].length; i<len; i++){
        tmp[sort_order[idx][i]] = i;
    }
    re_sort_order[idx] = tmp;

    // console.log(sort_order, re_sort_order)
}

export function updateOrder(idx = 0, type = 2, sort_list = null){
    if(sort_list === null)
        sort_list = sort_type.map((name, index) =>{
            return { name, index, on:true, reverse:false};
        })
    let tmp_order = []
    for(let i=0, len=visualcode_object[type].length; i<len; i++ ){
        tmp_order.push(i);
    }

    function cmp(a, b){
        if(select_first[0]){
            let p = interactive_list.indexOf(a)===-1? (interactive_list.indexOf(b)===-1? 0: -1) :
                    (interactive_list.indexOf(b)===-1? 1: 0);
            if(p !== 0) return -p;
        }
        if(match_first[0]){
            if(filter_list[idx].indexOf(a)===0) return -1;
            if(filter_list[idx].indexOf(b)===0) return 1;
            let p = filter_list[idx].indexOf(a)===-1? (filter_list[idx].indexOf(b)===-1? 0: -1) :
                    (filter_list[idx].indexOf(b)===-1? 1: 0);
            if(p !== 0) return -p;
        }
        for(let i=0; i<sort_list.length; i++){
            if(!sort_list[i].on) continue;
            let tmp; 
            switch(sort_list[i].index){
                // case 0:
                //     tmp = filter_list[idx].indexOf(a)===-1? (filter_list[idx].indexOf(b)===-1? 0: -1) :
                //         (filter_list[idx].indexOf(b)===-1? 1: 0);
                //     break;
                // case 1:
                //     tmp = interactive_list.indexOf(a)===-1? (interactive_list.indexOf(b)===-1? 0: -1) :
                //         (interactive_list.indexOf(b)===-1? 1: 0);
                //     break;
                case 0:
                    tmp = data_lists[idx][a].length - data_lists[idx][b].length;
                    break;
                case 1:
                    tmp = visualcode_object[type][a].getEndTime()-visualcode_object[type][a].getStartTime() 
                        - visualcode_object[type][b].getEndTime()+visualcode_object[type][b].getStartTime() ;
                    break;
                case 2:
                    tmp = visualcode_object[type][a].getStartTime() - visualcode_object[type][b].getStartTime();
                    break;
                case 3:
                    tmp = visualcode_object[type][a].max_value - visualcode_object[type][b].max_value;
                    break;
                case 4:
                    tmp = visualcode_object[type][a].name > visualcode_object[type][b].name;
                    break;
                default:
                    tmp = a-b; /// would not be executed forever
            }
            if(tmp === 0) continue;
            if(sort_list[i].reverse) return tmp;
            else return -tmp;
        }
        return a-b;
    }

    tmp_order.sort(cmp);
    sort_order[idx] = tmp_order;
    getReSortOrder(idx);

    match_first[0] = false
    select_first[0] = false
}