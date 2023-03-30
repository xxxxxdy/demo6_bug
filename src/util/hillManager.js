/// In fact there are two ways to record the message of hill
/// One is to record the index message as below
/// Another is to record the value message, its benefit is that it doesn't need 
/// the origin data to calculate, but it also mean that it can't get the
/// origin data that may be used. That is why I don't used it.

export class Hill{
    /// include right
    constructor(left, top, right, max_value, min_value, sum = 0, end_pers = Infinity, start_pers = 0){
        this.left_idx = left;
        this.right_idx = right;
        this.top_idx = top;
        this.max_value = max_value;
        this.min_value = min_value;
        this.value_sum = sum;
        this.start_persistence = start_pers;
        this.end_persistence = end_pers;
        this.upper = -1;
    }

    setpersistence(kill_value){
        this.end_persistence = kill_value;
    }

    setUpper(hill_idx){
        this.upper = hill_idx;
    }

}
