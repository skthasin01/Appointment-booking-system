import client from './client';

// GET /reviews — admin only, newest first
export const getAllReviews = async () => {
  const { data } = await client.get('/reviews');
  return data;
};

// PATCH /reviews/{id} — author or admin
// payload: { communication?, behavior?, punctuality?, treatment_effectiveness?, comment? }
export const updateReview = async (reviewId, payload) => {
  const { data } = await client.patch(`/reviews/${reviewId}`, payload);
  return data;
};

// DELETE /reviews/{id} — author or admin
export const deleteReview = async (reviewId) => {
  const { data } = await client.delete(`/reviews/${reviewId}`);
  return data;
};
