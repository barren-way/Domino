import Tools from "./Tools";
export module GameSingle {

    //珠盘路

    //珠盘路
    export function GetDishRoad(tab): any {
        let clonetab = tab.slice()
        if (!clonetab) {
            return
        }
        if (clonetab.length <= 0) {
            return
        }
        let cur_x = 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        let cur_y = 0
        let cur_table = []
        for (let index = 0; index < tab.length; index++) {
            if (cur_table.length <= 0) {
                cur_table.push([cur_x, cur_y, tab[index]])
            } else {
                cur_y = cur_y + 1
                if (index % 6 == 0) {
                    cur_x = cur_x + 1
                    cur_y = 0
                }
                cur_table.push([cur_x, cur_y, tab[index]])
            }

        }
        return cur_table
    }

    //获取主路数据
    export function GetMainRoad(tab): any {
        let clonetab = tab.slice()
        if (!clonetab) {
            return
        }
        if (clonetab.length <= 0) {
            return
        }
        clonetab.reverse();
        for (let i = clonetab.length - 1; i >= 0; i--) {
            if (clonetab[i] == 3) {
                clonetab.splice(i, 1)
            }else{
                break;
            }
        }
        clonetab.reverse();
        let cur_x = 0
        let cur_y = 0
        let cur_xx = 0
        let cur_drawImg = 0
        let cur_table = []
        for (let index = 0; index < clonetab.length; index++) {
            let num = clonetab[index]
            if (num == 3) {
                if (cur_table.length != 0) {
                    let he = 3
                    cur_table[cur_table.length - 1].push(he)
                }
            } else {
                if (cur_drawImg == 0) {
                    cur_drawImg = num
                } else {
                    if (num == cur_drawImg) {
                        cur_y = cur_y + 1
                    } else {
                        cur_x = cur_xx + 1
                        cur_xx = cur_xx + 1
                        cur_y = 0
                        cur_drawImg = num
                    }
                }
                let isCur_stop = getCanStop(cur_x, cur_y, cur_table, 6)
                if (isCur_stop) {
                    cur_x = cur_x + 1
                    cur_y = cur_y - 1
                }
                cur_table.push([cur_x, cur_y, num])
            }

        }
        return cur_table
    }

    //主路（无拐弯）
    export function GetLargeRoadCommon(tab): any {
        let clonetab = tab.slice()
        if (!clonetab) {
            return
        }
        if (clonetab.length <= 0) {
            return
        }
        
        clonetab.reverse();
        for (let i = clonetab.length - 1; i >= 0; i--) {
            if (clonetab[i] == 3) {
                clonetab.splice(i, 1)
            }else{
                break;
            }
        }
        clonetab.reverse();

        let cur_x = 0
        let cur_y = 0
        let cur_xx = 0
        let cur_drawImg = 0
        let cur_table = []
        for (let index = 0; index < clonetab.length; index++) {
            let num = clonetab[index]
            if (num == 3) {
                if (cur_table.length != 0) {
                    let he = 3
                    cur_table[cur_table.length - 1].push(he)
                }
            } else {
                if (cur_drawImg == 0) {
                    cur_drawImg = num
                } else {
                    if (num == cur_drawImg) {
                        cur_y = cur_y + 1
                    } else {
                        cur_x = cur_xx + 1
                        cur_xx = cur_xx + 1
                        cur_y = 0
                        cur_drawImg = num
                    }
                }
                cur_table.push([cur_x, cur_y, num])
            }
        }
        return cur_table
    }

