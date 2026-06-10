var e=`
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
`;function t(){if(document.getElementById(`confirm-modal-styles`))return;let t=document.createElement(`style`);t.id=`confirm-modal-styles`,t.textContent=e,document.head.appendChild(t)}function n(e){t();let{message:n,title:r=`Confirm`,confirmLabel:i=`OK`,cancelLabel:a=`Cancel`,isAlert:o=!1}=e,s=document.createElement(`div`);s.className=`confirm-modal-backdrop`,s.setAttribute(`role`,`dialog`),s.setAttribute(`aria-modal`,`true`),s.setAttribute(`aria-labelledby`,`confirm-modal-title`);let c=document.createElement(`div`);c.className=`confirm-modal-box`;let l=document.createElement(`h4`);l.id=`confirm-modal-title`,l.textContent=r;let u=document.createElement(`p`);u.textContent=n;let d=document.createElement(`div`);return d.className=`confirm-modal-actions`,new Promise(e=>{let t=t=>{s.remove(),e(t)},n=document.createElement(`button`);if(n.className=`confirm-modal-btn confirm-modal-btn-primary`,n.textContent=i,n.addEventListener(`click`,()=>t(!0)),o)d.appendChild(n);else{let e=document.createElement(`button`);e.className=`confirm-modal-btn confirm-modal-btn-secondary`,e.textContent=a,e.addEventListener(`click`,()=>t(!1)),d.appendChild(e),d.appendChild(n)}s.addEventListener(`click`,e=>{e.target===s&&t(!1)}),c.appendChild(l),c.appendChild(u),c.appendChild(d),s.appendChild(c),document.body.appendChild(s),n.focus()})}function r(e){return n({message:e,title:`Confirm`,confirmLabel:`OK`,cancelLabel:`Cancel`,isAlert:!1})}function i(e){return n({message:e,title:`Notice`,confirmLabel:`OK`,isAlert:!0})}export{r as n,i as t};