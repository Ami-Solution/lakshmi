M.AutoInit();

$('.chips-placeholder').chips({
    placeholder: 'Type here',
    secondaryPlaceholder: '+ Add More',
});

var data = window.location.pathname.substr(1);

if(data!=""){
    //Verify data and get loan info
    $($(".breadcrumb")[0]).remove();
    $($(".breadcrumb")[0]).remove();
    $($(".breadcrumb")[0]).addClass("active");
    $(".onboard-step-1").addClass("hide");
    $(".onboard-step-5").removeClass("hide");
    $($(".breadcrumb")[1]).removeClass("hide");

}else{
    $($(".breadcrumb")[0]).addClass("active");
}

$('input#idea-details, textarea#idea-details').characterCounter();

const OTPModel = {
    phone: "",
    OTP: ""
}
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
    $("#number").text(OTPModel.phone);
    $("#otp-card").addClass("hide");
    $("#otp-verify-card").removeClass("hide");
});

$("#otp").on('keypress',(e)=>{
    OTPModel.OTP+=e.key;
    if(OTPModel.OTP.length>4){
        $("#verifyOTP").removeClass("disabled");
    }else{
        $("#verifyOTP").addClass("disabled")
    }
});

$("#verifyOTP").on("click",()=>{
    M.toast({html:`Verifying OTP Sent to ${OTPModel.phone}`});
    setTimeout(()=>{   
        $("#otp-verify-card").addClass("hide");
        $($(".step .breadcrumb")[0]).remove();
        $($(".step .breadcrumb")[0]).addClass("active");
        $(".onboard-step-2").removeClass("hide");
        $(".onboard-step-1").addClass("hide");
        $(".step .breadcrumb").removeClass("hide");
        M.toast({html:`OTP Verified.`});
    },5000)
});

$("#next").on("click",()=>{
    $(".onboard-step-2").addClass("hide");
    $(".onboard-step-3").removeClass("hide");
})

$("#edit-story").on("click",()=>{
    $(".onboard-step-3").addClass("hide");
    $(".onboard-step-2").removeClass("hide");
})

$("#submit-review").on("click",()=>{
    M.toast({html:"Loan application submited for review, hang tight !"})
    $(".onboard-step-3").addClass("hide");
    $(".onboard-step-4").removeClass("hide");
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
    $($(".step .breadcrumb")[0]).removeClass("active");
    $($(".step .breadcrumb")[1]).addClass("active");
    $(".onboard-step-6").addClass("hide");
    $(".onboard-step-7").removeClass("hide");
})