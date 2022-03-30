
import CardData_domino from "./CardData_domino"
import Gambling from "./Gambling"
import MsgArg from "./MsgArg"



export default class GameCtrl{
    lastEvent:string=null
    ifMsg:Boolean=false
    
    args:MsgArg=null
    id:number=0
    gambling:Gambling=null
    deck:number[]=[]
    choosingCard=null
    rivalChoosingCard=null

    LONG:number=160
    DECKSIZE:number=28

    canPlay:boolean=true
    rivalCanPlay:boolean=true

    rivalPlay:boolean=false

    leftSpecial:boolean=false
    rightSpecial:boolean=false

    init(){
        this.args=new MsgArg
        this.gambling=new Gambling
        this.createDeck()
        this.shuffleDeck()             
    }
    //创建牌堆
    createDeck(){
        for(let i=0;i<this.DECKSIZE;i++){
            this.deck[i]=i+1
        }
    }
    //洗牌
    shuffleDeck(){
        for(let i=0;i<this.DECKSIZE;i++){
            let ram1=parseInt(Math.random()*this.DECKSIZE+'')
            let ram2=parseInt(Math.random()*this.DECKSIZE+'')
            let mid:number=0
            mid=this.deck[ram1]
            this.deck[ram1]=this.deck[ram2]
            this.deck[ram2]=mid
        }
    }
    getDealtNum(){
        return this.gambling.dealtCardNum
    }

    getMsg(event:string){
        this.lastEvent=event
        switch(this.lastEvent){
            case 'free_match':
                this.ifMsg=true
                break
            case 'state':
                this.setState()
                this.ifMsg=true
                break
            case 'choose_card':
                //console.log('------------------ctrl---getMsg------------')
                this.chooseCard()
                this.ifMsg=true
                break
            case 'choose_side':
                this.chooseSide()
                this.ifMsg=true
                break
            case 'rival_choose_card':
                this.rivalPlayCard()
                this.ifMsg=true
            case 'null':
                break
        }
    }

    setState(){
        this.args.state='deal'
        for(let i=0;i<6;i++){
            this.args.cards.push(this.deck[i])
            this.args.rivalCards.push(this.deck[i+6])           
            this.gambling.handCard.push(this.deck[i])
            this.gambling.rivalHandCard.push(this.deck[i+6])
            
        }
    }

    canTwoSidePlay(){
        var rivalCanPlay= this.checkHandCard(this.gambling.rivalHandCard) 
        var playerCanPlay= this.checkHandCard(this.gambling.handCard) 
        if(!rivalCanPlay&&!playerCanPlay){
            return false
        }
        return true
    }

    chooseSide(){
        var c_data=CardData_domino.getPokerData(this.args.choosingCard)
        if(this.gambling.leftCardNum==0){           
            this.gambling.leftCardNum++
            this.gambling.rightCardNum++        
            this.args.rotate=-90
            this.gambling.onLeftNum=c_data.up
            this.gambling.onRightNum=c_data.down
            this.args.leftPos-=this.LONG
            this.args.rightPos+=this.LONG
            this.changeHandCard(this.gambling.handCard,false)
            this.args.handCardNum--
            if(c_data.up==c_data.down){
                this.args.rotate+=90
                this.args.leftPos+=this.LONG/4
                this.args.rightPos-=this.LONG/4
            }
            return
        }
        
        if(this.args.choosingSide=='left'){
            this.gambling.leftCardNum++  
            this.judgeSpecial(c_data,this.args.choosingSide)    
            this.changeCardPos(this.args.choosingSide,this.args.choosingCard)     
            this.changeChoosePos(this.args.choosingSide,this.args.choosingCard) 
            
            this.gambling.onLeftNum= c_data.up==this.gambling.onLeftNum? c_data.down:c_data.up
        }
        else{
            this.gambling.rightCardNum++
            this.judgeSpecial(c_data,this.args.choosingSide)  
            this.changeCardPos(this.args.choosingSide,this.args.choosingCard)          
            this.changeChoosePos(this.args.choosingSide,this.args.choosingCard) 
              
            this.gambling.onRightNum= c_data.up==this.gambling.onRightNum? c_data.down:c_data.up   
        }
        this.ifRoate(c_data,this.args.choosingSide)
        this.args.handCardNum--
        this.changeHandCard(this.gambling.handCard,false)  
    }
    judgeSpecial(c_data,side){
        var num= side=='left'? this.gambling.leftCardNum:this.gambling.rightCardNum  
        if(c_data.up==c_data.down&&num>=6&&num<7){
            if(side=='left'){
                this.leftSpecial=true
            }
            else{
                this.rightSpecial=true
            }  

        }

    }
    //牌上下点数相同旋转九十度放置
    ifRoate(c_data,side){
        var num= side=='left'? this.gambling.leftCardNum:this.gambling.rightCardNum  
        var choosingSpecial=side=='left'? this.leftSpecial:this.rightSpecial
        if(c_data.up==c_data.down){
            var changeX=0
            var rotate=90
            var changeY=0
           if(num>0&&num<6||num>=18&&num<26){
                changeX=this.LONG/2
                rotate=0
            }
            else if(num>=6&&num<7||num>=16&&num<17){
                changeX=0
                rotate=0
                changeY=this.LONG/4 
             
            }
            else if(num>=7&&num<8){
                changeX=-this.LONG/4
                rotate=90
                changeY=0
            }
            else if(num>=8&&num<16){
                if(num!=8||!choosingSpecial){
                    changeX=-this.LONG/2
                    rotate=0
                    changeY=0
                }  
                else{
                    rotate=90
                } 
            }
            else if(num>=17&&num<18){
                changeX=+this.LONG/4
                rotate=90
                changeY=0

            }

            if(side=='left'){
                this.args.leftPos+=changeX
                this.args.rotate=rotate
                this.args.leftPosY+=changeY
            }
            else{
                this.args.rightPos-=changeX
                this.args.rotate=rotate
                this.args.rightPosY-=changeY
            }
            
        }
    }

