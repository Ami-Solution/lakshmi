M.AutoInit();

const OTPModel = {
    phone: ""
}
$("#phone").on('keypress',(e)=>{
    OTPModel.phone+=e.key;
    if(OTPModel.phone.length>9){
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
})
