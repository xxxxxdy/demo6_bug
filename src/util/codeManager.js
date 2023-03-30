import { data_field, getDataTime, getDataValue, max, min} from './dataManager'
import { CODE_WIDTH, user_parameters } from './parameters'
import { Hill } from './hillManager'

export class CodeData{
    /// except end
    constructor(name, start, end){ 
        this.name = name;
        this.start_idx = start;
        this.end_idx = end;
        this.max_value = -Infinity;
        this.min_value = Infinity;
        this.top_hill_idx = -1;
        this.hill_list = [];
    }

    set1OriginHill(left, top, right, max_value, min_value, sum, end_pers){
        this.hill_list.push(new Hill(left, top, right, max_value, min_value, sum, end_pers));
        if(max_value > this.max_value){
            this.max_value = max_value;
            this.top_hill_idx = this.hill_list.length-1;
        }
        if(min_value < this.min_value){
            this.min_value = min_value;
        }
    }

    /// Or use a variable to save this time value
    getStartTime(){ 
        return getDataTime(this.start_idx);
    }
    getEndTime(){
        return getDataTime(this.end_idx-1);
    }

    buildTreeWithpersistence(j = 2){
        if(this.hill_list.length <= 1) return;

        /// sort hill from small persistence to bigger
        this.hill_list.sort(function(a, b){
            return a.end_persistence - b.end_persistence
        })
        
        let now_pers=0, i = 0, cnt = 0, hills_num = this.hill_list.length;
        while(cnt < hills_num){
            cnt ++;
            now_pers = this.hill_list[i].end_persistence;

            let kill_idx = this.hill_list[i].left_idx;
            let kill_left = true;
            let near_hill = -1;
            let new_pers = 0;
            /// decide that which side should be killed
            if((getDataValue(this.hill_list[i].left_idx, j) === this.hill_list[i].min_value || 
                kill_idx === this.start_idx) && this.hill_list[i].right_idx !== this.end_idx-1){
                kill_left = false;
                kill_idx = this.hill_list[i].right_idx;
            }
            if(kill_left){
                for(let j=i+1; j<this.hill_list.length; j++){
                    if(this.hill_list[j].right_idx === kill_idx){
                        near_hill = j;
                        break;
                    }
                }
                if(near_hill === -1) continue;
                if(getDataValue(this.hill_list[near_hill].left_idx, j) === this.hill_list[near_hill].min_value){
                    new_pers = this.hill_list[near_hill].max_value -max(this.hill_list[near_hill].min_value, this.hill_list[i].min_value);
                }
                else{
                    new_pers = this.hill_list[near_hill].end_persistence;
                }
            }
            else{
                for(let j=i+1; j<this.hill_list.length; j++){
                    if(this.hill_list[j].left_idx === kill_idx){
                        near_hill = j;
                        break;
                    }
                }
                if(near_hill === -1) continue;
                if(getDataValue(this.hill_list[near_hill].right_idx, j) === this.hill_list[near_hill].min_value){
                    new_pers = this.hill_list[near_hill].max_value -max(this.hill_list[near_hill].min_value, this.hill_list[i].min_value);
                }
                else{
                    new_pers = this.hill_list[near_hill].end_persistence;
                }
            }

            /// This part is to kill the hill and update another hill at the same time
            let tmp_hill = this.hill_list.splice(near_hill, 1)[0];
            tmp_hill.setpersistence(now_pers);
            this.hill_list.splice(i+1, 0, tmp_hill);
            i += 2;
            let new_idx;
            for(new_idx=i; new_idx<this.hill_list.length; new_idx++){
                if(new_pers <this.hill_list[new_idx].end_persistence){
                    break;
                }
            }

            if(kill_left){
                this.hill_list.splice(new_idx, 0, new Hill(this.hill_list[i-1].left_idx,this.hill_list[i-1].max_value < this.hill_list[i-2].max_value ? this.hill_list[i-2].top_idx: this.hill_list[i-1].top_idx,
                     this.hill_list[i-2].right_idx, max(this.hill_list[i-1].max_value, this.hill_list[i-2].max_value), min(this.hill_list[i-1].min_value, this.hill_list[i-2].min_value),
                    this.hill_list[i-1].value_sum+this.hill_list[i-2].value_sum, new_pers, now_pers))
                this.hill_list[i-1].setUpper(i)
            }
            else{
                this.hill_list.splice(new_idx, 0, new Hill(this.hill_list[i-2].left_idx, this.hill_list[i-1].max_value < this.hill_list[i-2].max_value ? this.hill_list[i-2].top_idx: this.hill_list[i-1].top_idx,
                    this.hill_list[i-1].right_idx, max(this.hill_list[i-1].max_value, this.hill_list[i-2].max_value), min(this.hill_list[i-1].min_value, this.hill_list[i-2].min_value),
                    this.hill_list[i-1].value_sum+this.hill_list[i-2].value_sum, new_pers, now_pers))
                this.hill_list[i-1].setUpper(i)
            }
        }
    }
    
