const dropZone = document.getElementById("fileDropZone");
const tree = document.getElementById("tree");
let pages = {};
let siteNum = 0;
let formDatas = [new FormData(),];
const submitBtn = document.getElementById("submitBtn");
const tabWrap= document.getElementById("tabWrap");
const tabAddBtn = document.getElementById("tabAddBtn");
let tabDeleteBtn = new Array(...document.querySelectorAll(".tabDeleteBtn"));
let dirEntry = [];

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
            addTab(null, item.name);
            let ulNode = createDirNode(tree, item.name);
            scanFiles(item, ulNode);
        }
        
    }
    
    
}, false);

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

    //file.filePath = path;
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

function createAnchorNode(target, file){
    console.log(file);
    
    let a = document.createElement("a");
    let text = document.createTextNode(file.name);
    a.appendChild(text);
    
    let url = URL.createObjectURL(file);
    a.href = url;
    
    a.target = "page"
    target.appendChild(a);

}


tabWrap.addEventListener("click", function (e){
    tabWrap.childNodes.forEach(node=>{
        if(node.tagName === "LI"){
            node.id = "";
        }
        if(node === e.target){
            node.id = "siteTabOn";
        }
    });
});
tabAddBtn.addEventListener("click", addTab);

function addTab(e, title=""){
    console.log(title);
    let li = document.createElement("li");
    let img = document.createElement("img");

    img.className = "tabDeleteBtn";
    img.src = "img/minus-gradient.png";
    img.onclick = deleteTab;

    let text = title;
    if(text.trim() === ""){
        text = "site " + (tabWrap.childElementCount + 1);
    }
    li.innerText = text;
    li.appendChild(img);
    tabWrap.appendChild(li);

    formDatas.push(new FormData());
    tabDeleteBtn.push(img);
}
function deleteTab(e){
    console.log(this);
    let index = tabDeleteBtn.indexOf(e.target);
    formDatas.splice(index, 1);
    tabDeleteBtn.splice(index, 1);
    tabWrap.removeChild(e.target.parentNode);
}

function createTree(data){

}

