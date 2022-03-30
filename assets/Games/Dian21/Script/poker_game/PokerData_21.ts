
const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerData_21 {

    private static poker_data13=
    {
        [1]:{num:14, color:1, type:1, name:"黑桃A", src:"black_1"},
        [2]:{num:15, color:1, type:1, name:"黑桃2", src:"black_2"},
        [3]:{num:3, color:1, type:1, name:"黑桃3", src:"black_3"},
        [4]:{num:4, color:1, type:1, name:"黑桃4", src:"black_4"},
        [5]:{num:5, color:1, type:1, name:"黑桃5", src:"black_5"},
        [6]:{num:6, color:1, type:1, name:"黑桃6", src:"black_6"},
        [7]:{num:7, color:1, type:1, name:"黑桃7", src:"black_7"},
        [8]:{num:8, color:1, type:1, name:"黑桃8", src:"black_8"},
        [9]:{num:9, color:1, type:1, name:"黑桃9", src:"black_9"},
        [10]:{num:10,color:1, type:1, name:"黑桃10",src:"black_10"},
        [11]:{num:11,color:1, type:1, name:"黑桃J", src:"black_11"},
        [12]:{num:12,color:1, type:1, name:"黑桃Q", src:"black_12"},
        [13]:{num:13,color:1, type:1, name:"黑桃K", src:"black_13"},
        [14]:{num:14, color:2, type:1, name:"红桃A", src:"red_1"},
        [15]:{num:15, color:2, type:1, name:"红桃2", src:"red_2"},
        [16]:{num:3, color:2, type:1, name:"红桃3", src:"red_3"},
        [17]:{num:4, color:2, type:1, name:"红桃4", src:"red_4"},
        [18]:{num:5, color:2, type:1, name:"红桃5", src:"red_5"},
        [19]:{num:6, color:2, type:1, name:"红桃6", src:"red_6"},
        [20]:{num:7, color:2, type:1, name:"红桃7", src:"red_7"},
        [21]:{num:8, color:2, type:1, name:"红桃8", src:"red_8"},
        [22]:{num:9, color:2, type:1, name:"红桃9", src:"red_9"},
        [23]:{num:10,color:2, type:1, name:"红桃10",src:"red_10"},
        [24]:{num:11,color:2, type:1, name:"红桃J", src:"red_11"},
        [25]:{num:12,color:2, type:1, name:"红桃Q", src:"red_12"},
        [26]:{num:13,color:2, type:1, name:"红桃K", src:"red_13"},
        [27]:{num:14, color:3, type:1, name:"梅花A", src:"black_1"},
        [28]:{num:15, color:3, type:1, name:"梅花2", src:"black_2"},
        [29]:{num:3, color:3, type:1, name:"梅花3", src:"black_3"},
        [30]:{num:4, color:3, type:1, name:"梅花4", src:"black_4"},
        [31]:{num:5, color:3, type:1, name:"梅花5", src:"black_5"},
        [32]:{num:6, color:3, type:1, name:"梅花6", src:"black_6"},
        [33]:{num:7, color:3, type:1, name:"梅花7", src:"black_7"},
        [34]:{num:8, color:3, type:1, name:"梅花8", src:"black_8"},
        [35]:{num:9, color:3, type:1, name:"梅花9", src:"black_9"},
        [36]:{num:10,color:3, type:1, name:"梅花10",src:"black_10"},
        [37]:{num:11,color:3, type:1, name:"梅花J", src:"black_11"},
        [38]:{num:12,color:3, type:1, name:"梅花Q", src:"black_12"},
        [39]:{num:13,color:3, type:1, name:"梅花K", src:"black_13"},
        [40]:{num:14, color:4, type:1, name:"方片A", src:"red_1"},
        [41]:{num:15, color:4, type:1, name:"方片2", src:"red_2"},
        [42]:{num:3, color:4, type:1, name:"方片3", src:"red_3"},
        [43]:{num:4, color:4, type:1, name:"方片4", src:"red_4"},
        [44]:{num:5, color:4, type:1, name:"方片5", src:"red_5"},
        [45]:{num:6, color:4, type:1, name:"方片6", src:"red_6"},
        [46]:{num:7, color:4, type:1, name:"方片7", src:"red_7"},
        [47]:{num:8, color:4, type:1, name:"方片8", src:"red_8"},
        [48]:{num:9, color:4, type:1, name:"方片9", src:"red_9"},
        [49]:{num:10,color:4, type:1, name:"方片10",src:"red_10"},
        [50]:{num:11,color:4, type:1, name:"方片J", src:"red_11"},
        [51]:{num:12,color:4, type:1, name:"方片Q", src:"red_12"},
        [52]:{num:13,color:4, type:1, name:"方片K", src:"red_13"},
        [53]:{num:16, color:5, type:2, name:"小王", src:"joker2"},
        [54]:{num:17, color:5, type:3, name:"大王", src:"joker1"},
    }

    public static getPokerData(id){
        return this.poker_data13[id];
    }

    public static getPokerGrade(id){
        var p_data=this.poker_data13[id];
        if(p_data){
            return p_data.num;
        }
        return 0;
    }

    public static getPokerDatas(){
        return this.poker_data13;
    }

    public static sortPoker(p_1,p_2){
        var data_1=this.poker_data13[p_1];
        var data_2=this.poker_data13[p_2];
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