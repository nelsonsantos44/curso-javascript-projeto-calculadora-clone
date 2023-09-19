class CalcController {

    constructor(){


        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();

        //colocando em varíaveis para manipulação
        //_ underline no começo quer dizer que é privado
        // this. para chamar essas variaveis

    }

    initialize(){

        this.setDisplayDateTime();

        setInterval(() =>{ //criação de intervalo, para a data ir funcionando

            this.setDisplayDateTime()
        
        }, 1000);


        this.setLastNumberToDisplay();

    }

    addEventListenerAll(element,events,fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event,fn,false);
            
        });
      //fazendo o AddEventListener entender "click drag" com a função split que entende o espaço e separa as palavras como se fosse uma array
    }


    clearAll(){

        this._operation = [];

        this.setLastNumberToDisplay();
    }

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    getLastOperation(){


        return this._operation[this._operation.length-1];
        // '.lenght-1', para retornar a ultima posição do meu array
        //meu array

    }


    setLastOperation(value){

        //substituir valor da string no array
        this._operation[this._operation.length-1] = value;



    }   

    isOperator (value){

        return (['+', '-', '*' , '%' , '/'].indexOf(value) > -1) 
    
    }

    pushOperation(value){  

        this._operation.push(value);

        if(this._operation.length > 3) {
            
            this.calc();

        }

    }

    getResult(){

            return eval(this._operation.join(""));

    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.lenght < 3) {

            let firstItem = this._operation[0];

            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.lenght > 3) {

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        //puxando os ultimos numeros e operadores

        } else if (this._operation.lenght == 3) {

            this._lastNumber = this.getLastItem(false);
            
        }
        
        let result = this.getResult();

        console.log('_lastOperator',this._lastOperator);
        console.log('_lastNumber',this._lastNumber);

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];
        
            if (last) this._operation.push(last);

        }
//if para aplicar a porcetagem
        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){

            let lastItem;
         
            for (let i = this._operation.length-1; i >= 0; i--){

                if (this.isOperator(this._operation[i]) == isOperator) {
        
                    lastItem = this._operation[i];
        
                    break;
                //! é o not, ou seja, se não for um operador ele vai apresentar, ele reconhece o número e coloca na variavel
            } 
            
        }

        if (!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
//ulitmo numero do display
    }

    addOperation(value){

        if (isNaN(this.getLastOperation())) {
            //string

            if (this.isOperator(value)) {
                
                this.setLastOperation(value);
                //trocar o operador
                //ele vai verificar qual foi a ultima operação , se for um operador ele vai trocar  A ULTIMA OPERAÇÃO, o bloco dentro da array é a busca da ultima operação

            } else if(isNaN(value)) {
              
                //verificando se existe valor na string ISNAN  super importante
                console.log("outra coisa", value);

            } else {

                this.pushOperation(value)

                this.setLastNumberToDisplay()

            }

        } else {

            if(this.isOperator(value)){ //se for um operator ele vai adicionar na string

                this.pushOperation(value);

            } else{
           
            //função de concatenar valor, identificar os números colocados

            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseInt(newValue));
            //atualizar display
            //number. Transformando em string para que entenda que deve ser concatenado o valor e não somado, o getLastOperation pega o ultimo valor que foi colocado, não o valor que foi colocado agora

            this.setLastNumberToDisplay();
                
            }

        }
       
    }
//push adicionar mais uma informação no array

    setError(){

        this.displayCalc = "error"

    }
    
    
    execBtn(value){

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation('+')
                break;

            case 'subtracao':
                this.addOperation('-')
                
                break;
                
            case 'divisao':
                this.addOperation('/')
                break;

            case 'multiplicacao':
                this.addOperation('*')
                break;
            
            case 'porcento':
                this.addOperation('%')
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addOperation('.')
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

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    //queryselectorall vai selecionar TODOS os IDS 
    //chama os IDS com "#" no inicio e as class com "." no inicio
       
        buttons.forEach((btn, index)=>{

    //forEach para verificar qual dos botões

            this.addEventListenerAll(btn,"click drag" , e => {

            let textBtn = btn.className.baseVal.replace("btn-","")

            this.execBtn(textBtn);


        })

    //addEventListener para verificar o 'click' quando clica, "drag" quando clica e arrasta            
    //className.Baseval para realizar o tratamento, voltar só o valor da class e o replace para retirar o "btn-"
        
        this.addEventListenerAll (btn, "mouseover mouseup mousedown",e => {

            btn.style.cursor = "pointer";

        });

    });
        
    }

  
    
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day:'2-digit',
            month:'long',
            year:'numeric'
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime() {

        return this._timeEl.innerHTML;
    
    }
 
    set displayTime (value) {

        return this._timeEl.innerHTML = value;

    }
    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        return this._dateEl.innerHTML = value;

    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value ;
    }

    get currentDate (){
               
        return new Date();
    }

    set currentDate(value){

        this._currentDate = value;
    }

}

//Dentro de uma classe encotramos Atributos e métodos(variaveis e funções ) uma classe é um conjunto de atributos e métodos
