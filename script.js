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
    sap:"supporting", auth:"primary", git:"primary", ai:"primary"
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
const descriptionWrap = document.getElementById("domain-description-wrap");
const description = document.getElementById("domain-description");
let activeDomain = null;
let activeSkill = null;

function clearDomainStates() {
  domainButtons.forEach(btn => btn.classList.remove("active","state-disabled","state-supporting","state-primary"));
}

function clearSkillStates() {
  skillCards.forEach(card => card.classList.remove("selected","state-disabled","state-supporting","state-primary"));
}

function closeDescription() {
  descriptionWrap.classList.remove("open");
}

function openDescription(domain) {
  const data = domainData[domain];
  description.innerHTML = "<p><strong>" + data.title + "</strong> — " + data.description + "</p>";
  descriptionWrap.classList.add("open");
  description.classList.remove("animate");
  void description.offsetWidth;
  description.classList.add("animate");
}

function renderDomain(domain) {
  activeSkill = null;
  clearDomainStates();
  clearSkillStates();

  if (!domain) {
    activeDomain = null;
    closeDescription();
    return;
  }

  activeDomain = domain;
  domainButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.domain === domain));
  skillCards.forEach(card => {
    const state = mapping[domain][card.dataset.skill];
    card.classList.add(state === "primary" ? "state-primary" : state === "supporting" ? "state-supporting" : "state-disabled");
  });
  openDescription(domain);
}

function renderSkill(skill) {
  activeDomain = null;
  clearDomainStates();
  clearSkillStates();
  closeDescription();

  if (!skill) {
    activeSkill = null;
    return;
  }

  activeSkill = skill;
  const selected = skillCards.find(card => card.dataset.skill === skill);
  if (selected) selected.classList.add("selected");

  domainButtons.forEach(btn => {
    const state = mapping[btn.dataset.domain][skill];
    btn.classList.add(state === "primary" ? "state-primary" : state === "supporting" ? "state-supporting" : "state-disabled");
  });
}

domainButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const next = btn.dataset.domain;
    renderDomain(activeDomain === next ? null : next);
  });
});

skillCards.forEach(card => {
  card.addEventListener("click", () => {
    const next = card.dataset.skill;
    renderSkill(activeSkill === next ? null : next);
  });
});

document.querySelectorAll(".toggle-detail").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;
    const open = target.classList.toggle("open");
    const label = button.textContent.replace(/[↓↑]/g,"").trim();
    button.textContent = label + (open ? " ↑" : " ↓");
    button.setAttribute("aria-expanded", String(open));
  });
});

const timeline = document.getElementById("career-timeline");
if (timeline) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  observer.observe(timeline);
}

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (target) setTimeout(() => target.focus?.({preventScroll:true}), 450);
  });
});

// v3 — portfolio-style reveal motion
const revealTargets = [
  ...document.querySelectorAll(".section-heading"),
  ...document.querySelectorAll(".profile-section .lead"),
  ...document.querySelectorAll(".skill-section"),
  ...document.querySelectorAll(".supporting-group"),
  ...document.querySelectorAll(".project-card"),
  ...document.querySelectorAll(".experience-card"),
  ...document.querySelectorAll(".language-list article"),
  ...document.querySelectorAll(".education-card")
];

revealTargets.forEach((el, index) => {
  el.classList.add("reveal-on-scroll");
  if (el.matches(".project-card:nth-child(even), .experience-card:nth-child(even)")) {
    el.classList.add("reveal-right");
  } else if (el.matches(".project-card, .experience-card")) {
    el.classList.add("reveal-left");
  }
  el.dataset.revealDelay = String((index % 4) + 1);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

revealTargets.forEach(el => revealObserver.observe(el));

const coreApproach = document.querySelector(".hero-principle");
if (coreApproach) {
  const coreObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });
  coreObserver.observe(coreApproach);
}
