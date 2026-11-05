const domainData = {
  zh: {
    solution: { title: "Solution Architecture", description: "從 business requirement 出發，規劃 application、data、integration、infrastructure 與 deployment 的完整解決方案，並依組織規模、成本、維護能力與實際使用情境進行技術選擇。" },
    analysis: { title: "Systems Analysis & Process Design", description: "透過需求訪談與實際作業流程分析，將使用者問題轉換為明確 workflow、data flow、system boundary 與操作流程，並持續透過使用者回饋修正設計。" },
    software: { title: "Software Engineering", description: "具備多年企業應用程式開發經驗，涵蓋 Golang、C# / .NET、REST API、SQL、Web Application、system integration 與 AI-assisted frontend engineering。" },
    platform: { title: "Cloud & Platform Engineering", description: "具備 Kubernetes、Helm、Hyper-V 與 AWS 實務經驗，能從基礎架構、deployment pattern、traffic routing 到 application runtime 建立一致的平台環境。" },
    infra: { title: "IT Infrastructure", description: "早期具備大型企業 MIS 維運經驗，熟悉 Server、Network、Windows / Linux、Virtualization 與企業 IT infrastructure，作為後續 application 與 architecture decision 的技術基礎。" }
  },
  en: {
    solution: { title: "Solution Architecture", description: "Translate business requirements into complete, executable solutions across application, data, integration, infrastructure, and deployment, selecting technologies according to organizational scale, cost, maintainability, and real usage scenarios." },
    analysis: { title: "Systems Analysis & Process Design", description: "Analyze real workflows and user needs, then turn them into clear workflows, data flows, system boundaries, and operating processes, refining the design continuously through user feedback." },
    software: { title: "Software Engineering", description: "Hands-on enterprise software engineering experience across Golang, C# / .NET, REST APIs, SQL, web applications, system integration, and AI-assisted frontend engineering." },
    platform: { title: "Cloud & Platform Engineering", description: "Practical experience with Kubernetes, Helm, Hyper-V, and AWS, covering infrastructure, deployment patterns, traffic routing, and consistent application runtime environments." },
    infra: { title: "IT Infrastructure", description: "A strong enterprise IT foundation from earlier MIS work, including servers, networks, Windows / Linux, and virtualization, supporting later application and architecture decisions." }
  },
  ja: {
    solution: { title: "Solution Architecture", description: "業務要件を起点に、Application・Data・Integration・Infrastructure・Deployment を含む実行可能なソリューションへ落とし込み、組織規模・コスト・保守性・実利用に合わせて技術を選定します。" },
    analysis: { title: "Systems Analysis & Process Design", description: "利用部門へのヒアリングと実業務の分析を通じて、課題を明確な Workflow・Data Flow・System Boundary・運用プロセスへ変換し、利用者のフィードバックをもとに継続的に改善します。" },
    software: { title: "Software Engineering", description: "Golang、C# / .NET、REST API、SQL、Web Application、System Integration、AI-assisted frontend engineering を含む企業システム開発の実務経験があります。" },
    platform: { title: "Cloud & Platform Engineering", description: "Kubernetes、Helm、Hyper-V、AWS の実務経験を持ち、Infrastructure、Deployment Pattern、Traffic Routing、Application Runtime まで一貫した基盤を設計できます。" },
    infra: { title: "IT Infrastructure", description: "MIS としての経験を基盤に、Server、Network、Windows / Linux、Virtualization に精通しており、その知識を後続の Application／Architecture 設計に活かしています。" }
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
  const data = domainData[currentLang][domain];
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
    updateDetailButton(button, open);
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


const translations = {
  en: {
    "Domains":"Domains","Skills":"Skills","Projects":"Projects","Experience":"Experience","Evolution":"Evolution",
    "從 Infrastructure、Software Engineering 到 Systems Analysis，累積超過 10 年企業 IT 與系統開發經驗。":"More than 10 years of experience spanning IT Infrastructure, Software Engineering, and Systems Analysis.",
    "從 Infrastructure、Software Engineering 到 Systems Analysis，累積超過 10 年企業 IT 與系統開發經驗。 專注於將實際業務需求轉換為可落地、可維護、可持續演進的技術方案。":"More than 10 years of experience spanning IT Infrastructure, Software Engineering, and Systems Analysis. I focus on turning real business requirements into practical, maintainable, and evolvable technical solutions.",
    "專注於將實際業務需求轉換為可落地、可維護、可持續演進的技術方案。":"Focused on turning real business requirements into practical, maintainable, and evolvable technical solutions.",
    "跨越需求、應用與平台的完整系統視角":"A complete systems perspective across requirements, applications, and platforms",
    "擅長從使用者與業務需求出發，釐清真正需要解決的問題，再將需求轉換為 workflow、data model、API、 UI/UX、application architecture 與 deployment architecture。除了系統分析與架構設計，也具備實際的 軟體開發、系統整合、Cloud 與 Kubernetes 平台建置能力。":"I start from user and business needs, clarify the real problem, and translate it into workflows, data models, APIs, UI/UX, application architecture, and deployment architecture. Beyond systems analysis and architecture design, I also have hands-on experience in software development, system integration, cloud, and Kubernetes platform engineering.",
    "近年亦將 AI 納入實際工程流程：先建立 architecture、coding conventions、shared modules 與 implementation constraints，再利用 AI 協助實作並進行 code structure 與 architecture review。":"In recent years, I have also integrated AI into real engineering workflows: defining architecture, coding conventions, shared modules, and implementation constraints first, then using AI to assist implementation while continuously reviewing code structure and architecture.",
    "專業領域":"Professional Domains",
    "技術能力":"Technical Skills",
    "預設":"Default","關聯":"Supporting","主要關聯":"Primary",
    "實務中使用過、用來支援主要能力的技術與工具。":"Technologies and tools used in production to support the core capabilities above.",
    "用實際系統展示問題如何被轉換成 Solution":"Selected systems that show how real problems are transformed into solutions",
    "以 React / Next.js 建立的內部 Web System，整合使用者權限、SAP 表單申請、庫存查詢與視覺化，以及簽核流程。":"An internal web system built with React / Next.js, integrating user permissions, SAP request forms, inventory lookup and visualization, and approval workflows.",
    "負責需求分析與 solution design，自主規劃 workflow、DB schema、API、UI/UX、technology stack 與 deployment architecture。":"Owned requirement analysis and solution design, including workflow, DB schema, APIs, UI/UX, technology stack, and deployment architecture.",
    "將部分多步驟 SAP 操作簡化為一次送單後由後端自動完成；每日人工報表改為夜間自動產生並寄送。":"Simplified selected multi-step SAP operations into a single submission handled automatically by backend services; replaced manually generated daily reports with scheduled nightly delivery.",
    "將原本以數量與表格為主的庫存資訊重新設計為包含 heatmap 的視覺化介面，降低資訊判讀成本。":"Redesigned inventory information from plain quantities and tables into a visual interface with heatmaps, reducing the effort required to interpret inventory status.",
    "將製造現場的生產流程、測試資料、生產履歷與工單資訊系統化整合，並定義跨工具共用的資料介面。":"Integrated manufacturing workflows, test data, production history, and work-order information, while defining common data interfaces across heterogeneous tools.",
    "與 Software RD、Hardware RD 與產線人員溝通，分析現場 workflow，定義資料交換方式與系統流程。":"Worked with Software RD, Hardware RD, and shop-floor users to analyze actual workflows and define data exchange and system processes.",
    "定義統一 REST API，使不同部門、不同程式語言開發的測試工具能以一致方式上傳測試資料。":"Defined a unified REST API so test tools built by different teams and in different languages could upload test data consistently.",
    "建立工時統計、測試資料檢查、工單狀態、報表、生產履歷與物料使用資訊。":"Implemented work-hour statistics, test-data validation, work-order status, reporting, production history, and material-usage information.",
    "依業務展示需求建立可持續維護的多媒體平台，將內容更新流程與 application code 解耦。":"Built a maintainable multimedia platform for sales demonstrations, decoupling content updates from application code.",
    "影片排列與內容由 S3 上的 JSON 定義，新增影片時依 SOP 更新媒體與 metadata，不需要修改 application。":"Video ordering and content are defined by JSON on S3, allowing IT to add or update media and metadata through an SOP without modifying or redeploying the application.",
    "另將公司官方網站由 EC2 遷移至 Amplify，在符合既有需求的前提下降低約 60% 雲端費用。":"Also migrated the corporate website from EC2 to Amplify, reducing cloud costs by approximately 60% while preserving the required functionality.",
    "把真實旅行中的模糊需求，透過 Systems Analysis、Information Architecture、UI/UX 與 AI-assisted Engineering 轉換為實際可使用的行程 Web App。":"Turned ambiguous real-world travel needs into a usable itinerary web app through systems analysis, information architecture, UI/UX, and AI-assisted engineering.",
    "驗證能否把生活中的真實問題，透過 SA 思維整理成系統，而不是單純製作技術 Demo。":"A real-world exercise in applying systems-analysis thinking to everyday problems rather than building a technology demo for its own sake.",
    "以旅途中快速掃讀為核心，整理每日行程、交通、餐廳、景點、注意事項與低頻資訊。":"Designed for quick scanning while traveling, organizing daily itineraries, transportation, restaurants, attractions, notes, and low-frequency information.",
    "研究將長時間日文 VTuber 影片自動轉換為日文／繁中雙語字幕的 AI pipeline，重點放在可重現評估與架構取捨。":"An AI pipeline for automatically converting long-form Japanese VTuber videos into aligned Japanese / Traditional Chinese subtitles, with emphasis on reproducible evaluation and architectural trade-offs.",
    "使用 CER / WER、固定測試資料與第二支影片進行 cross-video validation，避免只對單一素材調參。":"Uses CER / WER, fixed test data, and a second video for cross-video validation to avoid over-optimizing for a single source.",
    "若額外 AI correction stage 無法證明穩定淨改善，且可能破壞原本正確字幕，優先移除而非為了架構完整度保留。":"If an additional AI correction stage cannot demonstrate a reliable net improvement and risks damaging correct subtitles, it is removed rather than retained for architectural completeness.",
    "從維運、開發、分析到完整 Solution Ownership":"From infrastructure operations and development to full solution ownership",
    "全智通機器人股份有限公司":"Aeolus Robotics",
    "從需求到 deployment，自主規劃內部 solution 的 workflow、data、API、UI/UX 與技術架構。":"Owned internal solution design from requirements through deployment, including workflow, data, APIs, UI/UX, and technical architecture.",
    "建立內部流程系統與共用 Golang services，涵蓋 SAP、權限、報表、排程與系統整合。":"Built internal workflow systems and shared Golang services covering SAP integration, authorization, reporting, scheduling, and system integration.",
    "從零建置 6-node Kubernetes application platform，統一內部應用程式的部署環境。":"Built a 6-node Kubernetes application platform from scratch to standardize internal application deployment.",
    "導入 architecture-guided AI-assisted engineering workflow，並部署 DeepWiki 進行企業 AI 應用驗證。":"Introduced an architecture-guided AI-assisted engineering workflow and deployed DeepWiki to evaluate practical enterprise AI usage.",
    "內部流程系統目前服務約 20 名使用者，涵蓋約 4–5 個部門，包含權限管理、SAP 表單、庫存視覺化與簽核流程。":"The internal workflow system serves around 20 users across 4–5 departments, covering permission management, SAP forms, inventory visualization, and approval workflows.",
    "以 Golang 建立 Casbin 權限、JWT/API 驗證、SAP / Shopfloor integration、ETL、排程報表與通知服務。":"Built Golang services for Casbin authorization, JWT/API authentication, SAP / Shopfloor integration, ETL, scheduled reports, and notifications.",
    "將部分多步 SAP 操作改為一次送單後由後端完成；人工日報改為夜間自動產生並寄送。":"Converted selected multi-step SAP processes into one-submit workflows completed by backend services; automated previously manual daily reports.",
    "將 DeepWiki 部署至 Kubernetes，透過 OpenRouter 比較 LLM 輸出並調整 prompt。":"Deployed DeepWiki to Kubernetes, compared LLM output through OpenRouter, and tuned prompts for practical usage.",
    "設計 AWS 多媒體展示平台，並將官網由 EC2 遷移至 Amplify，降低約 60% 雲端費用。":"Designed an AWS multimedia showcase platform and migrated the corporate site from EC2 to Amplify, reducing cloud costs by about 60%.",
    "在既有 Hyper-V 環境上建立一致的 application runtime，使用 Helm 管理 deployment pattern，並設計 probes 與 node replacement procedure。":"Created a consistent application runtime on the existing Hyper-V environment, using Helm for deployment patterns and defining health probes and node replacement procedures.",
    "與 Software RD、Hardware RD、產線與使用部門訪談，將實際作業需求轉換為 workflow、data specification 與 application design。":"Interviewed Software RD, Hardware RD, production, and user departments to translate real operational needs into workflows, data specifications, and application designs.",
    "持續改善 Shopfloor / MES，包含生產流程、工時統計、測試資料檢查、工單狀態與報表。":"Continuously improved Shopfloor / MES functions including production workflows, work-hour statistics, test-data validation, work-order status, and reporting.",
    "定義統一資料上傳 API 與文件，並協助海外工程師導入。":"Defined unified data-upload APIs and documentation and supported overseas engineers during integration.",
    "執行 Order System PoC，負責訂單、產能、出貨與 SKU 整合流程設計。":"Delivered an Order System PoC covering order, capacity, shipment, and SKU integration flows.",
    "自由職業者":"Freelance",
    "直接與製造業客戶訪談，從現場 workflow、UI 設計一路完成應用程式開發，建立 end-to-end delivery 經驗。":"Worked directly with a manufacturing client, from workflow interviews and UI design through independent application development and end-to-end delivery.",
    "綠界科技股份有限公司":"ECPay",
    "維護財政部電子發票 integration API、產品 SDK 與會員後台，並撰寫新專案程式架構文件。":"Maintained Ministry of Finance e-invoice integration APIs, product SDKs, and membership backend systems, and authored architecture documentation for new projects.",
    "網訊電通股份有限公司":"Telexpress",
    "由企業 MIS 工作中的自動化與工具開發，自然轉任專職 Software Engineer。":"Transitioned from enterprise MIS into a dedicated Software Engineer role through automation and internal tool development.",
    "使用 C# / .NET MVC、REST API、SQL 與 JavaScript / jQuery 開發內部及客戶系統。":"Developed internal and customer-facing systems using C# / .NET MVC, REST APIs, SQL, and JavaScript / jQuery.",
    "早期負責超過 2,000 台 PC、30+ servers 與 4 個跨國分公司的 IT 環境。":"Previously managed an IT environment with 2,000+ PCs, 30+ servers, and networks across four overseas branches.",
    "從零規劃員工權限紀錄系統，並與既有權限申請流程整合。":"Designed an employee permission-record system from scratch and integrated it with the existing permission-request workflow.",
    "參與外部活動網站與媽媽教室平台，負責前後端流程、付款狀態控制與每日訂單對帳。":"Worked on external event and maternity-class platforms, covering front- and back-end flows, payment state handling, and daily order reconciliation.",
    "以非同步讀取與單頁式操作改善既有客服系統效能與 UX。":"Improved performance and UX of an existing customer-service system through asynchronous loading and single-page interactions.",
    "維運 2,000+ 使用者 PC、30+ servers 與 4 個跨國分公司的企業網路。":"Maintained 2,000+ user PCs, 30+ servers, and enterprise networks across four overseas branches.",
    "以 Batch、Bash 與自行開發的 C# WinForms 工具改善維運，並以 SignalR 建立端點與管理端雙向溝通。":"Improved operations with Batch, Bash, and a custom C# WinForms tool, using SignalR for bidirectional communication between endpoints and the management side.",
    "能力不是切換，而是一路累積":"Each stage builds on the one before it",
    "母語":"Native",
    "可閱讀技術文件，並進行工作與技術溝通 · 歷史 TOEIC 720":"Technical documentation and workplace communication · Historical TOEIC 720",
    "基礎日常對話與閱讀，可理解部分日文操作文件":"Basic everyday conversation and reading; able to understand some Japanese operational documentation",
    "元智大學 Yuan Ze University":"Yuan Ze University",
    "Bachelor of Science in Computer Science / 資訊工程學士":"Bachelor of Science in Computer Science",
    "我的核心能力並不是單一程式語言或特定平台，而是能理解一個問題在 Business Process、Application、 Data、Integration 與 Infrastructure 各層面的需求與限制，並選擇適合組織規模、成本與維護方式的技術方案。":"My core strength is not a single programming language or platform, but the ability to understand a problem across Business Process, Application, Data, Integration, and Infrastructure layers and choose a solution appropriate to the organization's scale, cost, and maintenance model.",
    "過去的 IT Infrastructure 經驗讓我理解系統運作的基礎，Software Engineering 經驗讓我能親自實現設計， Systems Analysis 經驗讓我能將使用者需求轉換為清楚流程，而目前的工作則將這些能力整合成完整的 Solution Architecture。":"My IT Infrastructure background gives me a strong understanding of how systems operate, Software Engineering enables me to implement designs directly, and Systems Analysis helps me translate user needs into clear processes. Today, I integrate these capabilities into end-to-end Solution Architecture.",
    "回到頁首":"Back to top","主要導覽":"Main navigation",
    "全智通機器人股份有限公司":"Aeolus Robotics",
    "綠界科技股份有限公司":"ECPay",
    "網訊電通股份有限公司":"Telexpress",
    "自由職業者":"Freelance",
    "View Details":"View Details","Research Details":"Research Details","View Demo ↗":"View Demo ↗","Demo on Request":"Demo on Request","此 Demo 因存取控制與獨立運行環境需求，平時不對外常駐開放；可於需要時提供展示。":"This demo is kept offline by default due to access-control requirements and dedicated hosting resources. Available for demonstration on request.","Back to top ↑":"Back to top ↑",
    "Language":"Language","Education":"Education"
  },
  ja: {
    "Domains":"領域","Skills":"スキル","Projects":"プロジェクト","Experience":"経歴","Evolution":"キャリア",
    "CORE APPROACH":"コア・アプローチ",
    "Requirement":"要件",
    "Architecture":"アーキテクチャ",
    "Implementation":"実装",
    "Production":"本番運用",
    "從 Infrastructure、Software Engineering 到 Systems Analysis，累積超過 10 年企業 IT 與系統開發經驗。":"IT Infrastructure、Software Engineering、Systems Analysis を横断する10年以上の企業IT・システム開発経験があります。",
    "從 Infrastructure、Software Engineering 到 Systems Analysis，累積超過 10 年企業 IT 與系統開發經驗。 專注於將實際業務需求轉換為可落地、可維護、可持續演進的技術方案。":"IT Infrastructure、Software Engineering、Systems Analysis を横断する10年以上の企業IT・システム開発経験があります。実際の業務要件を、実装可能で保守しやすく、継続的に発展できる技術ソリューションへ変換することを得意としています。",
    "專注於將實際業務需求轉換為可落地、可維護、可持續演進的技術方案。":"実際の業務要件を、実装可能で保守しやすく、継続的に発展できる技術ソリューションへ変換することを得意としています。",
    "跨越需求、應用與平台的完整系統視角":"要件・アプリケーション・プラットフォームを横断するシステム視点",
    "擅長從使用者與業務需求出發，釐清真正需要解決的問題，再將需求轉換為 workflow、data model、API、 UI/UX、application architecture 與 deployment architecture。除了系統分析與架構設計，也具備實際的 軟體開發、系統整合、Cloud 與 Kubernetes 平台建置能力。":"ユーザーと業務の要件から本当に解決すべき課題を整理し、Workflow、Data Model、API、UI/UX、Application Architecture、Deployment Architecture へ落とし込みます。システム分析・設計だけでなく、ソフトウェア開発、システム連携、Cloud、Kubernetes 基盤構築まで実務で対応できます。",
    "近年亦將 AI 納入實際工程流程：先建立 architecture、coding conventions、shared modules 與 implementation constraints，再利用 AI 協助實作並進行 code structure 與 architecture review。":"近年は AI も実際の開発プロセスに導入しています。Architecture、Coding Conventions、Shared Modules、Implementation Constraints を先に定義し、AI に実装を支援させながら Code Structure と Architecture を継続的にレビューしています。",
    "專業領域":"専門領域","技術能力":"技術スキル","預設":"通常","關聯":"関連","主要關聯":"主要",
    "實務中使用過、用來支援主要能力的技術與工具。":"主要スキルを支えるため、実務で使用してきた技術・ツールです。",
    "用實際系統展示問題如何被轉換成 Solution":"実際の課題を Solution に変換した代表プロジェクト",
    "以 React / Next.js 建立的內部 Web System，整合使用者權限、SAP 表單申請、庫存查詢與視覺化，以及簽核流程。":"React / Next.js で構築した社内 Web System。ユーザー権限、SAP 申請フォーム、在庫照会・可視化、承認フローを統合しています。",
    "負責需求分析與 solution design，自主規劃 workflow、DB schema、API、UI/UX、technology stack 與 deployment architecture。":"要件分析と Solution Design を担当し、Workflow、DB Schema、API、UI/UX、Technology Stack、Deployment Architecture を自ら設計しました。",
    "將部分多步驟 SAP 操作簡化為一次送單後由後端自動完成；每日人工報表改為夜間自動產生並寄送。":"複数手順だった一部の SAP 操作を1回の申請で Backend が自動処理する形に簡素化し、手作業の日報を夜間自動生成・配信へ変更しました。",
    "將原本以數量與表格為主的庫存資訊重新設計為包含 heatmap 的視覺化介面，降低資訊判讀成本。":"数量と表中心だった在庫情報を Heatmap を含む可視化UIへ再設計し、状況把握の負荷を下げました。",
    "將製造現場的生產流程、測試資料、生產履歷與工單資訊系統化整合，並定義跨工具共用的資料介面。":"製造現場の生産フロー、テストデータ、生産履歴、作業指示情報を統合し、複数ツールで共通利用できるデータインターフェースを定義しました。",
    "與 Software RD、Hardware RD 與產線人員溝通，分析現場 workflow，定義資料交換方式與系統流程。":"Software RD、Hardware RD、現場担当者と連携し、実際の Workflow を分析してデータ交換方式とシステムフローを定義しました。",
    "定義統一 REST API，使不同部門、不同程式語言開發的測試工具能以一致方式上傳測試資料。":"統一 REST API を定義し、異なる部門・言語で作られたテストツールから同じ方式でデータをアップロードできるようにしました。",
    "建立工時統計、測試資料檢查、工單狀態、報表、生產履歷與物料使用資訊。":"工数集計、テストデータ確認、作業指示ステータス、レポート、生産履歴、部材使用情報を実装しました。",
    "依業務展示需求建立可持續維護的多媒體平台，將內容更新流程與 application code 解耦。":"営業デモの要件に合わせて保守しやすいマルチメディア基盤を構築し、コンテンツ更新を Application Code から分離しました。",
    "影片排列與內容由 S3 上的 JSON 定義，新增影片時依 SOP 更新媒體與 metadata，不需要修改 application。":"動画の並びと内容を S3 上の JSON で定義し、SOP に沿って Media と Metadata を更新するだけで追加できるようにし、Application の変更や再デプロイを不要にしました。",
    "另將公司官方網站由 EC2 遷移至 Amplify，在符合既有需求的前提下降低約 60% 雲端費用。":"また、会社公式サイトを EC2 から Amplify へ移行し、既存要件を維持したままクラウドコストを約60%削減しました。",
    "把真實旅行中的模糊需求，透過 Systems Analysis、Information Architecture、UI/UX 與 AI-assisted Engineering 轉換為實際可使用的行程 Web App。":"実際の旅行で生じる曖昧な要望を、Systems Analysis、Information Architecture、UI/UX、AI-assisted Engineering を通して実用的な旅程 Web App に落とし込みました。",
    "驗證能否把生活中的真實問題，透過 SA 思維整理成系統，而不是單純製作技術 Demo。":"単なる技術 Demo ではなく、日常の実問題を SA の考え方でシステム化できるかを検証したプロジェクトです。",
    "以旅途中快速掃讀為核心，整理每日行程、交通、餐廳、景點、注意事項與低頻資訊。":"旅行中に素早く確認できることを重視し、日別予定、交通、飲食店、観光地、注意事項、低頻度情報を整理しました。",
    "研究將長時間日文 VTuber 影片自動轉換為日文／繁中雙語字幕的 AI pipeline，重點放在可重現評估與架構取捨。":"長時間の日本語 VTuber 動画を日本語／繁体字中国語の二言語字幕へ自動変換する AI Pipeline。再現可能な評価と Architecture Trade-off を重視しています。",
    "使用 CER / WER、固定測試資料與第二支影片進行 cross-video validation，避免只對單一素材調參。":"CER / WER、固定テストデータ、2本目の動画を用いた Cross-video Validation により、単一素材への過学習を避けています。",
    "若額外 AI correction stage 無法證明穩定淨改善，且可能破壞原本正確字幕，優先移除而非為了架構完整度保留。":"追加の AI Correction Stage が安定した純改善を示せず、正しい字幕を壊す可能性がある場合は、構成を複雑に保つためではなく削除を優先します。",
    "從維運、開發、分析到完整 Solution Ownership":"運用・開発・分析から Solution Ownership まで",
    "全智通機器人股份有限公司":"Aeolus Robotics",
    "從需求到 deployment，自主規劃內部 solution 的 workflow、data、API、UI/UX 與技術架構。":"要件から Deployment まで、社内 Solution の Workflow、Data、API、UI/UX、技術 Architecture を主体的に設計しています。",
    "建立內部流程系統與共用 Golang services，涵蓋 SAP、權限、報表、排程與系統整合。":"SAP、権限、レポート、スケジュール、System Integration を含む社内 Workflow System と共通 Golang Services を構築しました。",
    "從零建置 6-node Kubernetes application platform，統一內部應用程式的部署環境。":"6-node Kubernetes Application Platform をゼロから構築し、社内アプリケーションの Deployment 環境を統一しました。",
    "導入 architecture-guided AI-assisted engineering workflow，並部署 DeepWiki 進行企業 AI 應用驗證。":"Architecture-guided AI-assisted Engineering Workflow を導入し、DeepWiki をデプロイして企業内 AI 活用を検証しました。",
    "內部流程系統目前服務約 20 名使用者，涵蓋約 4–5 個部門，包含權限管理、SAP 表單、庫存視覺化與簽核流程。":"社内 Workflow System は約20名、4〜5部門で利用され、権限管理、SAP Form、在庫可視化、承認フローを提供しています。",
    "以 Golang 建立 Casbin 權限、JWT/API 驗證、SAP / Shopfloor integration、ETL、排程報表與通知服務。":"Golang で Casbin 権限、JWT/API 認証、SAP / Shopfloor Integration、ETL、定期レポート、通知 Service を構築しました。",
    "將部分多步 SAP 操作改為一次送單後由後端完成；人工日報改為夜間自動產生並寄送。":"複数手順の SAP 操作を1回の申請後に Backend が完了する形へ変更し、手作業の日報を夜間自動生成・送信へ移行しました。",
    "將 DeepWiki 部署至 Kubernetes，透過 OpenRouter 比較 LLM 輸出並調整 prompt。":"DeepWiki を Kubernetes にデプロイし、OpenRouter で複数 LLM の出力を比較しながら Prompt を調整しました。",
    "設計 AWS 多媒體展示平台，並將官網由 EC2 遷移至 Amplify，降低約 60% 雲端費用。":"AWS マルチメディア展示基盤を設計し、公式サイトを EC2 から Amplify へ移行してクラウド費用を約60%削減しました。",
    "在既有 Hyper-V 環境上建立一致的 application runtime，使用 Helm 管理 deployment pattern，並設計 probes 與 node replacement procedure。":"既存 Hyper-V 環境上に一貫した Application Runtime を構築し、Helm で Deployment Pattern を管理、Health Probe と Node Replacement Procedure を設計しました。",
    "與 Software RD、Hardware RD、產線與使用部門訪談，將實際作業需求轉換為 workflow、data specification 與 application design。":"Software RD、Hardware RD、製造現場、利用部門へのヒアリングを行い、実業務要件を Workflow、Data Specification、Application Design に変換しました。",
    "持續改善 Shopfloor / MES，包含生產流程、工時統計、測試資料檢查、工單狀態與報表。":"Shopfloor / MES を継続改善し、生産フロー、工数集計、テストデータ確認、作業指示ステータス、レポートを実装しました。",
    "定義統一資料上傳 API 與文件，並協助海外工程師導入。":"統一 Data Upload API とドキュメントを定義し、海外エンジニアの導入を支援しました。",
    "執行 Order System PoC，負責訂單、產能、出貨與 SKU 整合流程設計。":"Order System PoC を実施し、注文・生産能力・出荷・SKU の統合フロー設計を担当しました。",
    "自由職業者":"フリーランス",
    "直接與製造業客戶訪談，從現場 workflow、UI 設計一路完成應用程式開發，建立 end-to-end delivery 經驗。":"製造業顧客へ直接ヒアリングを行い、現場 Workflow、UI 設計からアプリケーション開発まで End-to-end で担当しました。",
    "綠界科技股份有限公司":"ECPay",
    "維護財政部電子發票 integration API、產品 SDK 與會員後台，並撰寫新專案程式架構文件。":"財政部電子インボイス Integration API、製品 SDK、会員 Backend を保守し、新規プロジェクトの Architecture Document を作成しました。",
    "網訊電通股份有限公司":"Telexpress",
    "由企業 MIS 工作中的自動化與工具開發，自然轉任專職 Software Engineer。":"企業 MIS 業務での自動化・ツール開発をきっかけに、専任 Software Engineer へ移行しました。",
    "使用 C# / .NET MVC、REST API、SQL 與 JavaScript / jQuery 開發內部及客戶系統。":"C# / .NET MVC、REST API、SQL、JavaScript / jQuery を用いて社内・顧客向けシステムを開発しました。",
    "早期負責超過 2,000 台 PC、30+ servers 與 4 個跨國分公司的 IT 環境。":"初期には2,000台超のPC、30台超のServer、海外4拠点のネットワークを含むIT環境を担当しました。",
    "從零規劃員工權限紀錄系統，並與既有權限申請流程整合。":"従業員権限記録システムをゼロから設計し、既存の権限申請フローと統合しました。",
    "參與外部活動網站與媽媽教室平台，負責前後端流程、付款狀態控制與每日訂單對帳。":"外部イベントサイトやマタニティクラス向けプラットフォームに携わり、Frontend / Backend Flow、決済状態管理、日次注文照合を担当しました。",
    "以非同步讀取與單頁式操作改善既有客服系統效能與 UX。":"非同期読み込みと Single-page 操作により、既存カスタマーサービスシステムの性能と UX を改善しました。",
    "維運 2,000+ 使用者 PC、30+ servers 與 4 個跨國分公司的企業網路。":"2,000台超のユーザーPC、30台超のServer、海外4拠点の企業ネットワークを運用しました。",
    "以 Batch、Bash 與自行開發的 C# WinForms 工具改善維運，並以 SignalR 建立端點與管理端雙向溝通。":"Batch、Bash、自作 C# WinForms ツールで運用を改善し、SignalR で Endpoint と管理側の双方向通信を構築しました。",
    "能力不是切換，而是一路累積":"役割を変えるのではなく、経験を積み重ねてきたキャリア",
    "母語":"母語",
    "可閱讀技術文件，並進行工作與技術溝通 · 歷史 TOEIC 720":"技術文書の読解、業務・技術コミュニケーション · 過去の TOEIC 720",
    "基礎日常對話與閱讀，可理解部分日文操作文件":"基礎的な日常会話・読解。日本語の一部操作資料を理解可能",
    "元智大學 Yuan Ze University":"元智大学 Yuan Ze University",
    "Bachelor of Science in Computer Science / 資訊工程學士":"コンピュータサイエンス学士 / 情報工学",
    "我的核心能力並不是單一程式語言或特定平台，而是能理解一個問題在 Business Process、Application、 Data、Integration 與 Infrastructure 各層面的需求與限制，並選擇適合組織規模、成本與維護方式的技術方案。":"私の強みは特定の言語やプラットフォームではなく、Business Process、Application、Data、Integration、Infrastructure の各層で課題と制約を理解し、組織規模・コスト・保守方法に合った技術ソリューションを選択できることです。",
    "過去的 IT Infrastructure 經驗讓我理解系統運作的基礎，Software Engineering 經驗讓我能親自實現設計， Systems Analysis 經驗讓我能將使用者需求轉換為清楚流程，而目前的工作則將這些能力整合成完整的 Solution Architecture。":"IT Infrastructure の経験でシステム運用の基礎を理解し、Software Engineering の経験で設計を自ら実装でき、Systems Analysis の経験でユーザー要件を明確なプロセスへ変換できます。現在はこれらを統合し、Solution Architecture として活かしています。",
    "PROFESSIONAL PROJECT":"業務プロジェクト",
    "PERSONAL PROJECT":"個人プロジェクト",
    "PERSONAL R&D · IN PROGRESS":"個人R&D · 開発中",
    "Role & Ownership":"役割・責任範囲",
    "Representative Impact":"主な成果",
    "UX Decision":"UX上の判断",
    "Collaboration":"連携",
    "Integration":"システム連携",
    "Operations":"運用機能",
    "Architecture":"アーキテクチャ",
    "Key Decision":"主要な設計判断",
    "Cloud Optimization":"クラウド最適化",
    "Purpose":"目的",
    "Design Focus":"設計方針",
    "Process":"プロセス",
    "Pipeline":"パイプライン",
    "Evaluation":"評価",
    "Engineering Principle":"設計原則",
    "Role evolution since 2024.10 · Solution Architecture":"2024.10以降の役割拡張 · Solution Architecture",
    "Career transition · Infrastructure → Software":"キャリア転換 · Infrastructure → Software",
    "ARCHITECTURE HIGHLIGHT":"アーキテクチャ・ハイライト",
    "Control Plane":"Control Plane",
    "Worker Node":"Worker Node",
    "Freelance Software Engineer":"フリーランス Software Engineer",
    "MIS Engineer → Software Engineer":"MIS Engineer → Software Engineer",
    "Manufacturing & Enterprise Systems":"製造・企業システム",
    "Internal Systems · Platform · AI":"社内システム · Platform · AI",
    "PROFESSIONAL SUMMARY":"PROFESSIONAL SUMMARY",
    "View Details":"詳細を見る","Research Details":"研究詳細","View Demo ↗":"Demoを見る ↗","Demo on Request":"デモはお問い合わせください","此 Demo 因存取控制與獨立運行環境需求，平時不對外常駐開放；可於需要時提供展示。":"アクセス管理および専用実行環境の都合により、デモ環境は通常非公開としています。必要に応じてデモをご案内できます。","Back to top ↑":"トップへ ↑",
    "Language":"言語","Education":"学歴","回到頁首":"トップへ","主要導覽":"メインナビゲーション"
  }
};

let currentLang = "zh";
const textNodeKeys = new WeakMap();

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function rememberTranslatableTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style")) return NodeFilter.FILTER_REJECT;
      const key = normalizeText(node.nodeValue || "");
      if (!key) return NodeFilter.FILTER_REJECT;
      textNodeKeys.set(node, key);
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  while (walker.nextNode()) {}
}

function translateTextNodes(lang) {
  document.body.classList.add("language-updating");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const key = textNodeKeys.get(node);
    if (!key) continue;
    const value = lang === "zh" ? key : (translations[lang]?.[key] ?? key);
    node.nodeValue = value;
  }
  requestAnimationFrame(() => document.body.classList.remove("language-updating"));
}

