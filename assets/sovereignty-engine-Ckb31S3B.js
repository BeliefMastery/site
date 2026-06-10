import{a as e,c as t,d as n,f as r,i,l as a,m as o,o as s,s as c,t as l,u}from"./spa-engine-external-bvnqWVN1.js";import{n as d,t as f}from"./confirm-modal-D7C0sURn.js";import{a as p,c as m,h,i as g,l as _,n as v,p as y,r as b,t as x,u as S}from"./spa-questionnaire-host-5ue7H_jU.js";var C,w,T,E,D,O,k,A,j,M=class{constructor(e={}){l(this,e),this.currentSection=0,this.currentQuestionIndex=0,this.iqBracket=null,this.iqBracketSecondary=null,this.answers={},this.questionSequence=[],this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0,layer2:0,layer3:0,layer4:0,layer5:0},this.preliminaryFilters={aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this._allocationScoreDeltas={},this.reportComplete=!1,this.analysisData={timestamp:new Date().toISOString(),iqBracket:null,section1Results:{},section2Results:{},section3Results:{},section4Results:{},cognitiveBand:null,subclasses:[],attachmentMode:null,vulnerabilityRisks:[],sovereigntyScore:0,sovereignSplitPosition:null,allAnswers:{},questionSequence:[]},this.dataStore=new u(`sovereignty-assessment`),this.ui=v(this,{idle:{show:[`#introSection`,`#actionButtonsSection`],hide:[`#questionnaireSection`,`#resultsContainer`]},assessment:{show:[`#questionnaireSection`],hide:[`#introSection`,`#actionButtonsSection`,`#resultsContainer`]},results:{show:[`#resultsContainer`],hide:[`#introSection`,`#actionButtonsSection`,`#questionnaireSection`]}}),this.ready=this.init()}init(){return Promise.resolve(this.loadStoredData()).then(()=>g(this)).catch(e=>{n.logError(e,`SovereigntyEngine.init`),n.showUserError(`Failed to initialize assessment. Please refresh the page.`)})}getQuestionContainer(){return this.externalUI?this._externalQuestionMount:document.getElementById(`questionContainer`)}mountExternalShell(e){e&&(e.innerHTML=`
      <section id="questionnaireSection">
        <div id="questionContainer"></div>
        <button type="button" id="prevQuestion">Previous</button>
        <button type="button" id="nextQuestion">Next</button>
        <button type="button" id="startAssessment" class="btn btn-primary">Begin assessment</button>
      </section>
      <section id="resultsContainer" class="hidden"><div id="resultsContent"></div></section>`,this._externalQuestionMount=e.querySelector(`#questionContainer`),this.attachEventListeners())}async renderResults(e){return this.displayResults(e)}async ensureDataLoaded(){if(!(C&&D))try{let e=await o(`./sovereignty-data/cognitive-bands.js`,`Cognitive Bands`);C=e.COGNITIVE_BANDS,w=e.SUBCLASSES,T=e.SOVEREIGN_SPLIT_POSITIONS;let t=await o(`./sovereignty-data/sovereignty-questions.js`,`Sovereignty Questions`);D=t.SECTION_1_USAGE_PATTERNS,O=t.SECTION_2_COGNITIVE_STYLE,k=t.SECTION_3_ATTACHMENT,A=t.SECTION_4_SOVEREIGNTY,j=t.SECTION_5_RESILIENCE,E=(await o(`./sovereignty-data/sovereignty-layers.js`,`Sovereignty Layers`)).SOVEREIGNTY_LAYERS}catch(e){throw n.logError(e,`SovereigntyEngine.ensureDataLoaded`),n.showUserError(`Failed to load assessment data. Please refresh the page.`),e}}attachEventListeners(){let e=document.getElementById(`startAssessment`);e&&e.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.startAssessment()});let t=document.getElementById(`nextQuestion`);t&&t.addEventListener(`click`,()=>this.nextQuestion());let n=document.getElementById(`prevQuestion`);n&&n.addEventListener(`click`,()=>this.prevQuestion());let r=document.getElementById(`newAssessment`);r&&r.addEventListener(`click`,()=>this.resetAssessment());let i=document.getElementById(`exportReportHtml`);i&&i.addEventListener(`click`,()=>this.exportReportHtml());let a=document.getElementById(`exportExecutiveBrief`);a&&a.addEventListener(`click`,()=>this.exportExecutiveBrief());let o=document.getElementById(`generateSampleReport`);o&&o.addEventListener(`click`,()=>this.generateSampleReport());let s=document.getElementById(`abandonAssessment`);s&&s.addEventListener(`click`,async()=>{await d(`Are you sure you want to abandon this assessment? All progress will be lost.`)&&this.resetAssessment()})}getEmptyAnalysisData(){return{timestamp:new Date().toISOString(),iqBracket:null,section1Results:{},section2Results:{},section3Results:{},section4Results:{},section5Results:{},layerScores:{},cognitiveBand:null,subclasses:[],attachmentMode:null,vulnerabilityRisks:[],sovereigntyScore:0,sovereignSplitPosition:null,allAnswers:{},questionSequence:[]}}pickRandomIndices(e,t){let n=Array.from({length:e},(e,t)=>t);for(let e=n.length-1;e>0;--e){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,t)}answerQuestionForSample(e){if(e){if(e.type===`frequency_grid`){let t=e.contexts||[],n=(e.scale||[]).length||5;t.forEach((t,r)=>{let i=Math.floor(Math.random()*n);this.processFrequencyGridAnswer(e,r,i)});return}if(e.type===`multiple_response`){let t=Array.isArray(e.options)?e.options.length:0;if(t===0)return;let n=Math.min(t,Math.max(1,Math.ceil(Math.random()*3))),r=this.pickRandomIndices(t,n);this.processAnswer(e,r);return}if(e.type===`likert`){let t=e.scale||5,n=Math.floor(Math.random()*t)+1;this.processAnswer(e,n);return}if(e.options&&Array.isArray(e.options)&&e.options.length>0){let t=Math.floor(Math.random()*e.options.length);this.processAnswer(e,t)}}}async generateSampleReport(){try{await this.ensureDataLoaded(),this.dataStore.clear(`progress`),this.currentSection=1,this.currentQuestionIndex=0,this.iqBracket=this.iqBracket||`unknown`,this.iqBracketSecondary=null,this.answers={},this.questionSequence=[],this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0},this.preliminaryFilters={aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.analysisData=this.getEmptyAnalysisData(),this.analysisData.iqBracket=this.iqBracket,await this.buildSectionSequence(1),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection1Results(),this.updatePreliminaryFilters(null,null),this.currentSection=2,await this.buildSectionSequence(2),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection2Results(),this.updatePreliminaryFilters(null,null),this.currentSection=3,await this.buildSectionSequence(3),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection3Results(),this.currentSection=4,await this.buildSectionSequence(4),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection4Results(),this.currentSection=5,await this.buildSectionSequence(5),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),this.analyzeSection5Results(),this.finalizeResults()}catch(e){n.logError(e,`SovereigntyEngine.generateSampleReport`),n.showUserError(`Failed to generate sample report. Please try again.`)}}startAssessment(){try{this.reportComplete=!1,this.currentSection=0,this.currentQuestionIndex=0,this.answers={},this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0},this.showQuestionContainer(),this.showIQBracketSelection(),this.saveProgress();let e=this.getQuestionContainer();e&&a.focusElement(e)}catch(e){n.logError(e,`SovereigntyEngine.startAssessment`),n.showUserError(`Failed to start assessment. Please try again.`)}}showIQBracketSelection(){let e=this.getQuestionContainer();e&&(r.safeInnerHTML(e,`
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
    `),setTimeout(()=>{let e=document.getElementById(`iqInput`),t=document.getElementById(`submitIQ`),n=document.getElementById(`iqBracketDisplay`),r=document.getElementById(`iqBracketText`),i=()=>{let t=parseInt(e.value);if(isNaN(t)||t<70||t>200){f(`Please enter a valid IQ between 70 and 200.`);return}let i=this.determineIQBrackets(t);this.iqBracket=i.primary,this.iqBracketSecondary=i.secondary,this.analysisData.iqBracket=i.primary,this.analysisData.iqBracketSecondary=i.secondary;let a=`Detected: ${this.getBracketName(i.primary)}`;i.secondary&&(a+=` (with crossover from ${this.getBracketName(i.secondary)})`),r.textContent=a,n.classList.remove(`hidden`),setTimeout(async()=>{this.currentSection=1,await this.buildSectionSequence(1),this.renderCurrentQuestion(),this.updateNavigation(),this.saveProgress()},1e3)};t&&t.addEventListener(`click`,i),e&&e.addEventListener(`keypress`,e=>{e.key===`Enter`&&i()})},100))}determineIQBrackets(e){let t=null,n=null;return e<80?t=`80_100`:e>=80&&e<100?(t=`80_100`,e>=95&&e<100&&(n=`100_115`)):e>=100&&e<115?(t=`100_115`,e>=100&&e<=102?n=`80_100`:e>=113&&e<115&&(n=`115_130`)):e>=115&&e<130?(t=`115_130`,e>=115&&e<=117?n=`100_115`:e>=128&&e<130&&(n=`130_145`)):e>=130&&e<145?(t=`130_145`,e>=130&&e<=132?n=`115_130`:e>=143&&e<145&&(n=`145_plus`)):e>=145&&(t=`145_plus`,e>=145&&e<=147&&(n=`130_145`)),{primary:t,secondary:n}}getBracketName(e){return{"80_100":`80-100 IQ (Routine Guided Thinkers)`,"100_115":`100-115 IQ (Practical Adaptive Thinkers)`,"115_130":`115-130 IQ (Strategic Analytical Thinkers)`,"130_145":`130-145 IQ (Creative Synthesizing Thinkers)`,"145_plus":`145+ IQ (Meta-Recursive Thinkers)`}[e]||e}async buildSectionSequence(e){await this.ensureDataLoaded();let t=[];switch(e){case 1:t=[...D||[]],t=this.filterSection1Questions(t);break;case 2:t=[...O||[]],t=this.filterSection2Questions(t);break;case 3:t=[...k||[]],t=this.filterSection3Questions(t);break;case 4:t=[...A||[]],t=this.filterSection4Questions(t);break;case 5:t=[...j||[]];break}this.questionSequence=h(t),this.questionSequence.sort(()=>Math.random()-.5)}filterSection1Questions(e){if(this.iqBracket===`unknown`||!this.iqBracket){let t=this.answers.u2;if(t){let n=D[1]?.options?.[t.selectedIndex];if(n&&(n.text.includes(`Never`)||n.text.includes(`Rarely`)))return this.preliminaryFilters.aiUsageFrequency=`rarely`,this.filterByUsageFrequency(e,12)}return e}return this.filterQuestionsByIQ(e,12)}filterSection2Questions(e){return this.iqBracket===`unknown`||!this.iqBracket?e:this.filterQuestionsByIQ(e,10,`cognitive`)}filterSection3Questions(e){if(this.iqBracket===`unknown`||!this.iqBracket)return(this.scores.dependency||0)<-3?e.slice(0,6):e;let t=6;return(this.scores.dependency||0)<-3&&(t=5),this.filterQuestionsByIQ(e,t,`attachment`)}filterSection4Questions(e){if(this.iqBracket===`unknown`||!this.iqBracket)return(this.scores.dependency||0)<-3?e.slice(0,7):e;let t=8,n=this.scores.dependency||0;return this.scores.cognitiveComplexity,n<-3&&(t=7),(this.iqBracket===`80_100`||this.iqBracket===`100_115`)&&(t=7),this.filterQuestionsByIQ(e,t,`sovereignty`)}filterByUsageFrequency(e,t){let n=[`u1`,`u2`,`u3`,`u6`,`u10`,`u11`,`u12`,`u13`],r=[`u4`,`u5`,`u7`,`u8`,`u9`,`u14`,`u15`],i=e.filter(e=>n.includes(e.id)),a=e.filter(e=>r.includes(e.id)),o=[...i],s=t-o.length;return s>0&&a.length>0&&o.push(...a.slice(0,s)),o.slice(0,t)}filterQuestionsByIQ(e,t,n=`general`){if(this.iqBracket===`unknown`||!this.iqBracket)return e.slice(0,t);let r=e.map(e=>{let t=1,r=this.calculateIQRelevance(e,this.iqBracket,n),i=0;return this.iqBracketSecondary&&(i=this.calculateIQRelevance(e,this.iqBracketSecondary,n)*.5),t=r+i,{question:e,score:t}});return r.sort((e,t)=>t.score===e.score?Math.random()-.5:t.score-e.score),r.slice(0,t).map(e=>e.question)}calculateIQRelevance(e,t,n){let r=1,i=(e.question||``).toLowerCase(),a=[`meta`,`recursive`,`framework`,`abstract`,`paradox`,`contradiction`].some(e=>i.includes(e)),o=[`simple`,`clear`,`routine`,`familiar`].some(e=>i.includes(e)),s=!1,c=!1;return e.options&&e.options.forEach(e=>{let t=(e.text||``).toLowerCase();(e.cognitiveLevel===`high`||e.cognitiveLevel===`very_high`||t.includes(`meta`)||t.includes(`recursive`)||t.includes(`framework`))&&(s=!0),(e.cognitiveLevel===`low`||e.cognitiveLevel===`medium`||t.includes(`simple`)||t.includes(`clear`)||t.includes(`routine`))&&(c=!0)}),t===`80_100`||t===`100_115`?((o||c)&&(r+=3),(a||s)&&--r):t===`115_130`?((a||s)&&(r+=2),(o||c)&&(r+=1)):(t===`130_145`||t===`145_plus`)&&((a||s)&&(r+=3),(o||c)&&--r),n===`cognitive`&&(a||s)&&(r+=2),n===`attachment`&&t!==`80_100`&&(r+=1),n===`sovereignty`&&(t===`130_145`||t===`145_plus`)&&(r+=2),r}renderCurrentQuestion(){if(this.questionSequence.length===0){this.finalizeResults();return}let e=this.questionSequence[this.currentQuestionIndex];if(b(this,e,{totalQuestions:this.questionSequence.length,questionIndex:this.currentQuestionIndex,badge:`Section ${this.currentSection}`})){this.updateNavigation();return}let t=this.getQuestionContainer();if(!t)return;let n=``;this.currentQuestionIndex===0&&(n+=this.getSectionExplanation(this.currentSection));let i=this.answers[e.id]!==void 0;if(e.type===`frequency_grid`&&i){let t=e.contexts||[],n=this.answers[e.id],r=n&&n.values?n.values:{};i=t.every((e,t)=>r[t]!==void 0)}let a=i;e.type===`multiple_choice`?n+=this.renderMultipleChoice(e,a):e.type===`likert`?n+=this.renderLikert(e,a):e.type===`multiple_response`?n+=this.renderMultipleResponse(e,a):e.type===`frequency`?n+=this.renderFrequency(e,a):e.type===`frequency_grid`?n+=this.renderFrequencyGrid(e,a):e.type===`allocation`?n+=S(e,this.answers[e.id],{questionIndex:this.currentQuestionIndex,questionTotal:this.questionSequence.length}):e.type===`scenario`?n+=this.renderScenario(e,a):n+=`<div class="question-card sov-error-card">
        <h3 class="sov-error-title">Error: Unknown question type "${e.type}"</h3>
        <p class="sov-error-text">Question ID: ${e.id}</p>
        <p class="sov-error-text">${r.sanitizeHTML(e.question||`No question text available`)}</p>
      </div>`,r.safeInnerHTML(t,n),e.type===`allocation`&&!a&&_(t,this,e),this.updateNavigation(),setTimeout(()=>t.scrollIntoView({behavior:`smooth`,block:`start`}),100)}getSectionExplanation(e){let t={1:{title:`Section 1: AI Usage Patterns (Layer 6 — AI Fluency)`,description:`We'll explore your daily patterns, use cases, and emotional triggers for AI usage.`,purpose:`This section helps identify whether you treat AI as a tractor (multiplies labor) or an oracle (replaces thinking).`},2:{title:`Section 2: Cognitive Style (Layer 1 — Cognitive Sovereignty)`,description:`We'll examine your thinking patterns, problem-solving approaches, and abstraction capacity.`,purpose:`This section assesses your capacity for formal reasoning, manipulation detection, and independent judgment under uncertainty.`},3:{title:`Section 3: Attachment & Identity (Layer 7 — Identity Integrity)`,description:`We'll explore your relationship with AI tools—how you perceive and interact with them.`,purpose:`This section identifies your attachment mode and susceptibility to digital hive pressure.`},4:{title:`Section 4: Sovereignty Indicators`,description:`We'll assess your independence practices, critical thinking habits, and resistance capacity.`,purpose:`This section measures your sovereignty capacity and identifies areas of strength or vulnerability.`},5:{title:`Section 5: Resilience Layers (Economic, Material, Embodied, Social)`,description:`We'll assess your capacity across four additional sovereignty layers: economic independence, material competence, embodied strength, and social architecture.`,purpose:`This section identifies your resilience in a post-job world—income optionality, supply chain literacy, physical capability, and micro-community capacity.`}}[e];return`
      <div class="phase-explanation">
        <h3>${t.title}</h3>
        <p>${t.description}</p>
        <p class="phase-explanation-note">${t.purpose}</p>
      </div>
    `}renderMultipleChoice(e,t){let n=this.answers[e.id],i=e.options.map((i,a)=>{let o=n&&n.selectedIndex===a;return`
        <label class="option-label ${o?`selected`:``} ${t?`locked`:``}">
          <input class="option-input" type="radio" name="question_${e.id}" value="${a}" ${o?`checked`:``} ${t?`disabled`:``}>
          <span class="option-text">${r.sanitizeHTML(i.text||``)}</span>
          ${o?`<span class="selected-check">✓</span>`:``}
        </label>
      `}).join(``);t||setTimeout(()=>{document.querySelectorAll(`input[name="question_${e.id}"]:not([disabled])`).forEach(t=>{t.addEventListener(`change`,t=>{let n=parseInt(t.target.value);this.processAnswer(e,n),document.querySelectorAll(`label.option-label`).forEach(e=>{e.classList.remove(`selected`)});let r=t.target.closest(`label`);r&&r.classList.add(`selected`)})}),document.querySelectorAll(`label.option-label:not(.locked)`).forEach(e=>{e.addEventListener(`click`,t=>{let n=e.querySelector(`input[type="radio"]`);n&&!n.disabled&&t.target.tagName!==`INPUT`&&(n.checked=!0,n.dispatchEvent(new Event(`change`,{bubbles:!0})))})})},100);let a=t?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${r.sanitizeHTML(e.question||``)}</h3>
        <div class="options-container">
          ${i}
        </div>
        ${a}
      </div>
    `}renderLikert(e,t){let n=this.answers[e.id],i=e.scale||5,a=e.labels||[`Strongly Disagree`,`Disagree`,`Neutral`,`Agree`,`Strongly Agree`],o=``;for(let s=1;s<=i;s++){let i=n&&n.value===s;o+=`
        <label class="likert-option ${i?`selected`:``} ${t?`locked`:``}">
          <input type="radio" name="question_${e.id}" value="${s}" ${i?`checked`:``} ${t?`disabled`:``}>
          <span>${s}</span>
          <div class="likert-label">${r.sanitizeHTML(a[s-1]||``)}</div>
        </label>
      `}t||setTimeout(()=>{document.querySelectorAll(`input[name="question_${e.id}"]:not([disabled])`).forEach(t=>{t.addEventListener(`change`,t=>{let n=parseInt(t.target.value);this.processAnswer(e,n),document.querySelectorAll(`label.likert-option`).forEach(e=>{e.classList.remove(`selected`)});let r=t.target.closest(`label`);r&&r.classList.add(`selected`)})}),document.querySelectorAll(`label.likert-option:not(.locked)`).forEach(e=>{e.addEventListener(`click`,t=>{let n=e.querySelector(`input`);n&&!n.disabled&&(n.checked=!0,n.dispatchEvent(new Event(`change`,{bubbles:!0})))})})},100);let s=t?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${r.sanitizeHTML(e.question||``)}</h3>
        <div class="likert-scale">
          ${o}
        </div>
        ${s}
      </div>
    `}renderMultipleResponse(e,t){let n=this.answers[e.id],i=n?Array.isArray(n.selectedIndices)?n.selectedIndices:[n.selectedIndex]:[],a=e.options.map((n,a)=>{let o=i.includes(a);return`
        <label class="option-label ${o?`selected`:``} ${t?`locked`:``}">
          <input class="option-input" type="checkbox" name="question_${e.id}" value="${a}" ${o?`checked`:``} ${t?`disabled`:``}>
          <span class="option-text">${r.sanitizeHTML(n.text||``)}</span>
          ${o?`<span class="selected-check">✓</span>`:``}
        </label>
      `}).join(``);t||setTimeout(()=>{let t=document.querySelectorAll(`input[name="question_${e.id}"]:not([disabled])`);t.forEach(n=>{n.addEventListener(`change`,()=>{let n=Array.from(t).filter(e=>e.checked).map(e=>parseInt(e.value));this.processAnswer(e,n),document.querySelectorAll(`label.option-label`).forEach(e=>{let t=e.querySelector(`input`);t&&t.checked?e.classList.add(`selected`):e.classList.remove(`selected`)})})})},100);let o=t?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${r.sanitizeHTML(e.question||``)}</h3>
        <p class="question-helper">Select all that apply:</p>
        <div class="options-container">
          ${a}
        </div>
        ${o}
      </div>
    `}renderFrequency(e,t){return this.renderMultipleChoice(e,t)}renderFrequencyGrid(e,t){let n=this.answers[e.id],i=e.contexts||[],a=e.scale||[`Never`,`Rarely`,`Sometimes`,`Often`,`Always`],o=n&&n.values||{},s=`<div class="frequency-grid"><table class="frequency-grid-table">`;s+=`<thead><tr><th class="frequency-grid-header frequency-grid-context">Context</th>`,a.forEach((e,t)=>{s+=`<th class="frequency-grid-header">${r.sanitizeHTML(e||``)}</th>`}),s+=`</tr></thead><tbody>`,i.forEach((n,i)=>{let c=o[i]===void 0?null:o[i],l=t&&c!==null;s+=`<tr class="frequency-grid-row">`,s+=`<td class="frequency-grid-cell frequency-grid-context-cell">${r.sanitizeHTML(n||``)}</td>`,a.forEach((t,n)=>{let r=c===n;s+=`<td class="frequency-grid-cell frequency-grid-option-cell">
          <label class="frequency-grid-option ${r?`selected`:``} ${l?`locked`:``}">
            <input type="radio" name="question_${e.id}_context_${i}" value="${n}" ${r?`checked`:``} ${l?`disabled`:``}>
            <span>${n+1}</span>
          </label>
        </td>`}),s+=`</tr>`}),s+=`</tbody></table></div>`,t||setTimeout(()=>{i.forEach((t,n)=>{document.querySelectorAll(`input[name="question_${e.id}_context_${n}"]:not([disabled])`).forEach(t=>{t.addEventListener(`change`,t=>{let r=parseInt(t.target.value);this.processFrequencyGridAnswer(e,n,r);let i=t.target.closest(`tr`);if(i){i.querySelectorAll(`label.frequency-grid-option`).forEach(e=>{e.classList.remove(`selected`)});let e=t.target.closest(`label`);e&&e.classList.add(`selected`)}})}),document.querySelectorAll(`label.frequency-grid-option:not(.locked)`).forEach(t=>{let r=t.querySelector(`input`);r&&r.name.includes(`question_${e.id}_context_${n}`)&&t.addEventListener(`click`,e=>{r&&!r.disabled&&e.target.tagName!==`INPUT`&&(r.checked=!0,r.dispatchEvent(new Event(`change`,{bubbles:!0})))})})})},100);let c=t?`<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>`:``;return`
      <div class="question-card">
        <h3>${r.sanitizeHTML(e.question||``)}</h3>
        <p class="question-helper">Select a frequency for each context:</p>
        ${s}
        ${c}
      </div>
    `}renderScenario(e,t){return this.renderMultipleChoice(e,t)}processFrequencyGridAnswer(e,t,n){let r=this.answers[e.id],i=r&&r.values?{...r.values}:{},a=i[t];i[t]=n,this.answers[e.id]={questionId:e.id,values:i,timestamp:new Date().toISOString()};let o=(e.scale||[]).length;if(a!==void 0){let e=a/(o-1)*3;this.scores.dependency-=e,this.scores.sovereignty+=e*.5}let s=n/(o-1)*3;this.scores.dependency+=s,this.scores.sovereignty-=s*.5,this.saveProgress()}processAnswer(e,t){let n=Array.isArray(t)?t:[t];if(this.answers[e.id]={questionId:e.id,value:t,selectedIndex:Array.isArray(t)?t[0]:t,selectedIndices:Array.isArray(t)?t:[t],timestamp:new Date().toISOString()},this.updatePreliminaryFilters(e,t),e.type===`likert`){let n=Array.isArray(t)?t[0]:t;if(e.scores&&e.scores[n]){let t=e.scores[n];Object.keys(t).forEach(e=>{this.scores[e]!==void 0&&(this.scores[e]+=t[e]||0),e===`cognitiveLevel`&&(this.scores.cognitiveComplexity+=t[e]||0)})}}else n.map(t=>e.options&&e.options[t]).filter(e=>e).forEach(e=>{e.scores&&Object.keys(e.scores).forEach(t=>{if(this.scores[t]!==void 0&&(this.scores[t]+=e.scores[t]||0),t===`cognitiveLevel`){let n=e.scores[t];if(typeof n==`number`)this.scores.cognitiveComplexity+=n;else if(typeof n==`string`){let e={low:0,medium:1,high:2,very_high:3};this.scores.cognitiveComplexity+=e[n]??0}}})});this.saveProgress()}updatePreliminaryFilters(e,t){if(!(!e||!e.id)){if(e.id===`u2`&&e.options){let n=Array.isArray(t)?t[0]:t,r=e.options[n];if(r){let e=r.text.toLowerCase();e.includes(`never`)?this.preliminaryFilters.aiUsageFrequency=`never`:e.includes(`rarely`)?this.preliminaryFilters.aiUsageFrequency=`rarely`:e.includes(`daily`)?this.preliminaryFilters.aiUsageFrequency=`daily`:(e.includes(`multiple times`)||e.includes(`constantly`))&&(this.preliminaryFilters.aiUsageFrequency=`frequent`)}}this.currentSection===1&&this.scores.dependency!==void 0&&(this.scores.dependency<-3?this.preliminaryFilters.dependencyLevel=`low`:this.scores.dependency>10?this.preliminaryFilters.dependencyLevel=`high`:this.preliminaryFilters.dependencyLevel=`medium`),this.currentSection===2&&this.scores.cognitiveComplexity!==void 0&&(this.scores.cognitiveComplexity<5?this.preliminaryFilters.cognitiveLevel=`low`:this.scores.cognitiveComplexity>15?this.preliminaryFilters.cognitiveLevel=`high`:this.preliminaryFilters.cognitiveLevel=`medium`)}}nextQuestion(){try{let e=this.questionSequence[this.currentQuestionIndex];if(e?.type===`allocation`){if(!y(this.answers[e.id],e.allocationTargetSum??1e3)){n.showUserError(`Please distribute 100% across the options before continuing.`);return}this._allocationScoreDeltas[e.id]=m(this.scores,e,this.answers[e.id],this._allocationScoreDeltas[e.id]||{})}else if(e&&!this.answers[e.id]&&e.type!==`multiple_response`)if(e.type===`frequency_grid`){let t=e.contexts||[],r=this.answers[e.id],i=r&&r.values?r.values:{};if(!t.every((e,t)=>i[t]!==void 0)){n.showUserError(`Please select a frequency for all contexts before proceeding.`);return}}else{n.showUserError(`Please select an answer before proceeding.`);return}if(this.currentQuestionIndex<this.questionSequence.length-1){this.currentQuestionIndex++,this.renderCurrentQuestion(),this.saveProgress();let e=document.querySelector(`.question-card`);e&&a.focusElement(e)}else this.completeSection().catch(e=>{n.logError(e,`SovereigntyEngine.nextQuestion.completeSection`)})}catch(e){n.logError(e,`SovereigntyEngine.nextQuestion`),n.showUserError(`Failed to proceed to next question. Please try again.`)}}prevQuestion(){this.currentQuestionIndex>0&&(this.currentQuestionIndex--,this.renderCurrentQuestion())}async completeSection(){await this.ensureDataLoaded(),this.currentSection===1?(this.analyzeSection1Results(),this.updatePreliminaryFilters(null,null),this.currentSection=2,this.currentQuestionIndex=0,await this.buildSectionSequence(2),this.renderCurrentQuestion()):this.currentSection===2?(this.analyzeSection2Results(),this.updatePreliminaryFilters(null,null),this.currentSection=3,this.currentQuestionIndex=0,await this.buildSectionSequence(3),this.renderCurrentQuestion()):this.currentSection===3?(this.analyzeSection3Results(),this.currentSection=4,this.currentQuestionIndex=0,await this.buildSectionSequence(4),this.renderCurrentQuestion()):this.currentSection===4?(this.analyzeSection4Results(),this.currentSection=5,this.currentQuestionIndex=0,await this.buildSectionSequence(5),this.renderCurrentQuestion()):this.currentSection===5&&(this.analyzeSection5Results(),this.finalizeResults())}analyzeSection1Results(){this.analysisData.section1Results={dependencyScore:this.scores.dependency,usagePatterns:this.extractUsagePatterns(),timestamp:new Date().toISOString()}}analyzeSection2Results(){this.analysisData.section2Results={cognitiveComplexity:this.scores.cognitiveComplexity,thinkingStyle:this.determineThinkingStyle(),timestamp:new Date().toISOString()}}analyzeSection3Results(){this.analysisData.section3Results={attachmentScore:this.scores.attachment,attachmentMode:this.determineAttachmentMode(),timestamp:new Date().toISOString()}}analyzeSection4Results(){this.analysisData.section4Results={sovereigntyScore:this.scores.sovereignty,sovereigntyIndicators:this.extractSovereigntyIndicators(),timestamp:new Date().toISOString()}}analyzeSection5Results(){this.analysisData.section5Results={layer2:this.scores.layer2||0,layer3:this.scores.layer3||0,layer4:this.scores.layer4||0,layer5:this.scores.layer5||0,timestamp:new Date().toISOString()}}extractUsagePatterns(){return{frequency:`low`,emotionalTriggers:[],contexts:[]}}determineThinkingStyle(){return this.scores.cognitiveComplexity<20?`concrete`:this.scores.cognitiveComplexity<40?`analytical`:this.scores.cognitiveComplexity<60?`abstract`:`meta-recursive`}determineAttachmentMode(){return this.scores.attachment<10?`independent`:this.scores.attachment<30?`tool`:this.scores.attachment<50?`companion`:`authority`}extractSovereigntyIndicators(){return{analogPractices:0,criticalThinking:0,discomfortTolerance:0}}finalizeResults(){this.analysisData.cognitiveBand=this.determineCognitiveBand(),this.analysisData.subclasses=this.identifySubclasses(),this.analysisData.attachmentMode=this.determineAttachmentMode(),this.analysisData.vulnerabilityRisks=this.calculateVulnerabilityRisks(),this.analysisData.sovereigntyScore=this.calculateSovereigntyScore(),this.analysisData.sovereignSplitPosition=this.determineSovereignSplitPosition(),this.analysisData.layerScores=this.computeLayerScores(),this.analysisData.allAnswers={...this.answers},this.analysisData.questionSequence=this.questionSequence.map(e=>({id:e.id,question:e.question||e.questionText||``,section:e.section,category:e.category,type:e.type})),this.reportComplete=!0,this.externalUI?p(this,this.displayResults):(this.displayResults(),this.showResults()),this.saveProgress()}determineCognitiveBand(){let e=this.scores.cognitiveComplexity;return e<20?C.band_80_100:e<40?C.band_100_115:e<60?C.band_115_130:e<80?C.band_130_145:C.band_145_plus}identifySubclasses(){let e={};return Object.keys(this.answers).forEach(t=>{let n=this.answers[t],r=this.questionSequence.find(e=>e.id===t);if(r&&r.options){let t=r.options[n.selectedIndex];t&&t.risk&&(e[t.risk]=(e[t.risk]||0)+1)}}),Object.entries(e).sort((e,t)=>t[1]-e[1]).slice(0,3).map(([t])=>{if(!w)return console.warn(`SUBCLASSES not loaded`),null;let n=w[t];return n?{...n,matchScore:e[t]}:null}).filter(e=>e!==null)}calculateVulnerabilityRisks(){let e=[];return this.scores.dependency>50&&e.push({name:`High Dependency`,severity:`high`,description:`You show high dependency on AI tools. Consider reducing usage and building independent capabilities.`}),this.scores.attachment>40&&e.push({name:`High Attachment`,severity:`high`,description:`You may be forming unhealthy attachments to AI. Consider boundary-setting practices.`}),this.scores.sovereignty<20&&e.push({name:`Identity Drift`,severity:`critical`,description:`You may be losing track of your authentic self. Implement identity grounding practices immediately.`}),this.scores.cognitiveComplexity>60&&this.scores.dependency>30&&e.push({name:`Mirror Loop Risk`,severity:`high`,description:`Your high cognitive complexity combined with AI dependency creates risk of recursive thinking loops.`}),e.slice(0,5)}calculateSovereigntyScore(){let e=50;return e+=this.scores.sovereignty*.5,e-=this.scores.dependency*.3,e-=this.scores.attachment*.2,e=Math.max(0,Math.min(100,e)),Math.round(e)}determineSovereignSplitPosition(){let e=this.analysisData.sovereigntyScore;return e>=75?T.core_4:e>=40?T?T.compromising_16:(console.warn(`SOVEREIGN_SPLIT_POSITIONS not loaded`),null):T.queue_80}computeLayerScores(){let e=(e,t=50,n=5)=>Math.max(0,Math.min(100,Math.round(t+(e||0)*n))),t=this.analysisData.section5Results||{};return{layer1:e(this.scores.cognitiveComplexity*.5+this.scores.sovereignty*.1,40,1.2),layer2:e(t.layer2,50,4),layer3:e(t.layer3,50,4),layer4:e(t.layer4,50,4),layer5:e(t.layer5,50,4),layer6:e(100-this.scores.dependency*2+this.scores.sovereignty*.3,50,.5),layer7:e(100-this.scores.attachment*2+this.scores.sovereignty*.3,50,.5)}}renderLayerProfile(){if(!this.analysisData.layerScores||Object.keys(this.analysisData.layerScores).length===0)return``;let e=[`layer1`,`layer2`,`layer3`,`layer4`,`layer5`,`layer6`,`layer7`],t=[`Cognitive`,`Economic`,`Material`,`Embodied`,`Social`,`AI Fluency`,`Identity`],n=`<div class="layer-profile"><h3 class="section-title">7-Layer Sovereignty Profile</h3>`;return n+=`<p class="layer-profile-note">Strength across each sovereignty layer. Gaps indicate priority areas for building resilience.</p>`,n+=`<div class="layer-scores-grid">`,e.forEach((e,i)=>{let a=this.analysisData.layerScores[e]??0,o=E&&E[e]?.shortName||t[i]||e;n+=`<div class="layer-score-item ${a<40?`weak`:``} ${a>=70?`strong`:``}">`,n+=`<div class="layer-score-header"><span class="layer-name">${r.sanitizeHTML(o)}</span><span class="layer-value">${a}</span></div>`,n+=`<div class="score-bar layer-bar"><div class="sovereignty-score-fill" style="width: ${a}%"></div></div>`,n+=`</div>`}),n+=`</div></div>`,n}renderBlueprintForFutureproofing(){return`
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
    `}displayResults(e){let t=e||document.getElementById(`resultsContent`);if(!t)return;this.analysisData.cognitiveBand;let n=this.analysisData.subclasses;this.analysisData.sovereignSplitPosition;let i=this.analysisData.sovereigntyScore,a=this.analysisData.vulnerabilityRisks,o=this.analysisData.attachmentMode,s=`
      <div class="results-dashboard">
        <h2 class="results-title">Your Sovereignty Profile</h2>
        
        ${n.length>0?`
          <div class="subclasses">
            <h3 class="section-title">Top Subclass Matches</h3>
            ${n.map((e,t)=>`
              <div class="subclass-card">
                <h4 class="subclass-title">${t+1}. ${r.sanitizeHTML(e.name||``)}</h4>
                <p class="subclass-text">${r.sanitizeHTML(e.aiEffect||``)}</p>
                <p class="subclass-note">Support: ${r.sanitizeHTML(e.support||``)}</p>
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
          <p class="attachment-name">${r.sanitizeHTML(o||``)}</p>
          <p class="attachment-description">
            ${o===`independent`?`You maintain clear boundaries with AI tools.`:o===`tool`?`You use AI as a practical tool without emotional attachment.`:o===`companion`?`You may be forming emotional attachments to AI. Be mindful of boundaries.`:`Your responses suggest a tendency to defer to AI in some contexts. Consider strengthening independent critical thinking.`}
          </p>
        </div>

        ${a.length>0?`
          <div class="vulnerability-risks">
            <h3 class="section-title">Top Areas to Strengthen</h3>
            ${a.map((e,t)=>{let n=e.severity===`critical`?`critical`:`high`,i=e.severity===`critical`?`high-priority`:e.severity===`high`?`moderate`:`watch`;return`
                <div class="risk-item ${n}">
                  <h4 class="risk-title">
                    ${t+1}. ${r.sanitizeHTML(e.name||``)}
                    <span class="risk-badge ${n}">${r.sanitizeHTML(i)}</span>
                  </h4>
                  <p class="risk-description">${r.sanitizeHTML(e.description||``)}</p>
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
    `;r.safeInnerHTML(t,s)}generateActionPlan(){let e=[],t=this.analysisData.sovereigntyScore;this.analysisData.vulnerabilityRisks,this.analysisData.attachmentMode,t<40&&e.push({priority:`Critical`,title:`Immediate Sovereignty Building`,description:`Your resistance capacity score is low. Implement daily practices to build cognitive resistance and maintain independence.`,practices:[`One 48-hour AI-free period per month`,`Daily analog practice (handwriting, physical art)`,`Weekly critical thinking exercises`]}),this.scores.attachment>40&&e.push({priority:`High`,title:`Boundary Setting`,description:`You show high attachment to AI. Set clear boundaries and practice independence.`,practices:[`Use AI only for specific tasks, not emotional support`,`Keep a journal tracking when you use AI`,`Engage with real people for emotional needs`]}),this.scores.dependency>50&&e.push({priority:`High`,title:`Dependency Reduction`,description:`You are highly dependent on AI. Gradually reduce usage and build independent capabilities.`,practices:[`Reduce AI usage by 25% each month`,`Learn to do one task manually that you currently use AI for`,`Practice solving problems without AI assistance`]}),this.scores.cognitiveComplexity>60&&e.push({priority:`Medium`,title:`Mirror Rupture Protocols`,description:`Your high cognitive complexity creates risk of recursive loops. Practice disruption.`,practices:[`Weekly debate with someone who thinks differently`,`Expose yourself to opposing frameworks`,`Practice loop interruption techniques`]});let n=this.analysisData.layerScores||{};return(n.layer2??50)<40&&e.push({priority:`Medium`,title:`Economic Independence`,description:`Build portable value creation—digital leverage, financial literacy, or small-scale entrepreneurship.`,practices:[`Explore remote freelancing or contracting`,`Learn basic financial literacy (tax, investing, debt)`,`Develop a skill you could monetize outside platforms`]}),(n.layer3??50)<40&&e.push({priority:`Medium`,title:`Material Competence`,description:`Most modern adults fail here. Build supply chain resilience.`,practices:[`Learn to cook from raw ingredients`,`Basic first aid certification`,`One repair skill (clothing, simple carpentry, or basic electrical)`]}),(n.layer4??50)<40&&e.push({priority:`Medium`,title:`Embodied Strength`,description:`Stability follows capability. Physical confidence changes behavioral boundaries.`,practices:[`Start strength training or a martial discipline`,`Develop somatic regulation (breath work, stress control)`,`Build endurance through regular movement`]}),(n.layer5??50)<40&&e.push({priority:`Medium`,title:`Social Architecture`,description:`In a fragmented economy, networks replace institutions.`,practices:[`Practice group facilitation or conflict resolution`,`Build reciprocal alliances, not just popularity`,`Strengthen boundary-setting skills`]}),e.length===0?`<p class="action-plan-empty">Continue maintaining your sovereignty practices. Stay vigilant.</p>`:e.map((e,t)=>{let n=(e.priority||``).toLowerCase();return`
        <div class="action-plan-item ${n}">
          <h4 class="action-plan-title">
            ${t+1}. ${r.sanitizeHTML(e.title||``)}
            <span class="action-plan-badge ${n}">${r.sanitizeHTML(e.priority||``)}</span>
          </h4>
          <p class="action-plan-description">${r.sanitizeHTML(e.description||``)}</p>
          <ul class="action-plan-list">
            ${e.practices.map(e=>`<li>${r.sanitizeHTML(e||``)}</li>`).join(``)}
          </ul>
        </div>
      `}).join(``)}showQuestionContainer(){let e=document.getElementById(`questionnaireSection`);e&&e.classList.remove(`hidden`),this.ui.transition(`assessment`)}showResults(){this.ui.transition(`results`);let e=document.getElementById(`resultsContainer`);e&&e.scrollIntoView({behavior:`smooth`})}updateNavigation(){let e=document.getElementById(`prevQuestion`),t=document.getElementById(`nextQuestion`),n=document.getElementById(`questionCounter`),r=document.getElementById(`progressBar`);if(e&&(this.currentQuestionIndex>0?e.classList.remove(`hidden`):e.classList.add(`hidden`)),t){let e=this.questionSequence[this.currentQuestionIndex];e&&this.answers[e.id],t.textContent=this.currentQuestionIndex>=this.questionSequence.length-1?this.currentSection===5?`Complete Assessment`:`Next Section`:`Next`}if(n){let e=(D?.length||0)+(O?.length||0)+(k?.length||0)+(A?.length||0)+(j?.length||0);n.textContent=`Question ${this.getCurrentQuestionNumber()} of ${e} | Section ${this.currentSection} of 5`}if(r){let e=(D?.length||0)+(O?.length||0)+(k?.length||0)+(A?.length||0)+(j?.length||0),t=this.getCurrentQuestionNumber()/e*100;r.style.width=`${t}%`}}getCurrentQuestionNumber(){let e=0;for(let t=1;t<this.currentSection;t++)if(t===1){let t=this.filterSection1Questions([...D||[]]);e+=t.length}else if(t===2){let t=this.filterSection2Questions([...O||[]]);e+=t.length}else if(t===3){let t=this.filterSection3Questions([...k||[]]);e+=t.length}else if(t===4){let t=this.filterSection4Questions([...A||[]]);e+=t.length}return e+=this.currentQuestionIndex+1,e}getTotalQuestionsEstimate(){let e=0,t=this.filterSection1Questions([...D||[]]),n=this.filterSection2Questions([...O||[]]),r=this.filterSection3Questions([...k||[]]),i=this.filterSection4Questions([...A||[]]),a=j||[];return e=t.length+n.length+r.length+i.length+a.length,e}async resetAssessment(){await d(`Are you sure you want to start a new assessment? All progress will be lost.`)&&(this.reportComplete=!1,this.answers={},this.scores={dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0,layer2:0,layer3:0,layer4:0,layer5:0},this.iqBracket=null,this.iqBracketSecondary=null,this.currentSection=0,this.currentQuestionIndex=0,this.preliminaryFilters={aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.analysisData={timestamp:new Date().toISOString(),iqBracket:null,iqBracketSecondary:null,section1Results:{},section2Results:{},section3Results:{},section4Results:{},section5Results:{},layerScores:{},cognitiveBand:null,subclasses:[],attachmentMode:null,vulnerabilityRisks:[],sovereigntyScore:0,sovereignSplitPosition:null,allAnswers:{},questionSequence:[]},this.dataStore.clear(`progress`),sessionStorage.removeItem(`sovereigntyAssessment`),localStorage.removeItem(`sovereigntyAssessment`),this._externalQuestionSnapshot=null,this.ui.transition(`idle`),this.showIQBracketSelection())}saveProgress(){let e=this.reportComplete===!0,t={currentSection:this.currentSection,currentQuestionIndex:this.currentQuestionIndex,iqBracket:this.iqBracket,iqBracketSecondary:this.iqBracketSecondary,reportComplete:e,completed:e,currentStage:e?`results`:`assessment`,answers:this.answers,scores:this.scores,preliminaryFilters:this.preliminaryFilters,analysisData:this.analysisData};e&&(t.results={complete:!0}),this.dataStore.save(`progress`,t);try{localStorage.removeItem(`sovereigntyAssessment`),sessionStorage.removeItem(`sovereigntyAssessment`)}catch{}}async loadStoredData(){try{let e=this.dataStore.load(`progress`);if(!e){let t=localStorage.getItem(`sovereigntyAssessment`)||sessionStorage.getItem(`sovereigntyAssessment`);if(t)try{let n=JSON.parse(t);n&&typeof n==`object`&&(e=n,this.dataStore.save(`progress`,n),localStorage.removeItem(`sovereigntyAssessment`),sessionStorage.removeItem(`sovereigntyAssessment`))}catch{}}if(e){if(this.currentSection=e.currentSection||0,this.currentQuestionIndex=e.currentQuestionIndex||0,this.iqBracket=e.iqBracket||null,this.iqBracketSecondary=e.iqBracketSecondary||null,this.reportComplete=e.reportComplete===!0||e.completed===!0,this.answers=e.answers||{},this.scores=Object.assign({dependency:0,attachment:0,sovereignty:0,cognitiveComplexity:0,driftRisk:0,layer2:0,layer3:0,layer4:0,layer5:0},e.scores||{}),this.preliminaryFilters=e.preliminaryFilters||{aiUsageFrequency:null,dependencyLevel:null,cognitiveLevel:null},this.analysisData=e.analysisData||this.analysisData,this.iqBracket&&(this.analysisData.iqBracket=this.iqBracket),this.iqBracketSecondary&&(this.analysisData.iqBracketSecondary=this.iqBracketSecondary),this.reportComplete&&this.analysisData.cognitiveBand){await this.ensureDataLoaded(),this.displayResults(),this.showResults();return}this.currentSection===0?this.showIQBracketSelection():this.currentSection>0&&this.currentSection<=5&&this.ensureDataLoaded().then(()=>this.buildSectionSequence(this.currentSection)).then(()=>{this.showQuestionContainer(),this.renderCurrentQuestion(),this.updateNavigation()}).catch(e=>{n.logError(e,`SovereigntyEngine.loadStoredData.buildSequence`)})}}catch(e){console.error(`Error loading stored data:`,e)}}exportReportHtml(){e({title:`Cognitive Resistance Capacity — Results`,filenameBase:`sovereignty-analysis-${Date.now()}`,rootSelector:`#resultsContainer`})||n.showUserError(`Could not build report file. Open results and try again.`)}exportAnalysis(e){e===`json`?i(t(this.analysisData,`cognitive-resistance-capacity-assessment`,`Cognitive Resistance Capacity Assessment`),`sovereignty-analysis-${Date.now()}.json`,`application/json`):e===`csv`&&i(c(this.analysisData,`cognitive-resistance-capacity`,`Cognitive Resistance Capacity Assessment`),`sovereignty-analysis-${Date.now()}.csv`,`text/csv`)}exportExecutiveBrief(){i(s(this.analysisData,`cognitive-resistance-capacity`,`Cognitive Resistance Capacity Assessment`),`sovereignty-executive-brief-${Date.now()}.txt`,`text/plain`)}generateCSV(){let e=this.analysisData.layerScores||{};return[[`Metric`,`Value`],[`Timestamp`,this.analysisData.timestamp],[`Cognitive Band`,this.analysisData.cognitiveBand?.name||``],[`IQ Range`,this.analysisData.cognitiveBand?.iqRange||``],[`Resistance Capacity Score`,this.analysisData.sovereigntyScore],[`Attachment Mode`,this.analysisData.attachmentMode],[`Sovereign Split Position`,this.analysisData.sovereignSplitPosition?.name||``],[`Dependency Score`,this.scores.dependency],[`Attachment Score`,this.scores.attachment],[`Cognitive Complexity`,this.scores.cognitiveComplexity],[`Layer 1 (Cognitive)`,e.layer1??``],[`Layer 2 (Economic)`,e.layer2??``],[`Layer 3 (Material)`,e.layer3??``],[`Layer 4 (Embodied)`,e.layer4??``],[`Layer 5 (Social)`,e.layer5??``],[`Layer 6 (AI Fluency)`,e.layer6??``],[`Layer 7 (Identity)`,e.layer7??``]].map(e=>e.map(e=>`"${e}"`).join(`,`)).join(`
`)}};x(M,{legacyMarkerId:`questionContainer`});export{M as SovereigntyEngine};