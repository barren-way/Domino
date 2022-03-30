const { ccclass, property } = cc._decorator;

@ccclass
export default class nodeFenYe extends cc.Component {

    @property(cc.Label)
    m_pageText: cc.Label = null;

    private m_curpage = 0//当前页
    private m_maxpage = 1 //最大页
    private m_pagecall = null//回调函数

    start() {

    }

    leftcall() {
        if (this.m_pagecall) {
            this.changePage(-1)
        }
    }

    rightcall() {
        if (this.m_pagecall) {
            this.changePage(1)
        }
    }

    //切换页数
    changePage(dt) {
        if (dt == undefined) {
            return
        }
        var pagenum = this.m_curpage + dt
        if (pagenum <= 1) {
            pagenum = 1
        }
        if (pagenum >= this.m_maxpage) {
            pagenum = this.m_maxpage
        }
        this.m_curpage = pagenum
        if (this.m_pagecall) {
            this.m_pagecall(pagenum)
        }
        this.m_pageText.string = this.m_curpage + "/" + this.m_maxpage
    }

    setPageChangeCallBack(call) {
        this.m_pagecall = null
        this.m_pagecall = call
    }

    getCurPageNum() {
        return (this.m_curpage || 1)
    }

    setCurPageNum(page) {
        this.m_curpage = page || 1
        //标签
        this.m_pageText.string = this.m_curpage + "/" + this.m_maxpage
    }

    refreshPageView(curnum, maxnum) {
        if (curnum == undefined || maxnum == undefined) {
            return
        }
        //当前页
        this.m_curpage = curnum
        //最大页
        this.m_maxpage = maxnum
        //标签
        this.m_pageText.string = curnum + "/" + maxnum
    }
}
