const domainData = {
  solution: {
    title: "Solution Architecture",
    description: "從 business requirement 出發，規劃 application、data、integration、infrastructure 與 deployment 的完整解決方案，並依組織規模、成本、維護能力與實際使用情境進行技術選擇。"
  },
  analysis: {
    title: "Systems Analysis & Process Design",
    description: "透過需求訪談與實際作業流程分析，將使用者問題轉換為明確 workflow、data flow、system boundary 與操作流程，並持續透過使用者回饋修正設計。"
  },
  software: {
    title: "Software Engineering",
    description: "具備多年企業應用程式開發經驗，涵蓋 Golang、C# / .NET、REST API、SQL、Web Application、system integration 與 AI-assisted frontend engineering。"
  },
  platform: {
    title: "Cloud & Platform Engineering",
    description: "具備 Kubernetes、Helm、Hyper-V 與 AWS 實務經驗，能從基礎架構、deployment pattern、traffic routing 到 application runtime 建立一致的平台環境。"
  },
  infra: {
    title: "IT Infrastructure",
    description: "早期具備大型企業 MIS 維運經驗，熟悉 Server、Network、Windows / Linux、Virtualization 與企業 IT infrastructure，作為後續 application 與 architecture decision 的技術基礎。"
  }
};

const mapping = {
  solution: {
    golang:"supporting", csharp:"supporting", sql:"supporting", api:"primary", react:"supporting",
    sap:"primary", k8s:"primary", helm:"supporting", aws:"primary", linux:"supporting",
    hyperv:"supporting", auth:"primary", network:"supporting", ai:"primary"
  },
  analysis: {
    sql:"primary", api:"primary", sap:"primary", auth:"supporting"
  },
  software: {
    golang:"primary", csharp:"primary", sql:"primary", api:"primary", react:"primary",
    sap:"supporting", auth:"primary", git:"primary", ai:"primary", casbin:"supporting"
  },
  platform: {
    k8s:"primary", helm:"primary", aws:"primary", linux:"primary", hyperv:"primary",
    git:"supporting", network:"primary"
  },
  infra: {
    k8s:"supporting", aws:"supporting", linux:"primary", hyperv:"primary", network:"primary"
  }
};

const domainButtons = Array.from(document.querySelectorAll(".domain-card"));
const skillCards = Array.from(document.querySelectorAll(".skill-card"));
const description = document.getElementById("domain-description");
let activeDomain = null;

function clearSkillStates(){
  skillCards.forEach(card => {
    card.classList.remove("state-disabled","state-supporting","state-primary");
  });
}

function renderDomain(domain){
  domainButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.domain === domain));

  if(!domain){
    clearSkillStates();
    description.innerHTML = '<span class="domain-description-label">SELECT A DOMAIN</span><p>點擊上方卡片後，這裡會顯示該領域的說明。</p>';
  } else {
    skillCards.forEach(card => {
      card.classList.remove("state-supporting","state-primary");
      card.classList.add("state-disabled");
      const state = mapping[domain][card.dataset.skill];
      if(state){
        card.classList.remove("state-disabled");
        card.classList.add(state === "primary" ? "state-primary" : "state-supporting");
      }
    });
    const data = domainData[domain];
    description.innerHTML = '<span class="domain-description-label">' + data.title.toUpperCase() + '</span><p>' + data.description + '</p>';
  }

  description.classList.remove("animate");
  void description.offsetWidth;
  description.classList.add("animate");
}

domainButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const next = btn.dataset.domain;
    activeDomain = activeDomain === next ? null : next;
    renderDomain(activeDomain);
  });
});

document.querySelectorAll(".toggle-detail").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if(!target) return;
    const open = target.classList.toggle("open");
    const label = button.textContent.replace(/[↓↑]/g,"").trim();
    button.textContent = label + (open ? " ↑" : " ↓");
    button.setAttribute("aria-expanded", String(open));
  });
});

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if(target) setTimeout(() => target.focus?.({preventScroll:true}), 450);
  });
});