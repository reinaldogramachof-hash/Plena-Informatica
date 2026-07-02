import{u as j,j as e,m as u,X as f}from"./index-CBqsAD1c.js";import{P as N}from"./printer-zmOQS8y5.js";import{U as w}from"./utensils-B6vhUP_S.js";const k=({order:s,onClose:c,copyLabel:n})=>{var d;const{theme:p,waiters:x,settings:a}=j(),r=p==="dark",o=((d=x.find(t=>t.id===s.waiterId))==null?void 0:d.name)||"Balcão",m=new Date(s.timestamp).toLocaleString("pt-BR"),h=()=>{window.print()},l=s.payments.reduce((t,i)=>t+i.amount,0),b=Math.max(0,l-s.total);return e.jsxs("div",{className:"fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:bg-white print:p-0 print:block overflow-y-auto",children:[e.jsxs(u.div,{initial:{opacity:0,scale:.9,y:20},animate:{opacity:1,scale:1,y:0},id:"receipt-print-area",className:`relative w-full max-w-sm rounded-3xl border flex flex-col overflow-hidden shadow-2xl print:shadow-none print:border-none print:w-full print:max-w-none my-auto
        ${r?"bg-[var(--color-surface)] border-[var(--color-border)]":"bg-surface-light border-border-light"} print:bg-white`,children:[e.jsx("div",{className:"flex justify-end p-4 border-b border-dashed print:hidden",children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:h,className:`p-2 rounded-xl transition-colors ${r?"bg-white/5 hover:bg-white/10":"bg-gray-100 hover:bg-gray-200"}`,children:e.jsx(N,{className:"w-4 h-4"})}),e.jsx("button",{onClick:c,className:`p-2 rounded-xl transition-colors ${r?"bg-white/5 hover:bg-white/10":"bg-gray-100 hover:bg-gray-200"}`,children:e.jsx(f,{className:"w-4 h-4"})})]})}),e.jsx("div",{className:`p-6 font-mono text-[12px] leading-[1.4] ${r?"text-gray-300":"text-gray-800"} print:text-black print:p-0 print:w-full print:text-[12px]`,children:e.jsxs("div",{className:"print-content-wrapper",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx(w,{className:"w-5 h-5 mx-auto mb-2 print:hidden text-[var(--color-accent)]"}),e.jsx("h2",{className:"text-lg font-bold tracking-tighter mb-0 uppercase print:text-[16px]",children:a.establishment.name}),e.jsx("div",{className:"w-full border-b border-dashed border-current my-3"}),e.jsx("p",{className:"text-[10px] print:text-[11px] uppercase",children:a.establishment.address}),e.jsxs("p",{className:"text-[10px] print:text-[11px]",children:["DOCUMENTO: ",a.establishment.document]}),e.jsxs("p",{className:"text-[10px] print:text-[11px]",children:["TEL: ",a.establishment.phone]}),e.jsx("div",{className:"w-full border-b border-dashed border-current my-3"})]}),e.jsxs("div",{className:"space-y-0.5 mb-4 text-[10px] print:text-[11px] uppercase",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"DATA:"})," ",e.jsx("span",{children:m})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"EXTRATO:"})," ",e.jsxs("span",{className:"font-bold",children:["#",s.id.slice(-8).toUpperCase()]})]}),n&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"VIA:"})," ",e.jsx("span",{className:"font-bold",children:n})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"OPERADOR:"})," ",e.jsx("span",{children:o})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"MODO:"})," ",e.jsxs("span",{className:"font-bold",children:[s.mode," ",s.tableNumber?`| MESA ${s.tableNumber}`:""]})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("div",{className:"flex justify-between font-bold border-b border-dashed border-current pb-1 mb-2 text-[10px] print:text-[11px] uppercase",children:[e.jsx("span",{className:"w-8 shrink-0",children:"Qtd"}),e.jsx("span",{className:"flex-1",children:"Descricao"}),e.jsx("span",{className:"w-16 text-right",children:"Total"})]}),e.jsx("div",{className:"space-y-1.5",children:s.items.map(t=>e.jsxs("div",{className:"flex justify-between items-start text-[11px] print:text-[12px]",children:[e.jsx("span",{className:"w-8 shrink-0",children:t.quantity}),e.jsxs("div",{className:"flex-1 pr-1 overflow-hidden",children:[e.jsx("p",{className:"uppercase truncate",children:t.product.name}),e.jsxs("p",{className:"text-[9px] print:text-[10px] opacity-70",children:["@",t.price.toFixed(2)]})]}),e.jsx("span",{className:"w-16 text-right shrink-0",children:(t.price*t.quantity).toFixed(2)})]},t.id))})]}),e.jsxs("div",{className:"border-t border-dashed border-current pt-3 space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-[11px]",children:[e.jsx("span",{className:"uppercase",children:"Subtotal:"}),e.jsxs("span",{children:["R$ ",s.subtotal.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-[11px]",children:[e.jsx("span",{className:"uppercase",children:"Servico (10%):"}),e.jsxs("span",{children:["R$ ",s.serviceCharge.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-[14px] font-bold mt-1 pt-2 border-t border-dashed border-current uppercase",children:[e.jsx("span",{children:"Total:"}),e.jsxs("span",{children:["R$ ",s.total.toFixed(2)]})]})]}),e.jsxs("div",{className:"mt-4 pt-3 border-t border-dashed border-current space-y-1",children:[e.jsx("p",{className:"font-bold text-[10px] uppercase mb-2",children:"Pagamento:"}),s.payments.map((t,i)=>e.jsxs("div",{className:"flex justify-between text-[11px]",children:[e.jsx("span",{className:"uppercase",children:t.method}),e.jsxs("span",{children:["R$ ",t.amount.toFixed(2)]})]},i)),e.jsxs("div",{className:"flex justify-between mt-1 pt-1 border-t border-dotted border-current/30 font-bold text-[11px]",children:[e.jsx("span",{children:"RECEBIDO:"}),e.jsxs("span",{children:["R$ ",l.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between font-bold text-[11px]",children:[e.jsx("span",{children:"TROCO:"}),e.jsxs("span",{children:["R$ ",b.toFixed(2)]})]})]}),e.jsxs("div",{className:"text-center mt-8 space-y-1",children:[e.jsx("div",{className:"w-full border-b border-dashed border-current mb-3"}),e.jsx("p",{className:"text-[10px] font-bold uppercase",children:"Obrigado pela preferencia!"}),e.jsx("p",{className:"text-[9px] uppercase",children:"Volte Sempre"}),e.jsxs("div",{className:"pt-4 flex flex-col items-center gap-1 opacity-100",children:[e.jsx("div",{className:"w-full h-6 bg-black flex items-center justify-center text-white text-[8px] font-bold",children:s.id.slice(0,18).toUpperCase()}),e.jsx("span",{className:"text-[7px] font-mono",children:s.id})]})]})]})})]}),e.jsx("style",{children:`
        @media print {
          @page { 
            margin: 0; 
            size: 80mm auto;
          }
          html, body {
            background: white !important;
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #receipt-print-area, #receipt-print-area * {
            visibility: visible !important;
            color: black !important;
            background: white !important;
          }
          #receipt-print-area {
            position: static !important;
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            display: block !important;
          }
          /* Standard Fiscal Printable Area (approx 72mm) */
          .print-content-wrapper {
            width: 72mm !important;
            margin: 0 auto !important;
            padding: 4mm 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `})]})};export{k as R};