    //大眼仔路
    export function GetGreatEyedRoad(tab): any {
        let clonetab = tab.slice()
        if (!clonetab) {
            return
        }
        if (clonetab.length <= 0) {
            return
        }
        let LargeRoadtable = this.GetLargeRoadCommon(clonetab)
        let c_LargeRoadtable = LargeRoadtable.slice()
        let isHave = this.GetIsHaveRoad(LargeRoadtable, [1, 1], [2, 0])
        if (!isHave) {
            return
        }
        for (let i = c_LargeRoadtable.length - 1; i >= 0; i--) {
            if (c_LargeRoadtable[i][0] == 0) {
                c_LargeRoadtable.splice(i, 1)
            }
            if (c_LargeRoadtable[i][0] == 1 && c_LargeRoadtable[i][1] == 0) {
                c_LargeRoadtable.splice(i, 1)
            }
        }
        let cur_table = this.GetGreatEyedRoadlist(LargeRoadtable, c_LargeRoadtable)
        return cur_table
    }
    //大眼仔公式
    export function GetGreatEyedRoadlist(tab, tab2): any {
        if (!tab || !tab2) {
            return
        }
        if (tab.length <= 0 || tab2.length <= 0) {
            return
        }
        let cur_x = 0
        let cur_y = 0
        let cur_xx = 0
        let cur_drawImg = 0
        let last_drawImg = 0
        let cur_table = []
        for (let index = 0; index < tab2.length; index++) {
            let v = tab2[index]
            if (v[1] == 0) {
                cur_drawImg = this.getTlines(v[0] - 1, v[0] - 2, tab)
            } else if (v[1] == 1) {
                cur_drawImg = this.getIshave(v[0] - 1, v[1], tab)
            } else if (v[1] > 2 || v[1] == 2) {
                cur_drawImg = this.getThreeRoad(v[0], v[1], tab)
            }
            if (last_drawImg == 0) {
                last_drawImg = cur_drawImg
            } else {
                let objSame = this.getObjSame(last_drawImg, cur_drawImg)
                if (objSame) {
                    if (index != 0) {
                        cur_y = cur_y + 1
                    }
                } else {
                    if (objSame) {
                        cur_x = cur_x + 1
                    } else {
                        cur_x = cur_xx + 1
                        cur_xx = cur_xx + 1
                    }
                    cur_y = 0
                    last_drawImg = cur_drawImg
                }
            }
            let isCur_stop = this.getCanStop(cur_x, cur_y, cur_table, 6)
            if (isCur_stop) {
                cur_x = cur_x + 1
                cur_y = cur_y - 1
            }
            cur_table.push([cur_x, cur_y, cur_drawImg])
        }
        return cur_table
    }

    //小路
    export function GetTrailRoad(tab): any {
        let clonetab = tab.slice()
        if (!clonetab) {
            return
        }
        if (clonetab.length <= 0) {
            return
        }
        let LargeRoadtable = this.GetLargeRoadCommon(clonetab)
        if (LargeRoadtable.length < 3) {
            return null
        }
        let isHave = this.GetIsHaveRoad(LargeRoadtable, [2, 1], [3, 0])
        if (!isHave) {
            return
        }
        let clone_table
        let c_LargeRoadtable = LargeRoadtable.slice()
        for (let i = c_LargeRoadtable.length - 1; i >= 0; i--) {
            if (c_LargeRoadtable[i][0] == 0) {
                c_LargeRoadtable.splice(i, 1)
            }
            if (c_LargeRoadtable[i][0] == 1) {
                c_LargeRoadtable.splice(i, 1)
            }
            if (c_LargeRoadtable[i][0] == 2 && c_LargeRoadtable[i][1] == 0) {
                c_LargeRoadtable.splice(i, 1)
            }
        }
        let cur_table = this.GetTrailRoadlist(LargeRoadtable, c_LargeRoadtable, 1, 3, 2)
        return cur_table
    }

    export function GetCockroachRoad(tab): any {
        let clonetab = tab.slice()
        if (!clonetab) {
            return
        }
        if (clonetab.length <= 0) {
            return
        }
        let LargeRoadtable = this.GetLargeRoadCommon(clonetab)
        if (LargeRoadtable.length < 3) {
            return null
        }
        let isHave = this.GetIsHaveRoad(LargeRoadtable, [3, 1], [4, 0])
        if (!isHave) {
            return
        }
        let clone_table
        let c_LargeRoadtable = LargeRoadtable.slice()
        for (let i = c_LargeRoadtable.length - 1; i >= 0; i--) {
            if (c_LargeRoadtable[i][0] == 0) {
                c_LargeRoadtable.splice(i, 1)
            }
            if (c_LargeRoadtable[i][0] == 1) {
                c_LargeRoadtable.splice(i, 1)
            }
            if (c_LargeRoadtable[i][0] == 2) {
                c_LargeRoadtable.splice(i, 1)
            }
            if (c_LargeRoadtable[i][0] == 3 && c_LargeRoadtable[i][1] == 0) {
                c_LargeRoadtable.splice(i, 1)
            }
        }
        let cur_table = this.GetTrailRoadlist(LargeRoadtable, c_LargeRoadtable, 1, 4, 3)
        return cur_table
    }

