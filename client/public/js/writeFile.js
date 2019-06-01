const dropZone = document.getElementById("fileDropZone");
const tree = document.getElementById("tree");
let pages = {};
let siteNum = 0;
let formDatas = [];
const submitBtn = document.getElementById("submitBtn");
const tabWrap= document.getElementById("tabWrap");
const tabAddBtn = document.getElementById("tabAddBtn");
let tabDeleteBtn = new Array(...document.querySelectorAll(".tabDeleteBtn"));
let dirEntry = [];
const code = document.getElementById("code");

/* 서버전송 */
submitBtn.addEventListener("click", e=>{
    const forms = new FormData();
    formDatas.forEach(form=>{
        for(pair of form.entries()){
            console.log(pair[1]);
            forms.append(pair[0], pair[1]);
        }
    });
    
    fetch("/readdir/file", {
        method : "POST",
        body : forms,
    }).then(res=>{
        console.log(res);
    }).catch(err=>{
        console.error(err.message);
    });
});

/** 트리 관련 함수 */
/* 노드 생성 함수 */
function createDirNode(target, name){
    let li = document.createElement("li");
    let ul = document.createElement("ul");
    let details = document.createElement("details");
    details.open = "open";
    let summary = document.createElement("summary");
    let text = document.createTextNode(name);
    let dirImage = document.createElement("img");
    dirImage.src = "img/directory.png";
    
    summary.appendChild(dirImage);
    summary.appendChild(text);
    details.appendChild(summary);
    details.appendChild(ul);
    li.appendChild(details);
    target.appendChild(li);

    return ul;
}

function createFileNode(target, file, path){
    let li = document.createElement("li");
    addFileImgNode(li, file);
    target.appendChild(li);
    createAnchorNode(li, file);
    formDatas[siteNum].append(path, file);
}

function addFileImgNode(target, file){
    let fileImage = document.createElement("img");
    let type = file.type.split("/");
    switch(type[type.length-1]){
        case 'html':  case 'css': case 'json':  case 'javascript':  case 'png': case 'jpg': case 'gif':
            fileImage.src = "img/" + type[type.length-1] + ".png";
            break;
        default:
            fileImage.src = "img/file.png"
    }
    target.appendChild(fileImage);
}

function fileToString(file){
    return new Promise((resolve, reject) =>{
        const reader = new FileReader();
        reader.onload = function(e){
            let data = e.target.result;
            resolve(data);
        }
        reader.onerror = reject;

        reader.readAsText(file, "utf-8");
    });
}

async function createAnchorNode(target, file){
    console.log(file);

    let a = document.createElement("a");
    let text = document.createTextNode(file.name);
    let type = file.type.split("/");
    let data = file;


    if(type[1] === "html"){
        //iframe에서 (HTML파일을) 코드로 출력하기 위해 string 형으로 변경
        data = await fileToString(file);
        data = new Blob([data]);  
    }
    let url = URL.createObjectURL(data);
    a.href = url;
    a.target = "page"
    a.appendChild(text);
    target.appendChild(a);
}

/** 디렉토리 트리 관련 함수 */
function createTree(entry){
    tree.innerHTML = ""; 
    console.log(entry);
    let ulNode = createDirNode(tree, entry.name);
    scanFiles(entry, ulNode);  
}

/* FileSystemEntry 스캔 함수 */
function scanFiles(dir, node){
    let dirReader = dir.createReader();
    
    let readEntries = async (reader, node)=>{
        reader.readEntries(entries=>{
            if(!entries.length){
                console.log("length0");
            }else{
                for(var i = 0; i < entries.length; i++){
                    const path = entries[i].fullPath;

                    if(entries[i].isFile){
                        entries[i].file(file=>{
                            createFileNode(node, file, path);
                        }, err=>console.error(err.message));
                        
                    }else if(entries[i].isDirectory){
                        let ulNode = createDirNode(node, entries[i].name);
                        readEntries(entries[i].createReader(), ulNode);
                    }
                }
            }
        }, err=>console.error(err.message));
    }

    readEntries(dirReader, node);
};


dropZone.addEventListener("dragover", function(e){
    e.preventDefault();     //prevent browser handling
    e.stopPropagation();
    dropZone.style.backgroundColor = "cornflowerblue";
}, false);

dropZone.addEventListener("dragleave", function(e){
    e.preventDefault();     //prevent browser handling
    e.stopPropagation();
    dropZone.style.backgroundColor = "white";
}, false);

dropZone.addEventListener("drop", function(e){
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.backgroundColor = "white";
    
    let items = e.dataTransfer.items;

    if(items.length > 1){
        alert("루트디렉토리로 파일을 모아주세요.");
        return;
    }else{
        let item = items[0].webkitGetAsEntry();

        if(item.name.indexOf(".") > 1){
            alert("디렉토리이름에 .(점) 을 넣을 수 없습니다.");
            return;
        }
        else if(item.isDirectory){
            dirEntry.push(item);
            const li = addTab(null, item.name);
            changeOnTab({"target" : li});
            createTree(item);
        }
    }
}, false);



/** tab 관련 함수 */
tabWrap.addEventListener("click", e=>{
    if(e.target.tagName === "IMG") return;
    const index = changeOnTab(e);
    console.log(dirEntry);
    console.log(index);
    createTree(dirEntry[index]);
});

function changeOnTab({target}){
    let cnt = -1;
    let index = -1;
    tabWrap.childNodes.forEach(node=>{
        if(node.tagName === "LI"){
            cnt++;
            node.id = "";
        }
        if(node === target){
            index = cnt;
            node.id = "siteTabOn";
        }
    });
    return index;
}

function addTab(e, title=""){
    console.log(title);
    let li = document.createElement("li");
    let img = document.createElement("img");

    img.className = "tabDeleteBtn";
    img.src = "img/minus-gradient.png";
    img.onclick = deleteTab(img);

    let text = title;
    if(text.trim() === ""){
        text = "site " + (tabWrap.childElementCount + 1);
    }
    li.innerText = text;
    li.appendChild(img);
    tabWrap.appendChild(li);

    formDatas.push(new FormData());
    tabDeleteBtn.push(img);
    return li;
}

const deleteTab = img => (e)=>{
    if(!e)return;
    let index = tabDeleteBtn.indexOf(img);
    formDatas.splice(index, 1);
    dirEntry.splice(index, 1);
    tabDeleteBtn.splice(index, 1);
    tabWrap.removeChild(img.parentNode);
    tree.innerHTML = "";
}

tabAddBtn.addEventListener("click", addTab);