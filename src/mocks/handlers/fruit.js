import { rest } from 'msw';

// [Get] fruits 서버 요청 시 [ '사과', '바나나' ]를 응답한다.

export const getFruits = rest.get('/fruits', (req, res, ctx) =>
  res(ctx.json(['사과', '바나나']))
);

export const addFruits = rest.post('/fruits/add', (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(req.body));
});

export const clearFruits = rest.post('/fruits/clear', (req, res, ctx) => {
  return res(ctx.status(200));
});