function updateDetailButton(button, open) {
  const target = button.dataset.target || "";
  const research = target === "project-vtuber";
  const labels = {
    zh: research ? "Research Details" : "View Details",
    en: research ? "Research Details" : "View Details",
    ja: research ? "研究詳細" : "詳細を見る"
  };
  button.textContent = labels[currentLang] + (open ? " ↑" : " ↓");
}

function applyLanguage(lang, persist = true) {
  currentLang = ["zh","en","ja"].includes(lang) ? lang : "zh";
  document.documentElement.classList.add("lang-changing");
  document.documentElement.lang = currentLang === "zh" ? "zh-Hant" : currentLang;
  translateTextNodes(currentLang);

  document.querySelectorAll(".lang-button").forEach(button => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll(".toggle-detail").forEach(button => {
    const target = document.getElementById(button.dataset.target);
    updateDetailButton(button, !!target?.classList.contains("open"));
  });

  if (activeDomain) openDescription(activeDomain);

  const titles = {
    zh: "Cliff Lin — Solution Architect",
    en: "Cliff Lin — Solution Architect",
    ja: "Cliff Lin — Solution Architect"
  };
  const descriptions = {
    zh: "Cliff Lin — Solution Architect。Internal Systems、Software Engineering、Cloud & Platform。",
    en: "Cliff Lin — Solution Architect focused on Internal Systems, Software Engineering, Cloud & Platform.",
    ja: "Cliff Lin — Internal Systems、Software Engineering、Cloud & Platform を横断する Solution Architect。"
  };
  document.title = titles[currentLang];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = descriptions[currentLang];

  if (persist) localStorage.setItem("resume-language", currentLang);
  setTimeout(() => document.documentElement.classList.remove("lang-changing"), 120);
}

rememberTranslatableTextNodes();

document.querySelectorAll(".lang-button").forEach(button => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

const savedLanguage = localStorage.getItem("resume-language");
applyLanguage(savedLanguage || "zh", false);


// v6 — scroll-responsive header brand
const headerBrand = document.querySelector(".brand");
if (headerBrand) {
  const BRAND_MAX = 85;
  const BRAND_MIN = 50;
  const OFFSET_MAX = 15;
  const SCROLL_START = 16;
  const SCROLL_END = 180;
  let brandFrame = 0;

  const updateHeaderBrand = () => {
    brandFrame = 0;
    const progress = Math.min(
      1,
      Math.max(0, (window.scrollY - SCROLL_START) / (SCROLL_END - SCROLL_START))
    );
    const size = BRAND_MAX - (BRAND_MAX - BRAND_MIN) * progress;
    const offset = OFFSET_MAX * (1 - progress);

    headerBrand.style.setProperty("--brand-size", `${size.toFixed(2)}px`);
    headerBrand.style.setProperty("--brand-offset", `${offset.toFixed(2)}px`);
  };

  const requestBrandUpdate = () => {
    if (brandFrame) return;
    brandFrame = window.requestAnimationFrame(updateHeaderBrand);
  };

  updateHeaderBrand();
  window.addEventListener("scroll", requestBrandUpdate, { passive: true });
}
