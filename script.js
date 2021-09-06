var Vue = new Vue({
	el: '#main',
    data: {
        persons: [],
        currentRow: [],
        hide: {
            fname: true,
            lname: true,
            phone: true,
            about: true,
            eyeCo: true
        },

        pageNum: 0,
        rowsPerPage: 10,
        
    },
    methods: {

        // загружаем JSON файл с данными
        loadJSON(callback) {
            var xobj = new XMLHttpRequest(); //Создаём новый объект XMLHttpRequest
            xobj.overrideMimeType("application/json"); // переопределяем MIME тип, возвращаемый сервером
            xobj.open('GET', './data.json', true) //Конфигурируем его: GET-запрос на URL 'data.json'
            xobj.send(null); //Отсылаем запрос
            xobj.onreadystatechange = function () {
                // Если код ответа сервера не 200, то это ошибка
                // 4 - Операция полностью завершена.
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(xobj.responseText); 
                }
            };
        },

        init() {
            let that = this
            this.loadJSON(function (response) {
                that.persons = JSON.parse(response); // заполняем данными массив persons
            });
        },

        // отмечаем маркерами столбцы скрыты или нет
        toggle(v){
            switch(v){
                case 'firstName':   return this.hide.fname ? this.hide.fname = false : this.hide.fname = true;
                case 'lastName':    return this.hide.lname ? this.hide.lname = false : this.hide.lname = true;
                // case 'phone':       return this.hide.phone ? this.hide.phone = false : this.hide.phone = true;
                case 'about':       return this.hide.about ? this.hide.about = false : this.hide.about = true;
                case 'eyeColor':    return this.hide.eyeCo ? this.hide.eyeCo = false : this.hide.eyeCo = true;
                default:            return;
            } 
        },

        // сортировка колонок по значениям если данные не скрыты
        sortCol(col) {
            switch(col){
                case 'firstName':   if(this.hide.fname === true)    {return this.persons.sort(sortByFirstName)};
                case 'lastName' :   if( this.hide.lname === true)   {return this.persons.sort(sortByLastName)};
                // case 'phone' :      if( this.hide.phone === true)   {return this.persons.sort(sortByPhone)};
                case 'about' :      if( this.hide.about === true)   {return this.persons.sort(sortByAbout)};
                case 'eyeColor' :   if( this.hide.eyeCo === true)   {return this.persons.sort(sortByEyeColor)};
                default:            return this.persons;
            } 
        },

        // меняет номер стартовой позиции для массива persons зависимо от страницы
        movePages(amount) {
            var newStartRow = this.pageNum + (amount * this.rowsPerPage); // указываем индекс для начала строки в persons

            if (newStartRow >= 0 && newStartRow < this.persons.length) {
              this.pageNum = newStartRow;   // если все ок, то присваиваем глобальной переменной новое значение
            }
        },

        // вывод в форму объект person для редактирования
        edit(person){
            this.currentRow = person; // строка с которой будем работать

            document.querySelector(".formAct .firstName").value = this.currentRow.name.firstName;
            document.querySelector(".formAct .lastName").value = this.currentRow.name.lastName;
            // document.querySelector(".formAct .phone").value = this.currentRow.phone;
            document.querySelector(".formAct .about").value = this.currentRow.about;
            document.querySelector(".formAct .eyeColor").value = this.colorToRGB(this.currentRow.eyeColor);
        },

        // сохраняет отредактированные данные
        saveEdit(){
            this.currentRow.name.firstName = document.querySelector(".formAct .firstName").value;
            this.currentRow.name.lastName = document.querySelector(".formAct .lastName").value;
            // this.currentRow.phone = document.querySelector(".formAct .phone").value;
            this.currentRow.about = document.querySelector(".formAct .about").value;
            this.currentRow.eyeColor = document.querySelector(".formAct .eyeColor").value;
            
            var a = this.persons.findIndex(pers => this.currentRow.id === pers.id) // поиск нужного person в массиве
            this.persons[a] = this.currentRow;
            
            document.querySelector(".formAct .firstName").value = "";
            document.querySelector(".formAct .lastName").value = "";
            // document.querySelector(".formAct .phone").value = "";
            document.querySelector(".formAct .about").value = "";
            document.querySelector(".formAct .eyeColor").value = "#000000";
        },

        // переводит строку с названием цвета в HEX-формат
        colorToRGB(color) {
            switch(color){
                case "blue": return "#0000FF"
                case "brown": return "#A52A2A"
                case "red": return "#FF0000"
                case "green": return "#00FF00"
            }
        }

        // было в планах сделать еще такую кнопку, но стало этого нет в тз
        // newPerson(){
        //     if( document.querySelector("input.firstName").value != "" &&
        //         document.querySelector("input.lastName").value != ""  &&
        //         document.querySelector("input.phone").value != ""  &&
        //         document.querySelector("input.about").value != ""  &&
        //         document.querySelector("input.eyeColor").value != "") {
        //             // persons.push(["name": [firstName, lastname] ])
        //         }
        // }
    },

    mounted(){
        this.init();
    },

    computed: {
        // изменения знаения номера страницы
        personPerPage: function() {
            return this.persons.filter((item, index) => index >= this.pageNum && index < (this.pageNum + this.rowsPerPage))
        },
    }
});

// сортировки
var sortByFirstName =   function (d1, d2) {return (d1.name.firstName.toLowerCase() > d2.name.firstName.toLowerCase()) ? 1 : -1;};
var sortByLastName =    function (d1, d2) {return (d1.name.lastName.toLowerCase() > d2.name.lastName.toLowerCase()) ? 1 : -1;};
// var sortByPhone =       function (d1, d2) {return (d1.phone.toLowerCase() > d2.phone.toLowerCase()) ? 1 : -1;};
var sortByAbout =       function (d1, d2) {return (d1.about.toLowerCase() > d2.about.toLowerCase()) ? 1 : -1;};
var sortByEyeColor =    function (d1, d2) {return (d1.eyeColor.toLowerCase() > d2.eyeColor.toLowerCase()) ? 1 : -1;};