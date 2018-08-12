$.extend({
    jpost: function(url, body) {
        return $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(body),
            contentType: "application/json",
            dataType: 'json'
        });
    }
});

M.AutoInit();

var chips = $('.chips-placeholder').chips({
    placeholder: 'Type here',
    secondaryPlaceholder: '+ Add More',
    onChipAdd: (value)=>{
        value.find("input").data("key",value.data("key"))
        updateModel.call(value.find("input"));
    }
});


const OTPModel = {
    phone: "",
    OTP: ""
}

var Info = {
    loan:{
       approved: false,
       amount: 0,
       emi: 0,
       term: "",
       nextPaymenDate: "",
       paymentLink: ""
    },
    details:{
       phone: localStorage.getItem("userId"),
       story:"",
       amount:"",
       images: []
    },
    otherInfo:{
       name:"",
       address:"",
       angels:[],
       documents: []
    }
 }

function getModel(){
   var number = localStorage.getItem("userId");
   if(number){
     $.get("/getModel/"+number).then((res)=>{
        if(res!="")
            Info = res;
        else throw "empty";
        processState();
        prefillFields();
     }).catch(()=>{
        console.error("Error loading model");
        $(".onboard-step-1").removeClass("hide");
     })
   }else{
     $(".onboard-step-1").removeClass("hide");
   }
}

function saveModel(reload = false){
    $.jpost("/saveModel",Info,"application/json").then((res)=>{
        Info = res;
        if(reload) 
            processState();
    }).catch(()=>{
        M.toast({html:"Error Saving Information"});
    })
}
function prefillFields(){
    $("*[data-key]").each((id,el)=>{
        var jelm = $(el);
        var isFile = false;
    
        if($(this).prop("files")){
            isFile = true;
        }

    var keys = jelm.data("key");

    if(keys)
        keys.split(".").reduce((obj,key) => {
            if(typeof obj[key] == "string"){
                if(!isFile){
                    if(jelm.prop("tagName")=="TEXTAREA")
                        jelm.text(obj[key]);
                    else jelm.val(obj[key]);
                }
                //else saveFile(data,obj,key);
            }else if(obj[key] instanceof Array){
                if(!isFile){
                   if(jelm.hasClass("chips")){
                    var ins = M.Chips.getInstance(chips);
                    obj[key].forEach(elm => {
                        ins.addChip({
                            tag: elm
                        });
                    });
                   }   
                }
                else{
                    //saveFile(data,obj,key);
                }
            }
            return obj[key];
        },Info);

    })
}

function processState(){
    if(Info.loan.confirmed){
        $("#offer-amount-1").text(Info.loan.amount);
        $("#offer-amount-2").text(Info.loan.amount);
        $("#received-amount").text(Info.loan.amount);
        $("#offer-emi-1").text(Info.loan.emi);
        $("#offer-emi-2").text(Info.loan.emi);
        $("#pay-amount-installment").text(Info.loan.emi);
        $("#offer-time-1").text(Info.loan.term);
        $("#offer-time-2").text(Info.loan.term);
        $("#next-payment-date").text(Info.loan.nextPaymenDate);
        $(".onboard-step-6").addClass("hide");
        $(".onboard-step-7").removeClass("hide");
        $($(".breadcrumb")[0]).remove();
        if($(".breadcrumb").length==3)
            $($(".breadcrumb")[0]).remove();
        $($(".breadcrumb")[1]).removeClass("hide");
        $($(".breadcrumb")[1]).addClass("active");
    }
    else if(Info.loan.approved){
        $("#offer-amount-1").text(Info.loan.amount);
        $("#offer-amount-2").text(Info.loan.amount);
        $("#received-amount").text(Info.loan.amount);
        $("#offer-emi-1").text(Info.loan.emi);
        $("#offer-emi-2").text(Info.loan.emi);
        $("#pay-amount-installment").text(Info.loan.emi);
        $("#offer-time-1").text(Info.loan.term);
        $("#offer-time-2").text(Info.loan.term);
        $("#next-payment-date").text(Info.loan.nextPaymenDate);
         $($(".breadcrumb")[0]).remove();
         $($(".breadcrumb")[0]).remove();
         $($(".breadcrumb")[0]).addClass("active");
         $(".onboard-step-1").addClass("hide");
         $(".onboard-step-5").removeClass("hide");
         $($(".breadcrumb")[1]).removeClass("hide");
    }
    else{
        $("#otp-verify-card").addClass("hide");
        $($(".step .breadcrumb")[0]).remove();
        $($(".step .breadcrumb")[0]).addClass("active");
        $(".onboard-step-2").removeClass("hide");
        $(".onboard-step-1").addClass("hide");
        $(".step .breadcrumb").removeClass("hide");
    }
}

