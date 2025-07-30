
export const CONDITION_MAPPING: Record<string, { id: string; name: string; commonName: string; scarring: boolean; duration: 'temporary' | 'permanent' | 'variable' }> = {
  // Androgenetic Alopecia (using description as a key for now, will map from ID later if needed)
  'Male AGA - Early stages (1-2)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Male Pattern Baldness", scarring: false, duration: "permanent" },
  'Male AGA - Stage 3': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Male Pattern Baldness", scarring: false, duration: "permanent" },
  'Male AGA - Stage 3 vertex or 4': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Male Pattern Baldness", scarring: false, duration: "permanent" },
  'Male AGA - Stage 3 vertex or 4 (variation)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Male Pattern Baldness", scarring: false, duration: "permanent" },
  'Male AGA - Stage 5': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Male Pattern Baldness", scarring: false, duration: "permanent" },
  'Male AGA - Stage 5 or 6': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Male Pattern Baldness", scarring: false, duration: "permanent" },
  
  'Female AGA - Stage 1': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 2': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 2 or 3': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 3': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 3 (variation 2)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 3 (variation 3)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 3 (variation 4)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 4 (variation 1)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 4 (variation 2)': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  'Female AGA - Stage 5': { id: "androgenetic_alopecia", name: "Androgenetic Alopecia", commonName: "Female Pattern Hair Loss", scarring: false, duration: "permanent" },
  
  // Alopecia Areata Types
  'Alopecia Areata - Round patches': { id: "alopecia_areata", name: "Alopecia Areata", commonName: "Patchy Hair Loss", scarring: false, duration: "temporary" },
  'Alopecia Ophiasis - Band pattern': { id: "ophiasis_alopecia_areata", name: "Ophiasis Alopecia Areata", commonName: "Band Pattern Hair Loss", scarring: false, duration: "variable" },
  'Alopecia Ophiasis - Band pattern (variation)': { id: "ophiasis_alopecia_areata", name: "Ophiasis Alopecia Areata", commonName: "Band Pattern Hair Loss", scarring: false, duration: "variable" },
  'Alopecia Totalis - Complete scalp loss': { id: "alopecia_totalis", name: "Alopecia Totalis", commonName: "Complete Scalp Hair Loss", scarring: false, duration: "variable" },
  'Alopecia Universalis - Total body hair loss': { id: "alopecia_universalis", name: "Alopecia Universalis", commonName: "Total Body Hair Loss", scarring: false, duration: "variable" },
  'Alopecia Barbae - Patchy beard loss': { id: "alopecia_barbae", name: "Alopecia Barbae", commonName: "Beard Hair Loss", scarring: false, duration: "variable" },
  
  // Telogen Effluvium
  'Telogen Effluvium - Stress-related shedding': { id: "telogen_effluvium", name: "Telogen Effluvium", commonName: "Stress-Related Hair Loss", scarring: false, duration: "temporary" },
  'Telogen Effluvium - Diffuse shedding': { id: "telogen_effluvium", name: "Telogen Effluvium", commonName: "Stress-Related Hair Loss", scarring: false, duration: "temporary" },
  'Telogen Effluvium - Pattern variation': { id: "telogen_effluvium", name: "Telogen Effluvium", commonName: "Stress-Related Hair Loss", scarring: false, duration: "temporary" },

  // Medical Hair Loss
  'Chemotherapy-Induced Alopecia': { id: "anagen_effluvium", name: "Anagen Effluvium", commonName: "Chemotherapy Hair Loss", scarring: false, duration: "temporary" },
  'Chemotherapy-Induced Alopecia (variation)': { id: "anagen_effluvium", name: "Anagen Effluvium", commonName: "Chemotherapy Hair Loss", scarring: false, duration: "temporary" },
  'Chemotherapy-Induced Alopecia (progression)': { id: "anagen_effluvium", name: "Anagen Effluvium", commonName: "Chemotherapy Hair Loss", scarring: false, duration: "temporary" },
  
  // Behavioral
  'Trichotillomania - Hair pulling disorder': { id: "trichotillomania", name: "Trichotillomania", commonName: "Hair-pulling Disorder", scarring: false, duration: "variable" },
  
  // SCARRING CONDITIONS (Cicatricial Alopecias)
  'Central Centrifugal Cicatricial Alopecia': { id: "central_centrifugal_cicatricial_alopecia", name: "Central Centrifugal Cicatricial Alopecia", commonName: "CCCA", scarring: true, duration: "permanent" },
  'Central Centrifugal Cicatricial Alopecia (advanced)': { id: "central_centrifugal_cicatricial_alopecia", name: "Central Centrifugal Cicatricial Alopecia", commonName: "CCCA", scarring: true, duration: "permanent" },
  'Frontal Fibrosing Alopecia - Hairline recession': { id: "frontal_fibrosing_alopecia", name: "Frontal Fibrosing Alopecia", commonName: "FFA", scarring: true, duration: "permanent" },
  'Frontal Fibrosing Alopecia - Advanced': { id: "frontal_fibrosing_alopecia", name: "Frontal Fibrosing Alopecia", commonName: "FFA", scarring: true, duration: "permanent" },
  'Lichen Planopilaris - Scarring alopecia': { id: "lichen_planopilaris", name: "Lichen Planopilaris", commonName: "LPP", scarring: true, duration: "permanent" },
  'Dissecting Cellulitis - Inflammatory condition': { id: "dissecting_cellulitis_of_scalp", name: "Dissecting Cellulitis of Scalp", commonName: "DCS", scarring: true, duration: "permanent" },
};

export const SEVERITY_MAPPING: Record<string, { severity: string; stage: number; scale: string }> = {
  // Male AGA
  'Male AGA - Early stages (1-2)': { severity: "Mild", stage: 2, scale: "Norwood II" },
  'Male AGA - Stage 3': { severity: "Moderate", stage: 3, scale: "Norwood III" },
  'Male AGA - Stage 3 vertex or 4': { severity: "Moderate to Severe", stage: 4, scale: "Norwood IV" },
  'Male AGA - Stage 3 vertex or 4 (variation)': { severity: "Moderate to Severe", stage: 4, scale: "Norwood IV" },
  'Male AGA - Stage 5': { severity: "Severe", stage: 5, scale: "Norwood V" },
  'Male AGA - Stage 5 or 6': { severity: "Advanced", stage: 6, scale: "Norwood VI" },
  
  // Female AGA
  'Female AGA - Stage 1': { severity: "Normal", stage: 1, scale: "Sinclair 1" },
  'Female AGA - Stage 2': { severity: "Mild", stage: 2, scale: "Sinclair 2" },
  'Female AGA - Stage 2 or 3': { severity: "Moderate", stage: 3, scale: "Sinclair 3" },
  'Female AGA - Stage 3': { severity: "Moderate", stage: 3, scale: "Sinclair 3" },
  'Female AGA - Stage 3 (variation 2)': { severity: "Moderate", stage: 3, scale: "Sinclair 3" },
  'Female AGA - Stage 3 (variation 3)': { severity: "Moderate", stage: 3, scale: "Sinclair 3" },
  'Female AGA - Stage 3 (variation 4)': { severity: "Moderate", stage: 3, scale: "Sinclair 3" },
  'Female AGA - Stage 4 (variation 1)': { severity: "Severe", stage: 4, scale: "Sinclair 4" },
  'Female AGA - Stage 4 (variation 2)': { severity: "Severe", stage: 4, scale: "Sinclair 4" },
  'Female AGA - Stage 5': { severity: "Advanced", stage: 5, scale: "Sinclair 5" },
};
