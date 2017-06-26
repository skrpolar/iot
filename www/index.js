var socket = io.connect('/');//与服务器进行连接
var searchLedNum = 0;
var sensorValue = 0;

window.onload = function(){

    

    socket.on('connect',function(){
        console.log("Connect Success");
        socket.emit('searchLedNum');
    });

    var totalImgDivNum = document.getElementById("imgRow").getElementsByTagName("div").length;
    var initArr = [];
    for(let j = 0; j < totalImgDivNum; j ++){
        if((document.getElementById("imgRow").getElementsByTagName("div")[j].id).substr(0,(document.getElementById("imgRow").getElementsByTagName("div")[j].id).length - 1) == "ledd"){
            initArr[j] = (document.getElementById("imgRow").getElementsByTagName("div")[j].id).substr((document.getElementById("imgRow").getElementsByTagName("div")[j].id).length - 1);
        }
    }

    console.log(initArr);

    socket.emit('initLightStatus',initArr);

    socket.on('message',function(arr,str2){
        if(str2 == "init"){
            for(var i = 0; i < arr.length; i ++){
            let ledBtn = document.getElementById("sendLedBtn" + arr[i].number);
            let ledImg = document.getElementById("led" + arr[i].number);
            switch(arr[i].state){
                case 0 : (() => {
                    ledImg.src = "light-off.jpg";
                    ledBtn.innerText = "打开";
                })();break;
                case 1 : (() => {
                    ledImg.src = "light-on.jpg";
                    ledBtn.innerText = "关闭";
                })();break;
            }
        }
        }else if(str2 == "refresh"){
            let ledBtn = document.getElementById("sendLedBtn" + arr.number);
            ledBtn.disabled = false;
            let ledImg = document.getElementById("led" + arr.number);
            switch(arr.state){
                case 0 : (() => {
                    ledImg.src = "light-off.jpg";
                    ledBtn.innerText = "打开";
                })();break;
                case 1 : (() => {
                    ledImg.src = "light-on.jpg";
                    ledBtn.innerText = "关闭";
                })();break;
            }
        }else if(str2 == "wait"){
            let ledBtn = document.getElementById("sendLedBtn" + arr.number);
            ledBtn.disabled = true;
        }
    });

    socket.on('ledNum',(num) => {
        searchLedNum = num;
    });

    socket.on('sensor',(value) => {
        sensorValue = value;
    })
    
};