function updateModel(){
    var jelm = this.find?this:$(this);
    var data = $(this).val();
    var isFile = false;
    if(!data)
      data = $(this).text();
    
    if($(this).prop("files")){
        isFile = true;
        data = $(this).prop("files")[0];
    }

    var keys = jelm.data("key");

    if(keys)
        keys.split(".").reduce((obj,key) => {
            if(typeof obj[key] == "string"){
                if(!isFile){
                    obj[key] = data;
                }
                else saveFile(data,obj,key);
            }else if(obj[key] instanceof Array){
                if(!isFile){
                    obj[key].push(data);
                }
                else{
                    saveFile(data,obj,key);
                }
            }
            return obj[key];
        },Info);
}

function saveFile(file,obj,key){
    getBase64(file).then((data) => {
        if(obj[key] instanceof Array)
            obj[key].push(data);
        else obj[key] = data;
        $(".thumbs-wrapper").append(`<img class="circle" src="${data}">`);
    });
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

$("input,textarea").on("change",(e)=>{
    updateModel.call(e.currentTarget);
})


$('input#idea-details, textarea#idea-details').characterCounter();

$("#phone").on('focus',()=>{
    $("#phone").val('+91');
});

$("#phone").on('keyup',(e)=>{
    OTPModel.phone = $("#phone").val();
    if(OTPModel.phone.length==13){
        $("#sendOTP").removeClass("disabled");
    }else{
        $("#sendOTP").addClass("disabled")
    }
});

$("#sendOTP").on("click",()=>{
    M.toast({html:`Sending OTP to ${OTPModel.phone}`});
    $.get("/api/getOTP/"+OTPModel.phone).then((res)=>{
        if(res.otp_status){        
            $("#number").text(res.phone_number);
            $("#otp-card").addClass("hide");
            $("#otp-verify-card").removeClass("hide");
        }else{
            throw "error";
        }
    }).catch(err=>M.toast({html:"Error sending OTP to "+OTPModel.phone}));
});

$("#otp").on('keypress',(e)=>{
    OTPModel.OTP+=e.key;
    if(OTPModel.OTP.length>=4){
        $("#verifyOTP").removeClass("disabled");
    }else{
        $("#verifyOTP").addClass("disabled")
    }
});

$("#verifyOTP").on("click",()=>{
    M.toast({html:`Verifying OTP Sent to ${OTPModel.phone}`});
    $.get("/api/verifyOTP/"+OTPModel.phone+"/"+OTPModel.OTP).then((res)=>{
        if(res.status){
            $("#otp-verify-card").addClass("hide");
            $($(".step .breadcrumb")[0]).remove();
            $($(".step .breadcrumb")[0]).addClass("active");
            $(".onboard-step-2").removeClass("hide");
            $(".onboard-step-1").addClass("hide");
            $(".step .breadcrumb").removeClass("hide");
            M.toast({html:`OTP Verified.`});
            localStorage.setItem("userId",OTPModel.phone);
        }else{
            throw "error";
        }
    }).catch(err=>M.toast({html:"Error verifying OTP sent to "+OTPModel.phone}));
});

$("#next").on("click",()=>{
    saveModel();
    $(".onboard-step-2").addClass("hide");
    $(".onboard-step-3").removeClass("hide");
})

$("#edit-story").on("click",()=>{
    $(".onboard-step-3").addClass("hide");
    $(".onboard-step-2").removeClass("hide");
})

$("#submit-review").on("click",()=>{
    $.jpost("/submitReview",Info,"application/json").then((res)=>{    
        M.toast({html:"Loan application submited for review, hang tight !"})
        $(".onboard-step-3").addClass("hide");
        $(".onboard-step-4").removeClass("hide");
    }).catch(()=>{
        M.toast({html:"Error submitting application"});
    });
})

$("#edit-info").on("click",()=>{
    $(".onboard-step-4").addClass("hide");
    $(".onboard-step-3").removeClass("hide");
})

$("#accept-offer-term").on("click",()=>{
    $(".onboard-step-5").addClass("hide");
    $(".onboard-step-6").removeClass("hide");
})

$("#back-to-step-5").on("click",()=>{
    $(".onboard-step-6").addClass("hide");
    $(".onboard-step-5").removeClass("hide");
})

$("#confirm-offer-term").on("click",()=>{
    makeTransaction(()=>{  
        Info.loan.confirmed = true;
        saveModel(true);
    });
});

getModel();


/*** Make Transaction */
function makeTransaction(callback){
    var react = window.open("http://localhost:3001/");  
    react.onunload = callback;
}

