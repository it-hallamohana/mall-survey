import { supabase } from '../lib/supabase';

// Helper to fetch ALL rows, bypassing Supabase's 1000-row default limit.
// Uses pagination under the hood.
const fetchAllRows = async (tableName, selectColumns, filters) => {
  const PAGE_SIZE = 1000;
  let allData = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = supabase
      .from(tableName)
      .select(selectColumns)
      .range(from, from + PAGE_SIZE - 1);

    query = applyFilters(query, filters);

    const { data, error } = await query;
    if (error) throw error;

    allData = allData.concat(data);

    if (data.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      from += PAGE_SIZE;
    }
  }

  return allData;
};

const applyFilters = (query, filters) => {
  if (!filters) return query;
  
  let filteredQuery = query;
  
  if (filters.dateFrom) {
    filteredQuery = filteredQuery.gte('created_at', `${filters.dateFrom}T00:00:00.000Z`);
  }
  if (filters.dateTo) {
    filteredQuery = filteredQuery.lte('created_at', `${filters.dateTo}T23:59:59.999Z`);
  }
  if (filters.ageGroup) {
    filteredQuery = filteredQuery.eq('age_group', filters.ageGroup);
  }
  if (filters.gender) {
    filteredQuery = filteredQuery.eq('gender', filters.gender);
  }
  if (filters.city) {
    filteredQuery = filteredQuery.ilike('city', `%${filters.city}%`);
  }
  if (filters.satisfactionLevel) {
    filteredQuery = filteredQuery.eq('satisfaction_level', filters.satisfactionLevel);
  }
  if (filters.visitPurpose) {
    filteredQuery = filteredQuery.eq('visit_purpose', filters.visitPurpose);
  }
  
  return filteredQuery;
};

const processJsonbArray = (data, field) => {
  const counts = {};
  data.forEach(row => {
    if (row[field] && Array.isArray(row[field])) {
      row[field].forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
      });
    }
  });
  return Object.keys(counts).map(name => ({ name, value: counts[name] })).sort((a, b) => b.value - a.value);
};

const normalizeCity = (city) => {
  if (!city) return 'Lainnya';
  const c = city.trim().toLowerCase();
  
  // Deteksi variasi Pekanbaru
  if (
    c === 'pku' || 
    c.includes('pekanbaru') || 
    c.includes('pekan baru') || 
    c.includes('panam') || 
    c.includes('rumbai') || 
    c.includes('marpoyan') || 
    c.includes('tampang') || 
    c.includes('sukajadi') ||
    c.includes('jalan ') ||
    c.includes('jl. ') ||
    c.includes('jl ')
  ) {
    return 'Pekanbaru';
  }

  // Deteksi variasi Kampar / Bangkinang
  if (c.includes('kampar') || c.includes('bangkinang') || c.includes('siak hulu') || c.includes('kubang')) {
    return 'Kampar';
  }

  // Deteksi variasi Dumai
  if (c.includes('dumai')) {
    return 'Dumai';
  }

  // Deteksi variasi Duri / Bengkalis
  if (c.includes('duri') || c.includes('bengkalis') || c.includes('mandau')) {
    return 'Duri / Bengkalis';
  }

  // Deteksi Siak
  if (c.includes('siak') && !c.includes('siak hulu')) {
    return 'Siak';
  }

  // Deteksi Pelalawan / Pangkalan Kerinci
  if (c.includes('pelalawan') || c.includes('kerinci')) {
    return 'Pelalawan';
  }

  // Deteksi Kuansing / Teluk Kuantan
  if (c.includes('kuansing') || c.includes('kuantan')) {
    return 'Kuantan Singingi';
  }

  // Deteksi Rohul / Pasir Pengaraian
  if (c.includes('rohul') || c.includes('rokan hulu') || c.includes('pasir')) {
    return 'Rokan Hulu';
  }

  // Deteksi Rohil / Bagan
  if (c.includes('rohil') || c.includes('rokan hilir') || c.includes('bagan')) {
    return 'Rokan Hilir';
  }

  // Deteksi Inhu / Rengat
  if (c.includes('inhu') || c.includes('indragiri hulu') || c.includes('rengat')) {
    return 'Indragiri Hulu';
  }

  // Deteksi Inhil / Tembilahan
  if (c.includes('inhil') || c.includes('indragiri hilir') || c.includes('tembilahan')) {
    return 'Indragiri Hilir';
  }

  // Title Case untuk kota lainnya
  return city
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

const ORDINAL_ORDERS = {
  age_group: ['< 17 Tahun', '17–24 Tahun', '25–34 Tahun', '35–54 Tahun', '> 55 Tahun'],
  visit_frequency: ['Pertama kali', '1–2 kali per bulan', '1 kali per minggu', '> 2 kali per minggu'],
  visit_duration: ['< 1 jam', '1–2 jam', '2–3 jam', '> 3 jam'],
  estimated_spending: ['< Rp100.000', 'Rp100.000–Rp500.000', '> Rp500.000'],
  satisfaction_level: ['Kurang Puas', 'Cukup', 'Puas', 'Sangat Puas'],
  family_entertainment_importance: ['Tidak penting', 'Biasa saja', 'Penting', 'Sangat penting'],
  event_visit_interest: ['Kurang tertarik', 'Tertarik', 'Sangat tertarik'],
  food_variety: ['Kurang beragam', 'Cukup lengkap', 'Sangat lengkap'],
};

const processField = (data, field) => {
  const counts = {};
  data.forEach(row => {
    if (row[field]) {
      counts[row[field]] = (counts[row[field]] || 0) + 1;
    }
  });
  return Object.keys(counts).map(name => ({ name, value: counts[name] })).sort((a, b) => b.value - a.value);
};

const processFieldOrdered = (data, field) => {
  const counts = {};
  data.forEach(row => {
    if (row[field]) {
      counts[row[field]] = (counts[row[field]] || 0) + 1;
    }
  });

  if (ORDINAL_ORDERS[field]) {
    return ORDINAL_ORDERS[field].map(name => ({
      name,
      value: counts[name] || 0
    }));
  }

  return Object.keys(counts).map(name => ({ name, value: counts[name] })).sort((a, b) => b.value - a.value);
};

export const fetchSurveyStats = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'created_at, revisit_intention, satisfaction_level', filters);
  
  const totalResponses = data.length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  let todayResponses = 0;
  let monthResponses = 0;
  let revisitYes = 0;
  const satisfactionCounts = {};
  
  data.forEach(row => {
    const d = new Date(row.created_at);
    if (d >= today) todayResponses++;
    if (d >= monthStart) monthResponses++;
    
    if (row.revisit_intention === 'Ya' || row.revisit_intention === 'Yes') revisitYes++;
    
    if (row.satisfaction_level) {
      satisfactionCounts[row.satisfaction_level] = (satisfactionCounts[row.satisfaction_level] || 0) + 1;
    }
  });
  
  const revisitPercentage = totalResponses > 0 ? Math.round((revisitYes / totalResponses) * 100) : 0;
  
  return {
    totalResponses,
    todayResponses,
    monthResponses,
    revisitPercentage,
    satisfactionDistribution: Object.keys(satisfactionCounts).map(name => ({ name, value: satisfactionCounts[name] }))
  };
};