    changeChoosePos(side,choosingCard){
        var c_data=CardData_domino.getPokerData(choosingCard)
        var num= side=='left'? this.gambling.leftCardNum:this.gambling.rightCardNum    
        if(num>=0&&num<5||num>=17&&num<25){
            if(side=='left'){
                this.args.leftPos-=this.LONG
                this.args.chooseRotateLeft=90
                               
            }
            else{
                this.args.rightPos+=this.LONG
                this.args.chooseRotateRight=90
                             
            }
        }
        else if(num>=5&&num<6){
            
            if(side=='left'){
                this.args.leftPos-=this.LONG*3/4
                this.args.chooseRotateLeft=0
                this.args.leftPosY-= this.LONG/4
            }
            else{
                this.args.rightPos+=this.LONG*3/4
                this.args.chooseRotateRight=0
                this.args.rightPosY+= this.LONG/4
            }
        }
        else if(num>=6&&num<7){
            if(side=='left'){
                if(this.leftSpecial){
                    this.args.leftPos+=0
                    this.args.chooseRotateLeft=0
                    this.args.leftPosY-= this.LONG
                }
                else{
                    this.args.leftPos+=this.LONG/4
                    this.args.chooseRotateLeft=90
                    this.args.leftPosY-= this.LONG*3/4
                }       
            }
            else{
                if(this.rightSpecial){
                    this.args.rightPos-=0
                    this.args.chooseRotateRight=0
                    this.args.rightPosY+= this.LONG
                }
                else{
                    this.args.rightPos-=this.LONG/4
                    this.args.chooseRotateRight=90
                    this.args.rightPosY+= this.LONG*3/4
                }                 
            }
            
        }
        else if(num>=7&&num<15){
            
            if(side=='left'){
                if(this.leftSpecial&&num==7){
                    this.args.leftPos-=this.LONG/4
                    this.args.leftPosY-=this.LONG/4
                    
                }
                else if(this.leftSpecial&&num==8){
                    //this.leftSpecial=false
                }
                this.args.leftPos+=this.LONG
                this.args.chooseRotateLeft=90
            }
            else{
                if(this.rightSpecial&&num==7){
                    this.args.rightPos+=this.LONG/4
                    
                    this.args.rightPosY+=this.LONG/4
                }
                else if(this.rightSpecial&&num==8){
                    //this.rightSpecial=false
                }
                this.args.rightPos-=this.LONG
                this.args.chooseRotateRight=90
            }
        }
        else if(num>=16&&num<17){
            if(side=='left'){
                this.args.leftPos-=this.LONG/4
                this.args.chooseRotateLeft=90
                this.args.leftPosY-= this.LONG*3/4
            }
            else{
                this.args.rightPos+=this.LONG/4
                this.args.chooseRotateRight=90
                this.args.rightPosY+= this.LONG*3/4
            }
        }
        else if(num>=15&&num<16){
            if(side=='left'){
                this.args.leftPos+=this.LONG*3/4
                this.args.chooseRotateLeft=0
                this.args.leftPosY-= this.LONG/4
            }
            else{
                this.args.rightPos-=this.LONG*3/4
                this.args.chooseRotateRight=0
                this.args.rightPosY+= this.LONG/4
            }
        } 
    }

