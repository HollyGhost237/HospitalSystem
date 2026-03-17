import React from 'react';

// Si tu utilises React.forwardRef, assure-toi que l'export est bien fait
export const FicheReference = React.forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} style={{ padding: '40px', fontFamily: '"Times New Roman", Times, serif', color: 'black', maxWidth: '800px', margin: '0 auto', lineHeight: '1.5' }}>
      
      {/* 1. EN-TÊTE OFFICIEL CAMEROUN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>RÉPUBLIQUE DU CAMEROUN</p>
          <p style={{ margin: 0, fontStyle: 'italic' }}>Paix - Travail - Patrie</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>MINISTÈRE DE LA SANTÉ PUBLIQUE</p>
        </div>
        <div style={{ fontSize: '12px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>REPUBLIC OF CAMEROON</p>
          <p style={{ margin: 0, fontStyle: 'italic' }}>Peace - Work - Fatherland</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>MINISTRY OF PUBLIC HEALTH</p>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '30px', fontSize: '20px' }}>
        FICHE DE TRANSFERT / RÉFÉRENCE INTER-HOSPITALIÈRE
      </h2>

      {/* 2. CADRE RÉSERVÉ À L'HÔPITAL SOURCE (Rempli par ton application) */}
      <div style={{ border: '1px solid black', padding: '15px', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '16px', backgroundColor: '#f0f0f0', padding: '5px' }}>
          I. RENSEIGNEMENTS FOURNIS PAR LA STRUCTURE RÉFÉRENTE
        </h3>
        
        <p><strong>Hôpital Source :</strong> {data.hospital_source_name || "_________________"}</p>
        <p><strong>Référé vers (Hôpital) :</strong> {data.hospital_destination_name || "_________________"}</p>
        <p><strong>Date de transfert :</strong> {new Date().toLocaleDateString('fr-FR')}</p>

        <h4 style={{ margin: '15px 0 5px', textDecoration: 'underline' }}>Informations du Patient</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <p><strong>Patient :</strong> {data.patient_name || data.patient}</p>
          <p><strong>Service demandé :</strong> {data.service_name || data.service}</p>
          <p><strong>Degré d'urgence :</strong> {data.niveau_urgence}</p>
        </div>

        <h4 style={{ margin: '15px 0 5px', textDecoration: 'underline' }}>Données Cliniques</h4>
        <p><strong>Motif de consultation :</strong> {data.motif_consultation}</p>
        <p><strong>Diagnostic provisoire :</strong> {data.diagnostic}</p>
        <p><strong>Trouvailles cliniques :</strong> {data.trouvailles_cliniques || "Néant"}</p>
        <p><strong>Traitements déjà reçus :</strong> {data.traitements_recus || "Néant"}</p>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <p style={{ fontStyle: 'italic' }}>Visa et Cachet du Médecin traitant</p>
          <div style={{ height: '60px' }}></div>
        </div>
      </div>

      {/* <p style={{ textAlign: 'center', color: '#666', marginBottom: '150px' }}>
        ✂ --------------------------------------------------------------------------------------------------------- ✂
      </p> */}

      {/* 3. CADRE RÉSERVÉ À L'HÔPITAL DE DESTINATION (À remplir au stylo) */}
      <div style={{ border: '2px dashed black', padding: '15px', backgroundColor: '#fafafa', marginTop: '200px'}}>
        <h3 style={{ marginTop: 0, borderBottom: '1px dashed #ccc', paddingBottom: '5px', fontSize: '16px' }}>
          II. CADRE RÉSERVÉ À LA STRUCTURE D'ACCUEIL (Contre-Référence)
        </h3>
        <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '20px' }}>
          Ce cadre doit être dûment rempli par le médecin spécialiste de l'hôpital d'accueil et retourné à la structure référente pour le suivi médical.
        </p>

        <div style={{ lineHeight: '2.5' }}>
          <p style={{ margin: 0 }}><strong>Date et heure d'arrivée du patient :</strong> le __ / __ / 20__ à ___ h ___ min</p>
          <p style={{ margin: 0 }}><strong>État clinique à l'arrivée :</strong> ....................................................................................................................................</p>
          <p style={{ margin: 0 }}><strong>Diagnostic définitif retenu :</strong> ....................................................................................................................................</p>
          <p style={{ margin: 0 }}><strong>Examens complémentaires réalisés :</strong> ..............................................................................................................</p>
          <p style={{ margin: 0 }}><strong>Conduite à tenir / Traitement prescrit :</strong> .........................................................................................................<br />...............................................................................................................................................................................................</p>
          <p style={{ margin: 0 }}><strong>Nom du Médecin réceptionnaire :</strong> ....................................................................................................................</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', margin: 0 }}>Cachet de l'Hôpital et Signature</p>
            <div style={{ width: '200px', height: '100px', border: '1px dotted #999', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Emplacement du Cachet</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
});