    updateDataXDomain(){
        this.total_width = CODE_WIDTH, this.start_width = 0;
        if(user_parameters["global_time"]){
            this.start_time = data_field["mins"][1];
            this.total_time = data_field["maxs"][1] - this.start_time;
            this.start_width = CODE_WIDTH * (getDataTime(this.start_idx)-this.start_time)/this.total_time;
            this.total_width = CODE_WIDTH * (getDataTime(this.end_idx-1)-getDataTime(this.start_idx))/this.total_time;    
        }
        else{
            this.start_time = getDataTime(this.start_idx);
            this.total_time = getDataTime(this.end_idx-1) - this.start_time;   
        }
    }

    updateDataYDomain(j = 2){
        if(user_parameters["global_value"]){
            this.min_range = data_field["mins"][j];
            this.value_range = data_field["maxs"][j] - this.min_range;
        }
        else{
            this.min_range = this.min_value;
            this.value_range = this.max_value - this.min_value;
        }
    }

    updateDataDomain(j = 2){
        this.updateDataXDomain();
        this.updateDataYDomain(j);
    }

    /// These functions are for draw visual code
    getHillJsonData(i){
        let left_time = getDataTime(this.hill_list[i].left_idx);
        let peak_time = getDataTime(this.hill_list[i].top_idx);
        let right_time = getDataTime(this.hill_list[i].right_idx);
        let time_width = right_time - left_time;
        let persistence = this.hill_list[i].end_persistence;
        for(let j=this.hill_list[i].upper; j !== -1; j=this.hill_list[j].upper){
            persistence = this.hill_list[j].end_persistence;
        }
        if(persistence === Infinity) persistence = this.max_value-this.min_value;
        /// It seems that the json value are changeless, if need to accelerate I will modify here

        return {
            'right_idx': this.hill_list[i].right_idx,
            'left': (left_time - this.start_time)/this.total_time,
            'right':(right_time - this.start_time)/this.total_time,
            'peak_time':(peak_time - left_time)/(right_time - left_time),
            'area': (this.hill_list[i].value_sum/time_width - this.hill_list[i].min_value)/(this.hill_list[i].max_value - this.hill_list[i].min_value),
            'width': time_width/this.total_time,
            'peak_value':(this.hill_list[i].max_value - this.min_range)/this.value_range,
            'min_value':(this.hill_list[i].min_value - this.min_range)/this.value_range,
            'persistence': persistence/this.value_range
        }
    }

    getDataForOneDraw(persistence = 0){
        var data_list = [];
        
        for(let i=0; i<this.hill_list.length; i++){
            // There may be any other filter condition if necessary
            if(this.hill_list[i].start_persistence <= persistence && this.hill_list[i].end_persistence > persistence){
                data_list.push(this.getHillJsonData(i));
            } 
        }   
        
        if(data_list.length <= 0) data_list.push(this.getHillJsonData(this.hill_list.length-1))
        
        return data_list;
    } 
}