    changeCardPos(side,choosingCard){
        var c_data=CardData_domino.getPokerData(choosingCard)
        var num= side=='left'? this.gambling.leftCardNum:this.gambling.rightCardNum  
        this.checkCardNum(c_data,num,side)
    }

    checkCardNum(c_data,num,side){
        console.log('leftSpecial'+this.leftSpecial)
        console.log('rightSpecial'+this.rightSpecial)
        if(num>=0&&num<6||num>=17&&num<26){
            console.log(c_data)
            if(side=='left'){
                this.args.rotate= c_data.up==this.gambling.onLeftNum? 90:-90
            }
            else{
                this.args.rotate= c_data.up==this.gambling.onRightNum? -90:90
            }
        }
        else if(num>=6&&num<7||num>=16&&num<17){
            
            if(side=='left'){
                this.args.rotate= c_data.up==this.gambling.onLeftNum? 0:180
            }
            else{
                this.args.rotate= c_data.up==this.gambling.onRightNum? -180:0
            }
        }
        else if(num>=7&&num<16){
            if(side=='left'){
                if(this.leftSpecial&&num==7){
                    this.args.rotate= c_data.up==this.gambling.onLeftNum? 0:180
                    console.log('改变角度')
                }
                else{
                    this.args.rotate= c_data.up==this.gambling.onLeftNum? -90:90
                }
            }
                
            else{
                if(this.rightSpecial&&num==7){
                    this.args.rotate= c_data.up==this.gambling.onRightNum? 180:0
                    console.log('改变角度')
                }
                else{
                    this.args.rotate= c_data.up==this.gambling.onRightNum? 90:-90
                }              
            }         
        }
    }

    changeHandCard(handCard,ifrival){
        //var handCard=this.gambling.handCard
        var choosingCard= ifrival?  this.args.rivalChoosingCard:this.args.choosingCard
        for(let i=0;i<handCard.length;i++){
            if(handCard[i]==choosingCard){
                handCard.splice(i,1)
                break
            }
        }
    }

    afterDeal(){
        this.lastEvent='afterDeal'
        this.ifMsg=true
    }
    useOut(){
        this.lastEvent='useOut'
        this.ifMsg=true

    }
    first=true

    ifSupplement(){
        //检查手牌，不能出就发牌      
        this.canPlay= this.checkHandCard(this.gambling.handCard) 
        if(!this.canPlay){
            if(this.gambling.dealtCardNum>=this.DECKSIZE){
                /*setTimeout(() =>{
                    this.ifRivalSupplement()
                },600)*/
                if(this.first){
                    console.log(this.first)
                    this.useOut()
                    this.first=false
                    return
                }
                
                this.ifRivalSupplement()
                console.log('dealtNum:'+this.gambling.dealtCardNum)
                
            }
            else if(this.args.rivalCardNum>0){
                this.reDeal(this.args.cards,false,this.gambling.handCard)   
                console.log('dealtNum:'+this.gambling.dealtCardNum)   
            }
                  
        }
        else{
            this.afterDeal()
        }
    }
    ifRivalSupplement(){
        //检查手牌，不能出就发牌
        this.canPlay= this.checkHandCard(this.gambling.rivalHandCard) 
        if(!this.canPlay){
            if(this.gambling.dealtCardNum>=this.DECKSIZE){
                return
            }
            this.reDeal(this.args.rivalCards,true,this.gambling.rivalHandCard)          
        }
        else{
            this.rivalPlayCard()
        }

    }

    checkHandCard(handCard){
        //var handCard=this.gambling.handCard
        for(let i=0;i<handCard.length;i++){
            var c_data=CardData_domino.getPokerData(handCard[i])
            if(c_data){
                if(c_data.up==this.gambling.onLeftNum||c_data.down==this.gambling.onLeftNum){
                    return true
                }
                if(c_data.up==this.gambling.onRightNum||c_data.down==this.gambling.onRightNum){
                    return true
                }
            }
            
            
        }
        return false        
    }

