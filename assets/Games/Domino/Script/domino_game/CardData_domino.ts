
const { ccclass, property } = cc._decorator;

@ccclass
export default class CardData_domino {

    private static card_data=
    {
        //1,8,14,19,23,26,28
        [1]:{up:0, down:0, type:1,src_up:"0",src_down:"0"},
        [2]:{up:0, down:1, type:1,src_up:"0",src_down:"1"},
        [3]:{up:0, down:2, type:1,src_up:"0",src_down:"2"},
        [4]:{up:0, down:3, type:1,src_up:"0",src_down:"3"},
        [5]:{up:0, down:4, type:1,src_up:"0",src_down:"4"},
        [6]:{up:0, down:5, type:1,src_up:"0",src_down:"5"},
        [7]:{up:0, down:6, type:1,src_up:"0",src_down:"6"},
        [8]:{up:1, down:1, type:1,src_up:"1",src_down:"1"},
        [9]:{up:1, down:2, type:1,src_up:"1",src_down:"2"},
        [10]:{up:1, down:3, type:1,src_up:"1",src_down:"3"},
        [11]:{up:1, down:4, type:1,src_up:"1",src_down:"4"},
        [12]:{up:1, down:5, type:1,src_up:"1",src_down:"5"},
        [13]:{up:1, down:6, type:1,src_up:"1",src_down:"6"},
        [14]:{up:2, down:2, type:1,src_up:"2",src_down:"2"},
        [15]:{up:2, down:3, type:1,src_up:"2",src_down:"3"},
        [16]:{up:2, down:4, type:1,src_up:"2",src_down:"4"},
        [17]:{up:2, down:5, type:1,src_up:"2",src_down:"5"},
        [18]:{up:2, down:6, type:1,src_up:"2",src_down:"6"},
        [19]:{up:3, down:3, type:1,src_up:"3",src_down:"3"},
        [20]:{up:3, down:4, type:1,src_up:"3",src_down:"4"},
        [21]:{up:3, down:5, type:1,src_up:"3",src_down:"5"},
        [22]:{up:3, down:6, type:1,src_up:"3",src_down:"6"},
        [23]:{up:4, down:4, type:1,src_up:"4",src_down:"4"},
        [24]:{up:4, down:5, type:1,src_up:"4",src_down:"5"},
        [25]:{up:4, down:6, type:1,src_up:"4",src_down:"6"},
        [26]:{up:5, down:5, type:1,src_up:"5",src_down:"5"},
        [27]:{up:5, down:6, type:1,src_up:"5",src_down:"6"},
        [28]:{up:6, down:6, type:1,src_up:"6",src_down:"6"},
        [29]:{up:0, down:0, type:1,src_up:"0",src_down:"0"},
        [30]:{up:1, down:1, type:1,src_up:"0",src_down:"0"},
        [31]:{up:2, down:2, type:1,src_up:"0",src_down:"0"},
        [32]:{up:3, down:3, type:1,src_up:"0",src_down:"0"},
        [33]:{up:4, down:4, type:1,src_up:"0",src_down:"0"},
        [34]:{up:5, down:5, type:1,src_up:"0",src_down:"0"},
        [35]:{up:6, down:6, type:1,src_up:"0",src_down:"0"},
    }

    public static getPokerData(id){
        return this.card_data[id];
    }

    public static getPokerGrade(id){
        var p_data=this.card_data[id];
        if(p_data){
            return [p_data.up,p_data.down];
        }
        return [];
    }

    public static getPokerDatas(){
        return this.card_data;
    }

    public static sortPoker(p_1,p_2){
        var data_1=this.card_data[p_1];
        var data_2=this.card_data[p_2];
        if(data_1&&data_2){
            if(data_1.num==data_2.num){
                return p_2-p_1;
            }else{
                return data_2.num-data_1.num;
            }
        }
        return false;
    }

}