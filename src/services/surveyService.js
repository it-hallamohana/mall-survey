import { supabase } from '../lib/supabase';

export async function submitSurvey(formData) {
  try {
    const dataToSubmit = { ...formData };

    // Handle promo_consent boolean conversion
    if (dataToSubmit.promo_consent !== undefined) {
      dataToSubmit.promo_consent = dataToSubmit.promo_consent === 'Tertarik';
    }

    // Insert into survey_responses without .select() because anonymous users only have INSERT permission
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([dataToSubmit]);

    if (error) {
      console.error('Supabase insertion error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error during submission:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}
