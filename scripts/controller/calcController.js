class CalcController{

    constructor(){

        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._atualDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){

        this.setDisplayDateTime();

        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        
        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e =>{

                console.log(btn.className.baseVal.replace("btn-",""));

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown",e => {
                btn.style.cursor = "pointer";
            });
            
        })
    }

    setDisplayDateTime(){
        this.displayDate = this.atualDate.toLocaleDateString(this._locale);
        this.displayTime = this.atualDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML; 
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return _displayCalcEl.innerHTML
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get atualDate(){
        return new Date();
    }
    set atualDate(value){
        this._atualDate = value;
    }

}