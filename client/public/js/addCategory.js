const form = document.getElementById("categoryForm");
const title = document.getElementById("title");
const summary = document.getElementById("summary");
const content = document.getElementById("content");

form.addEventListener("submit", e=>{
    e.preventDefault();

    console.log(title.value);
    console.log(summary.value);
    if(title.value.trim() === "" || summary.value.trim() === "" || content.value.trim() === ""){
        alert("내용을 모두 채워야합니다.");
        return false;
    }
    
    form.submit();
});