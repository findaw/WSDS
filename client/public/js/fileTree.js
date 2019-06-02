export class FileTree{
    constructor(treeRoot, dirEntry, targetName){
        this.tree = treeRoot;
        this.dirEntry = dirEntry;
        this.iframeName = targetName;
    }
    createTree = (entry)=>{
        tree.innerHTML = ""; 
        console.log(entry);
        let ulNode = this.createDirNode(tree, entry.name);
        this.scanFiles(entry.createReader(), ulNode);  
    }

    scanFiles = (reader, node)=>{
        reader.readEntries(async entries=>{
            if(!entries.length){
                console.log("length0");
            }else{
                for(let i = 0; i < entries.length; i++){
                    const path = entries[i].fullPath;
                    if(entries[i].isFile){
                        entries[i].file(file=>{
                            this.createFileNode(node, file, path);
                        }, err=>console.log(err.message));
                    }else if(entries[i].isDirectory){
                        let ulNode = this.createDirNode(node, entries[i].name);
                        this.scanFiles(entries[i].createReader(), ulNode);
                    }
                }
            }
        }, err=>console.log(err.message));
    };


    /* 노드 생성 함수 */
    createDirNode=(target, name)=>{
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

    createFileNode=(target, file, path)=>{
        let li = document.createElement("li");
        this.addFileImgNode(li, file);
        target.appendChild(li);
        this.createAnchorNode(li, file);
    }

    addFileImgNode=(target, file)=>{
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

    createAnchorNode=(target, file)=>{
        console.log(file);

        let a = document.createElement("a");
        let text = document.createTextNode(file.name);

        if(this.iframeName !== null){
            this.fileToUrl(file).then(res=>{
                a.href = res;
                a.target = this.iframeName;
            });
        }else{
            a.href = "#"+file.name;
        }
        a.appendChild(text);
        target.appendChild(a);
        
    }
    
    fileToUrl = async(file)=>{
        let type = file.type.split("/");
        let data = file;
        if(type[1] === "html"){
            //iframe에서 (HTML파일을) 코드로 출력하기 위해 string 형으로 변경
            data = await this.fileToString(file);
            data = new Blob([data]);  
        }
        return URL.createObjectURL(data);
    }

    fileToString = (file)=>{
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
}