    reDeal(cards,ifrival,handCard){
        this.lastEvent=ifrival? 'rivalReDeal':'reDeal'
        this.ifMsg=true
        var dealtCardNum=this.gambling.dealtCardNum
        cards.push(this.deck[dealtCardNum])
        handCard.push(this.deck[dealtCardNum])
        this.gambling.dealtCardNum++
        if(!ifrival){this.args.handCardNum++}
        else {this.args.rivalCardNum++}
        
    }

    chooseCard(){
        var c_data=CardData_domino.getPokerData(this.args.choosingCard)
        this.args.state='choosing'
        if(this.gambling.onLeftNum<0){
            this.args.outLeft=true;
            this.args.outRight=true;
        }
        else{
            if(c_data.up==this.gambling.onLeftNum||c_data.down==this.gambling.onLeftNum){
                this.args.outLeft=true;          
            }
            else{
                this.args.outLeft=false; 
            }
            if(c_data.up==this.gambling.onRightNum||c_data.down==this.gambling.onRightNum){
                this.args.outRight=true;
            }
            else{
                this.args.outRight=false; 
            }
        }       
    }
    //对手出牌
    rivalPlayCard(){  
        this.rivalCanPlay= this.checkHandCard(this.gambling.rivalHandCard) 
        if(!this.rivalCanPlay){
            this.reDeal(this.args.rivalCards,true,this.gambling.rivalHandCard)
        }
        this.rivalChooseCard()
        var c_data=CardData_domino.getPokerData(this.args.rivalChoosingCard)
        if(this.args.rivalChoosingSide=='left'){
            this.gambling.leftCardNum++  
            this.judgeSpecial(c_data,this.args.rivalChoosingSide) 
            this.changeCardPos(this.args.rivalChoosingSide,this.args.rivalChoosingCard)
            this.gambling.onLeftNum= c_data.up==this.gambling.onLeftNum? c_data.down:c_data.up
        }
        else{
            this.gambling.rightCardNum++
            this.judgeSpecial(c_data,this.args.rivalChoosingSide) 
            this.changeCardPos(this.args.rivalChoosingSide,this.args.rivalChoosingCard)
            this.gambling.onRightNum= c_data.up==this.gambling.onRightNum? c_data.down:c_data.up   
        }
        //this.ifRoate(c_data,this.args.rivalChoosingSide)
        this.args.rivalCardNum--
        this.changeHandCard(this.gambling.rivalHandCard,true)      
        this.lastEvent='rivalPlay'
        this.ifMsg=true 
    }

    duringRivalPlay(){
        var c_data=CardData_domino.getPokerData(this.args.rivalChoosingCard)
        this.ifRoate(c_data,this.args.rivalChoosingSide)

    }
    //对手选牌，优先堵玩家出的牌，不能堵再看另一边可不可以出
    rivalChooseCard(){
        var rivalHandCard=this.gambling.rivalHandCard 
        var chooseSide=this.args.choosingSide
        var choosSideNum= this.args.choosingSide=='left'? this.gambling.onLeftNum:this.gambling.onRightNum
        var otherSide=this.args.choosingSide=='left'? 'right':'left'
        var otherSideNum=otherSide=='left'? this.gambling.onLeftNum:this.gambling.onRightNum
        for(let i=0;i<rivalHandCard.length;i++){          
            var c_data=CardData_domino.getPokerData(rivalHandCard[i])
            if(c_data.up==choosSideNum||c_data.down==choosSideNum){
                this.args.rivalChoosingCard=rivalHandCard[i]
                this.args.rivalChoosingSide=chooseSide
                return
            }
        }
        for(let i=0;i<rivalHandCard.length;i++){          
            var c_data=CardData_domino.getPokerData(rivalHandCard[i])
            if(c_data.up==otherSideNum||c_data.down==otherSideNum){
                this.args.rivalChoosingCard=rivalHandCard[i]
                this.args.rivalChoosingSide=otherSide
                return
            }
        }

    }

    sendData(data,event){
        switch(event){
            case 'choose_card':
                this.args.choosingCard=data
                break
            case 'choose_side':
                this.args.choosingSide=data    
        } 

    }
    getCardNum(side){
        var cardNum= side=='left'? this.gambling.leftCardNum:this.gambling.rightCardNum
        return cardNum

    }

    getArg(){
        return this.args;
    }
    getid(){
        return this.id
    }

    getEvent(){
        return this.lastEvent
    }
    getRotate(){
        return this.args.rotate
    }
    

}
