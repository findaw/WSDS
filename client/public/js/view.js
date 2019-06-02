import {TreeTab} from "./treeTab.js";
import {FileTree} from "./fileTree.js";


(function(){
    console.log("entry");
    console.log(entry);
    console.log(new Blob(entry, rootName));
    
const fileTree = new FileTree(
    document.getElementById("tree"), [], "page"
);

const treeTab = new TreeTab(
    document.getElementById("tabWrap"), null,null
);

/** tab 관련 함수 */
treeTab.tabWrap.addEventListener("click", e=>{
    if(e.target.tagName === "IMG") return;
    const index = treeTab.changeOnTab(e);
    console.log(fileTree.dirEntry);
    console.log(index);
    fileTree.createTree(fileTree.dirEntry[index]);
});

})();