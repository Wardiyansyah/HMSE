import { supabase } from './supabase';

/**
 * Add or update click points for a student profile (student_user_id).
 * - If no row exists, insert a new row with the given points.
 * - If row exists, treat NULL or missing point_value as 0 and add the given points.
 *
 * Returns the new total points on success, or null on failure.
 */
export async function addClickPoints(studentUserId: string, pointsToAdd: number): Promise<number | null> {
  if (!studentUserId) return null;

  try {
    // Use a transaction-like pattern: try to update first, if 0 rows updated then insert.
    // Fetch current value (may be null)
    const { data: existing, error: fetchErr } = await supabase
      .from('click_points')
      .select('point_value')
      .eq('student_user_id', studentUserId)
      .maybeSingle();

    if (fetchErr) {
      console.error('insanai-points: fetch error', fetchErr);
      return null;
    }

    const current = (existing && typeof existing.point_value === 'number') ? existing.point_value : 0;
    const newValue = current + (pointsToAdd || 0);

    if (!existing) {
      // insert new row
      const { error: insertErr } = await supabase.from('click_points').insert({ student_user_id: studentUserId, point_value: newValue });
      if (insertErr) {
        console.error('insanai-points: insert error', insertErr);
        return null;
      }
      return newValue;
    } else {
      // update existing row
      const { error: updateErr } = await supabase
        .from('click_points')
        .update({ point_value: newValue })
        .eq('student_user_id', studentUserId);

      if (updateErr) {
        console.error('insanai-points: update error', updateErr);
        return null;
      }
      return newValue;
    }
  } catch (err) {
    console.error('insanai-points: unexpected error', err);
    return null;
  }
}

export default addClickPoints;
