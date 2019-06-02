import {TreeTab} from "./treeTab.js";
import {FileTree} from "./fileTree.js";


(function(){
    
const title = document.getElementById("title");
const content = document.getElementById("content");    
const dropZone = document.getElementById("fileDropZone");
const submitBtn = document.getElementById("submitBtn");
let formData = {};


const fileTree = new FileTree(
    document.getElementById("tree"), [], null
);

const treeTab = new TreeTab(
    document.getElementById("tabWrap"), 
    new Array(...document.querySelectorAll(".tabDeleteBtn")), 
    (img)=>(e)=>{
        if(!e) return;
        let index = treeTab.deleteBtns.indexOf(img);
        let root = fileTree.dirEntry[index].name;
        delete formData[root];
        fileTree.dirEntry.splice(index, 1);
        fileTree.tree.innerHTML = "";
        treeTab.deleteBtns.splice(index, 1);
        treeTab.tabWrap.removeChild(img.parentNode);
    }
);



const createFileForm = ()=>{
    const form = new FormData();
    Object.keys(formData).forEach(key=>{
        for(let pair of formData[key].entries()){
            form.append(pair[0], pair[1]);
        }
    });
    return form;
}

/* 서버전송 */
submitBtn.addEventListener("click", e=>{
    console.log(title.value);
    console.log(content.value);
    if(title.value.trim() === "" || content.value.trim() === ""){
        alert("내용을 모두 채워야합니다.");
        return false;
    }
    const form = createFileForm();
    fileTree.dirEntry.forEach(entry=>{
        form.append("entry", entry);
    });
    form.append("title", title.value);
    form.append("content", content.value);

    fetch("/readdir/file", {
        method : "POST",
        body : form,
    }).then(res=>{
        console.log(res);
    }).catch(err=>{
        console.error(err.message);
    });
});


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
        if(item.isFile){
            alert("파일을 디렉토리에 담아주세요.");
        }
        else if(item.name.indexOf(".") > 1){
            alert("디렉토리이름에 .(점) 을 넣을 수 없습니다.");
            return;
        }
        else if(item.isDirectory){
            fileTree.dirEntry.push(item);
            const li = treeTab.addTab(item.name);

            treeTab.changeOnTab({"target" : li});
            fileTree.createTree(item);
            entryToForm(item, formData);
        }
    }
}, false);

const entryToForm = (entry, form)=>{
    let dirReader = entry.createReader();
    let dirName = entry.name;
    form[dirName] = new FormData(); 

    let readEntries = async (reader)=>{
        reader.readEntries(entries=>{
            if(!entries.length){
                console.log("length0");
            }else{
                for(var i = 0; i < entries.length; i++){
                    const path = entries[i].fullPath;
                    if(entries[i].isFile){
                        entries[i].file(file=>{
                            form[dirName].append(path, file);
                        }, err=>console.error(err.message));
                        
                    }else if(entries[i].isDirectory){
                        readEntries(entries[i].createReader());
                    }
                }
            }
        }, err=>console.error(err.message));
    }
    readEntries(dirReader);
}

/** tab 관련 함수 */
treeTab.tabWrap.addEventListener("click", e=>{
    if(e.target.tagName === "IMG") return;
    const index = treeTab.changeOnTab(e);
    console.log(fileTree.dirEntry);
    console.log(index);
    fileTree.createTree(fileTree.dirEntry[index]);
});

})();