export const fetchDemographicsData = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'age_group, gender, city', filters);

  // Normalisasi kota agar 'Pekanbaru', 'pekanbaru', 'PEKANBARU', 'pku' disatukan
  const cityCounts = {};
  data.forEach(row => {
    if (row.city) {
      const normalized = normalizeCity(row.city);
      cityCounts[normalized] = (cityCounts[normalized] || 0) + 1;
    }
  });
  const normalizedCities = Object.keys(cityCounts)
    .map(name => ({ name, value: cityCounts[name] }))
    .sort((a, b) => b.value - a.value);
  
  return {
    ageGroups: processFieldOrdered(data, 'age_group'),
    genders: processField(data, 'gender'),
    cities: normalizedCities.slice(0, 10)
  };
};

export const fetchBehaviorData = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'visit_frequency, visit_purpose, companions, visit_duration, estimated_spending', filters);
  
  return {
    visitFrequency: processFieldOrdered(data, 'visit_frequency'),
    visitPurpose: processField(data, 'visit_purpose'),
    companions: processField(data, 'companions'),
    visitDuration: processFieldOrdered(data, 'visit_duration'),
    estimatedSpending: processFieldOrdered(data, 'estimated_spending')
  };
};

export const fetchFnbData = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'food_variety, desired_fnb_tenants, dining_factors, requested_tenants', filters);
  
  const requestedTenantsList = data.map(r => r.requested_tenants).filter(t => t && t.trim() !== '');
  
  return {
    foodVariety: processFieldOrdered(data, 'food_variety'),
    desiredFnbTenants: processJsonbArray(data, 'desired_fnb_tenants'),
    diningFactors: processJsonbArray(data, 'dining_factors'),
    requestedTenants: requestedTenantsList
  };
};

export const fetchEntertainmentData = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'entertainment_areas, family_entertainment_importance, desired_events, event_visit_interest', filters);
  
  return {
    entertainmentAreas: processJsonbArray(data, 'entertainment_areas'),
    familyEntertainmentImportance: processFieldOrdered(data, 'family_entertainment_importance'),
    desiredEvents: processJsonbArray(data, 'desired_events'),
    eventVisitInterest: processFieldOrdered(data, 'event_visit_interest')
  };
};

export const fetchPromoData = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'preferred_promotions, promotion_information_sources, effective_media_channels', filters);
  
  return {
    preferredPromotions: processJsonbArray(data, 'preferred_promotions'),
    promotionInfoSources: processJsonbArray(data, 'promotion_information_sources'),
    effectiveMediaChannels: processJsonbArray(data, 'effective_media_channels')
  };
};

export const fetchExperienceData = async (filters) => {
  const data = await fetchAllRows('survey_responses', 'satisfaction_level, revisit_intention, visitor_suggestions', filters);
  
  const visitorSuggestionsList = data.map(r => r.visitor_suggestions).filter(t => t && t.trim() !== '');
  
  return {
    satisfactionLevel: processFieldOrdered(data, 'satisfaction_level'),
    revisitIntention: processField(data, 'revisit_intention'),
    visitorSuggestions: visitorSuggestionsList
  };
};

export const fetchResponses = async (filters, page = 1, pageSize = 10, sortField = 'created_at', sortDirection = 'desc', searchTerm = '') => {
  let query = supabase
    .from('survey_responses')
    .select('id, created_at, visitor_name, age_group, gender, city, visit_purpose, satisfaction_level, revisit_intention', { count: 'exact' });
    
  query = applyFilters(query, filters);
  
  if (searchTerm) {
    query = query.or(`visitor_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
  }
  
  if (sortField) {
    query = query.order(sortField, { ascending: sortDirection === 'asc' });
  }
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);
  
  const { data, count, error } = await query;
  if (error) throw error;
  
  return { data, count };
};

export const fetchResponseDetail = async (id) => {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export const exportResponses = async (filters) => {
  const data = await fetchAllRows('survey_responses', '*', filters);
  // Sort by date descending client-side
  data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return data;
};
