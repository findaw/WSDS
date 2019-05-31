let dropZone = document.getElementById("fileDropZone");
let tree = document.getElementById("tree");
let pages = {};
let siteNum = 0;
let formDatas = [new FormData(),];
const submitBtn = document.getElementById("submitBtn");

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

    for(let i = 0; i < items.length; i++){
        let item = items[i].webkitGetAsEntry();
        
        if(item.isFile){
            console.log("path : " + item.fullPath);
            createFileNode(tree, items[i].getAsFile(), item.fullPath);
        }else if(item.isDirectory){
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
    let fileImage = document.createElement("img");
    let li = document.createElement("li");
    
    fileImage.src = "img/file.png";
    
    li.appendChild(fileImage);
    target.appendChild(li);
    
    createAnchorNode(li, file);

    //file.filePath = path;
    formDatas[siteNum].append(path, file);
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


let siteTab = document.querySelector("#siteTabList");

siteTab.addEventListener("click", function (e){
    siteTab.childNodes.forEach(node=>{
        if(node.tagName === "LI"){
            node.id = "";
        }
        if(node === e.target){
            node.id = "siteTabOn";
        }
    });
});

