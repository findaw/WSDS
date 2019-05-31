const form = document.getElementById("loginForm");
const id = document.getElementById("id");
const pw = document.getElementById("pw");
const msg = document.getElementById("loginMessage");

form.addEventListener("submit", e=>{
    e.preventDefault();
    
    const idptn = /^[a-zA-Z0-9]+$/;
    if(id.value.trim() === "" || pw.value.trim() === "") {
        msg.innerText="※ 입력되지 않은 값이 있습니다.";
        msg.className = "loginMessageOn";
        return false;
    }else if(!idptn.test(id.value)){
        console.log("실행");
        msg.innerText="※ 아이디를 다시 확인하세요.";
        msg.className = "loginMessageOn";
        return false;
    }
   
    msg.className = "loginMessageOff";
    console.log(id.value);
    console.log(pw.value);
    form.submit();
});