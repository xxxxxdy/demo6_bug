/// Just test data
export var data_value = [
    {"name": 1, "time": 13,  "count": -0.304, "second": 4},
    {"name": 1,"time": 40, "count": -0.805, "second": 4},
    {"name": 1,"time": 80, "count": -0.201, "second": 2},
    {"name": 1,"time": 120, "count": -0.508, "second": 6},
    {"name": 1, "time": 140,  "count": -0.304, "second": 1},
    {"name": 1,"time": 160, "count": -0.802, "second": 7},
    {"name": 1,"time": 180, "count": -0.200, "second": 8},
    {"name": 1,"time": 188, "count": -0.507, "second": 4},
    {"name": 2,"time": 50,  "count": -0.605, "second": 3},
    {"name": 2,"time": 99, "count": -0.202, "second": 6},
    {"name": 2,"time": 100, "count": -0.507, "second": 5},
    {"name": 2,"time": 150, "count": -0.401, "second": 4},
    {"name": 2,"time": 192, "count": -0.607, "second": 3},
    {"name": 3,"time": 50,  "count": -0.402, "second": 6},
    {"name": 3,"time": 80, "count": -0.899, "second": 7},
    {"name": 3,"time": 150, "count": -0.308, "second": 3},
    {"name": 3,"time": 159, "count": -0.601, "second": 1},
    {"name": 3,"time": 188, "count": -0.701, "second": 4}
];

export var data_type_name = ["name", "time", "count", "second"];
export var data_value_line = [2, 3];

export var data_field = {
    "x_is_date": false, /// This variable is used to control the x-axis type
    "maxs": {},/// true max
    "mins": {},/// true min
    "step": {},/// draw step
    "max_domain": {},/// draw max
    "min_domain": {},/// draw min
    "x_distri": [], /// value distribution
    "max_distri": 0
};

export const DATA_TYPE = 400;
// export const DATA_TYPE = 100;
// export const DATA_TIME = 300;

export function max(a, b){
    return a> b ? a: b;
}

export function min(a, b){
    return a< b ? a: b;
}

export function getDataName(i){
    return data_value[i][data_type_name[0]];
}

export function getDataTime(i){
    return data_value[i][data_type_name[1]];
}

export function getDataValue(i, j=2){
    return data_value[i][data_type_name[j]];
}

export function getDrawGridStep(real_step){
    let draw_step = 1;
    if(real_step >= 1){
        let cnt = 0;
        while(real_step>1){
            if(cnt % 3 === 1){
                real_step /= 2.5;
                draw_step *= 2.5;
            }
            else{
                real_step /= 2;
                draw_step *= 2;
            }
            cnt ++;
        }
    }
    else{
        let cnt = 0;
        while(real_step<1){
            if(cnt % 3 === 1){
                real_step *= 2.5;
                draw_step /= 2.5;
            }
            else{
                real_step *= 2;
                draw_step /= 2;
            }
            cnt ++;
        }
        if(cnt % 3 === 2){
            draw_step *= 2.5;
        }
        else{
            draw_step *= 2;
        }
    }
    return draw_step;
}

export function updateFieldValue(){
    for(let key in data_field["step"]){
        delete data_field["step"][key];
        delete data_field["max_domain"][key];
        delete data_field["min_domain"][key];
    }

    for(let key in data_field["maxs"]){
        let y_step = (data_field["maxs"][key] - data_field["mins"][key])/20;
        let real_step = getDrawGridStep(y_step);
        data_field["step"][key] = real_step;

        data_field["min_domain"][key] = Math.floor(data_field["mins"][key]/real_step)*real_step;
        data_field["max_domain"][key] = Math.ceil(data_field["maxs"][key]/real_step)*real_step;
    }
} 

export function calculateDataField(){
    for(let key in data_field["maxs"]){
        delete data_field["maxs"][key];
        delete data_field["mins"][key];
    }
    data_field["maxs"][1] = -Infinity;
    data_field["mins"][1] = Infinity;
    for(let i=0; i<data_value_line.length; i++){
        data_field["maxs"][data_value_line[i]] = -Infinity;
        data_field["mins"][data_value_line[i]] = Infinity;
    }

    for(let i=0; i < data_value.length; i++){
        let tmp = getDataTime(i)
        if(tmp > data_field["maxs"][1])
            data_field["maxs"][1] = tmp;
        if(tmp< data_field["mins"][1])
            data_field["mins"][1] = tmp;
        for(let j=0; j<data_value_line.length; j++){
            let tmp2 = getDataValue(i, data_value_line[j]) ;
            if(tmp2 > data_field["maxs"][data_value_line[j]])
                data_field["maxs"][data_value_line[j]] = tmp2;
            if(tmp2 < data_field["mins"][data_value_line[j]])
                data_field["mins"][data_value_line[j]] = tmp2;
        }
    }
 
    updateFieldValue();

}