function panelClick(evt){
    var obj = window.event ? event.srcElement : evt.target;
    if(obj.nodeName == "BUTTON"){
        if(obj.id !== "add" && obj.id !== "delete"){
            console.log("Click led" + obj.id.substr(obj.id.length - 1) + "按钮");
            socket.send(obj.id.substr(obj.id.length - 1));
        }else if(obj.id == "delete"){

            let deleteTitle = document.getElementById("ledRow");
            let deleteImg = document.getElementById("imgRow");
            let deleteBtn = document.getElementById("btnRow");
            let add = document.getElementById("add");
            let i = 0;
            let j = 0;
            let k = 0;
            while(i = (deleteTitle.getElementsByTagName("div").length)){
                i ++;
                deleteTitle.removeChild(deleteTitle.getElementsByTagName("div")[0]);
            }
            while(j = (deleteImg.getElementsByTagName("div").length)){
                j ++;
                deleteImg.removeChild(deleteImg.getElementsByTagName("div")[0]);
            }
            while(k = (deleteBtn.getElementsByTagName("div").length)){
                k ++;
                deleteBtn.removeChild(deleteBtn.getElementsByTagName("div")[0]);
            }

            add.disabled = false;

        }else if(obj.id == "add"){

            obj.disabled = true;
            
            let title = document.getElementById("ledRow");
            let img = document.getElementById("imgRow");
            let btn = document.getElementById("btnRow");

            let enterBtn = document.createElement("input");
            let cancelBtn = document.createElement("input");
            cancelBtn.type = "button";
            cancelBtn.value = "del";
            cancelBtn.style.padding =  "1px 5px 1px 5px";
            cancelBtn.className = "btn btn-sm btn-danger";
            enterBtn.type = "button";
            enterBtn.value = "ok";
            enterBtn.style.padding =  "1px 5px 1px 5px";
            enterBtn.className = "btn btn-sm btn-primary";
            let select = document.createElement("select");
            let selectNum = document.createElement("select");
            let selectSpace = document.createElement("option");
            selectSpace.innerText = "type";
            let select1 = document.createElement("option");
            select1.innerText = "led";
            let select2 = document.createElement("option");
            select2.innerText = "sensor";
            let select3 = document.createElement("option");
            // select3.innerText = "光敏";

            select.appendChild(selectSpace);
            select.appendChild(select1);
            select.appendChild(select2);
            // select.appendChild(select3);

            select.onchange = () => {

                // if(select.options[select.selectedIndex].innerText == "温湿度"){
                //     while(selectNum.getElementsByTagName("option").length !== 0){
                //         selectNum.removeChild(selectNum.getElementsByTagName("option")[0]);
                //     }
                //     let serOption1 = document.createElement("option");
                //     serOption.innerText = "3";
                //     selectNum.appendChild(serOption1);
                //     let serOption2 = document.createElement("option");
                //     serOption.innerText = "6";
                //     selectNum.appendChild(serOption2);
                //     let serOption3 = document.createElement("option");
                //     serOption.innerText = "9";
                //     selectNum.appendChild(serOption3);
                //     let serOption4 = document.createElement("option");
                //     serOption.innerText = "12";
                //     selectNum.appendChild(serOption4);
                // }

                if(select.options[select.selectedIndex].innerText == "type"){
                    while(selectNum.getElementsByTagName("option").length !== 0){
                        selectNum.removeChild(selectNum.getElementsByTagName("option")[0]);
                    }
                } 

                if(select.options[select.selectedIndex].innerText == "sensor"){
                    while(selectNum.getElementsByTagName("option").length !== 0){
                        selectNum.removeChild(selectNum.getElementsByTagName("option")[0]);
                    }
                    let serOption1 = document.createElement("option");
                    serOption1.innerText = "1";
                    selectNum.appendChild(serOption1);
                    let serOption2 = document.createElement("option");
                    serOption2.innerText = "2";
                    selectNum.appendChild(serOption2);
                    let serOption3 = document.createElement("option");
                    serOption3.innerText = "3";
                    selectNum.appendChild(serOption3);
                    let serOption4 = document.createElement("option");
                    serOption4.innerText = "4";
                    selectNum.appendChild(serOption4);
                }
                
                
                
                if(select.options[select.selectedIndex].innerText == "led"){
                    
                    socket.emit('searchLedNum');
                    enterBtn.disabled = true;
                    cancelBtn.disabled = true;
                    
                    setTimeout(() => {
                        if(selectNum.getElementsByTagName("option").length !== 0){
                        while(selectNum.getElementsByTagName("option").length !== 0){
                            selectNum.removeChild(selectNum.getElementsByTagName("option")[0]);
                        }

                        let LedNum = 0;
                        for(var i in searchLedNum){
                            let p = 0;
                            
                            for(let j = 0; j < img.getElementsByTagName("div").length; j ++){
                                if((img.getElementsByTagName("div")[j].id).substr(0,(img.getElementsByTagName("div")[j].id).length - 1) == "ledd"){
                                    if(searchLedNum[i].number == (img.getElementsByTagName("div")[j].id).substr((img.getElementsByTagName("div")[j].id).length - 1)){
                                        p = 1;
                                    }
                                }
                            }
                            if(p == 0){
                                LedNum ++;
                                console.log(LedNum);
                                let serOption = document.createElement("option");
                                serOption.innerText = searchLedNum[i].number;
                                selectNum.appendChild(serOption);
                            }else{
                                // console.log("已经存在：" + searchLedNum[i].id);
                            }
                            
                        }

                        if(LedNum == 0){
                            alert("没有可以选择的灯！");
                            select.options[0].selected = true;
                            return;
                        }

                    }else{

                        let LedNum = 0;
                        for(var i in searchLedNum){
                            let p = 0;
                            for(let j = 0; j < img.getElementsByTagName("div").length; j ++){
                                if((img.getElementsByTagName("div")[j].id).substr(0,(img.getElementsByTagName("div")[j].id).length - 1) == "ledd"){
                                    if(searchLedNum[i].number == (img.getElementsByTagName("div")[j].id).substr((img.getElementsByTagName("div")[j].id).length - 1)){
                                        p = 1;
                                    }
                                }
                            }
                            if(p == 0){
                                LedNum ++;
                                let serOption = document.createElement("option");
                                serOption.innerText = searchLedNum[i].number;
                                selectNum.appendChild(serOption);
                            }else{
                                // console.log("已经存在：" + searchLedNum[i].id);
                            }
                            
                        }

                        if(LedNum == 0){
                            alert("没有可以选择的灯！");
                            select.options[0].selected = true;
                            enterBtn.disabled = false;
                            cancelBtn.disabled = false;
                            return;
                        }
                        
                    }

                    enterBtn.disabled = false;
                    cancelBtn.disabled = false;

                    },300);
                }


            }

            enterBtn.onclick = () => {
                if(select.options[select.selectedIndex].innerText !== "type"){

                    cancelBtn.disabled = true;

                    switch(select.options[select.selectedIndex].innerText){
                        case "led" : (() => {
                            enterBtn.disabled = true;
                            socket.emit('searchLedNum',selectNum.options[selectNum.selectedIndex].value);
                            // if(selectNum.options[selectNum.selectedIndex].innerText == undefined){
                            //     alert("没有可以选择的灯了！");
                            //     enterBtn.disabled = false;
                            //     return;
                            // }
                            // console.log(selectNum.options[selectNum.selectedIndex].value);
                            setTimeout(() => {
                                for(var i in searchLedNum){
                                if(searchLedNum[i].number == selectNum.options[selectNum.selectedIndex].innerText){
                                    console.log("已获取正确的新灯状态：" + searchLedNum[i].state);
                                    title.removeChild(addE);
                                    // img.removeChild(addImg);
                                    // btn.removeChild(addBtn);
                                    let newTitle = document.createElement("div");
                                    let newTitleSpan = document.createElement("span");
                                    let newBtnRow = document.createElement("div");
                                    let newImg = document.createElement("img");
                                    let newImgDiv = document.createElement("div");
                                    let newBtn = document.createElement("button");
                                    let newDelBtn = document.createElement("input");
                                    switch(searchLedNum[i].state){

                                        case 0 : (() => {
                                            newImg.src = "light-off.jpg";
                                            newBtn.innerText = "打开";
                                        })();break;

                                        case 1 : (() => {
                                            newImg.src = "light-on.jpg";
                                            newBtn.innerText = "关闭";
                                        })();break;

                                    }
                                    newImg.id = "led" + searchLedNum[i].number;
                                    newImg.style.borderRadius = "8px";
                                    newImgDiv.className = "col-xs-2";
                                    newImgDiv.id = "ledd" + searchLedNum[i].number;
                                    newImgDiv.appendChild(newImg);

                                    newTitle.className = "col-xs-2";

                                    newBtn.id = "sendLedBtn" + searchLedNum[i].number;
                                    newBtn.className = "btn btn-default";
                                    newDelBtn.type = "button";
                                    newDelBtn.className = "btn btn-danger"
                                    newDelBtn.value = "删除";
                                    newDelBtn.id = "deleteBtn" + searchLedNum[i].number;
                                    newBtnRow.className = "col-xs-2";
                                    newBtnRow.id = "sendBtnd" + searchLedNum[i].number;
                                    newBtnRow.appendChild(newBtn);
                                    newBtnRow.appendChild(document.createTextNode(" "));
                                    newBtnRow.appendChild(newDelBtn);

                                    newTitle.id = "title" + searchLedNum[i].number;
                                    newTitleSpan.className = "label label-info";
                                    newTitleSpan.innerText = "led灯0" + searchLedNum[i].number;
                                    newTitle.appendChild(newTitleSpan);
                                    title.appendChild(newTitle);
                                    img.appendChild(newImgDiv);
                                    btn.appendChild(newBtnRow);

                                    obj.disabled = false;

                                }
                            }
                            },500);
                            // title.removeChild(addE);
                        })();break;
                        case "sensor" : ((sensorNum) => {
                            enterBtn.disabled = true;
                            // socket.emit('searchLedNum',1,"sensor");
                            // setTimeout(() => {

                                title.removeChild(addE);
                                let newTitle = document.createElement("div");
                                let newTitleSpan = document.createElement("span");
                                let newBtnRow = document.createElement("div");
                                // let newImg = document.createElement("div");
                                let newImgDiv = document.createElement("div");
                                let newDelBtn = document.createElement("input");

                                let temValue = document.createElement("div");
                                let temSpan = document.createElement("span");
                                // temValue.innerText = ;
                                temValue.className = "alert alert-success";
                                // temValue.setAttribute("role","alert");
                                temSpan.className = "label label-success";
                                temSpan.innerText = "温度：" + "1" + "℃";
                                temValue.insertBefore(temSpan,temValue.firstChild);

                                let humValue = document.createElement("div");
                                let humSpan = document.createElement("div");
                                // humValue.innerText = ;
                                humValue.className = "alert alert-info";
                                humSpan.className = "label label-info";
                                humSpan.innerText = "湿度：" + "2" + "%";
                                humValue.insertBefore(humSpan,humValue.firstChild);

                                let lightValue = document.createElement("div");
                                let lightSpan = document.createElement("div");
                                lightValue.className = "alert alert-warning";
                                // lightValue.innerText = "3";
                                lightSpan.className = "label label-warning";
                                lightSpan.innerText = "光敏：" + "3";
                                lightValue.insertBefore(lightSpan,lightValue.firstChild);

                                newImgDiv.className = "col-xs-2";
                                newImgDiv.id = "sensor" + sensorNum;

                                newImgDiv.appendChild(temValue);
                                newImgDiv.appendChild(humValue);
                                newImgDiv.appendChild(lightValue);

                                newTitle.className = "col-xs-2";

                                newDelBtn.type = "button";
                                newDelBtn.className = "btn btn-danger"
                                newDelBtn.value = "删除";
                                newDelBtn.id = "deleteBtnSensor" + sensorNum;
                                newBtnRow.className = "col-xs-2";
                                newBtnRow.id = "sendBtndSensor" + sensorNum;
                                newBtnRow.appendChild(document.createTextNode(" "));
                                newBtnRow.appendChild(newDelBtn);

                                newTitle.id = "titleSensor" + sensorNum;
                                newTitleSpan.className = "label label-info";
                                newTitleSpan.innerText = "传感器0" + sensorNum;
                                newTitle.appendChild(newTitleSpan);
                                // newTitle.innerText = "传感器" + sensorNum;
                                title.appendChild(newTitle);
                                img.appendChild(newImgDiv);
                                btn.appendChild(newBtnRow);

                                setInterval(() => {
                                    var xhr = new XMLHttpRequest();
                                    xhr.open("GET","/sensor?sensorNum=" + sensorNum,true);
                                    xhr.onreadystatechange = () => {
                                        if(xhr.readyState == 4) {
                                            if(xhr.status == 200) {
                                                // alert(xhr.responseText);
                                                let jsonArr = JSON.parse(xhr.responseText);
                                                for(let i in jsonArr){
                                                    // console.log(i);
                                                    if(jsonArr[i].number == "1" || jsonArr[i].number == "4" || jsonArr[i].number == "7" || jsonArr[i].number == "10"){
                                                        temSpan.innerText = "温度：" + jsonArr[i].value + "℃";
                                                    }else if(jsonArr[i].number == "2" || jsonArr[i].number == "5" || jsonArr[i].number == "8" || jsonArr[i].number == "11"){
                                                        humSpan.innerText = "湿度：" + jsonArr[i].value + "%";
                                                    }else if(jsonArr[i].number == "3" || jsonArr[i].number == "6" || jsonArr[i].number == "9" || jsonArr[i].number == "12"){
                                                        lightSpan.innerText = "光敏：" + jsonArr[i].value;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    xhr.send(null);
                                },500);

                                obj.disabled = false;

                            // },200);
                        })(selectNum.options[selectNum.selectedIndex].value);break;

                    }

                }else{
                    alert("请选择类型！");
                }
            }

            cancelBtn.onclick = () => {
                title.removeChild(addE);
                obj.disabled = false;
                // img.removeChild(addImg);
                // btn.removeChild(addBtn);
            }

            let addE = document.createElement("div");
            addE.className = "col-xs-2";
            addE.appendChild(select);
            addE.appendChild(document.createTextNode(" "));
            addE.appendChild(selectNum);
            addE.appendChild(enterBtn);
            addE.appendChild(cancelBtn);
            // var addImg = document.createElement("div");
            // addImg.className = "col-xs-2";
            // var addBtn = document.createElement("div");
            // addBtn.className = "col-xs-2";
            title.appendChild(addE);
            // img.appendChild(addBtn);
            // btn.appendChild(addBtn);

        }
    }

    if(obj.value == "删除"){

        let deleteTitle = document.getElementById("ledRow");
        let deleteImg = document.getElementById("imgRow");
        let deleteBtn = document.getElementById("btnRow");

        if((obj.id).substr(0,(obj.id).length - 1) == "deleteBtnSensor"){

            var deleteId = (obj.id).substr((obj.id).length - 1);
            var deleteTitleC = document.getElementById("titleSensor" + deleteId);
            var deleteImgC = document.getElementById("sensor" + deleteId);
            var deleteBtnC = document.getElementById("sendBtndSensor" + deleteId);
            
        }else {

            var deleteId = (obj.id).substr((obj.id).length - 1);
            var deleteTitleC = document.getElementById("title" + deleteId);
            var deleteImgC = document.getElementById("ledd" + deleteId);
            var deleteBtnC = document.getElementById("sendBtnd" + deleteId);

        }

        deleteTitle.removeChild(deleteTitleC);
        deleteImg.removeChild(deleteImgC);
        deleteBtn.removeChild(deleteBtnC);

    }

}