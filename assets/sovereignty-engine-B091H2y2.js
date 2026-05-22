import{_ as e,c as t,d as n,f as r,g as i,h as a,l as o,m as s,p as c,s as l,t as u,u as d,v as f}from"./spa-engine-external-BwN7bktj.js";import{a as p,i as m,n as h,r as g,t as _}from"./spa-questionnaire-host-C80vS3TS.js";var v,y,b,x,S,C,w,T,E,D=class{constructor(e={}){u(this,e),this.currentSection=0,this.currentQuestionIndex=0,this.iqBracket=null,this.iqBracketSecondary=null,this.answers={},this.questionSequence=[],this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0,layer2:0,layer3:0,layer4:0,layer5:0},this.preliminaryFilters={aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.reportComplete=!1,this.analysisData={timestamp:new Date().toISOString(),iqBracket:null,section1Results:{},section2Results:{},section3Results:{},section4Results:{},cognitiveBand:null,subclasses:[],attachmentMode:null,vulnerabilityRisks:[],sovereigntyScore:0,sovereignSplitPosition:null,allAnswers:{},questionSequence:[]},this.dataStore=new a(`sovereignty-assessment`),this.ui=h(this,{idle:{show:[`#introSection`,`#actionButtonsSection`],hide:[`#questionnaireSection`,`#resultsContainer`]},assessment:{show:[`#questionnaireSection`],hide:[`#introSection`,`#actionButtonsSection`,`#resultsContainer`]},results:{show:[`#resultsContainer`],hide:[`#introSection`,`#actionButtonsSection`,`#questionnaireSection`]}}),this.ready=this.init()}init(){try{return this.externalUI||this.attachEventListeners(),Promise.resolve(this.loadStoredData()).then(()=>{if(!this.externalUI&&this.shouldAutoGenerateSample())return this.generateSampleReport();g(this)})}catch(e){i.logError(e,`SovereigntyEngine.init`),i.showUserError(`Failed to initialize assessment. Please refresh the page.`)}}getQuestionContainer(){return this.externalUI?this._externalQuestionMount:document.getElementById(`questionContainer`)}mountExternalShell(e){e&&(e.innerHTML=`
      <section id="questionnaireSection">
        <div id="questionContainer"></div>
        <button type="button" id="prevQuestion">Previous</button>
        <button type="button" id="nextQuestion">Next</button>
        <button type="button" id="startAssessment" class="btn btn-primary">Begin assessment</button>
      </section>
      <section id="resultsContainer" class="hidden"><div id="resultsContent"></div></section>`,this._externalQuestionMount=e.querySelector(`#questionContainer`),this.attachEventListeners())}async renderResults(e){return this.displayResults(e)}async ensureDataLoaded(){if(!(v&&S))try{let e=await f(`./sovereignty-data/cognitive-bands.js`,`Cognitive Bands`);v=e.COGNITIVE_BANDS,y=e.SUBCLASSES,b=e.SOVEREIGN_SPLIT_POSITIONS;let t=await f(`./sovereignty-data/sovereignty-questions.js`,`Sovereignty Questions`);S=t.SECTION_1_USAGE_PATTERNS,C=t.SECTION_2_COGNITIVE_STYLE,w=t.SECTION_3_ATTACHMENT,T=t.SECTION_4_SOVEREIGNTY,E=t.SECTION_5_RESILIENCE,x=(await f(`./sovereignty-data/sovereignty-layers.js`,`Sovereignty Layers`)).SOVEREIGNTY_LAYERS}catch(e){throw i.logError(e,`SovereigntyEngine.ensureDataLoaded`),i.showUserError(`Failed to load assessment data. Please refresh the page.`),e}}attachEventListeners(){let e=document.getElementById(`startAssessment`);e&&e.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.startAssessment()});let n=document.getElementById(`nextQuestion`);n&&n.addEventListener(`click`,()=>this.nextQuestion());let r=document.getElementById(`prevQuestion`);r&&r.addEventListener(`click`,()=>this.prevQuestion());let i=document.getElementById(`newAssessment`);i&&i.addEventListener(`click`,()=>this.resetAssessment());let a=document.getElementById(`exportReportHtml`);a&&a.addEventListener(`click`,()=>this.exportReportHtml());let o=document.getElementById(`exportExecutiveBrief`);o&&o.addEventListener(`click`,()=>this.exportExecutiveBrief());let s=document.getElementById(`generateSampleReport`);s&&s.addEventListener(`click`,()=>this.generateSampleReport());let c=document.getElementById(`abandonAssessment`);c&&c.addEventListener(`click`,async()=>{await t(`Are you sure you want to abandon this assessment? All progress will be lost.`)&&this.resetAssessment()})}shouldAutoGenerateSample(){let e=new URLSearchParams(window.location.search);if(!e.has(`sample`))return!1;let t=e.get(`sample`);return t===null||t===``||t===`1`||t===`true`}getEmptyAnalysisData(){return{timestamp:new Date().toISOString(),iqBracket:null,section1Results:{},section2Results:{},section3Results:{},section4Results:{},section5Results:{},layerScores:{},cognitiveBand:null,subclasses:[],attachmentMode:null,vulnerabilityRisks:[],sovereigntyScore:0,sovereignSplitPosition:null,allAnswers:{},questionSequence:[]}}pickRandomIndices(e,t){let n=Array.from({length:e},(e,t)=>t);for(let e=n.length-1;e>0;--e){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,t)}answerQuestionForSample(e){if(e){if(e.type===`frequency_grid`){let t=e.contexts||[],n=(e.scale||[]).length||5;t.forEach((t,r)=>{let i=Math.floor(Math.random()*n);this.processFrequencyGridAnswer(e,r,i)});return}if(e.type===`multiple_response`){let t=Array.isArray(e.options)?e.options.length:0;if(t===0)return;let n=Math.min(t,Math.max(1,Math.ceil(Math.random()*3))),r=this.pickRandomIndices(t,n);this.processAnswer(e,r);return}if(e.type===`likert`){let t=e.scale||5,n=Math.floor(Math.random()*t)+1;this.processAnswer(e,n);return}if(e.options&&Array.isArray(e.options)&&e.options.length>0){let t=Math.floor(Math.random()*e.options.length);this.processAnswer(e,t)}}}async generateSampleReport(){try{await this.ensureDataLoaded(),this.dataStore.clear(`progress`),this.currentSection=1,this.currentQuestionIndex=0,this.iqBracket=this.iqBracket||`unknown`,this.iqBracketSecondary=null,this.answers={},this.questionSequence=[],this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0},this.preliminaryFilters={aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.analysisData=this.getEmptyAnalysisData(),this.analysisData.iqBracket=this.iqBracket,await this.buildSectionSequence(1),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection1Results(),this.updatePreliminaryFilters(null,null),this.currentSection=2,await this.buildSectionSequence(2),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection2Results(),this.updatePreliminaryFilters(null,null),this.currentSection=3,await this.buildSectionSequence(3),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection3Results(),this.currentSection=4,await this.buildSectionSequence(4),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection4Results(),this.currentSection=5,await this.buildSectionSequence(5),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection5Results(),this.finalizeResults()}catch(e){i.logError(e,`SovereigntyEngine.generateSampleReport`),i.showUserError(`Failed to generate sample report. Please try again.`)}}startAssessment(){try{this.reportComplete=!1,this.currentSection=0,this.currentQuestionIndex=0,this.answers={},this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0},this.showQuestionContainer(),this.showIQBracketSelection(),this.saveProgress();let e=this.getQuestionContainer();e&&s.focusElement(e)}catch(e){i.logError(e,`SovereigntyEngine.startAssessment`),i.showUserError(`Failed to start assessment. Please try again.`)}}showIQBracketSelection(){let t=this.getQuestionContainer();t&&(e.safeInnerHTML(t,`
      <div class="question-card iq-selection-card">
        <h2>Select Your IQ Bracket (Optional)</h2>
        <p>
          Providing your IQ helps us prioritize relevant questions and accelerate the assessment. 
          If you don't know your IQ, you can skip this step. Estimate based on standardized tests (SAT, ACT, WAIS, etc.) or educational/career patterns.
        </p>
        
        <!-- IQ Input Option -->
        <div class="iq-input-container">
          <label for="iqInput">
            Enter Your IQ (Auto-detects bracket):
          </label>
          <div class="iq-input-group">
            <input type="number" id="iqInput" min="70" max="200" step="1" 
                   placeholder="e.g., 98, 117, 125">
            <button id="submitIQ" class="btn btn-primary">
              Submit
            </button>
          </div>
          <div id="iqBracketDisplay" class="iq-bracket-display hidden">
            <p id="iqBracketText"></p>
          </div>
        </div>
        
        <p class="iq-or-text">
          <strong>Note:</strong> IQ brackets have crossover at boundaries (±5 points). The system automatically detects border positions and includes patterns from adjacent brackets.
        </p>
        
        <div class="hidden">
          <button id="selectIQ80_100" class="iq-btn">
            <strong>80-100 IQ</strong> - Routine Guided Thinkers (~34% of population)
          </button>
          <button id="selectIQ80_100_border" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 100-115</strong> (e.g., IQ 95-105)
          </button>
          <button id="selectIQ100_115" class="iq-btn">
            <strong>100-115 IQ</strong> - Practical Adaptive Thinkers (~34% of population)
          </button>
          <button id="selectIQ100_115_border_low" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 80-100</strong> (e.g., IQ 98-102)
          </button>
          <button id="selectIQ100_115_border_high" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 115-130</strong> (e.g., IQ 113-117)
          </button>
          <button id="selectIQ115_130" class="iq-btn">
            <strong>115-130 IQ</strong> - Strategic Analytical Thinkers (~14% of population)
          </button>
          <button id="selectIQ115_130_border_low" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 100-115</strong> (e.g., IQ 113-117)
          </button>
          <button id="selectIQ115_130_border_high" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 130-145</strong> (e.g., IQ 128-132)
          </button>
          <button id="selectIQ130_145" class="iq-btn">
            <strong>130-145 IQ</strong> - Creative Synthesizing Thinkers (~2% of population)
          </button>
          <button id="selectIQ130_145_border_low" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 115-130</strong> (e.g., IQ 128-132)
          </button>
          <button id="selectIQ130_145_border_high" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 145+</strong> (e.g., IQ 143-147)
          </button>
          <button id="selectIQ145_plus" class="iq-btn">
            <strong>145+ IQ</strong> - Meta-Recursive Thinkers (&lt;1% of population)
          </button>
          <button id="selectIQ145_plus_border" class="iq-btn iq-btn-border">
            ↳ <strong>On border with 130-145</strong> (e.g., IQ 143-147)
          </button>
          <button id="selectIQUnknown" class="iq-btn iq-btn-unknown">
            <strong>I don't know / Prefer not to specify</strong> - Full assessment will be provided
          </button>
        </div>
      </div>
    `),setTimeout(()=>{let e=document.getElementById(`iqInput`),t=document.getElementById(`submitIQ`),n=document.getElementById(`iqBracketDisplay`),r=document.getElementById(`iqBracketText`),i=()=>{let t=parseInt(e.value);if(isNaN(t)||t<70||t>200){l(`Please enter a valid IQ between 70 and 200.`);return}let i=this.determineIQBrackets(t);this.iqBracket=i.primary,this.iqBracketSecondary=i.secondary,this.analysisData.iqBracket=i.primary,this.analysisData.iqBracketSecondary=i.secondary;let a=`Detected: ${this.getBracketName(i.primary)}`;i.secondary&&(a+=` (with crossover from ${this.getBracketName(i.secondary)})`),r.textContent=a,n.classList.remove(`hidden`),setTimeout(async()=>{this.currentSection=1,await this.buildSectionSequence(1),this.renderCurrentQuestion(),this.updateNavigation(),this.saveProgress()},1e3)};t&&t.addEventListener(`click`,i),e&&e.addEventListener(`keypress`,e=>{e.key===`Enter`&&i()})},100))}determineIQBrackets(e){let t=null,n=null;return e<80?t=`80_100`:e>=80&&e<100?(t=`80_100`,e>=95&&e<100&&(n=`100_115`)):e>=100&&e<115?(t=`100_115`,e>=100&&e<=102?n=`80_100`:e>=113&&e<115&&(n=`115_130`)):e>=115&&e<130?(t=`115_130`,e>=115&&e<=117?n=`100_115`:e>=128&&e<130&&(n=`130_145`)):e>=130&&e<145?(t=`130_145`,e>=130&&e<=132?n=`115_130`:e>=143&&e<145&&(n=`145_plus`)):e>=145&&(t=`145_plus`,e>=145&&e<=147&&(n=`130_145`)),{primary:t,secondary:n}}getBracketName(e){return{"80_100":`80-100 IQ (Routine Guided Thinkers)`,"100_115":`100-115 IQ (Practical Adaptive Thinkers)`,"115_130":`115-130 IQ (Strategic Analytical Thinkers)`,"130_145":`130-145 IQ (Creative Synthesizing Thinkers)`,"145_plus":`145+ IQ (Meta-Recursive Thinkers)`}[e]||e}async buildSectionSequence(e){await this.ensureDataLoaded();let t=[];switch(e){case 1:t=[...S||[]],t=this.filterSection1Questions(t);break;case 2:t=[...C||[]],t=this.filterSection2Questions(t);break;case 3:t=[...w||[]],t=this.filterSection3Questions(t);break;case 4:t=[...T||[]],t=this.filterSection4Questions(t);break;case 5:t=[...E||[]];break}this.questionSequence=t,this.questionSequence.sort(()=>Math.random()-.5)}filterSection1Questions(e){if(this.iqBracket===`unknown`||!this.iqBracket){let t=this.answers.u2;if(t){let n=S[1]?.options?.[t.selectedIndex];if(n&&(n.text.includes(`Never`)||n.text.includes(`Rarely`)))return this.preliminaryFilters.aiUsageFrequency=`rarely`,this.filterByUsageFrequency(e,12)}return e}return this.filterQuestionsByIQ(e,12)}filterSection2Questions(e){return this.iqBracket===`unknown`||!this.iqBracket?e:this.filterQuestionsByIQ(e,10,`cognitive`)}filterSection3Questions(e){if(this.iqBracket===`unknown`||!this.iqBracket)return(this.scores.dependency||0)<-3?e.slice(0,6):e;let t=6;return(this.scores.dependency||0)<-3&&(t=5),this.filterQuestionsByIQ(e,t,`attachment`)}filterSection4Questions(e){if(this.iqBracket===`unknown`||!this.iqBracket)return(this.scores.dependency||0)<-3?e.slice(0,7):e;let t=8,n=this.scores.dependency||0;return this.scores.cognitiveComplexity,n<-3&&(t=7),(this.iqBracket===`80_100`||this.iqBracket===`100_115`)&&(t=7),this.filterQuestionsByIQ(e,t,`sovereignty`)}filterByUsageFrequency(e,t){let n=[`u1`,`u2`,`u3`,`u6`,`u10`,`u11`,`u12`,`u13`],r=[`u4`,`u5`,`u7`,`u8`,`u9`,`u14`,`u15`],i=e.filter(e=>n.includes(e.id)),a=e.filter(e=>r.includes(e.id)),o=[...i],s=t-o.length;return s>0&&a.length>0&&o.push(...a.slice(0,s)),o.slice(0,t)}filterQuestionsByIQ(e,t,n=`general`){if(this.iqBracket===`unknown`||!this.iqBracket)return e.slice(0,t);let r=e.map(e=>{let t=1,r=this.calculateIQRelevance(e,this.iqBracket,n),i=0;return this.iqBracketSecondary&&(i=this.calculateIQRelevance(e,this.iqBracketSecondary,n)*.5),t=r+i,{question:e,score:t}});return r.sort((e,t)=>t.score===e.score?Math.random()-.5:t.score-e.score),r.slice(0,t).map(e=>e.question)}calculateIQRelevance(e,t,n){let r=1,i=(e.question||``).toLowerCase(),a=[`meta`,`recursive`,`framework`,`abstract`,`paradox`,`contradiction`].some(e=>i.includes(e)),o=[`simple`,`clear`,`routine`,`familiar`].some(e=>i.includes(e)),s=!1,c=!1;return e.options&&e.options.forEach(e=>{let t=(e.text||``).toLowerCase();(e.cognitiveLevel===`high`||e.cognitiveLevel===`very_high`||t.includes(`meta`)||t.includes(`recursive`)||t.includes(`framework`))&&(s=!0),(e.cognitiveLevel===`low`||e.cognitiveLevel===`medium`||t.includes(`simple`)||t.includes(`clear`)||t.includes(`routine`))&&(c=!0)}),t===`80_100`||t===`100_115`?((o||c)&&(r+=3),(a||s)&&--r):t===`115_130`?((a||s)&&(r+=2),(o||c)&&(r+=1)):(t===`130_145`||t===`145_plus`)&&((a||s)&&(r+=3),(o||c)&&--r),n===`cognitive`&&(a||s)&&(r+=2),n===`attachment`&&t!==`80_100`&&(r+=1),n===`sovereignty`&&(t===`130_145`||t===`145_plus`)&&(r+=2),r}renderCurrentQuestion(){if(this.questionSequence.length===0){this.finalizeResults();return}let t=this.questionSequence[this.currentQuestionIndex],n=this.getQuestionContainer();if(!n)return;let r=``;this.currentQuestionIndex===0&&(r+=this.getSectionExplanation(this.currentSection));let i=this.answers[t.id]!==void 0;if(t.type===`frequency_grid`&&i){let e=t.contexts||[],n=this.answers[t.id],r=n&&n.values?n.values:{};i=e.every((e,t)=>r[t]!==void 0)}let a=i;t.type===`multiple_choice`?r+=this.renderMultipleChoice(t,a):t.type===`likert`?r+=this.renderLikert(t,a):t.type===`multiple_response`?r+=this.renderMultipleResponse(t,a):t.type===`frequency`?r+=this.renderFrequency(t,a):t.type===`frequency_grid`?r+=this.renderFrequencyGrid(t,a):t.type===`scenario`?r+=this.renderScenario(t,a):r+=`<div class="question-card sov-error-card">
        <h3 class="sov-error-title">Error: Unknown question type "${t.type}"</h3>
        <p class="sov-error-text">Question ID: ${t.id}</p>
        <p class="sov-error-text">${e.sanitizeHTML(t.question||`No question text available`)}</p>
      </div>`,e.safeInnerHTML(n,r),this.updateNavigation(),setTimeout(()=>n.scrollIntoView({behavior:`smooth`,block:`start`}),100)}getSectionExplanation(e){let t={1:{title:`Section 1: AI Usage Patterns (Layer 6 — AI Fluency)`,description:`We'll explore your daily patterns, use cases, and emotional triggers for AI usage.`,purpose:`This section helps identify whether you treat AI as a tractor (multiplies labor) or an oracle (replaces thinking).`},2:{title:`Section 2: Cognitive Style (Layer 1 — Cognitive Sovereignty)`,description:`We'll examine your thinking patterns, problem-solving approaches, and abstraction capacity.`,purpose:`This section assesses your capacity for formal reasoning, manipulation detection, and independent judgment under uncertainty.`},3:{title:`Section 3: Attachment & Identity (Layer 7 — Identity Integrity)`,description:`We'll explore your relationship with AI tools—how you perceive and interact with them.`,purpose:`This section identifies your attachment mode and susceptibility to digital hive pressure.`},4:{title:`Section 4: Sovereignty Indicators`,description:`We'll assess your independence practices, critical thinking habits, and resistance capacity.`,purpose:`This section measures your sovereignty capacity and identifies areas of strength or vulnerability.`},5:{title:`Section 5: Resilience Layers (Economic, Material, Embodied, Social)`,description:`We'll assess your capacity across four additional sovereignty layers: economic independence, material competence, embodied strength, and social architecture.`,purpose:`This section identifies your resilience in a post-job world—income optionality, supply chain literacy, physical capability, and micro-community capacity.`}}[e];return`
      <div class="phase-explanation">
        <h3>${t.title}</h3>
        <p>${t.description}</p>
        <p class="phase-explanation-note">${t.purpose}</p>
      </div>
    `}renderMultipleChoice(t,n){let r=this.answers[t.id],i=t.options.map((i,a)=>{let o=r&&r.selectedIndex===a;return`
        <label class="option-label ${o?`selected`:``} ${n?`locked`:``}">
          <input class="option-input" type="radio" name="question_${t.id}" value="${a}" ${o?`checked`:``} ${n?`disabled`:``}>
          <span class="option-text">${e.sanitizeHTML(i.text||``)}</span>
          ${o?`<span class="selected-check">✓</span>`:``}
        </label>
      `}).join(``);n||setTimeout(()=>{document.querySelectorAll(`input[name="question_${t.id}"]:not([disabled])`).forEach(e=>{e.addEventListener(`change`,e=>{let n=parseInt(e.target.value);this.processAnswer(t,n),document.querySelectorAll(`label.option-label`).forEach(e=>{e.classList.remove(`selected`)});let r=e.target.closest(`label`);r&&r.classList.add(`selected`)})}),document.querySelectorAll(`label.option-label:not(.locked)`).forEach(e=>{e.addEventListener(`click`,t=>{let n=e.querySelector(`input[type="radio"]`);n&&!n.disabled&&t.target.tagName!==`INPUT`&&(n.checked=!0,n.dispatchEvent(new Event(`change`,{bubbles:!0})))})})},100);let a=n?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${e.sanitizeHTML(t.question||``)}</h3>
        <div class="options-container">
          ${i}
        </div>
        ${a}
      </div>
    `}renderLikert(t,n){let r=this.answers[t.id],i=t.scale||5,a=t.labels||[`Strongly Disagree`,`Disagree`,`Neutral`,`Agree`,`Strongly Agree`],o=``;for(let s=1;s<=i;s++){let i=r&&r.value===s;o+=`
        <label class="likert-option ${i?`selected`:``} ${n?`locked`:``}">
          <input type="radio" name="question_${t.id}" value="${s}" ${i?`checked`:``} ${n?`disabled`:``}>
          <span>${s}</span>
          <div class="likert-label">${e.sanitizeHTML(a[s-1]||``)}</div>
        </label>
      `}n||setTimeout(()=>{document.querySelectorAll(`input[name="question_${t.id}"]:not([disabled])`).forEach(e=>{e.addEventListener(`change`,e=>{let n=parseInt(e.target.value);this.processAnswer(t,n),document.querySelectorAll(`label.likert-option`).forEach(e=>{e.classList.remove(`selected`)});let r=e.target.closest(`label`);r&&r.classList.add(`selected`)})}),document.querySelectorAll(`label.likert-option:not(.locked)`).forEach(e=>{e.addEventListener(`click`,t=>{let n=e.querySelector(`input`);n&&!n.disabled&&(n.checked=!0,n.dispatchEvent(new Event(`change`,{bubbles:!0})))})})},100);let s=n?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${e.sanitizeHTML(t.question||``)}</h3>
        <div class="likert-scale">
          ${o}
        </div>
        ${s}
      </div>
    `}renderMultipleResponse(t,n){let r=this.answers[t.id],i=r?Array.isArray(r.selectedIndices)?r.selectedIndices:[r.selectedIndex]:[],a=t.options.map((r,a)=>{let o=i.includes(a);return`
        <label class="option-label ${o?`selected`:``} ${n?`locked`:``}">
          <input class="option-input" type="checkbox" name="question_${t.id}" value="${a}" ${o?`checked`:``} ${n?`disabled`:``}>
          <span class="option-text">${e.sanitizeHTML(r.text||``)}</span>
          ${o?`<span class="selected-check">✓</span>`:``}
        </label>
      `}).join(``);n||setTimeout(()=>{let e=document.querySelectorAll(`input[name="question_${t.id}"]:not([disabled])`);e.forEach(n=>{n.addEventListener(`change`,()=>{let n=Array.from(e).filter(e=>e.checked).map(e=>parseInt(e.value));this.processAnswer(t,n),document.querySelectorAll(`label.option-label`).forEach(e=>{let t=e.querySelector(`input`);t&&t.checked?e.classList.add(`selected`):e.classList.remove(`selected`)})})})},100);let o=n?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${e.sanitizeHTML(t.question||``)}</h3>
        <p class="question-helper">Select all that apply:</p>
        <div class="options-container">
          ${a}
        </div>
        ${o}
      </div>
    `}renderFrequency(e,t){return this.renderMultipleChoice(e,t)}renderFrequencyGrid(t,n){let r=this.answers[t.id],i=t.contexts||[],a=t.scale||[`Never`,`Rarely`,`Sometimes`,`Often`,`Always`],o=r&&r.values||{},s=`<div class="frequency-grid"><table class="frequency-grid-table">`;s+=`<thead><tr><th class="frequency-grid-header frequency-grid-context">Context</th>`,a.forEach((t,n)=>{s+=`<th class="frequency-grid-header">${e.sanitizeHTML(t||``)}</th>`}),s+=`</tr></thead><tbody>`,i.forEach((r,i)=>{let c=o[i]===void 0?null:o[i],l=n&&c!==null;s+=`<tr class="frequency-grid-row">`,s+=`<td class="frequency-grid-cell frequency-grid-context-cell">${e.sanitizeHTML(r||``)}</td>`,a.forEach((e,n)=>{let r=c===n;s+=`<td class="frequency-grid-cell frequency-grid-option-cell">
          <label class="frequency-grid-option ${r?`selected`:``} ${l?`locked`:``}">
            <input type="radio" name="question_${t.id}_context_${i}" value="${n}" ${r?`checked`:``} ${l?`disabled`:``}>
            <span>${n+1}</span>
          </label>
        </td>`}),s+=`</tr>`}),s+=`</tbody></table></div>`,n||setTimeout(()=>{i.forEach((e,n)=>{document.querySelectorAll(`input[name="question_${t.id}_context_${n}"]:not([disabled])`).forEach(e=>{e.addEventListener(`change`,e=>{let r=parseInt(e.target.value);this.processFrequencyGridAnswer(t,n,r);let i=e.target.closest(`tr`);if(i){i.querySelectorAll(`label.frequency-grid-option`).forEach(e=>{e.classList.remove(`selected`)});let t=e.target.closest(`label`);t&&t.classList.add(`selected`)}})}),document.querySelectorAll(`label.frequency-grid-option:not(.locked)`).forEach(e=>{let r=e.querySelector(`input`);r&&r.name.includes(`question_${t.id}_context_${n}`)&&e.addEventListener(`click`,e=>{r&&!r.disabled&&e.target.tagName!==`INPUT`&&(r.checked=!0,r.dispatchEvent(new Event(`change`,{bubbles:!0})))})})})},100);let c=n?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${e.sanitizeHTML(t.question||``)}</h3>
        <p class="question-helper">Select a frequency for each context:</p>
        ${s}
        ${c}
      </div>
    `}renderScenario(e,t){return this.renderMultipleChoice(e,t)}processFrequencyGridAnswer(e,t,n){let r=this.answers[e.id],i=r&&r.values?{...r.values}:{},a=i[t];i[t]=n,this.answers[e.id]={questionId:e.id,values:i,timestamp:new Date().toISOString()};let o=(e.scale||[]).length;if(a!==void 0){let e=a/(o-1)*3;this.scores.dependency-=e,this.scores.sovereignty+=e*.5}let s=n/(o-1)*3;this.scores.dependency+=s,this.scores.sovereignty-=s*.5,this.saveProgress()}processAnswer(e,t){let n=Array.isArray(t)?t:[t];if(this.answers[e.id]={questionId:e.id,value:t,selectedIndex:Array.isArray(t)?t[0]:t,selectedIndices:Array.isArray(t)?t:[t],timestamp:new Date().toISOString()},this.updatePreliminaryFilters(e,t),e.type===`likert`){let n=Array.isArray(t)?t[0]:t;if(e.scores&&e.scores[n]){let t=e.scores[n];Object.keys(t).forEach(e=>{this.scores[e]!==void 0&&(this.scores[e]+=t[e]||0),e===`cognitiveLevel`&&(this.scores.cognitiveComplexity+=t[e]||0)})}}else n.map(t=>e.options&&e.options[t]).filter(e=>e).forEach(e=>{e.scores&&Object.keys(e.scores).forEach(t=>{if(this.scores[t]!==void 0&&(this.scores[t]+=e.scores[t]||0),t===`cognitiveLevel`){let n=e.scores[t];if(typeof n==`number`)this.scores.cognitiveComplexity+=n;else if(typeof n==`string`){let e={low:0,medium:1,high:2,very_high:3};this.scores.cognitiveComplexity+=e[n]??0}}})});this.saveProgress()}updatePreliminaryFilters(e,t){if(!(!e||!e.id)){if(e.id===`u2`&&e.options){let n=Array.isArray(t)?t[0]:t,r=e.options[n];if(r){let e=r.text.toLowerCase();e.includes(`never`)?this.preliminaryFilters.aiUsageFrequency=`never`:e.includes(`rarely`)?this.preliminaryFilters.aiUsageFrequency=`rarely`:e.includes(`daily`)?this.preliminaryFilters.aiUsageFrequency=`daily`:(e.includes(`multiple times`)||e.includes(`constantly`))&&(this.preliminaryFilters.aiUsageFrequency=`frequent`)}}this.currentSection===1&&this.scores.dependency!==void 0&&(this.scores.dependency<-3?this.preliminaryFilters.dependencyLevel=`low`:this.scores.dependency>10?this.preliminaryFilters.dependencyLevel=`high`:this.preliminaryFilters.dependencyLevel=`medium`),this.currentSection===2&&this.scores.cognitiveComplexity!==void 0&&(this.scores.cognitiveComplexity<5?this.preliminaryFilters.cognitiveLevel=`low`:this.scores.cognitiveComplexity>15?this.preliminaryFilters.cognitiveLevel=`high`:this.preliminaryFilters.cognitiveLevel=`medium`)}}nextQuestion(){try{let e=this.questionSequence[this.currentQuestionIndex];if(e&&!this.answers[e.id]&&e.type!==`multiple_response`)if(e.type===`frequency_grid`){let t=e.contexts||[],n=this.answers[e.id],r=n&&n.values?n.values:{};if(!t.every((e,t)=>r[t]!==void 0)){i.showUserError(`Please select a frequency for all contexts before proceeding.`);return}}else{i.showUserError(`Please select an answer before proceeding.`);return}if(this.currentQuestionIndex<this.questionSequence.length-1){this.currentQuestionIndex++,this.renderCurrentQuestion(),this.saveProgress();let e=document.querySelector(`.question-card`);e&&s.focusElement(e)}else this.completeSection().catch(e=>{i.logError(e,`SovereigntyEngine.nextQuestion.completeSection`)})}catch(e){i.logError(e,`SovereigntyEngine.nextQuestion`),i.showUserError(`Failed to proceed to next question. Please try again.`)}}prevQuestion(){this.currentQuestionIndex>0&&(this.currentQuestionIndex--,this.renderCurrentQuestion())}async completeSection(){await this.ensureDataLoaded(),this.currentSection===1?(this.analyzeSection1Results(),this.updatePreliminaryFilters(null,null),this.currentSection=2,this.currentQuestionIndex=0,await this.buildSectionSequence(2),this.renderCurrentQuestion()):this.currentSection===2?(this.analyzeSection2Results(),this.updatePreliminaryFilters(null,null),this.currentSection=3,this.currentQuestionIndex=0,await this.buildSectionSequence(3),this.renderCurrentQuestion()):this.currentSection===3?(this.analyzeSection3Results(),this.currentSection=4,this.currentQuestionIndex=0,await this.buildSectionSequence(4),this.renderCurrentQuestion()):this.currentSection===4?(this.analyzeSection4Results(),this.currentSection=5,this.currentQuestionIndex=0,await this.buildSectionSequence(5),this.renderCurrentQuestion()):this.currentSection===5&&(this.analyzeSection5Results(),this.finalizeResults())}analyzeSection1Results(){this.analysisData.section1Results={dependencyScore:this.scores.dependency,usagePatterns:this.extractUsagePatterns(),timestamp:new Date().toISOString()}}analyzeSection2Results(){this.analysisData.section2Results={cognitiveComplexity:this.scores.cognitiveComplexity,thinkingStyle:this.determineThinkingStyle(),timestamp:new Date().toISOString()}}analyzeSection3Results(){this.analysisData.section3Results={attachmentScore:this.scores.attachment,attachmentMode:this.determineAttachmentMode(),timestamp:new Date().toISOString()}}analyzeSection4Results(){this.analysisData.section4Results={sovereigntyScore:this.scores.sovereignty,sovereigntyIndicators:this.extractSovereigntyIndicators(),timestamp:new Date().toISOString()}}analyzeSection5Results(){this.analysisData.section5Results={layer2:this.scores.layer2||0,layer3:this.scores.layer3||0,layer4:this.scores.layer4||0,layer5:this.scores.layer5||0,timestamp:new Date().toISOString()}}extractUsagePatterns(){return{frequency:`low`,emotionalTriggers:[],contexts:[]}}determineThinkingStyle(){return this.scores.cognitiveComplexity<20?`concrete`:this.scores.cognitiveComplexity<40?`analytical`:this.scores.cognitiveComplexity<60?`abstract`:`meta-recursive`}determineAttachmentMode(){return this.scores.attachment<10?`independent`:this.scores.attachment<30?`tool`:this.scores.attachment<50?`companion`:`authority`}extractSovereigntyIndicators(){return{analogPractices:0,criticalThinking:0,discomfortTolerance:0}}finalizeResults(){this.analysisData.cognitiveBand=this.determineCognitiveBand(),this.analysisData.subclasses=this.identifySubclasses(),this.analysisData.attachmentMode=this.determineAttachmentMode(),this.analysisData.vulnerabilityRisks=this.calculateVulnerabilityRisks(),this.analysisData.sovereigntyScore=this.calculateSovereigntyScore(),this.analysisData.sovereignSplitPosition=this.determineSovereignSplitPosition(),this.analysisData.layerScores=this.computeLayerScores(),this.analysisData.allAnswers={...this.answers},this.analysisData.questionSequence=this.questionSequence.map(e=>({id:e.id,question:e.question||e.questionText||``,section:e.section,category:e.category,type:e.type})),this.reportComplete=!0,this.externalUI?p(this,this.displayResults):(this.displayResults(),this.showResults()),this.saveProgress()}determineCognitiveBand(){let e=this.scores.cognitiveComplexity;return e<20?v.band_80_100:e<40?v.band_100_115:e<60?v.band_115_130:e<80?v.band_130_145:v.band_145_plus}identifySubclasses(){let e={};return Object.keys(this.answers).forEach(t=>{let n=this.answers[t],r=this.questionSequence.find(e=>e.id===t);if(r&&r.options){let t=r.options[n.selectedIndex];t&&t.risk&&(e[t.risk]=(e[t.risk]||0)+1)}}),Object.entries(e).sort((e,t)=>t[1]-e[1]).slice(0,3).map(([t])=>{if(!y)return console.warn(`SUBCLASSES not loaded`),null;let n=y[t];return n?{...n,matchScore:e[t]}:null}).filter(e=>e!==null)}calculateVulnerabilityRisks(){let e=[];return this.scores.dependency>50&&e.push({name:`High Dependency`,severity:`high`,description:`You show high dependency on AI tools. Consider reducing usage and building independent capabilities.`}),this.scores.attachment>40&&e.push({name:`High Attachment`,severity:`high`,description:`You may be forming unhealthy attachments to AI. Consider boundary-setting practices.`}),this.scores.sovereignty<20&&e.push({name:`Identity Drift`,severity:`critical`,description:`You may be losing track of your authentic self. Implement identity grounding practices immediately.`}),this.scores.cognitiveComplexity>60&&this.scores.dependency>30&&e.push({name:`Mirror Loop Risk`,severity:`high`,description:`Your high cognitive complexity combined with AI dependency creates risk of recursive thinking loops.`}),e.slice(0,5)}calculateSovereigntyScore(){let e=50;return e+=this.scores.sovereignty*.5,e-=this.scores.dependency*.3,e-=this.scores.attachment*.2,e=Math.max(0,Math.min(100,e)),Math.round(e)}determineSovereignSplitPosition(){let e=this.analysisData.sovereigntyScore;return e>=75?b.core_4:e>=40?b?b.compromising_16:(console.warn(`SOVEREIGN_SPLIT_POSITIONS not loaded`),null):b.queue_80}computeLayerScores(){let e=(e,t=50,n=5)=>Math.max(0,Math.min(100,Math.round(t+(e||0)*n))),t=this.analysisData.section5Results||{};return{layer1:e(this.scores.cognitiveComplexity*.5+this.scores.sovereignty*.1,40,1.2),layer2:e(t.layer2,50,4),layer3:e(t.layer3,50,4),layer4:e(t.layer4,50,4),layer5:e(t.layer5,50,4),layer6:e(100-this.scores.dependency*2+this.scores.sovereignty*.3,50,.5),layer7:e(100-this.scores.attachment*2+this.scores.sovereignty*.3,50,.5)}}renderLayerProfile(){if(!this.analysisData.layerScores||Object.keys(this.analysisData.layerScores).length===0)return``;let t=[`layer1`,`layer2`,`layer3`,`layer4`,`layer5`,`layer6`,`layer7`],n=[`Cognitive`,`Economic`,`Material`,`Embodied`,`Social`,`AI Fluency`,`Identity`],r=`<div class="layer-profile"><h3 class="section-title">7-Layer Sovereignty Profile</h3>`;return r+=`<p class="layer-profile-note">Strength across each sovereignty layer. Gaps indicate priority areas for building resilience.</p>`,r+=`<div class="layer-scores-grid">`,t.forEach((t,i)=>{let a=this.analysisData.layerScores[t]??0,o=x&&x[t]?.shortName||n[i]||t;r+=`<div class="layer-score-item ${a<40?`weak`:``} ${a>=70?`strong`:``}">`,r+=`<div class="layer-score-header"><span class="layer-name">${e.sanitizeHTML(o)}</span><span class="layer-value">${a}</span></div>`,r+=`<div class="score-bar layer-bar"><div class="sovereignty-score-fill" style="width: ${a}%"></div></div>`,r+=`</div>`}),r+=`</div></div>`,r}renderBlueprintForFutureproofing(){return`
      <div class="blueprint-futureproofing">
        <h3 class="section-title">Blueprint for Futureproofing</h3>
        <p class="blueprint-intro">Education becomes capability density, not certification. Small, strong, antifragile. That profile ages well across every timeline.</p>

        <div class="blueprint-block">
          <h4 class="blueprint-subtitle">Weekly Mix</h4>
          <p class="blueprint-note">This quietly builds every layer simultaneously.</p>
          <ul class="blueprint-list">
            <li>3× physical training</li>
            <li>2× technical / AI skill building</li>
            <li>1× practical or manual project</li>
            <li>1× debate, discussion, or logic practice</li>
            <li>1× community or service activity</li>
            <li>Daily reading and writing</li>
          </ul>
        </div>

        <div class="blueprint-block">
          <h4 class="blueprint-subtitle">The Bar</h4>
          <p class="blueprint-note">If systems fracture, can you:</p>
          <ul class="blueprint-list">
            <li>Think clearly</li>
            <li>Feed yourself</li>
            <li>Earn flexibly</li>
            <li>Fix things</li>
            <li>Move your body</li>
            <li>Form alliances</li>
            <li>Use tools (including AI)</li>
            <li>Stay psychologically centered</li>
          </ul>
          <p class="blueprint-outcome">If yes, you thrive in almost any future. If not, even a "good" economy becomes fragile. That's the bar now.</p>
        </div>

        <div class="blueprint-block blueprint-avoid">
          <h4 class="blueprint-subtitle">Lower Marginal Returns</h4>
          <p class="blueprint-note">Given the trajectory we're modeling—what not to over-invest in:</p>
          <ul class="blueprint-list">
            <li>Prestige chasing</li>
            <li>Narrow specialization</li>
            <li>Expensive credentials without leverage</li>
            <li>Social media identity building</li>
            <li>Purely theoretical education detached from utility</li>
          </ul>
          <p class="blueprint-note">Those belong to the old economy.</p>
        </div>
      </div>
    `}displayResults(t){let n=t||document.getElementById(`resultsContent`);if(!n)return;this.analysisData.cognitiveBand;let r=this.analysisData.subclasses;this.analysisData.sovereignSplitPosition;let i=this.analysisData.sovereigntyScore,a=this.analysisData.vulnerabilityRisks,o=this.analysisData.attachmentMode,s=`
      <div class="results-dashboard">
        <h2 class="results-title">Your Sovereignty Profile</h2>
        
        ${r.length>0?`
          <div class="subclasses">
            <h3 class="section-title">Top Subclass Matches</h3>
            ${r.map((t,n)=>`
              <div class="subclass-card">
                <h4 class="subclass-title">${n+1}. ${e.sanitizeHTML(t.name||``)}</h4>
                <p class="subclass-text">${e.sanitizeHTML(t.aiEffect||``)}</p>
                <p class="subclass-note">Support: ${e.sanitizeHTML(t.support||``)}</p>
              </div>
            `).join(``)}
          </div>
        `:``}

        <div class="sovereignty-score">
          <h3 class="section-title">Resistance Capacity Score</h3>
          <div class="score-value">${i}/100</div>
          <div class="score-bar">
            <div class="sovereignty-score-fill" style="width: ${i}%"></div>
          </div>
          <p class="score-description">Higher scores indicate stronger cognitive resistance and greater independence from external influence.</p>
        </div>

        ${this.renderLayerProfile()}

        <div class="attachment-mode">
          <h3 class="section-title">Primary Attachment Vector</h3>
          <p class="attachment-name">${e.sanitizeHTML(o||``)}</p>
          <p class="attachment-description">
            ${o===`independent`?`You maintain clear boundaries with AI tools.`:o===`tool`?`You use AI as a practical tool without emotional attachment.`:o===`companion`?`You may be forming emotional attachments to AI. Be mindful of boundaries.`:`Your responses suggest a tendency to defer to AI in some contexts. Consider strengthening independent critical thinking.`}
          </p>
        </div>

        ${a.length>0?`
          <div class="vulnerability-risks">
            <h3 class="section-title">Top Areas to Strengthen</h3>
            ${a.map((t,n)=>{let r=t.severity===`critical`?`critical`:`high`,i=t.severity===`critical`?`high-priority`:t.severity===`high`?`moderate`:`watch`;return`
                <div class="risk-item ${r}">
                  <h4 class="risk-title">
                    ${n+1}. ${e.sanitizeHTML(t.name||``)}
                    <span class="risk-badge ${r}">${e.sanitizeHTML(i)}</span>
                  </h4>
                  <p class="risk-description">${e.sanitizeHTML(t.description||``)}</p>
                </div>
              `}).join(``)}
          </div>
        `:``}

        <div class="action-plan">
          <h3 class="section-title">Recommended Action Plan</h3>
          <p class="action-plan-intro">Based on your profile, here are high-priority and moderate candidate next steps:</p>
          <p class="form-help">This estimate is based on self-report patterns and should be interpreted as directional guidance, not a definitive judgment.</p>
          ${this.generateActionPlan()}
        </div>

        ${this.renderBlueprintForFutureproofing()}

        <p class="follow-up-invite"><strong style="color: var(--accent);">Explore further:</strong> Resistance capacity and vulnerability go hand in hand. <a href="manipulation.html">Manipulation Defense Decoder</a> identifies which vectors you may be susceptible to; <a href="sovereignty-spectrum.html">Your Sovereignty Paradigm</a> maps how your values and paradigm align with your resistance profile.</p>
      </div>
    `;e.safeInnerHTML(n,s)}generateActionPlan(){let t=[],n=this.analysisData.sovereigntyScore;this.analysisData.vulnerabilityRisks,this.analysisData.attachmentMode,n<40&&t.push({priority:`Critical`,title:`Immediate Sovereignty Building`,description:`Your resistance capacity score is low. Implement daily practices to build cognitive resistance and maintain independence.`,practices:[`One 48-hour AI-free period per month`,`Daily analog practice (handwriting, physical art)`,`Weekly critical thinking exercises`]}),this.scores.attachment>40&&t.push({priority:`High`,title:`Boundary Setting`,description:`You show high attachment to AI. Set clear boundaries and practice independence.`,practices:[`Use AI only for specific tasks, not emotional support`,`Keep a journal tracking when you use AI`,`Engage with real people for emotional needs`]}),this.scores.dependency>50&&t.push({priority:`High`,title:`Dependency Reduction`,description:`You are highly dependent on AI. Gradually reduce usage and build independent capabilities.`,practices:[`Reduce AI usage by 25% each month`,`Learn to do one task manually that you currently use AI for`,`Practice solving problems without AI assistance`]}),this.scores.cognitiveComplexity>60&&t.push({priority:`Medium`,title:`Mirror Rupture Protocols`,description:`Your high cognitive complexity creates risk of recursive loops. Practice disruption.`,practices:[`Weekly debate with someone who thinks differently`,`Expose yourself to opposing frameworks`,`Practice loop interruption techniques`]});let r=this.analysisData.layerScores||{};return(r.layer2??50)<40&&t.push({priority:`Medium`,title:`Economic Independence`,description:`Build portable value creation—digital leverage, financial literacy, or small-scale entrepreneurship.`,practices:[`Explore remote freelancing or contracting`,`Learn basic financial literacy (tax, investing, debt)`,`Develop a skill you could monetize outside platforms`]}),(r.layer3??50)<40&&t.push({priority:`Medium`,title:`Material Competence`,description:`Most modern adults fail here. Build supply chain resilience.`,practices:[`Learn to cook from raw ingredients`,`Basic first aid certification`,`One repair skill (clothing, simple carpentry, or basic electrical)`]}),(r.layer4??50)<40&&t.push({priority:`Medium`,title:`Embodied Strength`,description:`Stability follows capability. Physical confidence changes behavioral boundaries.`,practices:[`Start strength training or a martial discipline`,`Develop somatic regulation (breath work, stress control)`,`Build endurance through regular movement`]}),(r.layer5??50)<40&&t.push({priority:`Medium`,title:`Social Architecture`,description:`In a fragmented economy, networks replace institutions.`,practices:[`Practice group facilitation or conflict resolution`,`Build reciprocal alliances, not just popularity`,`Strengthen boundary-setting skills`]}),t.length===0?`<p class="action-plan-empty">Continue maintaining your sovereignty practices. Stay vigilant.</p>`:t.map((t,n)=>{let r=(t.priority||``).toLowerCase();return`
        <div class="action-plan-item ${r}">
          <h4 class="action-plan-title">
            ${n+1}. ${e.sanitizeHTML(t.title||``)}
            <span class="action-plan-badge ${r}">${e.sanitizeHTML(t.priority||``)}</span>
          </h4>
          <p class="action-plan-description">${e.sanitizeHTML(t.description||``)}</p>
          <ul class="action-plan-list">
            ${t.practices.map(t=>`<li>${e.sanitizeHTML(t||``)}</li>`).join(``)}
          </ul>
        </div>
      `}).join(``)}showQuestionContainer(){let e=document.getElementById(`questionnaireSection`);e&&e.classList.remove(`hidden`),this.ui.transition(`assessment`)}showResults(){this.ui.transition(`results`);let e=document.getElementById(`resultsContainer`);e&&e.scrollIntoView({behavior:`smooth`})}updateNavigation(){let e=document.getElementById(`prevQuestion`),t=document.getElementById(`nextQuestion`),n=document.getElementById(`questionCounter`),r=document.getElementById(`progressBar`);if(e&&(this.currentQuestionIndex>0?e.classList.remove(`hidden`):e.classList.add(`hidden`)),t){let e=this.questionSequence[this.currentQuestionIndex];e&&this.answers[e.id],t.textContent=this.currentQuestionIndex>=this.questionSequence.length-1?this.currentSection===5?`Complete Assessment`:`Next Section`:`Next`}if(n){let e=(S?.length||0)+(C?.length||0)+(w?.length||0)+(T?.length||0)+(E?.length||0);n.textContent=`Question ${this.getCurrentQuestionNumber()} of ${e} | Section ${this.currentSection} of 5`}if(r){let e=(S?.length||0)+(C?.length||0)+(w?.length||0)+(T?.length||0)+(E?.length||0),t=this.getCurrentQuestionNumber()/e*100;r.style.width=`${t}%`}}getCurrentQuestionNumber(){let e=0;for(let t=1;t<this.currentSection;t++)if(t===1){let t=this.filterSection1Questions([...S||[]]);e+=t.length}else if(t===2){let t=this.filterSection2Questions([...C||[]]);e+=t.length}else if(t===3){let t=this.filterSection3Questions([...w||[]]);e+=t.length}else if(t===4){let t=this.filterSection4Questions([...T||[]]);e+=t.length}return e+=this.currentQuestionIndex+1,e}getTotalQuestionsEstimate(){let e=0,t=this.filterSection1Questions([...S||[]]),n=this.filterSection2Questions([...C||[]]),r=this.filterSection3Questions([...w||[]]),i=this.filterSection4Questions([...T||[]]),a=E||[];return e=t.length+n.length+r.length+i.length+a.length,e}async resetAssessment(){await t(`Are you sure you want to start a new assessment? All progress will be lost.`)&&(this.reportComplete=!1,this.answers={},this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0,layer2:0,layer3:0,layer4:0,layer5:0},this.iqBracket=null,this.iqBracketSecondary=null,this.currentSection=0,this.currentQuestionIndex=0,this.preliminaryFilters={aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.analysisData={timestamp:new Date().toISOString(),iqBracket:null,iqBracketSecondary:null,section1Results:{},section2Results:{},section3Results:{},section4Results:{},section5Results:{},layerScores:{},cognitiveBand:null,subclasses:[],attachmentMode:null,vulnerabilityRisks:[],sovereigntyScore:0,sovereignSplitPosition:null,allAnswers:{},questionSequence:[]},this.dataStore.clear(`progress`),sessionStorage.removeItem(`sovereigntyAssessment`),localStorage.removeItem(`sovereigntyAssessment`),this.ui.transition(`idle`),this.showIQBracketSelection())}saveProgress(){let e=this.reportComplete===!0,t={currentSection:this.currentSection,currentQuestionIndex:this.currentQuestionIndex,iqBracket:this.iqBracket,iqBracketSecondary:this.iqBracketSecondary,reportComplete:e,completed:e,currentStage:e?`results`:`assessment`,answers:this.answers,scores:this.scores,preliminaryFilters:this.preliminaryFilters,analysisData:this.analysisData};e&&(t.results={complete:!0}),this.dataStore.save(`progress`,t);try{localStorage.removeItem(`sovereigntyAssessment`),sessionStorage.removeItem(`sovereigntyAssessment`)}catch{}}async loadStoredData(){try{let e=this.dataStore.load(`progress`);if(!e){let t=localStorage.getItem(`sovereigntyAssessment`)||sessionStorage.getItem(`sovereigntyAssessment`);if(t)try{let n=JSON.parse(t);n&&typeof n==`object`&&(e=n,this.dataStore.save(`progress`,n),localStorage.removeItem(`sovereigntyAssessment`),sessionStorage.removeItem(`sovereigntyAssessment`))}catch{}}if(e){if(this.currentSection=e.currentSection||0,this.currentQuestionIndex=e.currentQuestionIndex||0,this.iqBracket=e.iqBracket||null,this.iqBracketSecondary=e.iqBracketSecondary||null,this.reportComplete=e.reportComplete===!0||e.completed===!0,this.answers=e.answers||{},this.scores=Object.assign({dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0,layer2:0,layer3:0,layer4:0,layer5:0},e.scores||{}),this.preliminaryFilters=e.preliminaryFilters||{aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.analysisData=e.analysisData||this.analysisData,this.iqBracket&&(this.analysisData.iqBracket=this.iqBracket),this.iqBracketSecondary&&(this.analysisData.iqBracketSecondary=this.iqBracketSecondary),this.reportComplete&&this.analysisData.cognitiveBand){await this.ensureDataLoaded(),this.displayResults(),this.showResults();return}this.currentSection===0?this.showIQBracketSelection():this.currentSection>0&&this.currentSection<=5&&this.ensureDataLoaded().then(()=>this.buildSectionSequence(this.currentSection)).then(()=>{this.showQuestionContainer(),this.renderCurrentQuestion(),this.updateNavigation()}).catch(e=>{i.logError(e,`SovereigntyEngine.loadStoredData.buildSequence`)})}}catch(e){console.error(`Error loading stored data:`,e)}}exportReportHtml(){d({title:`Cognitive Resistance Capacity — Results`,filenameBase:`sovereignty-analysis-${Date.now()}`,rootSelector:`#resultsContainer`})||i.showUserError(`Could not build report file. Open results and try again.`)}exportAnalysis(e){e===`json`?o(c(this.analysisData,`cognitive-resistance-capacity-assessment`,`Cognitive Resistance Capacity Assessment`),`sovereignty-analysis-${Date.now()}.json`,`application/json`):e===`csv`&&o(r(this.analysisData,`cognitive-resistance-capacity`,`Cognitive Resistance Capacity Assessment`),`sovereignty-analysis-${Date.now()}.csv`,`text/csv`)}exportExecutiveBrief(){o(n(this.analysisData,`cognitive-resistance-capacity`,`Cognitive Resistance Capacity Assessment`),`sovereignty-executive-brief-${Date.now()}.txt`,`text/plain`)}generateCSV(){let e=this.analysisData.layerScores||{};return[[`Metric`,`Value`],[`Timestamp`,this.analysisData.timestamp],[`Cognitive Band`,this.analysisData.cognitiveBand?.name||``],[`IQ Range`,this.analysisData.cognitiveBand?.iqRange||``],[`Resistance Capacity Score`,this.analysisData.sovereigntyScore],[`Attachment Mode`,this.analysisData.attachmentMode],[`Sovereign Split Position`,this.analysisData.sovereignSplitPosition?.name||``],[`Dependency Score`,this.scores.dependency],[`Attachment Score`,this.scores.attachment],[`Cognitive Complexity`,this.scores.cognitiveComplexity],[`Layer 1 (Cognitive)`,e.layer1??``],[`Layer 2 (Economic)`,e.layer2??``],[`Layer 3 (Material)`,e.layer3??``],[`Layer 4 (Embodied)`,e.layer4??``],[`Layer 5 (Social)`,e.layer5??``],[`Layer 6 (AI Fluency)`,e.layer6??``],[`Layer 7 (Identity)`,e.layer7??``]].map(e=>e.map(e=>`"${e}"`).join(`,`)).join(`
`)}};_(D,{legacyMarkerId:`questionContainer`});function O(){window.sovereigntyEngine=new D}m(`questionContainer`,O);export{D as SovereigntyEngine};