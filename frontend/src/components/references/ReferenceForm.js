import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FicheReference } from './FicheReference';
import { useNavigate } from 'react-router-dom';
import {
  User, Stethoscope, ClipboardList, Printer,
  ArrowLeft, CheckCircle, AlertTriangle, Hospital,
  ChevronRight, Activity, FileText, Pill
} from 'lucide-react';
import api from '../../services/api';
import HospitalProposal from './HospitalProposal';

const user = JSON.parse(localStorage.getItem('user')) || { id: 1, hospital_id: 1 };
const STEPS = ['Patient & Service', 'Détails Cliniques', 'Choix de l\'Hôpital', 'Confirmation'];

/* ─────────────────────────────────────────────
   Design tokens & global styles
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue:        #2563eb;
    --blue-lt:     #eff6ff;
    --blue-md:     #bfdbfe;
    --blue-dk:     #1d4ed8;
    --green:       #059669;
    --green-lt:    #d1fae5;
    --green-md:    #6ee7b7;
    --orange:      #d97706;
    --orange-lt:   #fffbeb;
    --red:         #dc2626;
    --red-lt:      #fef2f2;
    --ink:         #0f172a;
    --muted:       #64748b;
    --border:      #e2e8f0;
    --surface:     #ffffff;
    --bg:          #f8fafc;
    --radius:      14px;
    --shadow:      0 1px 3px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.08);
    --font-body:   'Sora', sans-serif;
    --font-disp:   'Lora', serif;
    --trans:       .2s cubic-bezier(.4,0,.2,1);
  }

  .rf-input, .rf-select, .rf-textarea {
    width: 100%; padding: 11px 14px;
    font-size: 14px; font-family: var(--font-body); color: var(--ink);
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 10px; outline: none; appearance: none; -webkit-appearance: none;
    transition: border-color var(--trans), box-shadow var(--trans), background var(--trans);
  }
  .rf-input:focus, .rf-select:focus, .rf-textarea:focus {
    border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-md); background: var(--blue-lt);
  }
  .rf-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
  .rf-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; cursor: pointer;
  }

  .rf-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600;
    letter-spacing: .07em; text-transform: uppercase; color: var(--muted);
    font-family: var(--font-body); margin-bottom: 6px;
  }
  .rf-label .req { color: var(--red); margin-left: 2px; }

  .rf-suggest-wrap { position: relative; }
  .rf-suggest-list {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 100;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; box-shadow: var(--shadow);
    max-height: 180px; overflow-y: auto;
  }
  .rf-suggest-item {
    padding: 10px 14px; font-size: 13px; cursor: pointer;
    font-family: var(--font-body); color: var(--ink);
    display: flex; align-items: center; gap: 8px;
  }
  .rf-suggest-item:hover { background: var(--blue-lt); color: var(--blue); }

  .rf-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .rf-card-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #f8fafc, #eff6ff);
  }
  .rf-card-head .icon { width: 32px; height: 32px; border-radius: 9px; background: var(--blue); display: flex; align-items: center; justify-content: center; }
  .rf-card-body { padding: 22px; }

  .rf-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 18px; }

  .rf-steps { display: flex; align-items: center; gap: 0; }
  .rf-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
  .rf-step:not(:last-child)::after { content: ''; position: absolute; top: 18px; left: 50%; right: -50%; height: 2px; background: var(--border); z-index: 0; }
  .rf-step.done:not(:last-child)::after { background: var(--blue); }
  .rf-step-dot { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; z-index: 1; position: relative; font-weight: 700; color: var(--muted); }
  .rf-step.active .rf-step-dot { border-color: var(--blue); background: var(--blue); color: #fff; box-shadow: 0 0 0 4px var(--blue-md); }
  .rf-step.done .rf-step-dot { border-color: var(--blue); background: var(--blue); color: #fff; }
  .rf-step-label { font-size: 11px; font-weight: 600; text-transform: uppercase; margin-top: 8px; color: var(--muted); }
  .rf-step.active .rf-step-label { color: var(--blue); }

  .rf-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .rf-badge.low { background: var(--green-lt); color: var(--green); }
  .rf-badge.medium { background: var(--orange-lt); color: var(--orange); }
  .rf-badge.high { background: var(--red-lt); color: var(--red); }

  .rf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 22px; font-size: 14px; font-weight: 600; border-radius: 10px; border: none; cursor: pointer; transition: all var(--trans); }
  .rf-btn:disabled { opacity: .5; cursor: not-allowed; }
  .rf-btn-ghost { background: transparent; color: var(--muted); border: 1.5px solid var(--border); }
  .rf-btn-primary { background: var(--blue); color: #fff; }
  
  .rf-alert { display: flex; align-items: flex-start; gap: 10px; padding: 13px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; }
  .rf-alert.error { background: var(--red-lt); color: var(--red); border: 1px solid #fecaca; }
  .rf-alert.info { background: var(--blue-lt); color: var(--blue); border: 1px solid var(--blue-md); }

  .rf-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: rfSpin .7s linear infinite; }
  @keyframes rfSpin { to { transform: rotate(360deg); } }
  @keyframes rfIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
`;

/* ─────────────────────────────────────────────
   Helpers & Suggestions
───────────────────────────────────────────── */
const Field = ({ label, required, icon: Icon, children, span }) => (
  <div style={span ? { gridColumn: `span ${span}` } : {}}>
    <label className="rf-label">
      {Icon && <Icon size={13} />}
      {label}
      {required && <span className="req">*</span>}
    </label>
    {children}
  </div>
);

