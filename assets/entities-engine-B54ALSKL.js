import{_ as e,c as t,g as n,h as r,t as i,u as a,v as o,y as s}from"./spa-engine-external-BxdCER2C.js";import{t as c}from"./debug-reporter-DrTQ2iO2.js";import{a as l,i as u,n as d,o as f,t as p}from"./spa-questionnaire-host-B3yISnrE.js";var m,h,g,_,v,y,b,x,S,C=class{constructor(e={}){i(this,e),this.currentQuestionIndex=0,this.currentStage=`tier`,this.answers={},this.tasteSkews=[],this.contractTheme=``,this.reportComplete=!1,this.intake={pathologyCategory:``,pathologyDisorder:``,node:``,channel:``,rootNeed:``},this.analysisData={timestamp:new Date().toISOString(),intake:{},tierScores:{},tierResult:null,tasteSkews:[],tasteSkewSelections:[],tasteSkewSuggestions:[],contract:null},this.ui=d(this,{idle:{show:[`#introSection`,`#intakeSection`,`#actionButtonsSection`,`#disclaimerSection`],hide:[`#questionnaireSection`,`#resultsSection`]},assessment:{show:[`#questionnaireSection`],hide:[`#introSection`,`#intakeSection`,`#actionButtonsSection`,`#disclaimerSection`,`#resultsSection`]},results:{show:[`#resultsSection`],hide:[`#introSection`,`#intakeSection`,`#actionButtonsSection`,`#disclaimerSection`,`#questionnaireSection`]}}),this.debugReporter=c(`EntitiesEngine`),s(this.debugReporter),this.debugReporter.markInitialized(),this.dataStore=new r(`entities-assessment`,`1.0.0`),this.ready=this.init()}async init(){try{if(await this.loadEntitiesData(),this.externalUI||(this.populateIntakeSelectors(),this.bindEvents()),await this.loadStoredData(),!this.externalUI&&this.shouldAutoGenerateSample()){await this.generateSampleReport();return}if(!this.externalUI&&this._storageAppliedUi)return;this.externalUI||this.ui.transition(`idle`),u(this)}catch(e){this.debugReporter.logError(e,`EntitiesEngine init`),n.showUserError(`Failed to initialize the entities assessment.`)}}async loadEntitiesData(){if(m&&h&&v)return;m=(await o(`./dsm5-data.js`,`DSM-5 Data`)).DSM5_CATEGORIES,h=(await o(`./channel-data/nodes.js`,`Channel Nodes`)).NODES,g=(await o(`./channel-data/channels.js`,`Channel Channels`)).CHANNELS,_=(await o(`./needs-dependency-data/needs-vocabulary.js`,`Needs Vocabulary`)).NEEDS_VOCABULARY;let e=await o(`./entities-data.js`,`Entities Data`);v=e.WILL_ANOMALY_TIERS,y=e.WILL_ANOMALY_QUESTIONS,e.TASTE_SKEW_OPTIONS,b=e.CONTRACT_THEMES,x=e.NODE_CONTRACT_MAP,S=e.NODE_TAINTED_EXPRESSIONS}populateIntakeSelectors(){let e=document.getElementById(`pathologyCategory`),t=document.getElementById(`pathologyDisorder`),n=document.getElementById(`nodeSelect`),r=document.getElementById(`channelSelect`),i=document.getElementById(`rootNeedSelect`);e&&(e.innerHTML=`<option value="">Select a pathology category</option>`,Object.entries(m||{}).forEach(([t,n])=>{let r=document.createElement(`option`);r.value=t,r.textContent=n.name,e.appendChild(r)}),e.addEventListener(`change`,()=>{let n=e.value;this.populateDisorders(t,n)})),n&&(n.innerHTML=`<option value="">Select a primary node</option>`,Object.values(h||{}).forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=`${e.name} — ${e.description}`,n.appendChild(t)}),n.addEventListener(`change`,()=>{this.populateChannels(r,n.value)})),r&&this.populateChannels(r,``),i&&(i.innerHTML=`<option value="">Select a root need</option>`,Object.values(_||{}).forEach(e=>{e.needs.forEach(t=>{let n=document.createElement(`option`);n.value=t,n.textContent=`${e.category}: ${t}`,i.appendChild(n)})}))}populateDisorders(e,t){if(!e)return;e.innerHTML=`<option value="">Select a disorder</option>`;let n=m?.[t];n?.disorders&&Object.keys(n.disorders).forEach(t=>{let n=document.createElement(`option`);n.value=t,n.textContent=t,e.appendChild(n)})}populateChannels(e,t){e&&(e.innerHTML=`<option value="">Select a channel</option>`,Object.values(g||{}).forEach(n=>{if(t&&n.from!==t&&n.to!==t)return;let r=document.createElement(`option`);r.value=n.id,r.textContent=n.name,e.appendChild(r)}))}bindEvents(){let e=document.getElementById(`startAssessment`);e&&e.addEventListener(`click`,()=>this.startAssessment());let t=document.getElementById(`generateSampleReport`);t&&t.addEventListener(`click`,()=>this.generateSampleReport());let n=document.getElementById(`prevQuestion`),r=document.getElementById(`nextQuestion`);n&&n.addEventListener(`click`,()=>this.prevQuestion()),r&&r.addEventListener(`click`,()=>this.nextQuestion());let i=document.getElementById(`exportReportHtml`);i&&i.addEventListener(`click`,()=>this.exportReportHtml());let a=document.getElementById(`abandonAssessment`);a&&a.addEventListener(`click`,()=>this.promptAbandonDuringAssessment());let o=document.getElementById(`newAssessment`);o&&o.addEventListener(`click`,()=>this.promptStartNewFromReport())}async promptAbandonDuringAssessment(){await t(`Are you sure you want to abandon this assessment? All progress will be lost.`)&&this.resetAssessment()}async promptStartNewFromReport(){await t(`Start a new assessment? Your saved report will be cleared.`)&&this.resetAssessment()}exportReportHtml(){a({title:`Entities Assessment Results`,filenameBase:`entities-assessment-${Date.now()}`,rootSelector:`#resultsSection`})||n.showUserError(`Could not build report file. Open results and try again.`)}shouldAutoGenerateSample(){let e=new URLSearchParams(window.location.search);if(!e.has(`sample`))return!1;let t=e.get(`sample`);return t===null||t===``||t===`1`||t===`true`}captureIntake(){this.intake={pathologyCategory:document.getElementById(`pathologyCategory`)?.value||``,pathologyDisorder:document.getElementById(`pathologyDisorder`)?.value||``,node:document.getElementById(`nodeSelect`)?.value||``,channel:document.getElementById(`channelSelect`)?.value||``,rootNeed:document.getElementById(`rootNeedSelect`)?.value||``}}validateIntake(){let{pathologyCategory:e,pathologyDisorder:t,node:r,channel:i,rootNeed:a}=this.intake;return!e||!t||!r||!i||!a?(n.showUserError(`Please complete pathology, node/channel, and root need selections before starting.`),!1):!0}mountExternalShell(e){e&&(e.innerHTML=`
      <section id="intakeSection" class="content-section">
        <select id="pathologyCategory"><option value="">Select category</option></select>
        <select id="pathologyDisorder"><option value="">Select disorder</option></select>
        <select id="nodeSelect"><option value="">Select node</option></select>
        <select id="channelSelect"><option value="">Select channel</option></select>
        <select id="rootNeedSelect"><option value="">Select need</option></select>
        <button type="button" class="btn btn-primary" id="startAssessment">Begin Entities Assessment</button>
      </section>
      <section id="questionnaireSection">
        <div id="questionCount"></div>
        <div class="progress-bar"><div id="progressFill"></div></div>
        <div id="questionContainer"></div>
        <button type="button" id="prevQuestion">Previous</button>
        <button type="button" id="nextQuestion">Next</button>
      </section>
      <section id="resultsSection" class="hidden"><div id="resultsContainer"></div></section>`,this.populateIntakeSelectors(),this.bindEvents())}startAssessment(){this.captureIntake(),this.validateIntake()&&(this.reportComplete=!1,this.currentQuestionIndex=0,this.currentStage=`tier`,this.answers={},this.tasteSkews=[],this.contractTheme=``,this.ui.transition(`assessment`),this.renderCurrentQuestion(),this.saveProgress())}renderCurrentQuestion(){if(this.currentStage===`taste`){this.renderTasteSkewStep();return}let t=this.externalUI&&this._externalQuestionMount||document.getElementById(`questionContainer`),n=document.getElementById(`questionCount`),r=document.getElementById(`progressFill`),i=y[this.currentQuestionIndex];if(!i||!t)return;n&&(n.textContent=`Question ${this.currentQuestionIndex+1} of ${y.length}`),r&&(r.style.width=`${(this.currentQuestionIndex+1)/y.length*100}%`);let a=i.options.map((t,n)=>{let r=this.answers[i.id]===n?`checked`:``;return`
        <label class="option-label">
          <input type="radio" name="question_${i.id}" value="${n}" ${r}>
          <span>${e.sanitizeHTML(t.label)}</span>
        </label>
      `}).join(``);t.innerHTML=`
      <div class="question-block">
        <h3>${e.sanitizeHTML(i.text)}</h3>
        <div class="options-container">
          ${a}
        </div>
      </div>
    `,t.querySelectorAll(`input[type="radio"]`).forEach(e=>{e.addEventListener(`change`,()=>{this.answers[i.id]=parseInt(e.value,10),this.saveProgress()})}),this.updateNavButtons(),setTimeout(()=>t.scrollIntoView({behavior:`smooth`,block:`start`}),100)}updateNavButtons(){let e=document.getElementById(`prevQuestion`),t=document.getElementById(`nextQuestion`);e&&(e.disabled=this.currentStage===`tier`&&this.currentQuestionIndex===0),t&&(this.currentStage===`taste`?t.textContent=`Finish`:t.textContent=(this.currentQuestionIndex,y.length-1,`Next`))}prevQuestion(){if(this.currentStage===`taste`){this.currentStage=`tier`,this.currentQuestionIndex=y.length-1,this.renderCurrentQuestion(),this.saveProgress();return}this.currentQuestionIndex!==0&&(--this.currentQuestionIndex,this.renderCurrentQuestion(),this.saveProgress())}nextQuestion(){if(this.currentStage===`taste`){this.completeAssessment();return}let e=y[this.currentQuestionIndex];if(!e||typeof this.answers[e.id]!=`number`){n.showUserError(`Please select an option to continue.`);return}if(this.currentQuestionIndex<y.length-1){this.currentQuestionIndex+=1,this.renderCurrentQuestion(),this.saveProgress();return}this.currentStage=`taste`,this.renderCurrentQuestion(),this.saveProgress()}renderTasteSkewStep(){let t=document.getElementById(`questionContainer`),n=document.getElementById(`questionCount`),r=document.getElementById(`progressFill`);if(!t)return;n&&(n.textContent=`Taste Skew Investigation`),r&&(r.style.width=`100%`);let i=this.intake.node,a=this.intake.channel,o=S?.[i]||[],s=g?.[a]?.blocked||``;[...o,...s?[s]:[]];let c=new Set(this.tasteSkews||[]),l=t=>`
      <label class="option-label">
        <input type="checkbox" value="${e.sanitizeHTML(t)}" ${c.has(t)?`checked`:``}>
        <span>${e.sanitizeHTML(t)}</span>
      </label>
    `;t.innerHTML=`
      <div class="question-block">
        <h3>Taste Skew and Tainted Expressions</h3>
        <p class="form-help">Select any distorted habits or lifestyle expressions that resonate. These are inferred from the node and channel library.</p>
        ${o.length?`
          <h4>Node Taint Expressions</h4>
          <div class="options-container">
            ${o.map(l).join(``)}
          </div>
        `:``}
        ${s?`
          <h4>Channel Taint Expression</h4>
          <div class="options-container">
            ${[s].map(l).join(``)}
          </div>
        `:``}
      </div>
    `,t.querySelectorAll(`input[type="checkbox"]`).forEach(e=>{e.addEventListener(`change`,()=>{let e=Array.from(t.querySelectorAll(`input[type="checkbox"]`)).filter(e=>e.checked).map(e=>e.value);this.tasteSkews=e,this.saveProgress()})}),this.updateNavButtons()}scoreTiers(){let e={tier1:0,tier2:0,tier3:0};return y.forEach(t=>{let n=this.answers[t.id];if(typeof n!=`number`)return;let r=t.options[n];r?.scores&&Object.entries(r.scores).forEach(([t,n])=>{e[t]+=n})}),e}deriveContract(e){if(this.contractTheme)return b.find(e=>e.id===this.contractTheme)||null;let t=x?.[e]||``;return b.find(e=>e.id===t)||null}buildStrategySteps({tierResult:e,tierData:t,contract:n,nodeInfo:r,channelInfo:i,rootNeed:a}){let o=r?.name||`the selected node`,s=r?.function||`core function`,c=i?.name||`the selected channel`,l=i?.blocked||`a blocked flow pattern`,u=a?`root need "${a}"`:`the root need named in your loop chain`,d=n?.label||`the likely contract theme`;return e===`tier1`?[`Locate how ${o} (${s}) is hijacked; name the protector pattern that spikes it.`,`Trace the original threat or invalidation that formed this overcompensation around ${u}.`,`Re-regulate the ${o} node through daily boundary practice and reparenting in trigger contexts.`,`Address the channel disruption (${c}): ${l}`]:e===`tier2`?[`Dis‑identify from the foreign override and name the contract: ${d}.`,`Locate the wound tied to ${u} and demonstrate that the contract conditions no longer apply.`,`Stabilize the housing node (${o}) through consistent, grounded regulation.`,`Disrupt the channel pattern (${c}): ${l}`]:[`Stabilize safety and reduce exposure to reinforcing environments while restoring the ${o} node.`,`Use containment and external accountability to interrupt entrenched override patterns.`,`Address the channel distortion (${c}): ${l}`,`Pair reclamation with trauma‑focused modalities (e.g., EMDR) and structured support.`]}completeAssessment(){this.captureIntake();let e=this.scoreTiers(),t=Object.entries(e).sort((e,t)=>t[1]-e[1])[0]?.[0]||`tier1`,n=v[t],r=this.deriveContract(this.intake.node),i=h?.[this.intake.node],a=g?.[this.intake.channel],o=S?.[this.intake.node]||[],s=g?.[this.intake.channel]?.blocked||``,c=[...o,...s?[s]:[]],l=this.buildStrategySteps({tierResult:t,tierData:n,contract:r,nodeInfo:i,channelInfo:a,rootNeed:this.intake.rootNeed});this.analysisData={timestamp:new Date().toISOString(),intake:{...this.intake},tierScores:e,tierResult:t,tierSummary:n,strategySteps:l,tasteSkews:n?.tasteSkew||[],tasteSkewSelections:this.tasteSkews||[],tasteSkewSuggestions:c,contract:r},this.reportComplete=!0,this.currentStage=`results`,this.ui.transition(`results`),this.externalUI?f(this,this.renderResults):this.renderResults(),this.saveProgress()}renderResults(t){let n=t||document.getElementById(`resultsContainer`);if(!n)return;let r=this.analysisData.tierSummary,i=this.analysisData.contract,a=m?.[this.intake.pathologyCategory]?.name||this.intake.pathologyCategory,o=h?.[this.intake.node]?.name||this.intake.node,s=g?.[this.intake.channel]?.name||this.intake.channel;n.innerHTML=`
      <div class="panel panel-outline-accent">
        <p class="form-help">This estimate is based on structured self-report patterns and should be interpreted as directional guidance, not definitive judgment.</p>
        <h3 class="panel-title">Intake Summary</h3>
        <ul class="feature-list">
          <li><strong>Pathology:</strong> ${e.sanitizeHTML(a||`—`)} — ${e.sanitizeHTML(this.intake.pathologyDisorder||`—`)}</li>
          <li><strong>Node/Channel:</strong> ${e.sanitizeHTML(o||`—`)} / ${e.sanitizeHTML(s||`—`)}</li>
          <li><strong>Root Need:</strong> ${e.sanitizeHTML(this.intake.rootNeed||`—`)}</li>
        </ul>
      </div>
      <div class="panel panel-outline">
        <h3 class="panel-title">Will Anomaly Tier</h3>
        <p class="panel-text"><strong>${e.sanitizeHTML(r?.label||``)}</strong> — ${e.sanitizeHTML(r?.subtitle||``)}</p>
        <p class="panel-text">${e.sanitizeHTML(r?.summary||``)}</p>
        <p class="panel-text"><strong>Diagnostic Signature:</strong> ${e.sanitizeHTML(r?.diagnosticSignature||``)}</p>
        <p class="panel-text"><strong>Primary Healing Mode:</strong> ${e.sanitizeHTML(r?.primaryHealingMode||``)}</p>
      </div>
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Taste Skew Consequences</h3>
        <ul class="feature-list">
          ${(r?.tasteSkew||[]).map(t=>`<li>${e.sanitizeHTML(t)}</li>`).join(``)}
        </ul>
      </div>
      <div class="panel panel-outline">
        <h3 class="panel-title">Tainted Node/Channel Expressions</h3>
        <p class="panel-text">Inferred from the selected node and channel:</p>
        <ul class="feature-list">
          ${(this.analysisData.tasteSkewSuggestions||[]).map(t=>`<li>${e.sanitizeHTML(t)}</li>`).join(``)}
        </ul>
        <p class="panel-text"><strong>Why the taint exists:</strong> The will traded clarity for relief. To meet the unmet need (${e.sanitizeHTML(this.intake.rootNeed||`unspecified`)}), taste and impulse skew toward short‑term safety or control, and the node/channel narrows around that bargain.</p>
      </div>
      ${this.analysisData.tasteSkewSelections?.length?`
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Selected Taste Skews</h3>
        <ul class="feature-list">
          ${this.analysisData.tasteSkewSelections.map(t=>`<li>${e.sanitizeHTML(t)}</li>`).join(``)}
        </ul>
      </div>
      `:``}
      <div class="panel panel-outline">
        <h3 class="panel-title">Likely Contract</h3>
        <p class="panel-text"><strong>${e.sanitizeHTML(i?.label||`Unspecified`)}</strong></p>
        <p class="panel-text">${e.sanitizeHTML(i?.description||`Consider which wound or unmet need might have anchored the contract.`)}</p>
        <p class="panel-text"><strong>Why the contract existed:</strong> It formed to meet the unmet need (${e.sanitizeHTML(this.intake.rootNeed||`unspecified`)}) when personal capacity felt insufficient. The contract supplied stability or protection at the cost of partial will‑surrender.</p>
      </div>
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Strategy for Reclamation</h3>
        <ul class="feature-list">
          ${(this.analysisData.strategySteps||r?.strategy||[]).map(t=>`<li>${e.sanitizeHTML(t)}</li>`).join(``)}
        </ul>
      </div>
      <div class="panel panel-outline">
        <p class="panel-text"><strong>Safety note:</strong> This framework is for structured self-inquiry. If experiences feel overwhelming or destabilizing, seek qualified support and prioritize safety.</p>
      </div>
      <div class="panel-brand-left" style="background: var(--glass); border-radius: var(--radius); padding: 1.25rem; margin-top: 2rem; border-left: 4px solid var(--accent);">
        <p style="margin: 0;"><strong style="color: var(--accent);">Explore further:</strong> Will anomalies intersect with other frameworks. <a href="channels.html">Channel Flow Diagnostics</a> maps node and channel health at a structural level; <a href="diagnosis.html">Pathology Assessment</a> offers symptom-based pattern recognition; <a href="needs-dependency.html">Dependency Loop Tracer</a> traces need patterns that may anchor the contract.</p>
      </div>
    `}saveProgress(){let e=this.reportComplete===!0,t={currentQuestionIndex:this.currentQuestionIndex,currentStage:this.currentStage,reportComplete:e,completed:e,answers:this.answers,tasteSkews:this.tasteSkews,intake:this.intake,analysisData:this.analysisData};e&&(t.results={complete:!0}),this.dataStore.save(`progress`,t)}async loadStoredData(){try{let e=this.dataStore.load(`progress`);if(!e){this._storageAppliedUi=!1;return}this.currentQuestionIndex=e.currentQuestionIndex||0,this.currentStage=e.currentStage||`tier`,this.reportComplete=e.reportComplete===!0||e.completed===!0,this.answers=e.answers||{},this.tasteSkews=e.tasteSkews||[],this.intake=e.intake||this.intake,this.analysisData=e.analysisData||this.analysisData,this._storageAppliedUi=!1,this.reportComplete&&this.analysisData?.tierResult?(this.renderResults(),this.ui.transition(`results`),this._storageAppliedUi=!0):this.analysisData?.tierResult?(this.reportComplete=!0,this.renderResults(),this.ui.transition(`results`),this._storageAppliedUi=!0):Object.keys(this.answers).length>0&&(this.ui.transition(`assessment`),this.renderCurrentQuestion(),this._storageAppliedUi=!0)}catch(e){this.debugReporter.logError(e,`loadStoredData`)}}generateSampleReport(){if(this.generateSample(),this.captureIntake(),!this.validateIntake())return;y.forEach(e=>{this.answers[e.id]=Math.floor(Math.random()*e.options.length)});let e=S?.[this.intake.node]||[],t=g?.[this.intake.channel]?.blocked||``,n=[...e,...t?[t]:[]];this.tasteSkews=n.length?[n[0]]:[],this.completeAssessment()}generateSample(){let e=Object.keys(m||{})[0],t=e?Object.keys(m[e].disorders||{})[0]:``,n=Object.keys(h||{})[0],r=Object.keys(g||{})[0],i=Object.values(_||{})[0]?.needs?.[0]||``;document.getElementById(`pathologyCategory`).value=e||``,this.populateDisorders(document.getElementById(`pathologyDisorder`),e||``),document.getElementById(`pathologyDisorder`).value=t||``,document.getElementById(`nodeSelect`).value=n||``,this.populateChannels(document.getElementById(`channelSelect`),n||``),document.getElementById(`channelSelect`).value=r||``,document.getElementById(`rootNeedSelect`).value=i||``}resetAssessment(){this.reportComplete=!1,this._storageAppliedUi=!1,this.dataStore.clear(`progress`),this.currentQuestionIndex=0,this.currentStage=`tier`,this.answers={},this.tasteSkews=[],this.analysisData={timestamp:new Date().toISOString(),intake:{},tierScores:{},tierResult:null,tasteSkews:[],tasteSkewSelections:[],tasteSkewSuggestions:[],contract:null},this._externalQuestionSnapshot=null,this.ui.transition(`idle`)}};p(C,{legacyMarkerId:`questionContainer`});function w(){window.entitiesEngine=new C}l(`questionContainer`,w);export{C as EntitiesEngine};