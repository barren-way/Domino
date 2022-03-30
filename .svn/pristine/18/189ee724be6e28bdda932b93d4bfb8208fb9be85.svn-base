export default class Radio{
    private static mInstance:Radio = null;
    //走马灯数据
    private m_radioDataTable: Array<any> = [];
    //默认数据
    private m_defaultRadioData: Array<any> = [];
    public static getInstance():Radio{
        if(!Radio.mInstance){
            Radio.mInstance =  new Radio();
            Radio.mInstance.init();
        }
        return Radio.mInstance;
    }
    
    public init():void{
    }

    public setDefalutRadioData(radioData):void{
        if (!radioData) return
        this.m_defaultRadioData=[]
        for (let index = 0; index < radioData.length; index++) {
            this.m_defaultRadioData.push(radioData[index])
        }
    }

    public getDefalutRadioData():any{
        return this.m_defaultRadioData
    }

    public addHomeRadioData(data):void{
        if (data){
            if (data.times) {
                for (let z = 0; z < data.times; z++) {
                    this.m_radioDataTable.push({rType:data.rType,content:data.content})
                }
            }else{
                this.m_radioDataTable.push({rType:data.rType,content:data.content})
            }
            
        } 
    }

    public removeHomeRadioData():any{
        return this.m_radioDataTable.shift()
    }

    public getHomeRadioData():any{
        return this.m_radioDataTable.slice()
    }

    public isHaveHomeRadio():any{
        return this.m_radioDataTable.length > 0
    }
    
}