const MEDICAL_SUGGESTIONS = {
  diagnostics: ['Paludisme grave', 'Fièvre Typhoïde', 'Infection Respiratoire Aiguë', 'HTA Maligne', 'Appendicite Aiguë', 'Diabète Décompensé', 'AVC Ischémique'],
  examens: ['NFS', 'Glycémie à jeun', 'Échographie Abdominale', 'Scanner Cérébral', 'CRP', 'Bilan hépatique', 'ECG'],
  traitements: ['Paracétamol 1g IV', 'Sérum physiologique 500ml', 'Artémether IM', 'Oméprazole 40mg', 'Métronidazole 500mg'],
};

const SuggestionField = ({ label, required, icon, value, onChange, suggestions, placeholder, rows = 2 }) => {
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShow(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (val) => {
    onChange(val);
    const q = val.trim().toLowerCase();
    const hits = q.length > 0 ? suggestions.filter(s => s.toLowerCase().includes(q)) : suggestions;
    setFiltered(hits);
    setShow(hits.length > 0);
  };

  return (
    <div className="rf-suggest-wrap" ref={wrapRef}>
      <label className="rf-label">
        {icon && React.createElement(icon, { size: 13 })}
        {label}
        {required && <span className="req">*</span>}
      </label>
      <textarea
        className="rf-textarea"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => { setFiltered(suggestions); setShow(true); }}
      />
      {show && (
        <div className="rf-suggest-list">
          {filtered.map((item, i) => (
            <div key={i} className="rf-suggest-item" onMouseDown={() => { onChange(item); setShow(false); }}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Step content components
───────────────────────────────────────────── */
const Step1 = ({ formData, setFormData, patients, services }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rfIn .35s ease both' }}>
    <div className="rf-card">
      <div className="rf-card-head">
        <div className="icon"><User size={16} color="#fff" /></div>
        <h3>Identification du patient</h3>
      </div>
      <div className="rf-card-body">
        <div className="rf-grid-2">
          <Field label="Patient" required icon={User}>
            <select className="rf-select" value={formData.patient_id} onChange={e => setFormData(p => ({ ...p, patient_id: e.target.value }))}>
              <option value="">— Sélectionner un patient —</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </Field>
          <Field label="Service requis" required icon={Stethoscope}>
            <select className="rf-select" value={formData.service_id} onChange={e => setFormData(p => ({ ...p, service_id: e.target.value }))}>
              <option value="">— Sélectionner un service —</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
        </div>
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, setFormData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rfIn .35s ease both' }}>
    <div className="rf-card">
      <div className="rf-card-head">
        <div className="icon"><ClipboardList size={16} color="#fff" /></div>
        <h3>Motif & Urgence</h3>
      </div>
      <div className="rf-card-body">
        <div className="rf-grid-2">
          <Field label="Motif de consultation" required icon={FileText}>
            <textarea className="rf-textarea" rows={3} placeholder="Décrivez le motif..." value={formData.motif_consultation} onChange={e => setFormData(p => ({ ...p, motif_consultation: e.target.value }))} />
          </Field>
          <Field label="Degré d'urgence" icon={AlertTriangle}>
            <select className="rf-select" value={formData.niveau_urgence} onChange={e => setFormData(p => ({ ...p, niveau_urgence: e.target.value }))}>
              <option value="FAIBLE">🟢 Faible</option>
              <option value="MOYENNE">🟡 Moyenne</option>
              <option value="TRES_URGENT">🔴 Très urgent</option>
            </select>
          </Field>
        </div>
      </div>
    </div>

    <div className="rf-card">
      <div className="rf-card-head">
        <div className="icon"><Activity size={16} color="#fff" /></div>
        <h3>Données médicales</h3>
      </div>
      <div className="rf-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="rf-grid-2">
          {/* CHAMP OBLIGATOIRE CORRIGÉ ICI */}
          <Field label="Trouvailles cliniques" required icon={Activity}>
            <textarea 
              className="rf-textarea" 
              rows={3} 
              placeholder="Symptômes et signes constatés..." 
              value={formData.trouvailles_cliniques} 
              onChange={e => setFormData(p => ({ ...p, trouvailles_cliniques: e.target.value }))} 
            />
          </Field>
          <SuggestionField label="Diagnostic provisoire" required icon={Stethoscope} value={formData.diagnostic} onChange={v => setFormData(p => ({ ...p, diagnostic: v }))} suggestions={MEDICAL_SUGGESTIONS.diagnostics} placeholder="Votre diagnostic..." rows={3} />
        </div>
        <div className="rf-grid-2">
          <SuggestionField label="Examens faits" icon={ClipboardList} value={formData.examens_paracliniques} onChange={v => setFormData(p => ({ ...p, examens_paracliniques: v }))} suggestions={MEDICAL_SUGGESTIONS.examens} />
          <SuggestionField label="Traitements reçus" icon={Pill} value={formData.traitements_recus} onChange={v => setFormData(p => ({ ...p, traitements_recus: v }))} suggestions={MEDICAL_SUGGESTIONS.traitements} />
        </div>
      </div>
    </div>
  </div>
);

const Step3 = ({ formData, selectedHospital, setSelectedHospital }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'rfIn .35s ease both' }}>
    <div className="rf-alert info">
      <Hospital size={16} />
      <span>Sélectionnez l'établissement de destination.</span>
    </div>
    <HospitalProposal patientId={formData.patient_id} serviceId={formData.service_id} onSelect={setSelectedHospital} />
  </div>
);

const Step4 = ({ referenceCreated, componentRef, handlePrint }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', textAlign: 'center' }}>
    <div className="rf-success-ring" style={{ width: 60, height: 60, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
      <CheckCircle size={38} color="#059669" />
    </div>
    <h2>Référence créée !</h2>
    <div style={{ position: 'absolute', left: '-9999px' }}><div ref={componentRef}><FicheReference data={referenceCreated} /></div></div>
    <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
      <button className="rf-btn rf-btn-primary" onClick={handlePrint}><Printer size={16} /> Imprimer</button>
      <button className="rf-btn rf-btn-ghost" onClick={() => window.location.href='/dashboard'}>Fermer</button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const ReferenceForm = () => {
  const componentRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [referenceCreated, setReferenceCreated] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patient_id: '', service_id: '', motif_consultation: '',
    trouvailles_cliniques: '', diagnostic: '', examens_paracliniques: '',
    traitements_recus: '', niveau_urgence: 'FAIBLE', raisons_reference: ''
  });

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Reference_${referenceCreated?.id}`,
  });

  useEffect(() => {
    (async () => {
      try {
        const [pRes, sRes] = await Promise.all([api.get('/patients/'), api.get('/services/')]);
        setPatients(pRes.data.results || pRes.data);
        setServices(sRes.data.results || sRes.data);
      } catch {
        setError('Erreur de chargement.');
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // VALIDATION MISE À JOUR : Ajout de trouvailles_cliniques
  const canProceed = () => {
    if (activeStep === 0) return formData.patient_id && formData.service_id;
    if (activeStep === 1) return formData.motif_consultation && formData.diagnostic && formData.trouvailles_cliniques.trim() !== '';
    if (activeStep === 2) return !!selectedHospital;
    return true;
  };

  const handleCreateReference = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        patient: parseInt(formData.patient_id, 10),
        service: parseInt(formData.service_id, 10),
        doctor: user.id,
        hospital_source: 1, 
        hospital_destination: selectedHospital.id,
        motif_consultation: formData.motif_consultation,
        trouvailles_cliniques: formData.trouvailles_cliniques, // Plus vide ici !
        diagnostic: formData.diagnostic,
        examens_faits: formData.examens_paracliniques,
        traitements_recus: formData.traitements_recus,
        niveau_urgence: formData.niveau_urgence,
        raisons_reference: formData.raisons_reference || 'Non spécifié',
        status: 'en_attente',
      };
      const response = await api.post('/references/', payload);
      setReferenceCreated(response.data);
      setActiveStep(3);
    } catch (err) {
      setError(`Erreur : ${JSON.stringify(err.response?.data || 'Serveur injoignable')}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div style={{ padding: 50, textAlign: 'center' }}>Chargement...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 16px', fontFamily: 'Sora' }}>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px 36px', borderBottom: '1px solid #eee' }}>
            <div className="rf-steps">
              {STEPS.map((label, i) => (
                <div key={label} className={`rf-step ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}>
                  <div className="rf-step-dot">{i < activeStep ? '✓' : i + 1}</div>
                  <span className="rf-step-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 36 }}>
            {error && <div className="rf-alert error" style={{ marginBottom: 20 }}>{error}</div>}
            {activeStep === 0 && <Step1 formData={formData} setFormData={setFormData} patients={patients} services={services} />}
            {activeStep === 1 && <Step2 formData={formData} setFormData={setFormData} />}
            {activeStep === 2 && <Step3 formData={formData} selectedHospital={selectedHospital} setSelectedHospital={setSelectedHospital} />}
            {activeStep === 3 && <Step4 referenceCreated={referenceCreated} componentRef={componentRef} handlePrint={handlePrint} />}
          </div>

          {activeStep < 3 && (
            <div style={{ padding: '20px 36px', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <button className="rf-btn rf-btn-ghost" onClick={() => setActiveStep(p => p - 1)} disabled={activeStep === 0 || loading}>Retour</button>
              <button className="rf-btn rf-btn-primary" onClick={activeStep === 2 ? handleCreateReference : () => setActiveStep(p => p + 1)} disabled={!canProceed() || loading}>
                {loading ? <span className="rf-spinner"></span> : (activeStep === 2 ? 'Confirmer' : 'Suivant')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceForm;