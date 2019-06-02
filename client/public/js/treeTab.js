export class TreeTab{
    constructor(tabWrap, deleteBtns, deleteCallback){
        this.tabWrap= tabWrap;
        this.deleteBtns = deleteBtns;
        this.deleteTab = deleteCallback;
    }
    changeOnTab = ({target}) => {
        let cnt = -1;
        let index = -1;
        this.tabWrap.childNodes.forEach(node=>{
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

    addTab = (title) =>{
        console.log(title);
        let li = document.createElement("li");
        
        const text = document.createTextNode(title);
        li.appendChild(text);
        
        if(this.deleteBtns !== null){
            let img = document.createElement("img");
            
            img.className = "tabDeleteBtn";
            img.src = "img/minus-gradient.png";
            img.onclick = this.deleteTab(img);
            
            li.appendChild(img);
            this.deleteBtns.push(img);
        }
        this.tabWrap.appendChild(li);

        return li;
    }
}