    export function GetTrailRoadlist(tab, tab2, a, b, c) {
        if (!tab || !tab2) {
            return
        }
        if (tab.length <= 0 || tab2.length <= 0) {
            return
        }
        let cur_x = 0
        let cur_y = 0
        let cur_xx = 0
        let cur_drawImg = 0
        let last_drawImg = 0
        let cur_table = []
        for (let index = 0; index < tab2.length; index++) {
            let v = tab2[index]
            if (v[1] == 0) {
                cur_drawImg = this.getTlines(v[0] - a, v[0] - b, tab)
            } else if (v[1] == 1) {
                cur_drawImg = this.getIshave(v[0] - c, v[1], tab)
            } else if (v[1] > 2 || v[1] == 2) {
                cur_drawImg = this.getThreeRoad(v[0], v[1], tab, c)
            }
            if (last_drawImg == 0) {
                last_drawImg = cur_drawImg
            } else {
                let objSame = this.getObjSame(last_drawImg, cur_drawImg)
                if (objSame) {
                    if (index != 0) {
                        cur_y = cur_y + 1
                    }
                } else {
                    if (objSame) {
                        cur_x = cur_x + 1
                    } else {
                        cur_x = cur_xx + 1
                        cur_xx = cur_xx + 1
                    }
                    cur_y = 0
                    last_drawImg = cur_drawImg
                }
            }
            let isCur_stop = this.getCanStop(cur_x, cur_y, cur_table, 6)
            if (isCur_stop) {
                cur_x = cur_x + 1
                cur_y = cur_y - 1
            }
            cur_table.push([cur_x, cur_y, cur_drawImg])
        }
        return cur_table
    }

    //获取第一行
    export function getTlines(l1, l2, tab): any {
        let clone_tab = tab.slice()
        let tlines_tab_a = []
        let tlines_tab_b = []
        for (let index = clone_tab.length - 1; index >= 0; index--) {
            let v = clone_tab[index]
            let sel_arr = clone_tab.slice(index, index + 1)
            if (v[0] == l1) {
                tlines_tab_a.push(sel_arr[0])
                clone_tab.splice(index, 1)
            } else if (v[0] == l2) {
                tlines_tab_b.push(sel_arr[0])
                clone_tab.splice(index, 1)
            }
        }
        if (tlines_tab_a.length == tlines_tab_b.length) {
            return 1
        } else {
            return 2
        }
    }
    //获取第二行
    export function getIshave(l1, l2, tab): any {
        let ishave = 2
        for (let index = 0; index < tab.length; index++) {
            let v = tab[index]
            if (l1 == v[0] && l2 == v[1]) {
                ishave = 1
            }
        }
        return ishave
    }
    //获取第三行
    export function getThreeRoad(l1, l2, tab, a): any {
        if (!a) {
            a = 1
        }
        let ishave = 2
        for (let index = 0; index < tab.length; index++) {
            let v = tab[index]
            if (l1 - a == v[0] && l2 == v[1]) {
                ishave = 1
            }
        }
        if (ishave == 2) {
            ishave = 1
            for (let index = 0; index < tab.length; index++) {
                let v = tab[index]
                if (l1 - a == v[0] && l2 - 1 == v[1]) {
                    ishave = 2
                }
            }
        }
        return ishave
    }

    export function getObjSame(obj1, obj2): any {
        if (Tools.isArray(obj1) && Tools.isArray(obj2)) { //先无脑替换成isArray,不确定是否有bug
            if (obj1[1] != obj2[1]) {
                return false
            }
        } else {
            if (obj1 != obj2) {
                return false
            }

        }
        return true
    }



    //或
    export function getCanStop(cx, cy, tab, b): any {
        let isHave = false
        if (tab.length <= 0) {
            return isHave
        }
        if (cy == b) {
            isHave = true
        } else {
            for (let index = 0; index < tab.length; index++) {
                if (tab[index][0] == cx) {
                    if (tab[index][1] == cy) {
                        isHave = true
                    }
                }
            }
        }
        return isHave
    }

    export function GetIsHaveRoad(tab, a, b): any {
        let isHave = null
        let isHave1 = false
        if (tab.length <= 0) {
            return isHave
        }
        for (let index = 0; index < tab.length; index++) {
            let v = tab[index]
            if (a[0] == v[0]) {
                if (a[1] == v[1]) {
                    isHave1 = true
                    isHave = 1
                }
            }
        }
        if (isHave1 == false) {
            for (let index = 0; index < tab.length; index++) {
                let v = tab[index]
                if (b[0] == v[0]) {
                    if (b[1] == v[1]) {
                        isHave = 2
                    }
                }
            }
        }
        return isHave
    }

    export function GetMaxNum(tab): any {
        if (tab.length <= 0) {
            return
        }
        let maxcol = 1
        for (let index = 0; index < tab.length; index++) {
            if (tab[index][0]) {
                maxcol = tab[index][0]
            }
        }
        return maxcol
    }

}