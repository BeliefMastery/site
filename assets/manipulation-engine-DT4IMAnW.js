import{_ as e,c as t,d as n,f as r,g as i,h as a,l as o,m as s,p as c,t as l,u,v as d,y as f}from"./spa-engine-external-BwN7bktj.js";import{t as p}from"./debug-reporter-B-MS2Y6w.js";import{a as m,i as h,n as g,o as _,t as v}from"./spa-questionnaire-host-Do04SsN7.js";var y,b,x,S,C,w,T,E=class{constructor(e={}){l(this,e),this.currentPhase=1,this.currentQuestionIndex=0,this.answers={},this.questionSequence=[],this.vectorScores={},this.prioritizedVectors=[],this.assessedVectors=[],this.reportComplete=!1,this.analysisData={timestamp:new Date().toISOString(),phase1Results:{},phase2Results:{},phase3Results:{},vectorScores:{},identifiedVectors:[],primaryVector:null,supportingVectors:[],tactics:[],structuralModifier:null,allAnswers:{},questionSequence:[]},this.debugReporter=p(`ManipulationEngine`),f(this.debugReporter),this.debugReporter.markInitialized(),this.dataStore=new a(`manipulation-assessment`,`1.0.0`),this.ui=g(this,{idle:{show:[`#introSection`,`#actionButtonsSection`],hide:[`#questionnaireSection`,`#resultsSection`]},assessment:{show:[`#questionnaireSection`],hide:[`#introSection`,`#actionButtonsSection`,`#resultsSection`]},results:{show:[`#resultsSection`],hide:[`#introSection`,`#actionButtonsSection`,`#questionnaireSection`]}}),this.ready=this.init()}init(){return this.externalUI||this.attachEventListeners(),Promise.resolve(this.loadStoredData()).then(()=>{if(!this.externalUI&&this.shouldAutoGenerateSample())return this.generateSampleReport();h(this)}).catch(e=>{this.debugReporter.logError(e,`init`)})}async loadManipulationData(){if(!(y&&w))try{y=(await d(`./manipulation-data/manipulation-vectors.js`,`Manipulation Vectors`)).MANIPULATION_VECTORS,b=(await d(`./manipulation-data/manipulation-tactics.js`,`Manipulation Tactics`)).MANIPULATION_TACTICS,x=(await d(`./manipulation-data/symptom-questions.js`,`Symptom Questions`)).SYMPTOM_QUESTIONS,S=(await d(`./manipulation-data/effect-questions.js`,`Effect Questions`)).EFFECT_QUESTIONS,C=(await d(`./manipulation-data/consequence-questions.js`,`Consequence Questions`)).CONSEQUENCE_QUESTIONS,(await d(`./manipulation-data/vector-mapping.js`,`Vector Mapping`)).VECTOR_MAPPING;let e=await d(`./manipulation-data/manipulation-questions-v2.js`,`Manipulation Questions`);w=e.PHASE_1_VECTOR_SCREENING,T=e.generatePhase3VectorQuestions,this.debugReporter.recordSection(`Phase 1`,w?.length||0)}catch(e){throw this.debugReporter.logError(e,`loadManipulationData`),i.showUserError(`Failed to load assessment data. Please refresh the page.`),e}}attachEventListeners(){let e=document.getElementById(`startAssessment`);e&&e.addEventListener(`click`,()=>this.startAssessment());let n=document.getElementById(`nextQuestion`);n&&n.addEventListener(`click`,()=>this.nextQuestion());let r=document.getElementById(`prevQuestion`);r&&r.addEventListener(`click`,()=>this.prevQuestion());let i=document.getElementById(`exportReportHtml`);i&&i.addEventListener(`click`,()=>this.exportReportHtml());let a=document.getElementById(`exportExecutiveBrief`);a&&a.addEventListener(`click`,()=>this.exportExecutiveBrief());let o=document.getElementById(`newAssessment`);o&&o.addEventListener(`click`,()=>this.resetAssessment());let s=document.getElementById(`generateSampleReport`);s&&s.addEventListener(`click`,()=>this.generateSampleReport());let c=document.getElementById(`abandonAssessment`);c&&c.addEventListener(`click`,async()=>{await t(`Are you sure you want to abandon this assessment? All progress will be lost.`)&&this.resetAssessment()}),document.addEventListener(`keydown`,e=>{e.key===`Enter`&&e.target.matches(`button, input[type="radio"], input[type="checkbox"]`)||(e.key===`ArrowRight`||e.key===`Enter`&&e.ctrlKey?(e.preventDefault(),this.nextQuestion()):(e.key===`ArrowLeft`||e.key===`Backspace`&&e.ctrlKey)&&(e.preventDefault(),this.prevQuestion()))})}shouldAutoGenerateSample(){let e=new URLSearchParams(window.location.search);if(!e.has(`sample`))return!1;let t=e.get(`sample`);return t===null||t===``||t===`1`||t===`true`}getEmptyAnalysisData(){return{timestamp:new Date().toISOString(),phase1Results:{},phase2Results:{},phase3Results:{},prioritizedVectors:[],assessedVectors:[],vectorScores:{},primaryVector:null,secondaryVectors:[],allAnswers:{},questionSequence:[]}}pickRandomIndices(e,t){let n=Array.from({length:e},(e,t)=>t);for(let e=n.length-1;e>0;--e){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,t)}answerQuestionForSample(e){if(!e||!Array.isArray(e.options)||e.options.length===0)return;if(e.type===`multiselect`){let t=e.maxSelections||3,n=Math.min(e.options.length,Math.max(1,Math.ceil(Math.random()*t))),r=this.pickRandomIndices(e.options.length,n).map(t=>e.options[t]);this.answers[e.id]=r,this.currentPhase===3&&this.processPhase3Answer(e);return}let t=e.options[Math.floor(Math.random()*e.options.length)];this.answers[e.id]=t,this.currentPhase===3&&this.processPhase3Answer(e)}async generateSampleReport(){try{if(await this.loadManipulationData(),this.currentPhase=1,this.currentQuestionIndex=0,this.answers={},this.questionSequence=[],this.prioritizedVectors=[],this.assessedVectors=[],this.analysisData=this.getEmptyAnalysisData(),await this.buildPhase1Sequence(),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),await this.analyzePhase1Results(),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),await this.processPhase2Results(),this.currentPhase===3&&this.questionSequence.length>0){for(let e=0;e<this.questionSequence.length;e+=1){let t=this.questionSequence[e];this.answerQuestionForSample(t)}this.processPhase3Results()}this.completeAssessment()}catch(e){this.debugReporter.logError(e,`generateSampleReport`),i.showUserError(`Failed to generate sample report. Please try again.`)}}startAssessment(){this.ui.transition(`assessment`),this.buildPhase1Sequence()}async buildPhase1Sequence(){await this.loadManipulationData(),this.questionSequence=[],this.currentPhase=1,this.currentQuestionIndex=0,this.questionSequence.push(...w),this.debugReporter.recordQuestionCount(this.questionSequence.length);let e=document.getElementById(`questionnaireSection`);e&&!e.classList.contains(`active`)&&e.classList.add(`active`),this.renderCurrentQuestion()}async analyzePhase1Results(){await this.loadManipulationData();try{this.vectorScores={},Object.keys(y).forEach(e=>{let t=y[e],n=0,r=0;w.forEach(t=>{let i=this.answers[t.id];if(i&&i.mapsTo&&i.mapsTo.vector===e){let e=i.mapsTo.state,t=i.mapsTo.weight||1;n+=(e===`high`?3:+(e===`medium`))*t,r+=t}});let i=r>0?n/r:0,a=i>=2?`high`:i>=.5?`medium`:`low`;this.vectorScores[e]={state:a,score:i,vector:t}}),this.analysisData.phase1Results=this.vectorScores,await this.buildPhase2Sequence()}catch(e){this.debugReporter.logError(e,`analyzePhase1Results`),i.showUserError(`Failed to analyze Phase 1 results. Please try again.`)}}async buildPhase2Sequence(){await this.loadManipulationData();try{this.questionSequence=[],this.currentPhase=2,this.currentQuestionIndex=0;let e=Object.keys(this.vectorScores).filter(e=>this.vectorScores[e].state===`high`||this.vectorScores[e].state===`medium`).map(e=>({id:e,vector:y[e],score:this.vectorScores[e].score,state:this.vectorScores[e].state})).sort((e,t)=>t.score-e.score).slice(0,6);this.questionSequence.push({id:`p2_prioritization`,question:`Based on your initial screening, which manipulation vectors would you like to explore in depth?`,type:`multiselect`,maxSelections:3,options:e.map(e=>({text:`${e.vector.name}: ${e.vector.description}`,mapsTo:{vector:e.id,priority:e.state===`high`?`high`:`medium`},vector:e.id})),phase:2,likelyVectors:e}),this.debugReporter.recordQuestionCount(this.questionSequence.length),this.renderCurrentQuestion()}catch(e){this.debugReporter.logError(e,`buildPhase2Sequence`),i.showUserError(`Failed to load Phase 2. Please refresh the page.`)}}async processPhase2Results(){try{let e=this.answers.p2_prioritization;Array.isArray(e)&&(this.prioritizedVectors=e.map(e=>e.mapsTo.vector),this.analysisData.prioritizedVectors=this.prioritizedVectors),await this.buildPhase3Sequence()}catch(e){this.debugReporter.logError(e,`processPhase2Results`),i.showUserError(`Failed to process Phase 2 results.`)}}async buildPhase3Sequence(){await this.loadManipulationData();try{this.questionSequence=[],this.currentPhase=3,this.currentQuestionIndex=0;let e={symptoms:[],effects:[],consequences:[]};Object.keys(x).forEach(t=>{let n=x[t];Array.isArray(n)&&e.symptoms.push(...n)}),Object.keys(S).forEach(t=>{let n=S[t];Array.isArray(n)&&e.effects.push(...n)}),Object.keys(C).forEach(t=>{let n=C[t];Array.isArray(n)&&e.consequences.push(...n)}),this.prioritizedVectors.forEach(t=>{let n=y[t];n&&T(t,n,e).forEach(e=>{this.questionSequence.push({...e,phase:3,vector:t})})}),this.renderCurrentQuestion()}catch(e){this.debugReporter.logError(e,`buildPhase3Sequence`),i.showUserError(`Failed to build Phase 3 sequence. Please try again.`)}}processPhase3Answer(e){if(e.type===`binary_unsure`){let t=this.answers[e.id];if(t&&t.text){let n=e.conditional&&e.conditional[t.text];if(n){let t=this.questionSequence.findIndex(t=>t.id===e.id);n.forEach((n,r)=>{this.questionSequence.splice(t+1+r,0,{...n,phase:3,vector:e.vector})})}}}else if(e.type===`multiselect`&&e.conditional&&e.conditional.selected){let t=this.answers[e.id];if(t&&Array.isArray(t)&&t.length>0){let n=t.map(e=>e.mapsTo?.symptomId||e.mapsTo?.effectId||e.mapsTo?.consequenceId).filter(Boolean),r=e.conditional.selected.filter(e=>{if(e.conditional!==!0)return!1;let t=e.originalQuestion?.id;return t&&n.includes(t)});if(r.length>0){let t=this.questionSequence.findIndex(t=>t.id===e.id);r.forEach((n,r)=>{this.questionSequence.findIndex(e=>e.id===n.id)===-1&&this.questionSequence.splice(t+1+r,0,{...n,phase:3,vector:e.vector})})}}}}renderCurrentQuestion(){let t=performance.now();if(this.currentQuestionIndex>=this.questionSequence.length){this.completePhase();return}let n=this.questionSequence[this.currentQuestionIndex],r=this.externalUI?this._externalQuestionMount:document.getElementById(`questionContainer`);if(!r){this.externalUI||i.showUserError(`Question container not found. Please refresh the page.`);return}try{let i=``;n.type===`three_point`?i=this.renderThreePointQuestion(n):n.type===`binary_unsure`?i=this.renderBinaryUnsureQuestion(n):n.type===`frequency`?i=this.renderFrequencyQuestion(n):n.type===`multiselect`&&(i=this.renderMultiselectQuestion(n)),e.safeInnerHTML(r,i),this.attachQuestionListeners(n),this.updateProgress(),this.updateNavigationButtons();let a=performance.now()-t;this.debugReporter.recordRender(`question`,a),setTimeout(()=>{r.scrollIntoView({behavior:`smooth`,block:`start`})},100);let o=r.querySelector(`input, button, select, textarea`);o&&s.focusElement(o)}catch(e){this.debugReporter.logError(e,`renderCurrentQuestion`),i.showUserError(`Failed to render question. Please refresh the page.`)}}renderThreePointQuestion(t){let n=this.answers[t.id];return`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${e.sanitizeHTML(t.question||``)}</h3>
        ${t.description?`<div class="question-description">${e.sanitizeHTML(t.description||``)}</div>`:``}
        <div class="three-point-options">
          ${t.options.map((r,i)=>`
            <label class="three-point-option ${n&&n.text===r.text?`selected`:``}">
              <input 
                type="radio" 
                name="question_${t.id}" 
                value="${i}"
                data-option-data='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ${n&&n.text===r.text?`checked`:``}
              />
              <span class="option-text">${e.sanitizeHTML(r.text||``)}</span>
            </label>
          `).join(``)}
        </div>
      </div>
    `}renderBinaryUnsureQuestion(t){let n=this.answers[t.id];return`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${e.sanitizeHTML(t.question||``)}</h3>
        ${t.description?`<div class="question-description">${e.sanitizeHTML(t.description||``)}</div>`:``}
        <div class="binary-unsure-options">
          ${t.options.map((r,i)=>`
            <label class="binary-unsure-option ${n&&n.text===r.text?`selected`:``}">
              <input 
                type="radio" 
                name="question_${t.id}" 
                value="${i}"
                data-option-data='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ${n&&n.text===r.text?`checked`:``}
              />
              <span class="option-text">${e.sanitizeHTML(r.text||``)}</span>
            </label>
          `).join(``)}
        </div>
      </div>
    `}renderFrequencyQuestion(t){let n=this.answers[t.id];return`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${e.sanitizeHTML(t.question||``)}</h3>
        ${t.description?`<div class="question-description">${e.sanitizeHTML(t.description||``)}</div>`:``}
        <div class="frequency-options">
          ${t.options.map((r,i)=>`
            <label class="frequency-option ${n&&n.text===r.text?`selected`:``}">
              <input 
                type="radio" 
                name="question_${t.id}" 
                value="${i}"
                data-option-data='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ${n&&n.text===r.text?`checked`:``}
              />
              <span class="option-text">${e.sanitizeHTML(r.text||``)}</span>
            </label>
          `).join(``)}
        </div>
      </div>
    `}renderMultiselectQuestion(t){let n=this.answers[t.id]||[],r=t.maxSelections||3;return t.id===`p2_prioritization`?this.renderPhase2Prioritization(t,n,r):`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${e.sanitizeHTML(t.question||``)}</h3>
        ${t.description?`<div class="question-description">${e.sanitizeHTML(t.description||``)}</div>`:``}
        <p class="selection-limit">Select all that apply${r<t.options.length?` (up to ${r})`:``}</p>
        <div class="multiselect-options">
          ${t.options.map((r,i)=>{let a=n.some(e=>e.text===r.text);return`
              <label class="multiselect-option ${a?`selected`:``}">
                <input 
                  type="checkbox" 
                  name="question_${t.id}" 
                  value="${i}"
                  data-option-data='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                  ${a?`checked`:``}
                />
                <span class="option-text">${e.sanitizeHTML(r.text||``)}</span>
              </label>
            `}).join(``)}
        </div>
        <div class="selection-count" id="selectionCount_${t.id}">Selected: ${n.length}${r<t.options.length?` / ${r}`:``}</div>
      </div>
    `}renderPhase2Prioritization(t,n,r){let i=Object.keys(this.vectorScores).filter(e=>this.vectorScores[e].state===`high`).map(e=>y[e].name),a=Object.keys(this.vectorScores).filter(e=>this.vectorScores[e].state===`medium`).map(e=>y[e].name),o=`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <div class="warning-box">
          <h4>Your Vector Screening Summary</h4>
          ${i.length>0?`<p><strong>High concern:</strong> ${i.map(t=>e.sanitizeHTML(t||``)).join(`, `)}</p>`:``}
          ${a.length>0?`<p><strong>Moderate concern:</strong> ${a.map(t=>e.sanitizeHTML(t||``)).join(`, `)}</p>`:``}
          <p>Based on this screening, select 2-3 manipulation vectors you'd like to explore in depth.</p>
        </div>
        <h3 class="question-text">${e.sanitizeHTML(t.question||``)}</h3>
        <p class="selection-limit">Select up to ${r}</p>
        <div class="multiselect-options">
    `;return t.options.forEach((r,i)=>{let a=n.some(e=>e.text===r.text),s=y[r.mapsTo.vector];o+=`
        <label class="multiselect-option ${a?`selected`:``}">
          <input 
            type="checkbox" 
            name="question_${t.id}" 
            value="${i}"
            data-option-data='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
            ${a?`checked`:``}
          />
          <div class="multiselect-content">
            <div class="multiselect-title vector-title">${e.sanitizeHTML(s.name||``)}</div>
            <div class="multiselect-description">${e.sanitizeHTML(s.description||``)}</div>
          </div>
        </label>
      `}),o+=`
        </div>
        <div class="selection-count" id="selectionCount_${t.id}">Selected: ${n.length} / ${r}</div>
      </div>
    `,o}attachQuestionListeners(e){if(e.type===`three_point`||e.type===`binary_unsure`||e.type===`frequency`)document.querySelectorAll(`input[name="question_${e.id}"]`).forEach(t=>{t.addEventListener(`change`,t=>{let n=JSON.parse(t.target.dataset.optionData);this.answers[e.id]=n,document.querySelectorAll(`.three-point-option, .binary-unsure-option, .frequency-option`).forEach(e=>{e.classList.remove(`selected`)}),t.target.closest(`label`).classList.add(`selected`),this.currentPhase===3&&this.processPhase3Answer(e),this.saveProgress()})});else if(e.type===`multiselect`){let t=document.querySelectorAll(`input[name="question_${e.id}"]`),n=e.maxSelections||3,r=document.getElementById(`selectionCount_${e.id}`);t.forEach(i=>{i.addEventListener(`change`,i=>{let a=Array.from(t).filter(e=>e.checked).map(e=>JSON.parse(e.dataset.optionData));if(a.length>n){i.target.checked=!1;return}if(this.answers[e.id]=a,document.querySelectorAll(`.multiselect-option`).forEach(e=>{e.classList.remove(`selected`)}),a.forEach(e=>{let n=Array.from(t).find(t=>JSON.parse(t.dataset.optionData).text===e.text);n&&n.closest(`label`).classList.add(`selected`)}),r){let t=n<e.options.length?` / ${n}`:``;r.textContent=`Selected: ${a.length}${t}`}this.currentPhase===3&&this.processPhase3Answer(e),this.saveProgress()})})}}getPhaseLabel(e){return{1:`Vector Screening`,2:`Vector Prioritization`,3:`Deep Assessment`}[e]||`Phase ${e}`}getPhaseLabelPlain(e){return{Ingress:`Entry Phase - Happens early in the relationship to draw you in`,Entrench:`Control Phase - Happens once they have you, to keep you trapped`,Extract:`Harvest Phase - Happens when they're taking what they want from you`}[e]||e||`Unknown phase`}getModeLabelPlain(e){return{Covert:`Hidden/Subtle - Hard to notice, sneaky manipulation`,Overt:`Open/Obvious - Direct and clear manipulation`,Contextual:`Depends on situation - Changes based on what works`,"Overt and Covert":`Both hidden and open - Uses whatever works in the moment`}[e]||e||`Unknown mode`}getActivationLevelLabel(e){return{high:`High - This manipulation is very active and strong`,medium:`Medium - This manipulation is moderately present`,low:`Low - This manipulation is present but weak`}[e]||e||`Unknown`}getStructuralModifierLabel(e){return{structural:`Structural - This is a deep, ongoing pattern that affects your whole life`,situational:`Situational - This happens in specific situations but isn't constant`,mixed:`Mixed - This shows up both as ongoing patterns and in specific situations`}[e]||e||`Unknown`}updateProgress(){let e=this.getTotalQuestions(),t=this.getCurrentQuestionNumber(),n=e>0?t/e*100:0,r=document.getElementById(`progressFill`);r&&(r.style.width=`${n}%`)}getTotalQuestions(){let e=0;return this.currentPhase>=1&&(e+=w.length),this.currentPhase>=2&&(e+=1),this.currentPhase>=3&&(e+=this.prioritizedVectors.length*6),e}getCurrentQuestionNumber(){let e=0;return this.currentPhase>1&&(e+=w.length),this.currentPhase>2&&(e+=1),e+=this.currentQuestionIndex,e}updateNavigationButtons(){let e=document.getElementById(`prevQuestion`),t=document.getElementById(`nextQuestion`);e&&(e.disabled=this.currentQuestionIndex===0&&this.currentPhase===1),t&&(t.textContent=this.currentQuestionIndex===this.questionSequence.length-1?`Complete Phase`:`Next`)}async nextQuestion(){let e=this.questionSequence[this.currentQuestionIndex];if(e&&!this.answers[e.id]){i.showUserError(`Please select an answer before proceeding.`);return}this.saveCurrentAnswer(),this.currentQuestionIndex++,this.saveProgress(),this.currentQuestionIndex<this.questionSequence.length?this.renderCurrentQuestion():await this.completePhase()}prevQuestion(){this.currentQuestionIndex>0?(this.saveCurrentAnswer(),this.currentQuestionIndex--,this.renderCurrentQuestion(),this.saveProgress()):this.currentPhase>1&&(this.currentPhase--,this.currentPhase===1?this.buildPhase1Sequence():this.currentPhase===2&&(this.analyzePhase1Results(),this.buildPhase2Sequence()),this.currentQuestionIndex=this.questionSequence.length-1,this.renderCurrentQuestion(),this.saveProgress())}saveCurrentAnswer(){}async completePhase(){try{this.currentPhase===1?(await this.analyzePhase1Results(),this.questionSequence.length>0?this.renderCurrentQuestion():this.completeAssessment()):this.currentPhase===2?(await this.processPhase2Results(),this.questionSequence.length>0?this.renderCurrentQuestion():this.completeAssessment()):this.currentPhase===3&&(this.processPhase3Results(),this.completeAssessment())}catch(e){this.debugReporter.logError(e,`completePhase`),i.showUserError(`Failed to complete phase. Please try again.`)}}processPhase3Results(){this.analysisData.phase3Results={},this.assessedVectors=[...this.prioritizedVectors],this.prioritizedVectors.forEach(e=>{let t=Object.keys(this.answers).filter(t=>t.startsWith(`p3_${e}`)).map(e=>this.answers[e]),n=t.filter(e=>e&&e.mapsTo&&e.mapsTo.category===`symptoms`),r=t.filter(e=>e&&e.mapsTo&&e.mapsTo.category===`effects`),i=t.filter(e=>e&&e.mapsTo&&e.mapsTo.category===`consequences`),a=e=>{if(e.length===0)return 0;let t=e.reduce((e,t)=>(t.mapsTo&&t.mapsTo.frequency,e+(t.mapsTo&&t.mapsTo.weight?t.mapsTo.weight:0)),0);return e.length>0?t/e.length:0};this.analysisData.phase3Results[e]={vector:y[e],symptoms:{present:n.some(e=>e.mapsTo&&e.mapsTo.flow===`present`),score:a(n.filter(e=>e.mapsTo&&e.mapsTo.frequency))},effects:{present:r.some(e=>e.mapsTo&&e.mapsTo.flow===`present`),score:a(r.filter(e=>e.mapsTo&&e.mapsTo.frequency))},consequences:{present:i.some(e=>e.mapsTo&&e.mapsTo.flow===`present`),score:a(i.filter(e=>e.mapsTo&&e.mapsTo.frequency))},answers:t}})}async completeAssessment(){this.calculateResults(),this.analysisData.allAnswers={...this.answers},this.analysisData.questionSequence=this.getAllQuestionsAnswered(),this.reportComplete=!0,this.externalUI?await _(this,this.renderResults):await this.renderResults(),this.saveProgress()}getAllQuestionsAnswered(){let e=[];return w.forEach(t=>{e.push({id:t.id,question:t.question,phase:1,answer:this.answers[t.id]})}),e}calculateResults(){this.analysisData.vectorScores={},Object.keys(this.analysisData.phase3Results||{}).forEach(e=>{let t=this.analysisData.phase3Results[e],n=y[e],r=t.symptoms.present?t.symptoms.score:0,i=t.effects.present?t.effects.score:0,a=t.consequences.present?t.consequences.score:0,o=(r+i+a)/3,s=o*n.weight;this.analysisData.vectorScores[e]={name:n.name,description:n.description,rawScore:o,weightedScore:s,symptoms:t.symptoms,effects:t.effects,consequences:t.consequences,activationLevel:s>=6?`high`:s>=3?`medium`:`low`}});let e=Object.entries(this.analysisData.vectorScores).map(([e,t])=>({key:e,...t})).sort((e,t)=>t.weightedScore-e.weightedScore);e.length>0&&(this.analysisData.primaryVector=e[0],this.analysisData.supportingVectors=e.slice(1),this.analysisData.identifiedVectors=e),this.determineStructuralModifier(),this.identifyTactics()}determineStructuralModifier(){if(!this.analysisData.primaryVector)return;let e=this.analysisData.primaryVector,t=e.consequences?e.consequences.score:0,n=e.effects?e.effects.score:0,r=e.symptoms?e.symptoms.score:0;t>=6&&n>=6?this.analysisData.structuralModifier=`structural`:r>=6&&t<5?this.analysisData.structuralModifier=`situational`:this.analysisData.structuralModifier=`mixed`}identifyTactics(){if(this.analysisData.tactics=[],this.analysisData.primaryVector){let e=y[this.analysisData.primaryVector.key];e&&e.tactics&&e.tactics.forEach(e=>{let t=b[e];t&&this.analysisData.tactics.push(t)})}}async renderResults(t){this.externalUI||this.ui.transition(`results`);let n=t||document.getElementById(`vectorResults`);if(!n){this.externalUI||i.showUserError(`Results container not found.`);return}try{await this.loadManipulationData();let t=`<div class="manipulation-summary">`;if(t+=`<h3>Manipulation Vector Analysis Results</h3>`,t+=`<p>Based on your responses, here are patterns that may be consistent with manipulation vectors and suggested strategies to strengthen your position.</p>`,t+=`<p class="form-help">This estimate is based on self-report patterns and is directional rather than definitive.</p>`,t+=`</div>`,this.analysisData.primaryVector){let n=this.analysisData.primaryVector,r=e.sanitizeHTML(n.name||`Unknown`),i=e.sanitizeHTML(n.description||``);t+=`
          <div class="vector-result warning-box">
            <h3>Primary Vector: ${r}</h3>
            <p>${i}</p>
            <p><strong>Activation Level:</strong> ${this.getActivationLevelLabel(n.activationLevel)}</p>
            ${this.analysisData.structuralModifier?`<p><strong>Pattern Type:</strong> ${this.getStructuralModifierLabel(this.analysisData.structuralModifier)}</p>`:``}
          </div>
        `}this.analysisData.supportingVectors&&this.analysisData.supportingVectors.length>0&&(t+=`<div class="supporting-vectors">`,t+=`<h4>Supporting Vectors</h4>`,this.analysisData.supportingVectors.forEach(n=>{let r=e.sanitizeHTML(n.name||`Unknown`),i=e.sanitizeHTML(n.description||``);t+=`
            <div class="vector-result" style="background: var(--glass); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
              <h4>${r}</h4>
              <p style="font-size: 0.9rem; color: var(--muted);">${i}</p>
            </div>
          `}),t+=`</div>`),this.analysisData.tactics&&this.analysisData.tactics.length>0&&(t+=`<div class="tactics-section">`,t+=`<h4>Identified Tactics</h4>`,t+=`<p class="content-section">These are specific manipulation tactics that may be present in your relationship. Each tactic includes examples and explanations in plain language.</p>`,this.analysisData.tactics.forEach(n=>{let r=this.getPhaseLabelPlain(n.phase),i=this.getModeLabelPlain(n.mode);t+=`
          <div class="tactic-item">
            <h5>${e.sanitizeHTML(n.name||``)}</h5>
            ${n.phase||n.mode?`
              <div class="tactic-context">
                ${n.mode?`<strong>How it works:</strong> ${e.sanitizeHTML(i||``)}`:``}
                ${n.phase&&n.mode?` • `:``}
                ${n.phase?`<strong>When it happens:</strong> ${e.sanitizeHTML(r||``)}`:``}
              </div>
            `:``}
            ${n.example?`
              <div class="tactic-example">
                <strong>Example:</strong>
                <p>"${e.sanitizeHTML(n.example||``)}"</p>
              </div>
            `:``}
            ${n.mechanism?`
              <div class="tactic-detail">
                <strong>What it does:</strong>
                <p>${e.sanitizeHTML(n.mechanism||``)}</p>
              </div>
            `:``}
            ${n.leverage?`
              <div class="tactic-detail">
                <strong>How it can influence your choices:</strong>
                <p>${e.sanitizeHTML(n.leverage||``)}</p>
              </div>
            `:``}
          </div>
        `}),t+=`</div>`),t+=`<div class="panel-brand-left" style="background: var(--glass); border-radius: var(--radius); padding: 1.25rem; margin-top: 2rem; border-left: 4px solid var(--accent);">`,t+=`<p style="margin: 0;"><strong style="color: var(--accent);">Explore further:</strong> Identifying vectors is the first step; building resistance is the next. <a href="sovereignty.html">Cognitive Resistance Capacity</a> maps your vulnerability profile and how to strengthen it; <a href="sovereignty-spectrum.html">Your Sovereignty Paradigm</a> shows how your values alignment affects what you defend against.</p>`,t+=`</div>`,e.safeInnerHTML(n,t)}catch(e){this.debugReporter.logError(e,`renderResults`),i.showUserError(`Failed to render results. Please refresh the page.`)}}exportReportHtml(){u({title:`Manipulation Vector Analysis`,filenameBase:`manipulation-analysis-${Date.now()}`,rootSelector:`#resultsSection`})||i.showUserError(`Could not build report file. Open results and try again.`)}exportAnalysis(e=`json`){e===`csv`?o(r(this.analysisData,`manipulation`,`Manipulation Vector Identification`),`manipulation-analysis-${Date.now()}.csv`,`text/csv`):o(c(this.analysisData,`manipulation`,`Manipulation Vector Identification`),`manipulation-analysis-${Date.now()}.json`,`application/json`)}exportExecutiveBrief(){o(n(this.analysisData,`manipulation`,`Manipulation Defense Decoder`),`manipulation-executive-brief-${Date.now()}.txt`,`text/plain`)}saveProgress(){try{let e={currentPhase:this.currentPhase,currentQuestionIndex:this.currentQuestionIndex,reportComplete:this.reportComplete===!0,answers:this.answers,vectorScores:this.vectorScores,prioritizedVectors:this.prioritizedVectors,assessedVectors:this.assessedVectors,analysisData:this.analysisData,timestamp:new Date().toISOString()};this.dataStore.save(`progress`,e)}catch(e){this.debugReporter.logError(e,`saveProgress`)}}async loadStoredData(){try{let e=this.dataStore.load(`progress`);if(!e)return;if(this.currentPhase=e.currentPhase||1,this.currentQuestionIndex=e.currentQuestionIndex||0,this.answers=e.answers||{},this.vectorScores=e.vectorScores||{},this.prioritizedVectors=e.prioritizedVectors||[],this.assessedVectors=e.assessedVectors||[],this.analysisData=e.analysisData||this.analysisData,this.reportComplete=e.reportComplete===!0,this.reportComplete&&this.analysisData?.primaryVector){await this.renderResults();return}(this.currentQuestionIndex>0||this.currentPhase>1)&&(this.currentPhase===1?await this.buildPhase1Sequence():this.currentPhase===2?(await this.analyzePhase1Results(),await this.buildPhase2Sequence()):this.currentPhase===3&&(await this.processPhase2Results(),await this.buildPhase3Sequence()),document.getElementById(`questionnaireSection`).classList.add(`active`),this.renderCurrentQuestion())}catch(e){console.error(`Error loading stored data:`,e)}}resetAssessment(){this.currentPhase=1,this.currentQuestionIndex=0,this.answers={},this.questionSequence=[],this.vectorScores={},this.prioritizedVectors=[],this.assessedVectors=[],this.analysisData={timestamp:new Date().toISOString(),phase1Results:{},phase2Results:{},phase3Results:{},vectorScores:{},identifiedVectors:[],primaryVector:null,supportingVectors:[],tactics:[],structuralModifier:null,allAnswers:{},questionSequence:[]},this.reportComplete=!1,sessionStorage.removeItem(`manipulationProgress`),this.dataStore.clear(`progress`),this.ui.transition(`idle`),this.buildPhase1Sequence()}};v(E,{legacyMarkerId:`questionContainer`});function D(){window.manipulationEngine=new E}m(`questionContainer`,D);export{E as ManipulationEngine};