
/// 0: same  1: entirely different
/// a, b: visual_hill_json

import { max, min } from "./dataManager";

// export const SIMI_WEIGHT={
//     'hline':{
//         'x':5,
//         'y':2
//     },
//     'rect':{
//         'x':5,
//         'w':4,
//         'y':2
//     },
//     'vline':{
//         'x':1,
//         'y':1
//     }
// }

export function abs(a){
    return a>0?a:-a;
}

export var data_dis = [];

export var cluster_res = [];

// export function getSimilarity(a_, b_){
//     /// hill nums difference
//     let a_num = a_['rect'].length, b_num = b_['rect'].length;
//     let alpha = abs(1/a_num - 1/b_num);
//     let hills_diff = a_num - b_num;

//     if(a_num >30 && b_num >30) return [alpha, 0, 0];

//     /// align hills and calculate similarity
//     let a, b;
//     if(hills_diff > 0 || (hills_diff === 0 && 
//         b_['hline'][b_num-1]['x2']-b_['hline'][0]['x']<a_['hline'][a_num-1]['x2']-a_['hline'][0]['x'])){
//         a = a_, b = b_;
//     }
//     else{
//         a = b_, b = a_;
//         a_num = a['rect'].length, b_num = b['rect'].length;
//         hills_diff = -hills_diff;
//     }
//     // console.log(a, b)
//     let beta = 0;
//     let gamma = 0;
//     let a_now = 0;
//     for(let i=0; i<b_num; i++){
//         /// divide by left/right_idx
//         let a_front = a_now;
//         for(let j=0; j<=hills_diff; j++, a_front++){
//             if(a['hline'][a_front]['x2'] >b['hline'][i]['x2']){
//                 if(j !== 0 && a['hline'][a_front]['x2'] - b['hline'][i]['x2'] > b['hline'][i]['x2'] - a['hline'][a_front]['x']){
//                     a_front --;
//                 }
//                 break;
//             }
//             if(j === hills_diff) break;
//         }

//         let a_width = a['hline'][a_front]['x2']-a['hline'][a_now]['x'];
//         let b_width = b['hline'][i]['x2']-b['hline'][i]['x'];
//         let normalize_value = max(a_width, b_width);

//         let beta1 = abs(a_width - b_width);
//         let beta2 = Infinity, avg_rect_width = 0;
//         let b_top = (b['rect'][i]['x']-b['hline'][i]['x'])/(b['hline'][i]['x2']-b['hline'][i]['x']-b['rect'][i]['width'])*b['rect'][i]['width']+b['rect'][i]['x'];
//         let a_top_idx = -1;
//         for(let k=a_now; k<=a_front; k++){
//             let a_top = (a['rect'][k]['x']-a['hline'][k]['x'])/(a['hline'][k]['x2']-a['hline'][k]['x']-a['rect'][k]['width'])*a['rect'][k]['width']+a['rect'][k]['x'];
//             let rect_dis = abs(a_top - b_top);
//             if(rect_dis<beta2){
//                 beta2 = rect_dis;
//                 if(a_top_idx >= 0){
//                     gamma += a['rect'][a_top_idx]['width'];
//                 }
//                 a_top_idx = k;
//             }
//             else{
//                 gamma += a['rect'][k]['width'];
//             }
//             avg_rect_width += a['rect'][k]['width']*(a['hline'][k]['x2']-a['hline'][k]['x']);
//         }
//         avg_rect_width /= (a['hline'][a_front]['x2']-a['hline'][a_now]['x'])
//         let beta3 = abs(avg_rect_width - b['rect'][i]['width'])

//         let betas = (0.3*(2*beta1+beta3)+0.1*beta2)/normalize_value;
//         // console.log(beta1, beta2, beta3, betas)
//         beta += betas * b_width;

//         hills_diff -= a_front - a_now;
//         a_now = a_front+1;
//     }
//     beta /= (b['hline'][b_num-1]['x2']-b['hline'][0]['x']);
//     gamma /= (b['hline'][b_num-1]['x2']-b['hline'][0]['x']);

//     // console.log((1+alpha)*beta+gamma, alpha, beta, gamma)
//     // return [alpha, beta, gamma]

//     return (1+alpha)*beta+gamma
// }

function diff(a, b, a_len, b_len){
    let vec = new Array(a_len).fill(0).map(v=>new Array(b_len).fill(0));
    for(let i=0; i<a_len; i++){
        for(let j=0; j<b_len; j++){
            if(i === 0) vec[i][j] = j;
            else if(j === 0) vec[i][j] = i;
            else if(a[i] === b[i]) vec[i][j] = vec[i-1][j-1];
            else vec[i][j] = 1 + min(vec[i-1][j-1], min(vec[i][j-1], vec[i-1][j]));
        }
    }
    return vec[a_len-1][b_len-1];
}

export function getSimilarity(a, b){
    let a_len = a.length, b_len = b.length;
    if(a_len === 0 && b_len === 0) return 0;
    if(a_len === 0 || b_len === 0) return 1;
    return diff(a, b, a_len, b_len)/max(a_len, b_len);
}

export function getSimilarity2(a, b){
    let a_num = new Array(8).fill(0), b_num = new Array(8).fill(0);
    let a_len = a.length, b_len = b.length;
    for(let i=0; i<a_len; i++){
        a_num[Number(a[i])]++;
    }
    for(let j=0; j<b_len; j++){
        b_num[Number(b[j])]++;
    }
    let axb=0, aabs=0, babs=0;
    for(let i=0; i<8; i++){
        axb+=a_num[i]*b_num[i];
        aabs+=a_num[i]*a_num[i];
        babs+=b_num[i]*b_num[i];
    }
    return 1 - axb/Math.sqrt(aabs)/Math.sqrt(babs);

}

export function dbscan(dis, eps, minpts){
    let num = dis.length;
    let datas = [];
    cluster_res.splice(0, cluster_res.length);
    let cluster = -1;
    for(let i=0; i<num; i++){
        datas.push({visited: false, near: [], type: 0});
        cluster_res.push(-1);
        for(let j=0; j<num; j++){
            if(i===j) continue;
            if(dis[i][j] < eps) datas[i].near.push(j)
        }
    }
    
    for(let i=0; i<num; i++){
        if(datas[i].visited) continue;
        datas[i].visited = true;

        if(datas[i].near.length > minpts){
            cluster ++;
            datas[i].type = 3;  /// corepoint
            cluster_res[i] = cluster;
            for(let j=0, len=datas[i].near.length; j<len;  j++){
                let k = datas[i].near[j];
                if(datas[k].visited) continue;
                datas[k].visited = true;

                if(datas[k].near.length >minpts){ /// corepoint
                    let part_len = datas[k].near.length
                    for(let m=0; m<part_len; m++){
                        datas[i].near.push(datas[k].near[m]);
                    }
                    len += part_len;
                    datas[k].type = 3;
                }
                else{ /// bound point
                    datas[k].type = 2;
                }
                if(cluster_res[k] === -1) cluster_res[k] = cluster;
            }
        } 
    }
    console.log(cluster_res)
}