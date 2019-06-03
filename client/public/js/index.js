

(function (){
    const cardTarget = document.getElementById("cardTarget");
    const category = [
        {
            "title" : "XSS",
            "summary" : "악성코드를 기입하는 공격입니다.",
            "tag" : "xss",
            "state" : "active",
        },
        {
            "title" : "SQL Injection",
            "summary" : "SQL 언어를 이용해 DB에 허가되지 않은 조작을 합니다.",
            "tag" : "sql-injection",
            "state" : "active",
        },
        {
            "title" : "Fishing",
            "summary" : "사용자에게 악의적인 공격을 할 수 있는 사이트로 유도합니다.",
            "tag" : "fishing",
            "state" : "active",
        },
        {
            "title" : "DoS/DDoS",
            "summary" : "서버의 자원을 낭비시키는 공격입니다.",
            "tag" : "dos",
            "state" : "inactive",
        },
        {
            "title" : "CSRF",
            "summary" : "의도되지 않은 사이트로 교차 요청을 보내는 공격입니다.",
            "tag" : "csrf",
            "state" : "inactive",
        },
        {
            "title" : "HTML5 취약점",
            "summary" : "HTML5 에서 발생할 수 있는 공격입니다.",
            "tag" : "html5",
            "state" : "active",
        },
    ];
    /**
        <div class="card">
            <a href="/tag">
                <h2>title</h2>
                <section class="content">
                    summary
                </section>
                <section class="image">
                    <img src="img/rnd/2.png" />
                </section>
                <div></div>
            </a>
        </div>
     */
    const createCategoryCard = (target, item) =>{
        const card = document.createElement("div");
        const block = document.createElement("div");
        card.className = "card " + item.state;
        const a = createAnchorNode(item.tag);
        const title = createTitleNode(item.title);
        const summary = createContentNode(item.summary);
        const img = createImgNode("img/rnd/" + (Math.floor(Math.random() * 5) + 1) + ".png");
        a.appendChild(title);
        a.appendChild(summary);
        a.appendChild(img);
        a.appendChild(block);
        card.appendChild(a);
        target.appendChild(card);
    }
    const createAnchorNode =(url)=>{
        const a = document.createElement("a");
        a.href = "/category/" + url;
        return a
    }
    const createTitleNode = (title)=>{
        let node; 

        if(title.length > 16){
            node = document.createElement("h5");
        }
        else if(title.length > 7){
            node = document.createElement("h3");
        }else{
            node = document.createElement("h2");
        }
        node.innerText = title;
        node.className = "categoryTitle";
        return node;
    }
    const createContentNode = (content)=>{
        const section = document.createElement("section");
        section.className = "content";
        section.innerText = content;
        return section;
    }
    const createImgNode = (src)=>{
        const section = document.createElement("section");
        section.className = "image";
        const img = document.createElement("img");
        img.src = src;
        section.appendChild(img);
        return section;
    }
    
    let target;
    for(let i = 0; i < category.length; i++){
        if(i%3 === 0){
            wrapper = document.createElement("div");
            wrapper.className = "cardWrapper";
            cardTarget.appendChild(wrapper);
        }
        createCategoryCard(wrapper, category[i]);
    }
})();


