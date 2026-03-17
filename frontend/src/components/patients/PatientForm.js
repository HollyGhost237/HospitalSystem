import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

/* ─────────────────────────────────────────────
   Styles globaux (Identiques à ton visuel)
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  :root {
    --blue:     #2563eb;
    --blue-lt:  #eff6ff;
    --blue-md:  #bfdbfe;
    --red:      #dc2626;
    --red-lt:   #fef2f2;
    --green:    #059669;
    --green-lt: #d1fae5;
    --ink:      #0f172a;
    --muted:    #64748b;
    --border:   #e2e8f0;
    --surface:  #ffffff;
    --bg:       #f8fafc;
    --radius:   14px;
    --shadow:   0 1px 3px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.08);
    --font-body: 'Sora', sans-serif;
    --font-display: 'Lora', serif;
    --trans: .2s cubic-bezier(.4,0,.2,1);
  }

  .pf-field { display: flex; flex-direction: column; gap: 6px; }
  .pf-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--muted);
    font-family: var(--font-body);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .pf-label .req { color: var(--red); font-size: 14px; }

  .pf-input, .pf-select, .pf-textarea {
    width: 100%;
    padding: 12px 14px;
    font-size: 15px;
    font-family: var(--font-body);
    color: var(--ink);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    outline: none;
    transition: all var(--trans);
  }
  .pf-input:focus, .pf-select:focus, .pf-textarea:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px var(--blue-md);
    background: var(--blue-lt);
  }
  .pf-input.error { border-color: var(--red); box-shadow: 0 0 0 3px #fee2e2; }

  .pf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font-body);
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all var(--trans);
  }
  .pf-btn-primary {
    background: var(--blue);
    color: #fff;
    box-shadow: 0 4px 12px rgba(37,99,235,.2);
  }
  .pf-btn-primary:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
  .pf-btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
  }

  .pf-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    font-family: var(--font-body);
  }
  .pf-divider::before, .pf-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .pf-alert { padding: 14px 16px; border-radius: 10px; font-size: 14px; font-family: var(--font-body); margin-bottom: 20px; }
  .pf-alert.error { background: var(--red-lt); color: var(--red); border: 1px solid #fecaca; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ─────────────────────────────────────────────
   Composant de champ réutilisable
───────────────────────────────────────────── */
const Field = ({ label, required, error, children }) => (
  <div className="pf-field">
    {label && (
      <label className="pf-label">
        {label} {required && <span className="req">*</span>}
      </label>
    )}
    {children}
    {error && <span style={{ fontSize: '12px', color: 'var(--red)', marginTop: '4px' }}>⚠ {error}</span>}
  </div>
);

/* ─────────────────────────────────────────────
   Composant Principal
───────────────────────────────────────────── */
const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', date_of_birth: '',
    gender: 'M', phone: '', address: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/patients/${id}/`);
        setFormData(data);
      } catch {
        setError('Impossible de charger le dossier patient.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      isEditMode 
        ? await api.put(`/patients/${id}/`, formData) 
        : await api.post('/patients/', formData);
      navigate('/patients');
    } catch (err) {
      setError("Erreur lors de l'enregistrement. Vérifiez les données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
          
          <button 
            onClick={() => navigate('/patients')}
            className="pf-btn pf-btn-ghost"
            style={{ marginBottom: '20px', padding: '8px 16px' }}
          >
            ← Retour
          </button>

          <div style={{ 
            background: 'var(--surface)', 
            borderRadius: 'var(--radius)', 
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {/* Header de la Card */}
            <div style={{ 
              padding: '30px', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
              borderBottom: '1px solid var(--border)' 
            }}>
              <h1 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '28px', 
                color: 'var(--ink)' 
              }}>
                {isEditMode ? 'Modifier le Patient' : 'Nouveau Patient'}
              </h1>
              <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                Remplissez les informations essentielles du dossier médical.
              </p>
            </div>

            {/* Corps du Formulaire */}
            <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {error && <div className="pf-alert error">{error}</div>}

              <div className="pf-divider">Identité</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Field label="Nom" required error={fieldErrors.last_name}>
                  <input className="pf-input" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Mbarga" />
                </Field>
                <Field label="Prénom" required error={fieldErrors.first_name}>
                  <input className="pf-input" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Jean" />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Field label="Date de Naissance" required>
                  <input type="date" className="pf-input" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                </Field>
                <Field label="Sexe">
                  <select className="pf-input" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </Field>
              </div>

              <div className="pf-divider">Coordonnées</div>

              <Field label="Téléphone">
                <input className="pf-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="+237 6..." />
              </Field>

              <Field label="Adresse">
                <textarea className="pf-textarea" name="address" value={formData.address} onChange={handleChange} placeholder="Quartier, Ville..." />
              </Field>

              {/* Footer / Actions */}
              <div style={{ 
                marginTop: '10px', 
                paddingTop: '20px', 
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button type="button" className="pf-btn pf-btn-ghost" onClick={() => navigate('/patients')}>
                  Annuler
                </button>
                <button type="submit" className="pf-btn pf-btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer le dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientForm;