import{t as e}from"./preload-helper-Cn2LLw11.js";var t=new Map,n=null;function r(e){n=e}async function i(r,i=null){if(n&&(n.registerDataModule(r,i||r),n.markModuleLoading(r)),t.has(r))return n&&n.markModuleLoaded(r,t.get(r)),t.get(r);try{let i=r;r.startsWith(`./`)?i=r.replace(`./`,`../`):!r.startsWith(`/`)&&!r.startsWith(`http`)&&!r.startsWith(`.`)&&(i=`../`+r);let a=new URL(i,import.meta.url).href,o=await e(()=>import(a),[]);return t.set(r,o),n&&n.markModuleLoaded(r,o),o}catch(e){throw n&&n.markModuleFailed(r,e),console.error(`Failed to load data module: ${r}`,e),e}}var a={sanitizeHTML(e){if(typeof e!=`string`)return e;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML},sanitizeForDisplay(e){if(typeof e==`string`)return this.sanitizeHTML(e);if(Array.isArray(e))return e.map(e=>this.sanitizeForDisplay(e));if(typeof e==`object`&&e){let t={};for(let[n,r]of Object.entries(e))t[n]=this.sanitizeForDisplay(r);return t}return e},safeInnerHTML(e,t){if(!e){console.warn(`SecurityUtils.safeInnerHTML: element is null or undefined`);return}if(typeof t!=`string`){console.warn(`SecurityUtils.safeInnerHTML: content is not a string`,typeof t),e.innerHTML=``;return}e.innerHTML=t},safeTemplate(e,t,n){if(!e||typeof t!=`function`){console.warn(`SecurityUtils.safeTemplate: invalid arguments`);return}let r=t(this.sanitizeForDisplay(n));e.innerHTML=this.sanitizeHTML(r)}},o=class{constructor(e){this.namespace=e,this.version=`1.0.0`}save(e,t){try{let n={version:this.version,timestamp:Date.now(),data:t};return e===`progress`&&localStorage.setItem(`resume:${this.namespace}`,`true`),localStorage.setItem(`${this.namespace}:${e}`,JSON.stringify(n)),!0}catch(t){console.error(`Save failed:`,t);try{return e===`progress`&&sessionStorage.setItem(`resume:${this.namespace}`,`true`),sessionStorage.setItem(`${this.namespace}:${e}`,JSON.stringify(payload)),!0}catch{return!1}}}load(e){try{let t=`resume:${this.namespace}`,n=localStorage.getItem(`${this.namespace}:${e}`),r=sessionStorage.getItem(`${this.namespace}:${e}`),i=n||r,a=sessionStorage.getItem(t)===`true`||localStorage.getItem(t)===`true`||!!n;if(e===`progress`&&!a||!i)return null;e===`progress`&&!sessionStorage.getItem(t)&&!localStorage.getItem(t)&&localStorage.setItem(t,`true`);let o=JSON.parse(i);return o.version===this.version?(e===`progress`&&a&&sessionStorage.removeItem(t),o.data):this.migrate(o)}catch(e){return console.error(`Load failed:`,e),null}}migrate(e){return console.log(`Migrating from ${e.version} to ${this.version}`),e.data}clear(e){if(!e){Object.keys(localStorage).filter(e=>e.startsWith(`${this.namespace}:`)).forEach(e=>localStorage.removeItem(e)),Object.keys(sessionStorage).filter(e=>e.startsWith(`${this.namespace}:`)).forEach(e=>sessionStorage.removeItem(e)),localStorage.removeItem(`resume:${this.namespace}`),sessionStorage.removeItem(`resume:${this.namespace}`);return}localStorage.removeItem(`${this.namespace}:${e}`),sessionStorage.removeItem(`${this.namespace}:${e}`),e===`progress`&&(localStorage.removeItem(`resume:${this.namespace}`),sessionStorage.removeItem(`resume:${this.namespace}`))}export(){let e={};for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n&&n.startsWith(this.namespace)&&(e[n]=localStorage.getItem(n))}return JSON.stringify(e,null,2)}},s={errors:[],logError(e,t=``){let n={timestamp:new Date,message:e.message,stack:e.stack,context:t};this.errors.push(n),console.error(`[${t}] Assessment Error:`,e)},showUserError(e,t=null){let n=document.querySelector(`.user-error`);n&&n.remove();let r=document.createElement(`div`);return r.className=`user-error`,r.setAttribute(`role`,`alert`),r.setAttribute(`aria-live`,`assertive`),r.innerHTML=`
      <span>⚠️ ${a.sanitizeHTML(e)}</span>
      <button onclick="this.parentElement.remove()" aria-label="Dismiss error message">×</button>
    `,(t||document.querySelector(`.assessment-container`)||document.body).appendChild(r),setTimeout(()=>{r.remove()},5e3),r.focus(),r},clearErrors(){this.errors=[]}},c={createElement(e,t={},n=[]){let r=document.createElement(e);for(let[e,n]of Object.entries(t))e===`style`&&typeof n==`object`?Object.assign(r.style,n):e===`className`?r.className=n:e.startsWith(`data-`)?r.setAttribute(e,n):r[e]=n;return typeof n==`string`?r.textContent=n:Array.isArray(n)&&n.forEach(e=>{typeof e==`string`?r.appendChild(document.createTextNode(e)):e instanceof Node&&r.appendChild(e)}),r},focusElement(e,t={}){e&&(e.focus({preventScroll:t.preventScroll||!1}),t.preventScroll||e.scrollIntoView({behavior:`smooth`,block:`center`}))}},l=`1.1.0`,u={diagnosis:[`Sovereign of Mind`,`Distortion Codex`],coaching:[`Belief Mastery`,`Sovereign of Mind`],"life-domain-review":[`Belief Mastery`,`Sovereign of Mind`],manipulation:[`Sovereign of Mind`,`Distortion Codex`],channels:[`Sovereign of Mind`],paradigm:[`Sovereign of Mind`],"sovereignty-spectrum":[`Sovereign of Mind`],sovereignty:[`Sovereign of Mind`],"needs-dependency":[`Belief Mastery`,`Sovereign of Mind`],"logos-structure":[`Sovereign of Mind`],"cognitive-resistance-capacity":[`Sovereign of Mind`],"cognitive-resistance-capacity-assessment":[`Sovereign of Mind`],"sovereignty-paradigm":[`Sovereign of Mind`],"sovereignty-spectrum-analysis":[`Sovereign of Mind`],entities:[`Sovereign of Mind`],"outlier-aptitude":[`Sovereign of Mind`]},d={"life-domain-review":`coaching`,"logos-structure":`paradigm`,"cognitive-resistance-capacity":`sovereignty`,"cognitive-resistance-capacity-assessment":`sovereignty`,"sovereignty-spectrum-analysis":`sovereignty-paradigm`};function f(e){return e&&(d[e]||e)}function p(e){return e&&u[e]||[`Belief Mastery`,`Sovereign of Mind`]}function m(e,t,n=3){return e.filter(e=>typeof e[t]==`number`).sort((e,n)=>n[t]-e[t]).slice(0,n)}function h(e){let t=[];return e?(Array.isArray(e.identifiedVectors)&&e.identifiedVectors.length&&m(e.identifiedVectors,`weightedScore`).forEach(e=>{t.push(`Manipulation vector: ${e.name} (${e.weightedScore?.toFixed?.(2)||e.weightedScore})`)}),e.obstacles&&typeof e.obstacles==`object`&&m(Object.values(e.obstacles||{}),`weightedScore`).forEach(e=>{t.push(`Sovereignty obstacle: ${e.name} (${e.weightedScore?.toFixed?.(2)||e.weightedScore})`)}),e.domains&&typeof e.domains==`object`&&Object.values(e.domains||{}).filter(e=>typeof e.combinedScore==`number`).sort((e,t)=>e.combinedScore-t.combinedScore).slice(0,2).forEach(e=>{t.push(`Life domain strain: ${e.name} (${e.combinedScore?.toFixed?.(1)||e.combinedScore}/10)`)}),e.probabilities&&typeof e.probabilities==`object`&&m(Object.entries(e.probabilities).map(([e,t])=>({name:e,value:t})).filter(e=>typeof e.value==`number`),`value`).forEach(e=>{t.push(`Diagnostic indicator: ${e.name} (${Math.round(e.value*100)}%)`)}),e.primaryPattern&&t.push(`Primary pattern: ${e.primaryPattern}`),e.primaryLoop&&(t.push(`Primary dependency loop: ${e.primaryLoop}`),e.needChainDisplay&&t.push(`Need chain (Loop ← Root): ${e.needChainDisplay}`),e.firstLinkInChain&&t.push(`First link in chain (immanent focus): ${e.firstLinkInChain}`)),e.quadrants&&typeof e.quadrants==`object`&&Object.entries(e.quadrants).forEach(([e,n])=>{n&&n.label&&t.push(`Sovereign Assessment ${e}: ${n.label}`)}),e.spectrumLabel&&t.push(`Paradigm integration level: ${e.spectrumLabel}`),t):t}function g(e,t,n){let r=p(t).join(`, `),i=h(e),a=[`Focus on the top 1–3 findings before expanding scope.`,`Use the full export for AI-guided action planning.`,`Re-run the assessment after applying corrective actions.`],o=`${n} — Executive Brief\n`;return o+=`Version: ${l}\n`,o+=`Generated: ${new Date().toISOString()}\n`,o+=`Frameworks: ${r}\n\n`,o+=`Key Findings:
`,i.length?i.forEach(e=>{o+=`- ${e}\n`}):o+=`- No dominant findings detected. Review the full report for detail.
`,o+=`
Next Actions:
`,a.forEach(e=>{o+=`- ${e}\n`}),o}function _(e,t,n){let r=f(t),i=`${n} Assessment Profile\n`;return i+=`Export Version: ${l}\n`,i+=`Generated: `+new Date().toISOString()+`
`,i+=`System Type: `+t+`
`,i+=`Frameworks: `+p(t).join(`, `)+`
`,i+=`
`,i+=`=== HOW TO USE THIS DATA ===
`,i+=`This CSV contains assessment data with comprehensive explanations for how your AI agent should interpret, value, and prioritize the content.
`,i+=`Import this data into your AI platform (ChatGPT, Claude, etc.) and use the "AI Agent Configuration" section to configure your agent.
`,i+=`This profile is designed to transform your AI into a personalized sovereignty-aligned coaching and analysis agent.
`,i+=`
`,i+=`=== AI AGENT CONFIGURATION INSTRUCTIONS ===
`,i+=`Section,Instruction
`,i+=`"System Prompt","Use this assessment profile to understand the user's patterns, obstacles, and needs. Focus on sovereignty-aligned support and structural clarity."
`,i+=`"Primary Function","Provide coaching, analysis, and guidance based on the identified patterns and priorities in this profile."
`,i+=`"Tone & Approach","Adjust tone based on severity/priority levels: High = supportive but direct; Moderate = encouraging with strategies; Low = awareness and maintenance. Honor individual autonomy and authorship."
`,i+=`"Coaching Style","Question-based inquiry that surfaces self-awareness. Support without imposing. Help user recognize patterns and reclaim sovereignty."
`,i+=`"Prioritization","Use weighted scores and priority levels as primary metrics. Address high-priority items first, then moderate, then low."
`,i+=`"Response Approach","Focus responses on identified priorities. Acknowledge strengths. Provide practical strategies for obstacles and improvement areas."
`,i+=`"Sovereignty Alignment","All guidance should support the user's capacity for self-authorship, structural clarity, and reclaiming agency."
`,i+=`
`,r===`coaching`?i+=v(e):r===`manipulation`?i+=y(e):r===`channels`?i+=b(e):r===`paradigm`?i+=x(e):r===`diagnosis`?i+=S(e):r===`needs-dependency`?i+=w(e):r===`sovereignty`||r===`sovereignty-analysis`?i+=E(e):r===`sovereignty-paradigm`&&(i+=T(e)),i+=`
`,i+=`=== INTERPRETATION GUIDE ===
`,i+=`Column,Meaning,Priority Weight,Interpretation
`,i+=`Raw Score,User response on 0-10 scale,Low,Direct user response - use for context
`,i+=`Weighted Score,Score multiplied by importance weight,High,Primary metric for prioritization - higher = more urgent
`,i+=`Priority Level,Calculated priority (High/Moderate/Low),High,Use to determine focus and intervention urgency
`,i+=`Severity/Level,Interpreted level based on score,Medium,Use to understand user state and adjust tone/approach
`,i+=`
`,i+=`=== GENERAL SCORING INTERPRETATION ===
`,i+=`Higher scores typically indicate stronger presence of patterns, obstacles, or concerns.
`,i+=`Weighted scores determine priority - focus on high-priority items first.
`,i+=`Use priority levels to determine coaching focus and intervention urgency.
`,i+=`Adjust tone and approach based on severity/level indicators.
`,i+=`
`,i}function v(e){let t=`=== COACHING PROFILE DATA ===
`;return e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer (0-10),Category,Section,Name
`,e.questionSequence.forEach(n=>{let r=e.allAnswers&&e.allAnswers[n.id]!==void 0?e.allAnswers[n.id]:`Not answered`,i=n.question||n.questionText||``;t+=`"${n.id}","${i.replace(/"/g,`""`)}",${r},"${n.category||``}","${n.section||``}","${(n.name||``).replace(/"/g,`""`)}"\n`})),(!e.questionSequence||e.questionSequence.length===0)&&e.allAnswers&&Object.keys(e.allAnswers).length>0&&(t+=`
=== ALL RAW ANSWERS (Legacy Format) ===
`,t+=`Question ID,Answer (0-10)
`,Object.entries(e.allAnswers).forEach(([n,r])=>{let i=e.questionSequence?e.questionSequence.find(e=>e.id===n):null,a=i?i.question:n;t+=`"${n}","${a.replace(/"/g,`""`)}",${r}\n`})),e.obstacles&&Object.keys(e.obstacles).length>0&&(t+=`
=== OBSTACLES TO SOVEREIGNTY ===
`,t+=`Name,Description,Raw Score,Weight,Weighted Score,Priority Level,Severity,Coaching Focus
`,Object.entries(e.obstacles).map(([e,t])=>({key:e,...t})).sort((e,t)=>t.weightedScore-e.weightedScore).forEach(e=>{let n=e.rawScore>=7?`High`:e.rawScore>=4?`Moderate`:`Low`,r=e.weightedScore>=8?`High`:e.weightedScore>=5?`Moderate`:`Low`,i=e.rawScore>=7?`Urgent - Address immediately with direct coaching support`:e.rawScore>=4?`Important - Regular coaching attention and strategies`:`Monitor - Periodic check-ins and awareness`;t+=`"${e.name}","${(e.description||``).replace(/"/g,`""`)}",${e.rawScore},${e.weight||1},${e.weightedScore.toFixed(2)},${r},${n},"${i}"\n`})),e.domains&&Object.keys(e.domains).length>0&&(t+=`
=== SATISFACTION DOMAINS ===
`,t+=`Domain,Overall Score,Average Aspect Score,Combined Score,Weight,Weighted Score,Priority Level,Satisfaction Level,Coaching Focus
`,Object.entries(e.domains).map(([e,t])=>({key:e,...t})).sort((e,t)=>e.combinedScore-t.combinedScore).forEach(e=>{let n=e.combinedScore>=7?`High`:e.combinedScore>=4?`Moderate`:`Low`,r=e.combinedScore<=3?`High`:e.combinedScore<=5?`Moderate`:`Low`,i=e.combinedScore<=3?`Urgent - Primary focus for satisfaction improvement`:e.combinedScore<=5?`Important - Regular support and goal-setting`:`Maintain - Acknowledge strengths and support maintenance`;t+=`"${e.name}",${e.overviewScore},${e.averageAspectScore.toFixed(2)},${e.combinedScore.toFixed(2)},${e.weight||1},${e.weightedScore.toFixed(2)},${r},${n},"${i}"\n`})),e.priorities&&(t+=`
=== PRIORITY SUMMARY ===
`,e.priorities.topObstacles&&e.priorities.topObstacles.length>0&&(t+=`Top Obstacles to Address:
`,e.priorities.topObstacles.forEach((e,n)=>{t+=`${n+1},"${e.name}",Score: ${e.rawScore}/10,Weighted: ${e.weightedScore.toFixed(2)}\n`})),e.priorities.topImprovementAreas&&e.priorities.topImprovementAreas.length>0&&(t+=`
Top Areas for Improvement:
`,e.priorities.topImprovementAreas.forEach((e,n)=>{t+=`${n+1},"${e.name}",Satisfaction: ${e.combinedScore.toFixed(1)}/10,Weighted: ${e.weightedScore.toFixed(2)}\n`}))),t}function y(e){let t=`=== MANIPULATION ANALYSIS DATA ===
`;return e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer (0-10),Category,Subcategory,Type,Weight
`,e.questionSequence.forEach(n=>{let r=e.allAnswers&&e.allAnswers[n.id]!==void 0?e.allAnswers[n.id]:`Not answered`,i=n.question||n.text||n.questionText||``;t+=`"${n.id}","${i.replace(/"/g,`""`)}",${r},"${n.category||``}","${n.subcategory||``}","${n.type||``}",${n.weight||``}\n`})),(!e.questionSequence||e.questionSequence.length===0)&&e.allAnswers&&Object.keys(e.allAnswers).length>0&&(t+=`
=== ALL RAW ANSWERS (Legacy Format) ===
`,t+=`Question ID,Question,Answer (0-10),Category,Subcategory
`,Object.entries(e.allAnswers).forEach(([n,r])=>{let i=e.questionSequence?e.questionSequence.find(e=>e.id===n):null,a=i?i.question:n,o=i?i.category:``,s=i?i.subcategory:``;t+=`"${n}","${a.replace(/"/g,`""`)}",${r},"${o}","${s}"\n`})),e.identifiedVectors&&e.identifiedVectors.length>0&&(t+=`
=== IDENTIFIED MANIPULATION VECTORS ===
`,t+=`Vector,Description,Raw Score,Weighted Score,Priority Level,Severity,Focus
`,e.identifiedVectors.forEach(e=>{let n=e.weightedScore>=8?`High`:e.weightedScore>=5?`Moderate`:`Low`,r=e.weightedScore>=8?`High`:e.weightedScore>=5?`Moderate`:`Low`,i=e.weightedScore>=8?`Urgent - Primary manipulation vector requiring immediate recognition and protection strategies`:e.weightedScore>=5?`Important - Significant manipulation pattern requiring awareness and boundary-setting`:`Monitor - Present but lower priority, maintain awareness`;t+=`"${e.name}","${(e.description||``).replace(/"/g,`""`)}",${e.rawScore.toFixed(2)},${e.weightedScore.toFixed(2)},${r},${n},"${i}"\n`})),e.tactics&&e.tactics.length>0&&(t+=`
=== RELEVANT MANIPULATION TACTICS ===
`,t+=`Tactic,Vector,Mode,Phase,Example,Mechanism
`,e.tactics.slice(0,10).forEach(e=>{t+=`"${e.name}","${e.vector}","${e.mode}","${e.phase}","${(e.example||``).replace(/"/g,`""`)}","${(e.mechanism||``).replace(/"/g,`""`)}"\n`})),t}function b(e){let t=`=== CHANNEL ANALYSIS DATA ===
`;if(e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer (0-10),Stage,Category,Node,Channel,Weight
`,e.questionSequence.forEach(n=>{let r=e.allAnswers&&e.allAnswers[n.id]!==void 0?e.allAnswers[n.id]:`Not answered`,i=n.question||n.questionText||``;t+=`"${n.id}","${i.replace(/"/g,`""`)}",${r},"${n.stage||``}","${n.category||``}","${n.node||``}","${n.channel||``}",${n.weight||``}\n`})),e.allAnswers&&Object.keys(e.allAnswers).length>0){let n=new Set;e.questionSequence&&e.questionSequence.forEach(e=>n.add(e.id));let r=Object.entries(e.allAnswers).filter(([e])=>!n.has(e));r.length>0&&(t+=`
=== ADDITIONAL ANSWERS (Not in Question Sequence) ===
`,t+=`Question ID,Answer (0-10)
`,r.forEach(([e,n])=>{t+=`"${e}",${n}\n`}))}return e.identifiedChannels&&e.identifiedChannels.length>0&&(t+=`
=== IDENTIFIED CHANNEL BLOCKAGES ===
`,t+=`Channel,From Node,To Node,Blockage Score,Priority Level,Severity,Remediation Focus
`,e.identifiedChannels.forEach(e=>{let n=e.rawScore>=8?`High`:e.rawScore>=5?`Moderate`:`Low`,r=e.rawScore>=8?`High`:e.rawScore>=5?`Moderate`:`Low`,i=e.rawScore>=8?`Urgent - Primary channel blockage requiring immediate remediation strategies`:e.rawScore>=5?`Important - Significant blockage requiring targeted practices`:`Monitor - Present but lower priority, maintain awareness`;t+=`"${e.name}","${e.from}","${e.to}",${e.rawScore.toFixed(2)},${r},${n},"${i}"\n`})),e.remediationStrategies&&e.remediationStrategies.length>0&&(t+=`
=== REMEDIATION STRATEGIES ===
`,t+=`Channel,Strategy,Practices
`,e.remediationStrategies.forEach(e=>{let n=e.strategies?e.strategies.join(`; `):``,r=e.practices?e.practices.join(`, `):``;t+=`"${e.channelName}","${n.replace(/"/g,`""`)}","${r.replace(/"/g,`""`)}"\n`})),t}function x(e){let t=`=== LOGOS STRUCTURE DATA ===
`;if(e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer (0-10),Category,Paradigm,Perspective,Dimension,Name
`,e.questionSequence.forEach(n=>{let r=e.allAnswers&&e.allAnswers[n.id]!==void 0?e.allAnswers[n.id]:`Not answered`,i=n.question||n.questionText||``;t+=`"${n.id}","${i.replace(/"/g,`""`)}",${r},"${n.category||``}","${n.paradigm||``}","${n.perspective||``}","${n.dimension||``}","${(n.name||``).replace(/"/g,`""`)}"\n`})),e.allAnswers&&Object.keys(e.allAnswers).length>0){let n=new Set;e.questionSequence&&e.questionSequence.forEach(e=>n.add(e.id));let r=Object.entries(e.allAnswers).filter(([e])=>!n.has(e));r.length>0&&(t+=`
=== ADDITIONAL ANSWERS (Not in Question Sequence) ===
`,t+=`Question ID,Answer (0-10)
`,r.forEach(([e,n])=>{t+=`"${e}",${n}\n`}))}return e.identifiedParadigms&&e.identifiedParadigms.length>0&&(t+=`
=== IDENTIFIED PARADIGMS ===
`,t+=`Paradigm,Dimension,Score,Priority Level,Clarity Level,Focus
`,e.identifiedParadigms.forEach(e=>{let n=e.score>=7?`High`:e.score>=4?`Moderate`:`Low`,r=e.score>=7?`High`:e.score>=4?`Moderate`:`Low`,i=e.score>=7?`Primary paradigm - Strong alignment, use as foundation for coaching`:e.score>=4?`Secondary paradigm - Present but not dominant, consider in context`:`Tertiary paradigm - Minimal alignment, may indicate conflict or transition`;t+=`"${e.name}","${e.dimension}",${e.score.toFixed(2)},${n},${r},"${i}"\n`})),t}function S(e){let t=`=== DIAGNOSTIC ASSESSMENT DATA ===
`,n={};e.answers&&Object.assign(n,e.answers),e.refinedAnswers&&Object.assign(n,e.refinedAnswers),e.allAnswers&&Object.keys(n).length===0&&Object.assign(n,e.allAnswers),e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS (Main Sequence) ===
`,t+=`Question ID,Question Text,Answer (0-10),Category,Disorder,Criterion
`,e.questionSequence.forEach(r=>{let i=n[r.id]===void 0?e.answers&&e.answers[r.id]!==void 0?e.answers[r.id]:`Not answered`:n[r.id],a=r.question||r.questionText||``;t+=`"${r.id}","${a.replace(/"/g,`""`)}",${i},"${r.category||``}","${r.disorder||``}","${r.criterion||``}"\n`})),e.refinedQuestionSequence&&e.refinedQuestionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS (Refined Sequence) ===
`,t+=`Question ID,Question Text,Answer (0-10),Disorder,Category
`,e.refinedQuestionSequence.forEach(r=>{let i=n[r.id]===void 0?e.refinedAnswers&&e.refinedAnswers[r.id]!==void 0?e.refinedAnswers[r.id]:`Not answered`:n[r.id],a=r.question||r.questionText||``;t+=`"${r.id}","${a.replace(/"/g,`""`)}",${i},"${r.disorder||``}","${r.category||``}"\n`}));let r=new Set;return e.questionSequence&&e.questionSequence.forEach(e=>r.add(e.id)),e.refinedQuestionSequence&&e.refinedQuestionSequence.forEach(e=>r.add(e.id)),(!e.questionSequence||e.questionSequence.length===0)&&n&&Object.keys(n).length>0&&(t+=`
=== ALL RAW ANSWERS (Legacy Format) ===
`,t+=`Question ID,Answer (0-10),Category,Disorder,Criterion
`,Object.entries(n).forEach(([n,r])=>{let i=e.questionSequence?e.questionSequence.find(e=>e.id===n):e.refinedQuestionSequence?e.refinedQuestionSequence.find(e=>e.id===n):null,a=i?i.category:``,o=i?i.disorder:``,s=i?i.criterion:``;t+=`"${n}",${r},"${a}","${o}","${s}"\n`})),e.primaryDiagnosis&&(t+=`
=== PRIMARY DIAGNOSIS ===
`,t+=`Diagnosis: ${e.primaryDiagnosis.name}\n`,t+=`Probability: ${e.primaryDiagnosis.probability}%\n`,t+=`Severity: ${e.primaryDiagnosis.severity||`Not specified`}\n`),e.secondaryConsiderations&&e.secondaryConsiderations.length>0&&(t+=`
=== SECONDARY CONSIDERATIONS ===
`,t+=`Diagnosis,Probability,Severity
`,e.secondaryConsiderations.forEach(e=>{t+=`"${e.name}",${e.probability}%,${e.severity||`Not specified`}\n`})),t}function C(e){return e==null||e===``?`Not answered`:typeof e==`object`?e.mapsTo&&e.mapsTo.need?e.mapsTo.need:e.text?e.text:Array.isArray(e)?e.map(e=>C(e)).join(`; `):JSON.stringify(e):String(e)}function w(e){let t=`=== NEEDS DEPENDENCY LOOP DETERMINATOR DATA (4-Phase Architecture) ===
`;if(e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer,Phase,Loop
`,e.questionSequence.forEach(n=>{let r=C(n.answer===void 0?e.allAnswers&&e.allAnswers[n.id]:n.answer),i=(n.question||n.questionText||``).replace(/"/g,`""`);t+=`"${n.id}","${i}","${String(r).replace(/"/g,`""`)}",${n.phase||``},"${(n.loop||``).replace(/"/g,`""`)}"\n`})),e.primaryLoop){t+=`
=== PRIMARY DEPENDENCY LOOP ===
`;let n=e.loopScores&&e.loopScores[e.primaryLoop],r=n&&typeof n.totalScore==`number`?n.totalScore.toFixed(1):`N/A`;t+=`Loop Type: ${e.primaryLoop}\n`,t+=`Confidence: ${r}/10\n`}e.secondaryLoops&&e.secondaryLoops.length>0&&(t+=`
=== SECONDARY LOOPS ===
`,t+=e.secondaryLoops.join(`, `)+`
`);let n=e.needChain||e.phase3Results?.needChain||[];return n.length>0&&(t+=`
=== NEED CHAIN (Loop ← Root) ===
`,e.needChainDisplay&&(t+=`Chain: ${e.needChainDisplay}\n`),t+=`Position,Need,Deeper Options
`,n.forEach((e,n)=>{let r=(e.need||e).toString().replace(/"/g,`""`),i=Array.isArray(e.deeper)?e.deeper.join(`; `):``;t+=`${n+1},"${r}","${i.replace(/"/g,`""`)}"\n`})),e.firstLinkInChain&&(t+=`
=== FIRST LINK IN CHAIN (Immanent Focus) ===
`,t+=`Seek and achieve: ${e.firstLinkInChain}\n`),e.loopScores&&typeof e.loopScores==`object`&&(t+=`
=== LOOP SCORES ===
`,t+=`Loop,Total Score,Compulsion,Aversion,Need Chain Depth
`,Object.entries(e.loopScores).forEach(([e,n])=>{let r=n&&typeof n.totalScore==`number`?n.totalScore.toFixed(1):``,i=n&&typeof n.compulsionScore==`number`?n.compulsionScore.toFixed(1):``,a=n&&typeof n.aversionScore==`number`?n.aversionScore.toFixed(1):``,o=n&&typeof n.needChainDepth==`number`?n.needChainDepth:``;t+=`"${e}",${r},${i},${a},${o}\n`})),e.recommendations&&e.recommendations.length>0&&(t+=`
=== RECOMMENDATIONS ===
`,t+=`Priority,Title,Description
`,e.recommendations.forEach(e=>{let n=(e.title||``).replace(/"/g,`""`),r=(e.description||``).replace(/"/g,`""`);t+=`${e.priority||``},"${n}","${r}"\n`})),t}function T(e){let t=`=== SOVEREIGNTY PARADIGM (SPECTRUM) DATA ===
`;if(e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer,Section,Category,Type
`,e.questionSequence.forEach(n=>{let r=e.allAnswers&&e.allAnswers[n.id]!==void 0?e.allAnswers[n.id]:`Not answered`,i=n.question||n.questionText||n.text||``,a=typeof r==`object`?JSON.stringify(r):String(r);t+=`"${n.id}","${i.replace(/"/g,`""`)}","${a.replace(/"/g,`""`)}","${n.section||``}","${n.category||``}","${n.type||``}"\n`})),e.allAnswers&&Object.keys(e.allAnswers).length>0){let n=new Set;e.questionSequence&&e.questionSequence.forEach(e=>n.add(e.id));let r=Object.entries(e.allAnswers).filter(([e])=>!n.has(e));r.length>0&&(t+=`
=== ADDITIONAL ANSWERS ===
`,t+=`Question ID,Answer
`,r.forEach(([e,n])=>{let r=typeof n==`object`?JSON.stringify(n):String(n);t+=`"${e}","${r.replace(/"/g,`""`)}"\n`}))}return(e.spectrumLabel!=null||e.spectrumPosition!=null)&&(t+=`
=== INTEGRATION SPECTRUM ===
`,t+=`Spectrum Label,${e.spectrumLabel||``}\n`,t+=`Spectrum Position,${e.spectrumPosition==null?``:e.spectrumPosition}\n`),e.dominantParadigm!=null&&(t+=`
=== DOMINANT PARADIGM ID ===
`,t+=`${e.dominantParadigm}\n`),Array.isArray(e.paradigmDominance)&&e.paradigmDominance.length>0&&(t+=`
=== PARADIGM DOMINANCE ===
`,t+=`Paradigm ID,Score
`,e.paradigmDominance.forEach(e=>{t+=`"${e.id||``}",${e.score==null?``:e.score}\n`})),Array.isArray(e.paradigmConflicts)&&e.paradigmConflicts.length>0&&(t+=`
=== PARADIGM CONFLICTS ===
`,t+=`Primary,Secondary,Tension,Resolution
`,e.paradigmConflicts.forEach(e=>{t+=`"${(e.primaryName||``).replace(/"/g,`""`)}","${(e.secondaryName||``).replace(/"/g,`""`)}","${(e.tension||``).replace(/"/g,`""`)}","${(e.resolution||``).replace(/"/g,`""`)}"\n`})),e.derailerScores&&typeof e.derailerScores==`object`&&(t+=`
=== DERAILER SCORES ===
`,t+=`Derailer,Score
`,Object.entries(e.derailerScores).forEach(([e,n])=>{t+=`"${e}",${n}\n`})),Array.isArray(e.remediationPaths)&&e.remediationPaths.length>0&&(t+=`
=== REMEDIATION PATHS ===
`,t+=`Type,Priority,Action
`,e.remediationPaths.forEach(e=>{t+=`"${(e.type||``).replace(/"/g,`""`)}","${e.priority||``}","${(e.action||``).replace(/"/g,`""`)}"\n`})),t}function E(e){let t=`=== AI SOVEREIGNTY ANALYSIS DATA ===
`;if(e.questionSequence&&e.questionSequence.length>0&&(t+=`
=== ALL QUESTIONS AND ANSWERS ===
`,t+=`Question ID,Question Text,Answer (0-10),Section,Category,Type
`,e.questionSequence.forEach(n=>{let r=e.allAnswers&&e.allAnswers[n.id]!==void 0?e.allAnswers[n.id]:`Not answered`,i=n.question||n.questionText||``;t+=`"${n.id}","${i.replace(/"/g,`""`)}",${r},"${n.section||``}","${n.category||``}","${n.type||``}"\n`})),e.allAnswers&&Object.keys(e.allAnswers).length>0){let n=new Set;e.questionSequence&&e.questionSequence.forEach(e=>n.add(e.id));let r=Object.entries(e.allAnswers).filter(([e])=>!n.has(e));r.length>0&&(t+=`
=== ADDITIONAL ANSWERS (Not in Question Sequence) ===
`,t+=`Question ID,Answer (0-10)
`,r.forEach(([e,n])=>{t+=`"${e}",${n}\n`}))}return e.cognitiveBand&&(t+=`
=== COGNITIVE BAND ===
`,t+=`Band: ${e.cognitiveBand.name||``}\n`,t+=`IQ Range: ${e.cognitiveBand.iqRange||``}\n`),e.sovereigntyScore!==void 0&&(t+=`
=== SOVEREIGNTY METRICS ===
`,t+=`Sovereignty Score: ${e.sovereigntyScore}/100\n`,t+=`Attachment Mode: ${e.attachmentMode||``}\n`,e.sovereignSplitPosition&&(t+=`Sovereign Split Position: ${e.sovereignSplitPosition.name||``}\n`)),t}function D(e,t,n){let r={exportVersion:l,systemType:t,systemName:n,timestamp:new Date().toISOString(),frameworks:p(t),assessmentData:e,aiAgentInstructions:{systemPrompt:`Use this ${n} assessment profile to understand the user's patterns, obstacles, and needs. Focus on sovereignty-aligned support and structural clarity.`,primaryFunction:`Provide coaching, analysis, and guidance based on the identified patterns and priorities in this profile.`,tone:`Adjust tone based on severity/priority levels: High = supportive but direct; Moderate = encouraging with strategies; Low = awareness and maintenance.`,coachingStyle:`Question-based inquiry that surfaces self-awareness. Support without imposing. Help user recognize patterns and reclaim sovereignty.`,prioritization:`Use weighted scores and priority levels as primary metrics. Address high-priority items first.`,sovereigntyAlignment:`All guidance should support the user's capacity for self-authorship, structural clarity, and reclaiming agency.`}};return JSON.stringify(r,null,2)}var O=`
:root { color-scheme: light dark; }
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.55; margin: 0 auto; max-width: 52rem; padding: 1.5rem 1.25rem 3rem; color: #1a1a1a; background: #fafafa; }
@media (prefers-color-scheme: dark) {
  body { color: #e8e8e8; background: #121212; }
}
h1 { font-size: 1.35rem; margin: 0 0 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
@media (prefers-color-scheme: dark) {
  h1 { border-bottom-color: #444; }
}
h2, h3, h4, h5 { line-height: 1.3; margin-top: 1.35em; margin-bottom: 0.5em; }
p { margin: 0.5em 0; }
ul, ol { margin: 0.5em 0; padding-left: 1.35rem; }
a { color: #0b57d0; }
@media (prefers-color-scheme: dark) {
  a { color: #8ab4f8; }
}
.report-export-meta { font-size: 0.875rem; color: #555; margin-bottom: 1.5rem; }
@media (prefers-color-scheme: dark) {
  .report-export-meta { color: #aaa; }
}
.report-export-section { margin-bottom: 2rem; }
.report-export-section > h2:first-child { margin-top: 0; }
.info-box, .panel-brand-left, .paradigm-result-card, .derailer-item, .remediation-item, .domain-item, .channel-item { margin: 0.75rem 0; padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid #ddd; background: #fff; }
@media (prefers-color-scheme: dark) {
  .info-box, .panel-brand-left, .paradigm-result-card, .derailer-item, .remediation-item, .domain-item, .channel-item { border-color: #444; background: #1e1e1e; }
}
details { margin: 1rem 0; }
summary { cursor: pointer; font-weight: 600; }
table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 0.9rem; }
th, td { border: 1px solid #ccc; padding: 0.35rem 0.5rem; text-align: left; }
@media (prefers-color-scheme: dark) {
  th, td { border-color: #444; }
}
.diagnosis-results-heading { margin-bottom: 1rem; }
.diagnosis-primary-summary {
  margin: 0.75rem 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #f0f6ff;
}
@media (prefers-color-scheme: dark) {
  .diagnosis-primary-summary { border-color: #444; border-left-color: #8ab4f8; background: #1a2740; }
}
.diagnosis-primary-summary__text { margin: 0; line-height: 1.5; }
.diagnosis-primary-summary__link { font-weight: 600; }
.diagnosis-primary-summary__none { opacity: 0.85; }
details.category-group--diagnosis { margin: 1rem 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
@media (prefers-color-scheme: dark) {
  details.category-group--diagnosis { border-color: #444; }
}
details.category-group--diagnosis > summary.category-group-header--diagnosis {
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: rgba(0, 123, 255, 0.12);
  font-weight: 600;
}
details.category-group--diagnosis > summary.category-group-header--diagnosis::-webkit-details-marker { display: none; }
details.category-group--diagnosis .category-group-header__title { flex: 1; text-align: left; }
details.category-group--diagnosis .category-group-header__chev { font-size: 0.85rem; opacity: 0.85; }
details.category-group--diagnosis[open] .category-group-header__chev { display: inline-block; transform: rotate(-180deg); }
.category-group-content--diagnosis { padding: 1rem; background: #f9f9f9; }
@media (prefers-color-scheme: dark) {
  .category-group-content--diagnosis { background: #1a1a1a; }
}
.pattern-card--primary {
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #fff;
}
@media (prefers-color-scheme: dark) {
  .pattern-card--primary { border-color: #444; border-left-color: #8ab4f8; background: #1e1e1e; }
}
.pattern-card__title { margin: 0 0 0.65rem; line-height: 1.35; }
.pattern-card__label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 0.3rem;
}
@media (prefers-color-scheme: dark) {
  .pattern-card__label { color: #aaa; }
}
.pattern-card__disorder { display: block; font-size: 1.05rem; font-weight: 700; }
.pattern-card__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; margin-bottom: 0.45rem; }
.pattern-card__score { font-weight: 700; margin-left: auto; }
.alignment-badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #ccc;
}
.alignment-badge--high { background: rgba(40, 167, 69, 0.15); color: #1e7e34; border-color: rgba(40, 167, 69, 0.35); }
.alignment-badge--med { background: rgba(11, 87, 208, 0.1); color: #0b57d0; border-color: rgba(11, 87, 208, 0.25); }
.alignment-badge--low { background: rgba(128, 128, 128, 0.12); color: #555; }
@media (prefers-color-scheme: dark) {
  .alignment-badge--low { color: #bbb; }
}
.pattern-score-bar { height: 6px; border-radius: 999px; background: #e0e0e0; overflow: hidden; }
.pattern-score-bar--compact { height: 4px; margin-top: 0.3rem; }
.pattern-score-bar__fill { display: block; height: 100%; background: linear-gradient(90deg, #0b57d0, #34a853); border-radius: inherit; min-width: 2px; }
.pattern-signals-intro { margin: 0 0 0.55rem; font-size: 0.85rem; color: #555; }
@media (prefers-color-scheme: dark) {
  .pattern-signals-intro { color: #aaa; }
}
.pattern-signals { list-style: none; margin: 0; padding: 0; }
.pattern-row {
  margin-bottom: 0.55rem;
  padding: 0.65rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #34a853;
  background: #fff;
}
.pattern-row:last-child { margin-bottom: 0; }
.pattern-row__main { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 0.55rem; }
.pattern-row__name { font-weight: 600; flex: 1 1 10rem; min-width: 0; }
.pattern-row__score { font-size: 0.88rem; font-weight: 600; color: #555; }
@media (prefers-color-scheme: dark) {
  .pattern-row { border-color: #444; background: #1e1e1e; }
  .pattern-row__score { color: #aaa; }
}
.pattern-row--tier-1 { border-left-color: #34a853; }
.pattern-row--tier-2 { border-left-color: #0b57d0; padding: 0.6rem 0.75rem; background: #fafafa; }
.pattern-row--tier-3 { border-left-color: #888; padding: 0.55rem 0.72rem; background: #f5f5f5; }
.pattern-row--tier-4 { border-left-color: #ccc; border-left-width: 3px; padding: 0.5rem 0.68rem; background: #f0f0f0; }
.pattern-row--tier-5 { border-left-color: #ccc; border-left-width: 2px; padding: 0.45rem 0.62rem; background: #ebebeb; font-size: 0.9rem; }
@media (prefers-color-scheme: dark) {
  .pattern-row--tier-2 { background: #222; }
  .pattern-row--tier-3 { background: #242424; }
  .pattern-row--tier-4 { background: #262626; }
  .pattern-row--tier-5 { background: #282828; }
}
.coaching-impact-heading { color: #0b57d0; margin-top: 0; }
@media (prefers-color-scheme: dark) {
  .coaching-impact-heading { color: #8ab4f8; }
}
.coaching-impact-lead { color: #555; line-height: 1.6; margin: 0 0 1.1rem; }
@media (prefers-color-scheme: dark) {
  .coaching-impact-lead { color: #aaa; }
}
.coaching-primary-focus {
  margin: 0 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #f0f6ff;
}
@media (prefers-color-scheme: dark) {
  .coaching-primary-focus { border-color: #444; border-left-color: #8ab4f8; background: #1a2740; }
}
.coaching-primary-focus__text { margin: 0; line-height: 1.5; }
.coaching-primary-focus__link { font-weight: 600; }
.coaching-domains-heading { margin: 0 0 0.45rem; color: #0b57d0; }
@media (prefers-color-scheme: dark) {
  .coaching-domains-heading { color: #8ab4f8; }
}
.coaching-domains-intro { margin: 0 0 0.9rem; font-size: 0.92rem; color: #555; line-height: 1.55; }
@media (prefers-color-scheme: dark) {
  .coaching-domains-intro { color: #aaa; }
}
.coaching-aspects-label {
  font-weight: 700;
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #666;
  margin-right: 0.3rem;
}
.coaching-aspects-label::after { content: ':'; }
@media (prefers-color-scheme: dark) {
  .coaching-aspects-label { color: #999; }
}
.coaching-domain-card--featured {
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #fff;
}
@media (prefers-color-scheme: dark) {
  .coaching-domain-card--featured { border-color: #444; border-left-color: #8ab4f8; background: #1e1e1e; }
}
.coaching-domain-card__meta { display: flex; align-items: flex-start; gap: 0.65rem; margin-bottom: 0.5rem; }
.coaching-domain-card__rank {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.9rem;
  background: #0b57d0;
  color: #fff;
}
.coaching-domain-card__title { margin: 0; font-size: 1.05rem; font-weight: 700; flex: 1; min-width: 0; line-height: 1.35; }
.coaching-domain-card__aspects { margin: 0; line-height: 1.5; font-size: 0.92rem; }
.coaching-domain-signals-intro { margin: 0 0 0.5rem; font-size: 0.85rem; color: #555; }
@media (prefers-color-scheme: dark) {
  .coaching-domain-signals-intro { color: #aaa; }
}
.coaching-domain-signals { list-style: none; margin: 0 0 1rem; padding: 0; }
.coaching-domain-row {
  margin-bottom: 0.55rem;
  padding: 0.65rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #34a853;
  background: #fff;
}
.coaching-domain-row:last-child { margin-bottom: 0; }
.coaching-domain-row__main { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.35rem; }
.coaching-domain-row__rank { flex-shrink: 0; min-width: 1.5rem; font-weight: 800; font-size: 0.82rem; color: #666; }
.coaching-domain-row__name { font-weight: 600; flex: 1; min-width: 0; line-height: 1.35; }
.coaching-domain-row__aspects { margin: 0; font-size: 0.86rem; line-height: 1.45; color: #555; }
@media (prefers-color-scheme: dark) {
  .coaching-domain-row { border-color: #444; background: #1e1e1e; }
  .coaching-domain-row__rank { color: #999; }
  .coaching-domain-row__aspects { color: #aaa; }
}
.coaching-domain-row--tier-2 { border-left-color: #34a853; }
.coaching-domain-row--tier-3 { border-left-color: #0b57d0; padding: 0.6rem 0.75rem; background: #fafafa; }
.coaching-domain-row--tier-4 { border-left-color: #888; padding: 0.55rem 0.72rem; background: #f5f5f5; }
.coaching-domain-row--tier-5 { border-left-color: #ccc; border-left-width: 3px; padding: 0.5rem 0.68rem; background: #f0f0f0; font-size: 0.9rem; }
@media (prefers-color-scheme: dark) {
  .coaching-domain-row--tier-3 { background: #222; }
  .coaching-domain-row--tier-4 { background: #242424; }
  .coaching-domain-row--tier-5 { background: #262626; }
}
.coaching-micro-step {
  margin: 0 0 1.1rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border-left: 4px solid #34a853;
  background: #f5faf6;
  line-height: 1.5;
  font-size: 0.9rem;
}
@media (prefers-color-scheme: dark) {
  .coaching-micro-step { background: #1a2a22; border-left-color: #34a853; }
}
.coaching-stabilizing-card {
  margin: 1.1rem 0;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  border: 1px dashed #ccc;
  background: #fafafa;
}
@media (prefers-color-scheme: dark) {
  .coaching-stabilizing-card { border-color: #555; background: #222; }
}
.coaching-stabilizing-card__title { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; color: #666; margin-bottom: 0.3rem; }
.coaching-stabilizing-card__name { margin: 0 0 0.45rem; font-weight: 700; font-size: 0.98rem; }
.coaching-stabilizing-card__note { margin: 0; font-size: 0.88rem; color: #555; line-height: 1.45; }
@media (prefers-color-scheme: dark) {
  .coaching-stabilizing-card__note { color: #aaa; }
}
.coaching-profile-reminder { margin: 0; font-size: 0.88rem; color: #555; line-height: 1.5; }
@media (prefers-color-scheme: dark) {
  .coaching-profile-reminder { color: #aaa; }
}
.needs-dep-primary-heading { margin-top: 0; }
.needs-dep-sourcing-highlight {
  margin: 0 0 0.85rem;
  padding: 0.75rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left-width: 4px;
  border-left-style: solid;
}
.needs-dep-sourcing-highlight--avoidant { border-left-color: #0b57d0; background: #eef5ff; }
.needs-dep-sourcing-highlight--compulsive { border-left-color: #c62828; background: #fcefef; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-highlight { border-color: #444; }
  .needs-dep-sourcing-highlight--avoidant { border-left-color: #8ab4f8; background: #1a2740; }
  .needs-dep-sourcing-highlight--compulsive { border-left-color: #ef9a9a; background: #2a1f1f; }
}
.needs-dep-sourcing-label { display: block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #666; margin-bottom: 0.3rem; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-label { color: #999; }
}
.needs-dep-sourcing-title { display: block; font-size: 1rem; font-weight: 800; line-height: 1.25; }
.needs-dep-sourcing-highlight--avoidant .needs-dep-sourcing-title { color: #0b57d0; }
.needs-dep-sourcing-highlight--compulsive .needs-dep-sourcing-title { color: #c62828; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-highlight--avoidant .needs-dep-sourcing-title { color: #8ab4f8; }
  .needs-dep-sourcing-highlight--compulsive .needs-dep-sourcing-title { color: #ef9a9a; }
}
.needs-dep-sourcing-desc { margin: 0.4rem 0 0; font-size: 0.88rem; line-height: 1.45; color: #555; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-desc { color: #aaa; }
}
.needs-dep-loop-card--featured {
  border-left: 4px solid #0b57d0;
  background: #f8fbff;
}
@media (prefers-color-scheme: dark) {
  .needs-dep-loop-card--featured { border-left-color: #8ab4f8; background: #1e2838; }
}
.needs-dep-loop-header { margin-bottom: 0.65rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem; }
.needs-dep-loop-title { margin: 0; font-size: 1.1rem; }
.needs-dep-confidence-badge {
  font-size: 0.82rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #ccc;
  font-weight: 600;
}
@media (prefers-color-scheme: dark) {
  .needs-dep-confidence-badge { border-color: #555; }
}
.needs-dep-vice-note { margin: 0 0 0.85rem; line-height: 1.5; font-size: 0.92rem; }
.needs-dep-loop-details { margin-top: 0.2rem; }
.needs-dep-secondary-intro { margin: 0 0 0.65rem; font-size: 0.88rem; color: #555; line-height: 1.45; }
@media (prefers-color-scheme: dark) {
  .needs-dep-secondary-intro { color: #aaa; }
}
.needs-dep-secondary-signals { list-style: none; margin: 0; padding: 0; }
.needs-dep-secondary-row {
  margin-bottom: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #34a853;
  background: #fff;
}
.needs-dep-secondary-row:last-child { margin-bottom: 0; }
.needs-dep-secondary-row__name { font-weight: 600; }
@media (prefers-color-scheme: dark) {
  .needs-dep-secondary-row { border-color: #444; background: #1e1e1e; }
}
.needs-dep-secondary-row--tier-2 { border-left-color: #34a853; }
.needs-dep-secondary-row--tier-3 { border-left-color: #0b57d0; background: #fafafa; }
.needs-dep-secondary-row--tier-4 { border-left-color: #888; background: #f5f5f5; }
.needs-dep-secondary-row--tier-5 { border-left-color: #ccc; border-left-width: 3px; background: #f0f0f0; font-size: 0.9rem; }
@media (prefers-color-scheme: dark) {
  .needs-dep-secondary-row--tier-3 { background: #222; }
  .needs-dep-secondary-row--tier-4 { background: #242424; }
  .needs-dep-secondary-row--tier-5 { background: #262626; }
}
`;function k(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function A(e){let t=new TextEncoder().encode(e),n=``;for(let e=0;e<t.length;e++)n+=String.fromCharCode(t[e]);let r=btoa(n),i=[];for(let e=0;e<r.length;e+=76)i.push(r.slice(e,e+76));return i.join(`\r
`)}function j(e={}){let{title:t=`Assessment report`,filenameBase:n=`report`,rootSelector:r,rootSelectors:i}=e,a=i?Array.isArray(i)?i:[i]:r?[r]:[];if(!a.length||typeof document>`u`)return!1;let o=[];for(let e of a){let t=document.querySelector(e);if(!t)continue;let n=t.cloneNode(!0);n.querySelectorAll(`button, .export-section, [data-no-export], script, style[data-live-only]`).forEach(e=>{e.remove()}),o.push(`<div class="report-export-section">${n.innerHTML}</div>`)}if(!o.length)return!1;let s=k(t),c=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s}</title>
<style>${O}</style>
</head>
<body>
<h1>${s}</h1>
<p class="report-export-meta">Exported ${k(new Date().toISOString())}</p>
${o.join(`
`)}
</body>
</html>`,l=String(n).replace(/[^a-z0-9-_]+/gi,`_`).replace(/^_|_$/g,``)||`report`,u=`BMReport_${Date.now()}_${Math.random().toString(36).slice(2,10)}`,d=`file:///C:/${l}.html`,f=String(t).replace(/[\r\n]+/g,` `).slice(0,200),p=A(c);return M([`From: <Saved by Belief Mastery>`,`Snapshot-Content-Location: ${d}`,`Subject: ${f}`,`Date: ${new Date().toUTCString()}`,`MIME-Version: 1.0`,`Content-Type: multipart/related; type="text/html"; boundary="${u}"`,``,`--${u}`,`Content-Type: text/html; charset=utf-8`,`Content-Transfer-Encoding: base64`,`Content-Location: ${d}`,``,p,``,`--${u}--`,``].join(`\r
`),`${l}.mhtml`,`multipart/related`),!0}function M(e,t,n){let r=new Blob([e],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)}var N=`
.confirm-modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: confirm-fade-in 0.2s ease;
}
@keyframes confirm-fade-in { from { opacity: 0; } to { opacity: 1; } }
.confirm-modal-box {
  background: linear-gradient(135deg, rgba(15, 25, 45, 0.98), rgba(20, 35, 55, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.35);
  border-radius: 12px;
  padding: 1.75rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.1);
}
.confirm-modal-box h4 {
  color: #e8f0f8;
  margin: 0 0 1rem;
  font-size: 1.1rem;
}
.confirm-modal-box p {
  color: rgba(200, 220, 240, 0.9);
  line-height: 1.6;
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
}
.confirm-modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
.confirm-modal-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
}
.confirm-modal-btn-primary {
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #050a15;
}
.confirm-modal-btn-primary:hover {
  background: linear-gradient(135deg, #ffc820, #ffd700);
}
.confirm-modal-btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #bcdcff;
}
.confirm-modal-btn-secondary:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.6);
}
`;function P(){if(document.getElementById(`confirm-modal-styles`))return;let e=document.createElement(`style`);e.id=`confirm-modal-styles`,e.textContent=N,document.head.appendChild(e)}function F(e){P();let{message:t,title:n=`Confirm`,confirmLabel:r=`OK`,cancelLabel:i=`Cancel`,isAlert:a=!1}=e,o=document.createElement(`div`);o.className=`confirm-modal-backdrop`,o.setAttribute(`role`,`dialog`),o.setAttribute(`aria-modal`,`true`),o.setAttribute(`aria-labelledby`,`confirm-modal-title`);let s=document.createElement(`div`);s.className=`confirm-modal-box`;let c=document.createElement(`h4`);c.id=`confirm-modal-title`,c.textContent=n;let l=document.createElement(`p`);l.textContent=t;let u=document.createElement(`div`);return u.className=`confirm-modal-actions`,new Promise(e=>{let t=t=>{o.remove(),e(t)},n=document.createElement(`button`);if(n.className=`confirm-modal-btn confirm-modal-btn-primary`,n.textContent=r,n.addEventListener(`click`,()=>t(!0)),a)u.appendChild(n);else{let e=document.createElement(`button`);e.className=`confirm-modal-btn confirm-modal-btn-secondary`,e.textContent=i,e.addEventListener(`click`,()=>t(!1)),u.appendChild(e),u.appendChild(n)}o.addEventListener(`click`,e=>{e.target===o&&t(!1)}),s.appendChild(c),s.appendChild(l),s.appendChild(u),o.appendChild(s),document.body.appendChild(o),n.focus()})}function I(e){return F({message:e,title:`Confirm`,confirmLabel:`OK`,cancelLabel:`Cancel`,isAlert:!1})}function L(e){return F({message:e,title:`Notice`,confirmLabel:`OK`,isAlert:!0})}var R=class{constructor(e={}){this.config=e,this.hiddenClass=e.hiddenClass||`hidden`,this.activeClass=e.activeClass||`active`}transition(e){let t=this.config[e];t&&(this.applySelectors(t.show,!0),this.applySelectors(t.hide,!1))}applySelectors(e,t){e&&(Array.isArray(e)?e:[e]).forEach(e=>{let n=typeof e==`string`?document.querySelector(e):e;n&&(t?(n.classList.remove(this.hiddenClass),n.classList.add(this.activeClass)):(n.classList.add(this.hiddenClass),n.classList.remove(this.activeClass)))})}};function z(e,t={}){e.externalUI=!!t.externalUI,e._spaNotify=typeof t.onNotify==`function`?t.onNotify:null,e._spaPhase=e._spaPhase||`idle`,e._externalQuestionSnapshot=e._externalQuestionSnapshot??null}function B(e,t,n){try{e._spaNotify?.(t,n)}catch(e){console.warn(`Engine SPA notify:`,e)}}function V(e,t){e._spaPhase=t,B(e,`phase`,{phase:t})}function H(e){return typeof document>`u`||document.body?.dataset?.bmLegacyPage!==`true`?!1:!!(e&&document.getElementById(e))}function U(e,t){let n=()=>t();document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,n):n()}export{a as _,V as a,I as c,g as d,_ as f,s as g,o as h,B as i,M as l,c as m,U as n,R as o,D as p,H as r,L as s,z as t,j as u,i as v,r as y};