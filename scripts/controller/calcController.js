class CalcController{

    constructor(){

        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
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
        this.setLastNumberToDisplay();

        //A cada um segundo irá atualizar a hora
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

    }

    //Feito para clique ou arrastar em cima do botão
    addEventListenerAll(element, events, fn){

        //para cada espaço irá pegar um evento ex: click drag mouseup
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    //Apaga tudo no vetor
    btnAC(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    //apaga o ultimo lugar do vetor
    btnCE(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    //pega o ultimo lugar do vetor
    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    //Colocar proximo numero dentro do array junto
    setLastOperation(value){

        this._operation[this._operation.length-1] = value;
        
    }

    //Verificar se o botão é alguma dessas operações, true or false
    isOperator(value){

        return (['+','*','-','%','/'].indexOf(value) > -1);

    }

    pushOperation(value){
        //Verificar se há mais que 3 itens no array
        this._operation.push(value);

        if(this._operation.length > 3){


            this.calc();

        }

    }

    getResult(){


        //join serve para tirar as virgulas do array
        //Ex: 10,'+',90 = 10+90
        return eval(this._operation.join(""));
    }

    calc(){
        //calcular a conta

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firsItem = this._operation[0];
            this._operation = [firsItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){

            last = this._operation.pop();//remove um
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult()

        if(last == '%'){

            result /= 100;

            this._operation = [result]

        }else{
            //salvar o resultado
            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        //false = numero
        //true = operador

        let lastItem;

        for(let i = this._operation.length - 1; i >=0; i--){

            //Verificar se o ultimo item é operador ou é um numero

                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }

        }

        //se não tiver o perador irá continuar com o ultimo
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay(){
        //Pegar o ultimo numero e colocar no display
        let lastNumber = this.getLastItem(false);

        //se não tiver nada ele ficará com 0
        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value){

        //se o botão que foi para o vetor não for um numero
        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){
                //Troca o ultimo array
                this.setLastOperation(value);

            }else{

                //Primeiro numero adicionado, pois o primeiro é undefined
                //Assim isNan da true
                this.pushOperation(value);
                this.setLastNumberToDisplay();

            }

        }else{

            //se for operador irá adicionar um no array
            if(this.isOperator(value)){

                this.pushOperation(value);

            }else{//Se não realmente é um numero então irá adicionar junto com o ultimo numero

            //number
            let newValue = this.getLastOperation().toString() + value.toString();
            //adiciona no array
            this.setLastOperation(newValue);

            this.setLastNumberToDisplay();

            }

        }

    }

    //Algum botão inválido, usado apenas no defaul case
    setError(){
        this.displayCalc = "Error";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        //Não deixar adicionar dois pontos na mesma operação
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();

    }

    //Pegar o botão que foi pressionado
    execBtn(value){

        switch(value){

            case 'ac':
                this.btnAC();
                break;
            case 'ce':
                this.btnCE();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
            this.addOperation('-');
                break;
            case 'multiplicacao':
            this.addOperation('*');
                break;
            case 'divisao':
            this.addOperation('/');
                break;
            case 'porcento':
            this.addOperation('%');
                break;
            case 'igual':
            this.calc();
                break;
            case 'ponto':
            this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }

    }

    //Clique nos botões
    initButtonsEvents(){

        //Botões validos
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        
        //para cada botão
        buttons.forEach((btn, index)=>{

            //Pega o clique e manda para o execBtn
            this.addEventListenerAll(btn, "click drag", e =>{

                //Pegando o botão da classe e tirando o nome da classe para ir apenas o valor
                let textBtn = btn.className.baseVal.replace("btn-","");

                this.execBtn(textBtn);

            });


            this.addEventListenerAll(btn, "mouseover mouseup mousedown",e => {
                btn.style.cursor = "pointer";
            });
            
        })
    }

    //Setando data e hora
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
